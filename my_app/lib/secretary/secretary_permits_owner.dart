import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'secretary_dashboard.dart';

class SecretaryPermitsOwnerPage extends StatefulWidget {
  const SecretaryPermitsOwnerPage({Key? key}) : super(key: key);

  @override
  State<SecretaryPermitsOwnerPage> createState() =>
      _SecretaryPermitsOwnerPageState();
}

class _SecretaryPermitsOwnerPageState extends State<SecretaryPermitsOwnerPage> {
  List<Map<String, dynamic>> applications = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchConfirmedApplications();
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<void> fetchConfirmedApplications() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/permit-applications/confirmed'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          applications = List<Map<String, dynamic>>.from(data);
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch confirmed permit applications: ${response.body}';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Error: $e';
        loading = false;
      });
    }
  }

  void handleViewDetails(String villagerId) {
    Navigator.pushNamed(
      context,
      '/secretary_permits_owner_view',
      arguments: {'villagerId': villagerId},
    );
  }

  void handleBack() {
    Navigator.pushReplacementNamed(context, '/secretary/secretary_dashboard');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Container(
            width: 250,
            color: const Color(0xFF9C284F),
            child: const SecretaryDashboard(),
          ),
          Expanded(
            child: Center(
              child: Container(
                constraints: const BoxConstraints(maxWidth: 1200),
                margin: const EdgeInsets.symmetric(vertical: 32),
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9F9F9),
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: loading
                    ? const Center(child: CircularProgressIndicator())
                    : error != null
                        ? Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text(
                                'Confirmed Permit Owners',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF333333),
                                ),
                              ),
                              const SizedBox(height: 20),
                              Text(
                                error!,
                                style: const TextStyle(color: Color(0xFFF43F3F)),
                              ),
                              const SizedBox(height: 20),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF7A1632),
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                    vertical: 12,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                ),
                                onPressed: handleBack,
                                child: const Text('Back to Dashboard'),
                              ),
                            ],
                          )
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              const Text(
                                'Confirmed Permit Owners',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF333333),
                                ),
                              ),
                              const SizedBox(height: 20),
                              Expanded(
                                child: SingleChildScrollView(
                                  scrollDirection: Axis.horizontal,
                                  child: DataTable(
                                    headingRowColor: MaterialStateProperty.all(
                                      const Color(0xFFF3F3F3),
                                    ),
                                    dataRowColor:
                                        MaterialStateProperty.resolveWith<Color?>(
                                      (Set<MaterialState> states) {
                                        if (states.contains(MaterialState.selected)) {
                                          return const Color(0xFFEDE7F6);
                                        }
                                        return null;
                                      },
                                    ),
                                    columns: const [
                                      DataColumn(
                                        label: Text(
                                          'Villager Name',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Villager ID',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Permit Type',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Phone Number',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Address',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Action',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ],
                                    rows: applications.isNotEmpty
                                        ? applications.map((app) {
                                            return DataRow(
                                              cells: [
                                                DataCell(
                                                  Text(app['Full_Name'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(app['Villager_ID'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(app['Permits_Type'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(app['Phone_No'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(app['Address'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  ElevatedButton(
                                                    style: ElevatedButton.styleFrom(
                                                      backgroundColor: const Color(0xFF7A1632),
                                                      foregroundColor: Colors.white,
                                                      padding: const EdgeInsets.symmetric(
                                                        horizontal: 16,
                                                        vertical: 8,
                                                      ),
                                                    ),
                                                    onPressed: () => handleViewDetails(
                                                      app['Villager_ID'],
                                                    ),
                                                    child: const Text('View'),
                                                  ),
                                                ),
                                              ],
                                            );
                                          }).toList()
                                        : [
                                            const DataRow(
                                              cells: [
                                                DataCell(
                                                  Text(
                                                    'No confirmed permit owners',
                                                    style: TextStyle(color: Colors.grey),
                                                  ),
                                                  placeholder: true,
                                                ),
                                                DataCell.empty,
                                                DataCell.empty,
                                                DataCell.empty,
                                                DataCell.empty,
                                                DataCell.empty,
                                              ],
                                            ),
                                          ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 20),
                              Center(
                                child: ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF7A1632),
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 24,
                                      vertical: 12,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                  ),
                                  onPressed: handleBack,
                                  child: const Text('Back to Dashboard'),
                                ),
                              ),
                            ],
                          ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}