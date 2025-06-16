import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class AllowanceOwnersDetailsPage extends StatefulWidget {
  final String villagerId;
  const AllowanceOwnersDetailsPage({Key? key, required this.villagerId})
    : super(key: key);

  @override
  State<AllowanceOwnersDetailsPage> createState() =>
      _AllowanceOwnersDetailsPageState();
}

class _AllowanceOwnersDetailsPageState
    extends State<AllowanceOwnersDetailsPage> {
  Map<String, dynamic>? villager;
  bool loading = true;
  String error = '';

  @override
  void initState() {
    super.initState();
    fetchVillager();
  }

  Future<void> fetchVillager() async {
    setState(() {
      loading = true;
      error = '';
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/${widget.villagerId}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          villager = json.decode(response.body);
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch villager details';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to fetch villager details';
        loading = false;
      });
    }
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
              child: loading
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
                            child: Text('Back'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFF7a1632),
                              foregroundColor: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    )
                  : villager == null
                  ? Center(child: Text('Villager not found'))
                  : Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Villager ID: ${villager!['Villager_ID'] ?? 'N/A'}',
                          ),
                          Text('Full Name: ${villager!['Full_Name'] ?? 'N/A'}'),
                          Text('Email: ${villager!['Email'] ?? 'N/A'}'),
                          Text(
                            'Phone Number: ${villager!['Phone_No'] ?? 'N/A'}',
                          ),
                          Text('NIC: ${villager!['NIC'] ?? 'N/A'}'),
                          Text('Date of Birth: ${villager!['DOB'] ?? 'N/A'}'),
                          Text('Address: ${villager!['Address'] ?? 'N/A'}'),
                          Text(
                            'Regional Division: ${villager!['RegionalDivision'] ?? 'N/A'}',
                          ),
                          Text('Status: ${villager!['Status'] ?? 'N/A'}'),
                          Text('Area ID: ${villager!['Area_ID'] ?? 'N/A'}'),
                          Text('Latitude: ${villager!['Latitude'] ?? 'N/A'}'),
                          Text('Longitude: ${villager!['Longitude'] ?? 'N/A'}'),
                          Text(
                            'Election Participant: ${villager!['IsElectionParticipant'] == true ? 'Yes' : 'No'}',
                          ),
                          Text(
                            'Alive Status: ${villager!['AliveStatus'] ?? 'N/A'}',
                          ),
                          SizedBox(height: 24),
                          Align(
                            alignment: Alignment.center,
                            child: ElevatedButton(
                              onPressed: () => Navigator.pop(context),
                              child: Text('Back'),
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
        ],
      ),
    );
  }
}
