import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class AllowanceOwnersPage extends StatefulWidget {
  const AllowanceOwnersPage({Key? key}) : super(key: key);

  @override
  State<AllowanceOwnersPage> createState() => _AllowanceOwnersPageState();
}

class _AllowanceOwnersPageState extends State<AllowanceOwnersPage> {
  List applications = [];
  bool loading = true;
  String error = '';

  @override
  void initState() {
    super.initState();
    fetchApplications();
  }

  Future<void> fetchApplications() async {
    setState(() {
      loading = true;
      error = '';
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/allowance-applications/confirmed'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          applications = json.decode(response.body);
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch confirmed allowance applications';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to fetch confirmed allowance applications';
        loading = false;
      });
    }
  }

  void handleViewDetails(String villagerId) {
    Navigator.pushNamed(
      context,
      '/allowance_owners_details',
      arguments: {'villagerId': villagerId},
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 3, selectedSubIndex: 0),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: Scaffold(
                appBar: AppBar(title: Text('Confirmed Allowance Recipients')),
                body: loading
                    ? Center(child: CircularProgressIndicator())
                    : error.isNotEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(error, style: TextStyle(color: Colors.red)),
                            SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: () => Navigator.pop(context),
                              child: Text('Back to Dashboard'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFF7a1632),
                                foregroundColor: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      )
                    : Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          children: [
                            SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: DataTable(
                                columns: const [
                                  DataColumn(label: Text('Villager Name')),
                                  DataColumn(label: Text('Villager ID')),
                                  DataColumn(label: Text('Allowance Type')),
                                  DataColumn(label: Text('Phone Number')),
                                  DataColumn(label: Text('Address')),
                                  DataColumn(label: Text('Action')),
                                ],
                                rows: applications.isNotEmpty
                                    ? applications.map<DataRow>((app) {
                                        return DataRow(
                                          cells: [
                                            DataCell(
                                              Text(app['Full_Name'] ?? 'N/A'),
                                            ),
                                            DataCell(
                                              Text(app['Villager_ID'] ?? 'N/A'),
                                            ),
                                            DataCell(
                                              Text(
                                                app['Allowances_Type'] ?? 'N/A',
                                              ),
                                            ),
                                            DataCell(
                                              Text(app['Phone_No'] ?? 'N/A'),
                                            ),
                                            DataCell(
                                              Text(app['Address'] ?? 'N/A'),
                                            ),
                                            DataCell(
                                              ElevatedButton(
                                                onPressed: () =>
                                                    handleViewDetails(
                                                      app['Villager_ID'],
                                                    ),
                                                child: Text('View'),
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: Color(
                                                    0xFF7a1632,
                                                  ),
                                                  foregroundColor: Colors.white,
                                                ),
                                              ),
                                            ),
                                          ],
                                        );
                                      }).toList()
                                    : [
                                        DataRow(
                                          cells: [
                                            DataCell(
                                              Text(
                                                'No confirmed allowance recipients',
                                                textAlign: TextAlign.center,
                                              ),
                                            ),
                                            ...List.generate(
                                              5,
                                              (_) => DataCell(Container()),
                                            ),
                                          ],
                                        ),
                                      ],
                              ),
                            ),
                            SizedBox(height: 20),
                            Align(
                              alignment: Alignment.center,
                              child: ElevatedButton(
                                onPressed: () => Navigator.pop(context),
                                child: Text('Back to Dashboard'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Color(0xFF7a1632),
                                  foregroundColor: Colors.white,
                                ),
                              ),
                            ),
                          ],
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
