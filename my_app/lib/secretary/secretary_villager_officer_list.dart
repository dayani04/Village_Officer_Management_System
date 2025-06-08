import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'secretary_dashboard.dart';

class SecretaryVillagerOfficerListPage extends StatefulWidget {
  const SecretaryVillagerOfficerListPage({Key? key}) : super(key: key);

  @override
  _SecretaryVillagerOfficerListPageState createState() =>
      _SecretaryVillagerOfficerListPageState();
}

class _SecretaryVillagerOfficerListPageState
    extends State<SecretaryVillagerOfficerListPage> {
  List<Map<String, dynamic>> officers = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchOfficers();
  }

  Future<String> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token') ?? '';
  }

  Future<void> fetchOfficers() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final token = await getToken();
      if (token.isEmpty) {
        setState(() {
          error = 'No token provided. Please log in again.';
          loading = false;
        });
        // Optionally, redirect to login page after a short delay
        Future.delayed(const Duration(seconds: 2), () {
          Navigator.pushReplacementNamed(context, '/login');
        });
        return;
      }
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villager_officers/'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          officers = List<Map<String, dynamic>>.from(
            json.decode(response.body),
          );
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch villager officer data';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to fetch villager officer data: $e';
        loading = false;
      });
    }
  }

  Future<void> deleteOfficer(String officerId, String officerName) async {
    try {
      final token = await getToken();
      if (token.isEmpty) {
        setState(() {
          error = 'No token provided. Please log in again.';
        });
        // Optionally, redirect to login page after a short delay
        Future.delayed(const Duration(seconds: 2), () {
          Navigator.pushReplacementNamed(context, '/login');
        });
        return;
      }
      final response = await http.delete(
        Uri.parse('http://localhost:5000/api/villager_officers/$officerId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          officers.removeWhere(
            (officer) => officer['Villager_Officer_ID'].toString() == officerId,
          );
          error = 'Officer $officerName deleted successfully';
        });
      } else {
        setState(() {
          error = 'Failed to delete officer';
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to delete officer: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return VillagerOfficersPage(
      loading: loading,
      error: error,
      officers: officers,
      onAddOfficer: () {
        Navigator.pushNamed(context, '/add_secretary_villager_officer');
      },
      onEditOfficer: (String officerId) {
        Navigator.pushNamed(
          context,
          '/edit_secretary_villager_officer',
          arguments: {'officerId': officerId},
        );
      },
      onDeleteOfficer: (String officerId, String officerName) async {
        final confirmed = await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Confirm Deletion'),
            content: Text(
              'Are you sure you want to delete officer $officerName?',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('Delete'),
              ),
            ],
          ),
        );
        if (confirmed == true) {
          await deleteOfficer(officerId, officerName);
        }
      },
      onViewOfficer: (String officerId) {
        Navigator.pushNamed(
          context,
          '/view_secretary_villager_officer',
          arguments: {'officerId': officerId},
        );
      },
    );
  }
}

class VillagerOfficersPage extends StatelessWidget {
  final bool loading;
  final String? error;
  final List<Map<String, dynamic>> officers;
  final VoidCallback onAddOfficer;
  final Function(String) onEditOfficer;
  final Function(String, String) onDeleteOfficer;
  final Function(String) onViewOfficer;

