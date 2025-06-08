import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class PermitsOwnerPage extends StatefulWidget {
  @override
  _PermitsOwnerPageState createState() => _PermitsOwnerPageState();
}

class _PermitsOwnerPageState extends State<PermitsOwnerPage> {
  List<dynamic> applications = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchConfirmedApplications();
  }

  Future<void> fetchConfirmedApplications() async {
    setState(() {
      loading = true;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/permit-applications/confirmed'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final data = List<Map<String, dynamic>>.from(jsonDecode(response.body));
        setState(() {
          applications = data;
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch confirmed permit applications';
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

  void viewDetails(String villagerId) {
    Navigator.pushNamed(
      context,
      '/permits_owner_details',
      arguments: villagerId,
    );
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return Center(child: CircularProgressIndicator());
    if (error != null) return Center(child: Text('Error: $error'));

    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 3, selectedSubIndex: 1),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: Scaffold(
                appBar: AppBar(title: Text('Confirmed Permit Owners')),
                body: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: DataTable(
                    columns: [
                      DataColumn(label: Text('Villager Name')),
                      DataColumn(label: Text('Villager ID')),
                      DataColumn(label: Text('Permit Type')),
                      DataColumn(label: Text('Phone Number')),
                      DataColumn(label: Text('Address')),
                      DataColumn(label: Text('Action')),
                    ],
                    rows: applications.map((app) {
                      return DataRow(
                        cells: [
                          DataCell(Text(app['Full_Name'] ?? '')),
                          DataCell(Text(app['Villager_ID'].toString())),
                          DataCell(Text(app['Permits_Type'] ?? '')),
                          DataCell(Text(app['Phone_No'] ?? '')),
                          DataCell(Text(app['Address'] ?? '')),
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
                floatingActionButton: FloatingActionButton(
                  child: Icon(Icons.arrow_back),
                  onPressed: () =>
                      Navigator.pushReplacementNamed(context, '/dashboard'),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
