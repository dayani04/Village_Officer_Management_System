import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

// For web download
// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;

class UserPermitCertificatesPage extends StatefulWidget {
  const UserPermitCertificatesPage({super.key});

  @override
  State<UserPermitCertificatesPage> createState() =>
      _UserPermitCertificatesPageState();
}

class _UserPermitCertificatesPageState
    extends State<UserPermitCertificatesPage> {
  bool loading = true;
  String? error;
  List<dynamic> certificates = [];

  @override
  void initState() {
    super.initState();
    fetchCertificates();
  }

  Future<void> fetchCertificates() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/permit-applications/confirmed'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch certificates');
      }
      final data = jsonDecode(response.body);
      setState(() {
        certificates = data;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  Future<void> downloadCertificate(String filename) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final response = await http.get(
        Uri.parse(
          'http://localhost:5000/api/permit-applications/download/$filename',
        ),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final bytes = response.bodyBytes;
        if (kIsWeb) {
          // Web: trigger browser download
          final blob = html.Blob([bytes]);
          final url = html.Url.createObjectUrlFromBlob(blob);
          final anchor = html.AnchorElement(href: url)
            ..setAttribute('download', filename)
            ..click();
          html.Url.revokeObjectUrl(url);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Download started in browser.')),
          );
        } else {
          // Mobile/Desktop: save to Downloads directory
          Directory? downloadsDir;
          if (Platform.isAndroid || Platform.isIOS) {
            downloadsDir = await getExternalStorageDirectory();
          } else {
            downloadsDir = await getDownloadsDirectory();
          }
          if (downloadsDir == null) {
            throw Exception('Cannot access downloads directory');
          }
          final file = File('${downloadsDir.path}/$filename');
          await file.writeAsBytes(bytes);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Downloaded to: ${file.path}')),
          );
        }
      } else {
        throw Exception('Failed to download certificate');
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My Permit Certificates'),
        backgroundColor: Color(0xFF921940),
      ),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text('Error: $error'))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'My Permit Certificates',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 16),
                  Expanded(
                    child: certificates.isEmpty
                        ? Center(
                            child: Text('No certificates available for you'),
                          )
                        : ListView.builder(
                            itemCount: certificates.length,
                            itemBuilder: (context, idx) {
                              final cert = certificates[idx];
                              return Card(
                                margin: EdgeInsets.symmetric(vertical: 8),
                                child: ListTile(
                                  title: Text(cert['Permits_Type'] ?? 'N/A'),
                                  subtitle: cert['certificate_path'] != null
                                      ? GestureDetector(
                                          onTap: () => downloadCertificate(
                                            cert['certificate_path'],
                                          ),
                                          child: Text(
                                            'Download Certificate',
                                            style: TextStyle(
                                              color: Colors.blue,
                                              decoration:
                                                  TextDecoration.underline,
                                            ),
                                          ),
                                        )
                                      : Text('Not Available'),
                                ),
                              );
                            },
                          ),
                  ),
                  SizedBox(height: 20),
                  Center(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF921940),
                      ),
                      onPressed: () => Navigator.pop(context),
                      child: Text('Back to Dashboard'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
