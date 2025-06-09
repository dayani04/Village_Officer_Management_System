import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'secretary_dashboard.dart';

class SecretaryVillagersPage extends StatefulWidget {
  const SecretaryVillagersPage({super.key});

  @override
  State<SecretaryVillagersPage> createState() => _SecretaryVillagersPageState();
}

class _SecretaryVillagersPageState extends State<SecretaryVillagersPage> {
  List<Map<String, dynamic>> villagers = [];
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
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          villagers = List<Map<String, dynamic>>.from(json.decode(response.body));
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch villager data: ${response.body}';
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

  void handleBack() {
    Navigator.pushReplacementNamed(context, '/secretary/secretary_dashboard');
  }

  void handleView(String villagerId) {
    Navigator.pushNamed(
      context,
      '/view_secretary_villager',
      arguments: {'villagerId': villagerId},
    );
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
                                'All Villagers',
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
                                'All Villagers',
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
                                          'ID',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Area ID',
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
                                          'Email',
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
                                          'Election Participant',
                                          style: TextStyle(fontWeight: FontWeight.bold),
                                        ),
                                      ),
                                      DataColumn(
                                        label: Text(
                                          'Regional Division',
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
                                    rows: villagers.isNotEmpty
                                        ? villagers.map<DataRow>((villager) {
                                            return DataRow(
                                              cells: [
                                                DataCell(
                                                  Text(villager['Full_Name'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(
                                                    villager['Villager_ID']?.toString() ??
                                                        'N/A',
                                                  ),
                                                ),
                                                DataCell(
                                                  Text(
                                                    villager['Area_ID']?.toString() ??
                                                        'N/A',
                                                  ),
                                                ),
                                                DataCell(
                                                  Text(villager['Address'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(villager['Email'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(villager['Phone_No'] ?? 'N/A'),
                                                ),
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
                                                  Text(
                                                    villager['RegionalDivision'] ??
                                                        'N/A',
                                                  ),
                                                ),
                                                DataCell(
                                                  ElevatedButton(
                                                    onPressed: () => handleView(
                                                      villager['Villager_ID'].toString(),
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
                                                    'No villagers found',
                                                    style: TextStyle(color: Colors.grey),
                                                  ),
                                                  placeholder: true,
                                                ),
                                                DataCell.empty,
                                                DataCell.empty,
                                                DataCell.empty,
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