  const VillagerOfficersPage({
    Key? key,
    required this.loading,
    this.error,
    required this.officers,
    required this.onAddOfficer,
    required this.onEditOfficer,
    required this.onDeleteOfficer,
    required this.onViewOfficer,
  }) : super(key: key);

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
            child: Container(
              color: const Color(0xFFF9F9F9),
              child: Center(
                child: Container(
                  width: 1000,
                  margin: const EdgeInsets.symmetric(vertical: 32),
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
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
                            Text(
                              'Villager Officers',
                              style: Theme.of(context).textTheme.titleLarge,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              error!,
                              style: const TextStyle(color: Colors.red),
                            ),
                            const SizedBox(height: 24),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.start,
                              children: [
                                ElevatedButton(
                                  onPressed: () =>
                                      Navigator.pushReplacementNamed(
                                        context,
                                        '/secretary/secretary_dashboard',
                                      ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF7A1632),
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Back to Dashboard'),
                                ),
                              ],
                            ),
                          ],
                        )
                      : Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              'Villager Officers',
                              style: Theme.of(context).textTheme.titleLarge,
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 24),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                ElevatedButton.icon(
                                  icon: const Icon(
                                    Icons.add,
                                    color: Colors.white,
                                  ),
                                  label: const Text('Add Officer'),
                                  onPressed: onAddOfficer,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF7A1632),
                                    foregroundColor: Colors.white,
                                  ),
                                ),
                                ElevatedButton(
                                  onPressed: () =>
                                      Navigator.pushReplacementNamed(
                                        context,
                                        '/secretary/secretary_dashboard',
                                      ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF7A1632),
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Back to Dashboard'),
                                ),
                              ],
                            ),
                            const SizedBox(height: 24),
                            Expanded(
                              child: Container(
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: officers.isEmpty
                                    ? Center(
                                        child: Text(
                                          'No villager officers found',
                                          style: TextStyle(
                                            color: Colors.grey[700],
                                          ),
                                        ),
                                      )
                                    : SingleChildScrollView(
                                        scrollDirection: Axis.horizontal,
                                        child: DataTable(
                                          headingRowColor:
                                              MaterialStateProperty.all(
                                                const Color(0xFF7A1632),
                                              ),
                                          headingTextStyle: const TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                          ),
                                          columns: const [
                                            DataColumn(
                                              label: Text('Officer ID'),
                                            ),
                                            DataColumn(
                                              label: Text('Full Name'),
                                            ),
                                            DataColumn(label: Text('Email')),
                                            DataColumn(label: Text('Phone No')),
                                            DataColumn(label: Text('Status')),
                                            DataColumn(label: Text('Actions')),
                                          ],
                                          rows: officers.map<DataRow>((
                                            officer,
                                          ) {
                                            return DataRow(
                                              cells: [
                                                DataCell(
                                                  Text(
                                                    officer['Villager_Officer_ID']
                                                            ?.toString() ??
                                                        'N/A',
                                                  ),
                                                ),
                                                DataCell(
                                                  Text(
                                                    officer['Full_Name'] ??
                                                        'N/A',
                                                  ),
                                                ),
                                                DataCell(
                                                  Text(
                                                    officer['Email'] ?? 'N/A',
                                                  ),
                                                ),
                                                DataCell(
                                                  Text(
                                                    officer['Phone_No'] ??
                                                        'N/A',
                                                  ),
                                                ),
                                                DataCell(
                                                  Text(
                                                    officer['Status'] ?? 'N/A',
                                                  ),
                                                ),
                                                DataCell(
                                                  Row(
                                                    children: [
                                                      IconButton(
                                                        icon: const Icon(
                                                          Icons.edit,
                                                          color: Color(
                                                            0xFF7A1632,
                                                          ),
                                                        ),
                                                        onPressed: () =>
                                                            onEditOfficer(
                                                              officer['Villager_Officer_ID']
                                                                  .toString(),
                                                            ),
                                                        tooltip: 'Edit Officer',
                                                      ),
                                                      IconButton(
                                                        icon: const Icon(
                                                          Icons.delete,
                                                          color: Color(
                                                            0xFF7A1632,
                                                          ),
                                                        ),
                                                        onPressed: () =>
                                                            onDeleteOfficer(
                                                              officer['Villager_Officer_ID']
                                                                  .toString(),
                                                              officer['Full_Name'] ??
                                                                  '',
                                                            ),
                                                        tooltip:
                                                            'Delete Officer',
                                                      ),
                                                      IconButton(
                                                        icon: const Icon(
                                                          Icons.visibility,
                                                          color: Color(
                                                            0xFF7A1632,
                                                          ),
                                                        ),
                                                        onPressed: () =>
                                                            onViewOfficer(
                                                              officer['Villager_Officer_ID']
                                                                  .toString(),
                                                            ),
                                                        tooltip: 'View Officer',
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
