import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import 'village_officer_sidebar.dart';

class RequestsForIDCardsPage extends StatefulWidget {
  @override
  _RequestsForIDCardsPageState createState() => _RequestsForIDCardsPageState();
}

class _RequestsForIDCardsPageState extends State<RequestsForIDCardsPage> {
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
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/nic-applications/'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final data = List<Map<String, dynamic>>.from(jsonDecode(response.body));
        setState(() {
          applications = data
              .where((app) => app['status'] == 'Pending')
              .toList();
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch NIC applications';
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
    String nicId,
    String newStatus,
  ) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.put(
        Uri.parse(
          'http://localhost:5000/api/nic-applications/$villagerId/$nicId/status',
        ),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'status': newStatus}),
      );
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Status updated successfully')));
        fetchApplications();
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to update status')));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  Future<void> downloadDocument(String filename) async {
    if (filename.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('No document available.')));
      return;
    }
    final url = 'http://localhost:5000/Uploads/$filename';
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not launch document URL.')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to open document: $e')));
    }
  }

  void viewDetails(String villagerId) {
    Navigator.pushNamed(
      context,
      '/requests_for_id_cards_villager_details',
      arguments: villagerId,
    );
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return Center(child: CircularProgressIndicator());
    if (error != null) return Center(child: Text('Error: $error'));

    return Scaffold(
      appBar: AppBar(title: Text('NIC Applications')),
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 2, selectedSubIndex: 2),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: DataTable(
                  columns: [
                    DataColumn(label: Text('Villager Name')),
                    DataColumn(label: Text('Villager ID')),
                    DataColumn(label: Text('NIC Type')),
                    DataColumn(label: Text('Apply Date')),
                    DataColumn(label: Text('Document')),
                    DataColumn(label: Text('Status')),
                    DataColumn(label: Text('Status Action')),
                    DataColumn(label: Text('Action')),
                  ],
                  rows: applications.map((app) {
                    final key = '${app['Villager_ID']}-${app['NIC_ID']}';
                    return DataRow(
                      cells: [
                        DataCell(Text(app['Full_Name'] ?? '')),
                        DataCell(Text(app['Villager_ID'].toString())),
                        DataCell(Text(app['NIC_Type'] ?? '')),
                        DataCell(
                          Text(
                            app['apply_date'] != null
                                ? app['apply_date'].toString().split('T')[0]
                                : '',
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
                              app['Villager_ID'].toString(),
                              app['NIC_ID'].toString(),
                              pendingStatuses[key] ?? 'Pending',
                            ),
                          ),
                        ),
                        DataCell(
                          ElevatedButton(
                            child: Text('View'),
                            onPressed: () =>
                                viewDetails(app['Villager_ID'].toString()),
                          ),
                        ),
                      ],
                    );
                  }).toList(),
                ),
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.arrow_back),
        onPressed: () => Navigator.pushReplacementNamed(context, '/dashboard'),
      ),
    );
  }
}
