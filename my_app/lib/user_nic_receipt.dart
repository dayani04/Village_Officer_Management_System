import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserNICReceiptPage extends StatefulWidget {
  const UserNICReceiptPage({Key? key}) : super(key: key);

  @override
  State<UserNICReceiptPage> createState() => _UserNICReceiptPageState();
}

class _UserNICReceiptPageState extends State<UserNICReceiptPage> {
  bool loading = true;
  String? error;
  List<dynamic> receipts = [];

  @override
  void initState() {
    super.initState();
    fetchReceipts();
  }

  Future<void> fetchReceipts() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/nic-applications/confirmed'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          receipts = List<Map<String, dynamic>>.from(
            List.from(jsonDecode(response.body)),
          );
          loading = false;
        });
      } else {
        throw Exception('Failed to fetch your NIC receipts');
      }
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error ?? 'Failed to fetch your NIC receipts')),
      );
    }
  }

  Future<void> handleDownload(String filename) async {
    try {
      final response = await http.get(
        Uri.parse(
          'http://localhost:5000/api/nic-applications/download/$filename',
        ),
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if needed
        },
      );
      if (response.statusCode == 200) {
        final bytes = response.bodyBytes;
        final tempDir = await getTemporaryDirectory();
        final filePath = '${tempDir.path}/$filename';
        final file = File(filePath);
        await file.writeAsBytes(bytes);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('NIC receipt downloaded to $filePath')),
        );
      } else {
        throw Exception('Failed to download receipt');
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('My NIC Receipts'),
          backgroundColor: const Color(0xFF921940),
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (error != null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('My NIC Receipts'),
          backgroundColor: const Color(0xFF921940),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(error!, style: const TextStyle(color: Colors.red)),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: fetchReceipts,
                child: const Text('Retry'),
              ),
              const SizedBox(height: 8),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Back to Dashboard'),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.grey),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('My NIC Receipts'),
        backgroundColor: const Color(0xFF921940),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: receipts.isEmpty
            ? const Center(
                child: Text(
                  'No NIC receipts available for you',
                  style: TextStyle(fontStyle: FontStyle.italic),
                ),
              )
            : SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: DataTable(
                  columns: const [
                    DataColumn(label: Text('NIC Type')),
                    DataColumn(label: Text('Application Date')),
                    DataColumn(label: Text('Receipt')),
                  ],
                  rows: receipts.asMap().entries.map((entry) {
                    final receipt = entry.value;
                    return DataRow(
                      cells: [
                        DataCell(Text(receipt['NIC_Type'] ?? 'N/A')),
                        DataCell(
                          Text(
                            receipt['apply_date'] != null
                                ? DateTime.parse(
                                    receipt['apply_date'],
                                  ).toLocal().toString().split(' ')[0]
                                : 'N/A',
                          ),
                        ),
                        DataCell(
                          receipt['receipt_path'] != null
                              ? TextButton(
                                  onPressed: () =>
                                      handleDownload(receipt['receipt_path']),
                                  child: const Text('Download Receipt'),
                                )
                              : const Text('Not Available'),
                        ),
                      ],
                    );
                  }).toList(),
                ),
              ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.pop(context),
        label: const Text('Back to Dashboard'),
        icon: const Icon(Icons.arrow_back),
        backgroundColor: Colors.grey,
      ),
    );
  }
}
