import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class VillagerOfficerListPage extends StatefulWidget {
  const VillagerOfficerListPage({Key? key}) : super(key: key);

  @override
  State<VillagerOfficerListPage> createState() =>
      _VillagerOfficerListPageState();
}

class _VillagerOfficerListPageState extends State<VillagerOfficerListPage> {
  List officers = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    fetchOfficers();
  }

  Future<void> fetchOfficers() async {
    setState(() => loading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villager-officers'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          officers = json.decode(response.body);
          loading = false;
        });
      } else {
        setState(() {
          officers = [];
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        officers = [];
        loading = false;
      });
    }
  }

  void showToast(String msg, {Color color = Colors.red}) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(msg), backgroundColor: color));
  }

  Future<void> handleDeleteOfficer(String id, String fullName) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Delete Officer'),
        content: Text('Are you sure you want to delete $fullName?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: Text('Delete'),
          ),
        ],
      ),
    );
    if (confirmed != true) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.delete(
        Uri.parse('http://localhost:5000/api/villager-officers/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          officers.removeWhere((o) => o['Villager_Officer_ID'] == id);
        });
        showToast(
          'Officer $fullName deleted successfully',
          color: Colors.green,
        );
      } else {
        showToast('Failed to delete officer');
      }
    } catch (e) {
      showToast('Failed to delete officer');
    }
  }

  Future<void> handleToggleStatus(
    String id,
    String currentStatus,
    String fullName,
  ) async {
    final newStatus = currentStatus == 'Active' ? 'Inactive' : 'Active';
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.put(
        Uri.parse('http://localhost:5000/api/villager-officers/$id/status'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'status': newStatus}),
      );
      if (response.statusCode == 200) {
        setState(() {
          officers = officers.map((o) {
            if (o['Villager_Officer_ID'] == id) {
              o['Status'] = newStatus;
            }
            return o;
          }).toList();
        });
        showToast('Status updated for $fullName', color: Colors.green);
      } else {
        showToast('Failed to update status');
      }
    } catch (e) {
      showToast('Failed to update status');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 1), // 1 for officer list section
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AppBar(
                  title: Text('Villager Officers'),
                  backgroundColor: Color(0xFF921940),
                  automaticallyImplyLeading: false,
                ),
                if (loading)
                  Expanded(child: Center(child: CircularProgressIndicator()))
                else if (officers.isEmpty)
                  Expanded(
                    child: Center(child: Text('No villager officers found')),
                  )
                else ...[
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: ElevatedButton.icon(
                        icon: Icon(Icons.add),
                        label: Text('Add Officer'),
                        onPressed: () => Navigator.pushNamed(
                          context,
                          '/add_villager_officer',
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFF921940),
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: DataTable(
                        columns: const [
                          DataColumn(label: Text('Officer ID')),
                          DataColumn(label: Text('Full Name')),
                          DataColumn(label: Text('Email')),
                          DataColumn(label: Text('Phone No')),
                          DataColumn(label: Text('Status')),
                          DataColumn(label: Text('Actions')),
                        ],
                        rows: officers.map<DataRow>((officer) {
                          return DataRow(
                            cells: [
                              DataCell(
                                Text(officer['Villager_Officer_ID'] ?? 'N/A'),
                              ),
                              DataCell(Text(officer['Full_Name'] ?? 'N/A')),
                              DataCell(Text(officer['Email'] ?? 'N/A')),
                              DataCell(Text(officer['Phone_No'] ?? 'N/A')),
                              DataCell(Text(officer['Status'] ?? 'N/A')),
                              DataCell(
                                Row(
                                  children: [
                                    IconButton(
                                      icon: Icon(
                                        Icons.edit,
                                        color: Colors.blue,
                                      ),
                                      onPressed: () {
                                        Navigator.pushNamed(
                                          context,
                                          '/edit_villager_officer',
                                          arguments: {
                                            'officerId':
                                                officer['Villager_Officer_ID'],
                                          },
                                        );
                                      },
                                    ),
                                    IconButton(
                                      icon: Icon(
                                        Icons.delete,
                                        color: Colors.red,
                                      ),
                                      onPressed: () => handleDeleteOfficer(
                                        officer['Villager_Officer_ID'],
                                        officer['Full_Name'],
                                      ),
                                    ),
                                    IconButton(
                                      icon: Icon(
                                        officer['Status'] == 'Active'
                                            ? Icons.toggle_on
                                            : Icons.toggle_off,
                                        color: officer['Status'] == 'Active'
                                            ? Colors.green
                                            : Colors.grey,
                                        size: 28,
                                      ),
                                      onPressed: () => handleToggleStatus(
                                        officer['Villager_Officer_ID'],
                                        officer['Status'],
                                        officer['Full_Name'],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          );
                        }).toList(),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
