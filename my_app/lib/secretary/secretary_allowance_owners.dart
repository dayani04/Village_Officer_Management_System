import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'secretary_dashboard.dart';

class SecretaryAllowanceOwnersPage extends StatefulWidget {
  const SecretaryAllowanceOwnersPage({Key? key}) : super(key: key);

  @override
  State<SecretaryAllowanceOwnersPage> createState() =>
      _SecretaryAllowanceOwnersPageState();
}

class _SecretaryAllowanceOwnersPageState
    extends State<SecretaryAllowanceOwnersPage> {
  bool _loading = true;
  String? _error;
  List<Map<String, dynamic>> applications = [];

  @override
  void initState() {
    super.initState();
    fetchConfirmedApplications();
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    debugPrint('DEBUG: Retrieved token: $token');
    return token;
  }

  Future<void> fetchConfirmedApplications() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final token = await getToken();
      if (token == null) {
        throw Exception('No token found. Please log in again.');
      }
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/allowance-applications/confirmed'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      debugPrint('DEBUG: Fetch confirmed applications response: ${response.statusCode} ${response.body}');
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          applications = List<Map<String, dynamic>>.from(data);
          _loading = false;
        });
      } else {
        setState(() {
          _error = response.statusCode == 401
              ? 'Unauthorized: Please log in again'
              : 'Failed to fetch confirmed allowance applications: ${response.body}';
          _loading = false;
        });
        if (response.statusCode == 401 && mounted) {
          Navigator.pushReplacementNamed(context, '/login');
        }
      }
    } catch (e) {
      debugPrint('DEBUG: Fetch confirmed applications error: $e');
      setState(() {
        _error = 'Error: $e';
        _loading = false;
      });
    }
  }

  void handleViewDetails(String villagerId) {
    debugPrint('DEBUG: Navigating to view villager with ID: $villagerId');
    Navigator.pushNamed(
      context,
      '/secretary_allowance_owners_view',
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
                  borderRadius: BorderRadius.circular(8), // Match ApplicationsPage
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05), // Match ApplicationsPage
                      blurRadius: 8, // Match ApplicationsPage
                      offset: const Offset(0, 2), // Match ApplicationsPage
                    ),
                  ],
                ),
                child: _loading
                    ? const Center(child: CircularProgressIndicator())
                    : _error != null
                        ? Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text(
                                'Confirmed Allowance Recipients',
                                style: TextStyle(
                                  fontSize: 24, // Match ApplicationsPage
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF333333),
                                ),
                              ),
                              const SizedBox(height: 20), // Match ApplicationsPage
                              Text(
                                _error!,
                                style: const TextStyle(color: Color(0xFFF43F3F)),
                              ),
                              const SizedBox(height: 20), // Match ApplicationsPage
                              ElevatedButton(
                                onPressed: handleBack,
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
                                child: const Text('Back to Dashboard'),
                              ),
                            ],
                          )
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              const Text(
                                'Confirmed Allowance Recipients',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 24, // Match ApplicationsPage
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF333333),
                                ),
                              ),
                              const SizedBox(height: 20), // Match ApplicationsPage
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
                                          'Allowance Type',
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
                                                  Text(app['Allowances_Type'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(app['Phone_No'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(app['Address'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  ElevatedButton(
                                                    onPressed: () => handleViewDetails(
                                                      app['Villager_ID'],
                                                    ),
                                                    style: ElevatedButton.styleFrom(
                                                      backgroundColor: const Color(0xFF7A1632),
                                                      foregroundColor: Colors.white,
                                                      padding: const EdgeInsets.symmetric(
                                                        horizontal: 16,
                                                        vertical: 8,
                                                      ),
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
                                                    'No confirmed allowance recipients',
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
                              const SizedBox(height: 20), // Match ApplicationsPage
                              Center(
                                child: ElevatedButton(
                                  onPressed: handleBack,
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