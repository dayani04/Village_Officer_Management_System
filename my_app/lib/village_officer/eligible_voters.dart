import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class EligibleVotersPage extends StatefulWidget {
  const EligibleVotersPage({Key? key}) : super(key: key);

  @override
  State<EligibleVotersPage> createState() => _EligibleVotersPageState();
}

class _EligibleVotersPageState extends State<EligibleVotersPage> {
  List voters = [];
  bool loading = true;
  String error = '';
  Set sentNotifications = {};

  @override
  void initState() {
    super.initState();
    fetchVoters();
  }

  Future<void> fetchVoters() async {
    setState(() {
      loading = true;
      error = '';
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final eligibleVoters = data.where((villager) {
          if (villager['DOB'] == null || villager['DOB'] is! String)
            return false;
          final dob = DateTime.tryParse(villager['DOB']);
          if (dob == null) return false;
          final today = DateTime(2025, 5, 25);
          int age = today.year - dob.year;
          final monthDiff = today.month - dob.month;
          final dayDiff = today.day - dob.day;
          if (monthDiff < 0 || (monthDiff == 0 && dayDiff < 0)) {
            return age - 1 == 18;
          }
          return age == 18;
        }).toList();
        setState(() {
          voters = eligibleVoters;
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch voter data';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to fetch voter data';
        loading = false;
      });
    }
  }

  Future<void> handleSendNotification(
    String villagerId,
    String fullName,
  ) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final message =
          'Congratulations on turning 18! You are now eligible to vote.';
      final response = await http.post(
        Uri.parse(
          'http://localhost:5000/api/villagers/$villagerId/notification',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'message': message}),
      );
      if (response.statusCode == 200) {
        setState(() {
          sentNotifications.add(villagerId);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Notification sent to $fullName'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to send notification'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to send notification'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  String formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';
    final date = DateTime.tryParse(dateString);
    if (date == null) return 'N/A';
    return '${date.day}/${date.month}/${date.year}';
  }

  String calculateAge(String? dob) {
    if (dob == null || dob.isEmpty) return 'N/A';
    final dobDate = DateTime.tryParse(dob);
    if (dobDate == null) return 'N/A';
    final today = DateTime(2025, 5, 25);
    int age = today.year - dobDate.year;
    final monthDiff = today.month - dobDate.month;
    final dayDiff = today.day - dobDate.day;
    if (monthDiff < 0 || (monthDiff == 0 && dayDiff < 0)) {
      age--;
    }
    return age.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 2, selectedSubIndex: 5),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: loading
                  ? Center(child: CircularProgressIndicator())
                  : error.isNotEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Error: $error'),
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
                      child: Container(
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: Color(0xFFF9F9F9),
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.1),
                              blurRadius: 4,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            Text(
                              'Voters (Age 18)',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF333333),
                              ),
                              textAlign: TextAlign.center,
                            ),
                            SizedBox(height: 20),
                            SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: DataTable(
                                columns: const [
                                  DataColumn(label: Text('User ID')),
                                  DataColumn(label: Text('Full Name')),
                                  DataColumn(label: Text('Address')),
                                  DataColumn(label: Text('DOB')),
                                  DataColumn(label: Text('Age')),
                                  DataColumn(label: Text('Regional Division')),
                                  DataColumn(label: Text('Status')),
                                  DataColumn(label: Text('Area ID')),
                                  DataColumn(label: Text('Action')),
                                ],
                                rows: voters.isNotEmpty
                                    ? voters.map<DataRow>((voter) {
                                        return DataRow(
                                          cells: [
                                            DataCell(
                                              Text(
                                                voter['Villager_ID'] ?? 'N/A',
                                              ),
                                            ),
                                            DataCell(
                                              Text(voter['Full_Name'] ?? 'N/A'),
                                            ),
                                            DataCell(
                                              Text(voter['Address'] ?? 'N/A'),
                                            ),
                                            DataCell(
                                              Text(formatDate(voter['DOB'])),
                                            ),
                                            DataCell(
                                              Text(calculateAge(voter['DOB'])),
                                            ),
                                            DataCell(
                                              Text(
                                                voter['RegionalDivision'] ??
                                                    'N/A',
                                              ),
                                            ),
                                            DataCell(
                                              Text(voter['Status'] ?? 'N/A'),
                                            ),
                                            DataCell(
                                              Text(voter['Area_ID'] ?? 'N/A'),
                                            ),
                                            DataCell(
                                              Row(
                                                children: [
                                                  IconButton(
                                                    icon: Icon(
                                                      Icons.mail,
                                                      color:
                                                          sentNotifications
                                                              .contains(
                                                                voter['Villager_ID'],
                                                              )
                                                          ? Colors.green
                                                          : Color(0xFF7a1632),
                                                    ),
                                                    tooltip:
                                                        'Send Notification',
                                                    onPressed:
                                                        sentNotifications.contains(
                                                          voter['Villager_ID'],
                                                        )
                                                        ? null
                                                        : () => handleSendNotification(
                                                            voter['Villager_ID'],
                                                            voter['Full_Name'],
                                                          ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        );
                                      }).toList()
                                    : [
                                        DataRow(
                                          cells: [
                                            DataCell(
                                              Container(
                                                alignment: Alignment.center,
                                                padding: EdgeInsets.symmetric(
                                                  vertical: 20,
                                                ),
                                                child: Text(
                                                  'No voters aged 18 found',
                                                ),
                                              ),
                                            ),
                                            ...List.generate(
                                              8,
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
