import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class VillagersPage extends StatefulWidget {
  const VillagersPage({Key? key}) : super(key: key);

  @override
  State<VillagersPage> createState() => _VillagersPageState();
}

class _VillagersPageState extends State<VillagersPage> {
  List villagers = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchVillagers();
  }

  Future<void> fetchVillagers() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) {
        setState(() {
          error = 'No authentication token found. Please log in again.';
          loading = false;
        });
        return;
      }
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          villagers = json.decode(response.body);
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch villagers';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to fetch villagers';
        loading = false;
      });
    }
  }

  Future<void> deleteVillager(String id) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Delete Villager'),
        content: Text('Are you sure you want to delete this villager?'),
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
      final token = prefs.getString('token');
      if (token == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'No authentication token found. Please log in again.',
            ),
          ),
        );
        return;
      }
      final response = await http.delete(
        Uri.parse('http://localhost:5000/api/villagers/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          villagers.removeWhere((v) => v['Villager_ID'] == id);
        });
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Villager deleted')));
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Failed to delete villager')));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to delete villager')));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return Center(child: CircularProgressIndicator());
    if (error != null) {
      return Center(child: Text(error!));
    }
    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 1, selectedSubIndex: 1),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: Scaffold(
                appBar: AppBar(title: Text('All Villagers')),
                body: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: DataTable(
                    columns: const [
                      DataColumn(label: Text('Villager Name')),
                      DataColumn(label: Text('ID')),
                      DataColumn(label: Text('Area ID')),
                      DataColumn(label: Text('Address')),
                      DataColumn(label: Text('Email')),
                      DataColumn(label: Text('Phone Number')),
                      DataColumn(label: Text('Election Participant')),
                      DataColumn(label: Text('Regional Division')),
                      DataColumn(label: Text('Action')),
                    ],
                    rows: villagers
                        .map<DataRow>(
                          (villager) => DataRow(
                            cells: [
                              DataCell(Text(villager['Full_Name'] ?? 'N/A')),
                              DataCell(Text(villager['Villager_ID'] ?? 'N/A')),
                              DataCell(Text(villager['Area_ID'] ?? 'N/A')),
                              DataCell(Text(villager['Address'] ?? 'N/A')),
                              DataCell(Text(villager['Email'] ?? 'N/A')),
                              DataCell(Text(villager['Phone_No'] ?? 'N/A')),
                              DataCell(
                                Text(
                                  (villager['IsParticipant'] == true ||
                                          villager['IsParticipant'] == 1 ||
                                          villager['IsParticipant'] == '1')
                                      ? 'Yes'
                                      : 'No',
                                ),
                              ),
                              DataCell(
                                Text(villager['RegionalDivision'] ?? 'N/A'),
                              ),
                              DataCell(
                                Row(
                                  children: [
                                    IconButton(
                                      icon: Icon(
                                        Icons.edit,
                                        color: Colors.green,
                                      ),
                                      onPressed: () {
                                        Navigator.pushNamed(
                                          context,
                                          '/edit_villager',
                                          arguments: {
                                            'villagerId':
                                                villager['Villager_ID'],
                                          },
                                        );
                                      },
                                    ),
                                    IconButton(
                                      icon: Icon(
                                        Icons.visibility,
                                        color: Colors.blue,
                                      ),
                                      onPressed: () {
                                        Navigator.pushNamed(
                                          context,
                                          '/view_villager',
                                          arguments: {
                                            'villagerId':
                                                villager['Villager_ID'],
                                          },
                                        );
                                      },
                                    ),
                                    IconButton(
                                      icon: Icon(
                                        Icons.delete,
                                        color: Colors.red,
                                      ),
                                      onPressed: () => deleteVillager(
                                        villager['Villager_ID'],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        )
                        .toList(),
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
