import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'secretary_dashboard.dart';

class SecretaryVillagerOfficerListPage extends StatefulWidget {
  const SecretaryVillagerOfficerListPage({Key? key}) : super(key: key);

  @override
  State<SecretaryVillagerOfficerListPage> createState() =>
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

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    debugPrint('DEBUG: Retrieved token: $token');
    return token;
  }

  Future<void> fetchOfficers() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villager-officers/'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      debugPrint('DEBUG: Fetch officers response: ${response.statusCode} ${response.body}');
      if (response.statusCode == 200) {
        setState(() {
          officers = List<Map<String, dynamic>>.from(
            json.decode(response.body),
          );
          loading = false;
        });
      } else {
        setState(() {
          error = response.statusCode == 401
              ? 'Unauthorized: Please log in again'
              : 'Failed to fetch villager officer data: ${response.body}';
          loading = false;
        });
      }
    } catch (e) {
      debugPrint('DEBUG: Fetch officers error: $e');
      setState(() {
        error = 'Error: $e';
        loading = false;
      });
    }
  }

  Future<void> deleteOfficer(String officerId, String officerName) async {
    try {
      final token = await getToken();
      final response = await http.delete(
        Uri.parse('http://localhost:5000/api/villager-officers/$officerId'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      debugPrint('DEBUG: Delete officer response: ${response.statusCode} ${response.body}');
      if (response.statusCode == 200) {
        setState(() {
          officers.removeWhere(
            (officer) => officer['Villager_Officer_ID'].toString() == officerId,
          );
          error = 'Officer $officerName deleted successfully';
        });
      } else {
        setState(() {
          error = response.statusCode == 401
              ? 'Unauthorized: Please log in again'
              : 'Failed to delete officer: ${response.body}';
        });
      }
    } catch (e) {
      debugPrint('DEBUG: Delete officer error: $e');
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
        Navigator.pushNamed(context, '/add_secretary_villager_officer')
            .then((_) => fetchOfficers());
      },
      onEditOfficer: (String officerId) {
        Navigator.pushNamed(
          context,
          '/edit_secretary_villager_officer',
          arguments: {'officerId': officerId},
        ).then((_) => fetchOfficers());
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
        debugPrint('DEBUG: Navigating to view officer with ID: $officerId');
        Navigator.pushNamed(
          context,
          '/view_secretary_villager_officer',
          arguments: {'officerId': officerId},
        );
      },
      onRefresh: fetchOfficers,
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
  final VoidCallback? onRefresh;

  const VillagerOfficersPage({
    Key? key,
    required this.loading,
    this.error,
    required this.officers,
    required this.onAddOfficer,
    required this.onEditOfficer,
    required this.onDeleteOfficer,
    required this.onViewOfficer,
    this.onRefresh,
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
                                'Villager Officers',
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
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
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
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 24, vertical: 12),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                    ),
                                    child: const Text('Back to Dashboard'),
                                  ),
                                  if (onRefresh != null) const SizedBox(width: 16),
                                  if (onRefresh != null)
                                    ElevatedButton.icon(
                                      onPressed: onRefresh,
                                      icon: const Icon(Icons.refresh, color: Colors.white),
                                      label: const Text('Retry'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: const Color(0xFF7A1632),
                                        foregroundColor: Colors.white,
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 24, vertical: 12),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            ],
                          )
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              const Text(
                                'Villager Officers',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF333333),
                                ),
                              ),
                              const SizedBox(height: 20),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  ElevatedButton.icon(
                                    onPressed: onAddOfficer,
                                    icon: const Icon(Icons.add, color: Colors.white),
                                    label: const Text('Add Officer'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF7A1632),
                                      foregroundColor: Colors.white,
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 24, vertical: 12),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(6),
                                      ),
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
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 24, vertical: 12),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                    ),
                                    child: const Text('Back to Dashboard'),
                                  ),
                                ],
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
                                          'Officer ID',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Full Name',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Email',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Phone No',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Status',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Actions',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                    ],
                                    rows: officers.isNotEmpty
                                        ? officers.map<DataRow>((officer) {
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
                                                  Text(officer['Full_Name'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(officer['Email'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(officer['Phone_No'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(officer['Status'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Row(
                                                    children: [
                                                      IconButton(
                                                        icon: const Icon(
                                                          Icons.visibility,
                                                          color: Color(0xFF7A1632),
                                                        ),
                                                        onPressed: () => onViewOfficer(
                                                          officer['Villager_Officer_ID']
                                                              .toString(),
                                                        ),
                                                        tooltip: 'View Officer',
                                                      ),
                                                      IconButton(
                                                        icon: const Icon(
                                                          Icons.edit,
                                                          color: Color(0xFF7A1632),
                                                        ),
                                                        onPressed: () => onEditOfficer(
                                                          officer['Villager_Officer_ID']
                                                              .toString(),
                                                        ),
                                                        tooltip: 'Edit Officer',
                                                      ),
                                                      IconButton(
                                                        icon: const Icon(
                                                          Icons.delete,
                                                          color: Color(0xFFF43F3F),
                                                        ),
                                                        onPressed: () => onDeleteOfficer(
                                                          officer['Villager_Officer_ID']
                                                              .toString(),
                                                          officer['Full_Name'] ?? '',
                                                        ),
                                                        tooltip: 'Delete Officer',
                                                      ),
                                                    ],
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
                                                    'No villager officers found',
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