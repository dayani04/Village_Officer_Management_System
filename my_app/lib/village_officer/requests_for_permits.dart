// ...existing imports...
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import 'requests_for_permits_villager_details.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:path_provider/path_provider.dart';
import 'package:open_filex/open_filex.dart';
import 'village_officer_sidebar.dart';

class RequestsForPermitsPage extends StatefulWidget {
  @override
  _RequestsForPermitsPageState createState() => _RequestsForPermitsPageState();
}

class _RequestsForPermitsPageState extends State<RequestsForPermitsPage> {
  List<dynamic> applications = [];
  Map<String, String> pendingStatuses = {};
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchApplications();
  }

  Future<void> fetchApplications() async {
    setState(() {
      loading = true;
    });
    try {
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/permit-applications/'),
        headers: {
          HttpHeaders.authorizationHeader: 'Bearer ${await getToken()}',
        },
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          applications = data
              .where((app) => app['status'] == 'Pending')
              .toList();
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch permit applications';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  Future<void> updateStatus(
    String villagerId,
    String permitsId,
    String newStatus,
  ) async {
    final url =
        'http://localhost:5000/api/permit-applications/$villagerId/$permitsId/status';
    final response = await http.put(
      Uri.parse(url),
      headers: {
        HttpHeaders.contentTypeHeader: 'application/json',
        HttpHeaders.authorizationHeader: 'Bearer ${await getToken()}',
      },
      body: json.encode({'status': newStatus}),
    );
    if (response.statusCode == 200) {
      setState(() {
        applications.removeWhere(
          (app) =>
              app['Villager_ID'] == villagerId &&
              app['Permits_ID'] == permitsId,
        );
        pendingStatuses.remove('$villagerId-$permitsId');
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Status updated successfully')));
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to update status')));
    }
  }

  Future<void> downloadDocument(String filename) async {
    final url =
        'http://localhost:5000/api/permit-applications/download/$filename';
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse(url),
        headers: {HttpHeaders.authorizationHeader: 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final bytes = response.bodyBytes;
        final dir = await getTemporaryDirectory();
        final file = File('${dir.path}/$filename');
        await file.writeAsBytes(bytes);
        await OpenFilex.open(file.path);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to download: ${response.statusCode}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Download error: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return Center(child: CircularProgressIndicator());
    if (error != null) return Center(child: Text('Error: $error'));

    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 2, selectedSubIndex: 3),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: Scaffold(
                appBar: AppBar(title: Text('Permit Applications')),
                body: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: DataTable(
                    columns: [
                      DataColumn(label: Text('Villager Name')),
                      DataColumn(label: Text('Villager ID')),
                      DataColumn(label: Text('Permit Type')),
                      DataColumn(label: Text('Apply Date')),
                      DataColumn(label: Text('Document')),
                      DataColumn(label: Text('Police Report')),
                      DataColumn(label: Text('Status')),
                      DataColumn(label: Text('Status Action')),
                      DataColumn(label: Text('Action')),
                    ],
                    rows: applications.map((app) {
                      final key = '${app['Villager_ID']}-${app['Permits_ID']}';
                      return DataRow(
                        cells: [
                          DataCell(Text(app['Full_Name'] ?? '')),
                          DataCell(Text(app['Villager_ID'] ?? '')),
                          DataCell(Text(app['Permits_Type'] ?? '')),
                          DataCell(
                            Text(
                              DateTime.tryParse(
                                    app['apply_date'] ?? '',
                                  )?.toLocal().toString().split(' ')[0] ??
                                  '',
                            ),
                          ),
                          DataCell(
                            TextButton(
                              child: Text('Download'),
                              onPressed: () =>
                                  downloadDocument(app['document_path']),
                            ),
                          ),
                          DataCell(
                            TextButton(
                              child: Text('Download'),
                              onPressed: () =>
                                  downloadDocument(app['police_report_path']),
                            ),
                          ),
                          DataCell(
                            DropdownButton<String>(
                              value:
                                  pendingStatuses[key] ??
                                  app['status'] ??
                                  'Pending',
                              items: ['Pending', 'Send', 'Rejected', 'Confirm']
                                  .map(
                                    (s) => DropdownMenuItem(
                                      value: s,
                                      child: Text(s),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (val) {
                                setState(() {
                                  pendingStatuses[key] = val!;
                                });
                              },
                            ),
                          ),
                          DataCell(
                            ElevatedButton(
                              child: Text('Confirm'),
                              onPressed: () => updateStatus(
                                app['Villager_ID'],
                                app['Permits_ID'],
                                pendingStatuses[key] ?? app['status'],
                              ),
                            ),
                          ),
                          DataCell(
                            ElevatedButton(
                              child: Text('View'),
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) =>
                                        RequestsForPermitsVillagerDetailsPage(
                                          villagerId: app['Villager_ID'],
                                        ),
                                  ),
                                );
                              },
                            ),
                          ),
                        ],
                      );
                    }).toList(),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Helper to get token from storage (implement as per your auth logic)
Future<String> getToken() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString('token') ?? '';
}
