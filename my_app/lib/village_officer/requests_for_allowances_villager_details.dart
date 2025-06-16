import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class RequestsForAllowancesVillagerDetailsPage extends StatefulWidget {
  @override
  _RequestsForAllowancesVillagerDetailsPageState createState() =>
      _RequestsForAllowancesVillagerDetailsPageState();
}

class _RequestsForAllowancesVillagerDetailsPageState
    extends State<RequestsForAllowancesVillagerDetailsPage> {
  Map<String, dynamic>? villager;
  bool loading = true;
  String? error;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final villagerId = ModalRoute.of(context)?.settings.arguments as String?;
    if (villagerId != null) {
      fetchVillager(villagerId);
    } else {
      setState(() {
        error = 'No villager ID provided';
        loading = false;
      });
    }
  }

  Future<void> fetchVillager(String villagerId) async {
    setState(() {
      loading = true;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/$villagerId'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        setState(() {
          villager = jsonDecode(response.body);
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch villager';
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

  @override
  Widget build(BuildContext context) {
    if (loading) return Center(child: CircularProgressIndicator());
    if (error != null) return Center(child: Text('Error: $error'));
    if (villager == null) return Center(child: Text('Villager not found'));

    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 2, selectedSubIndex: 0),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: ListView(
                  children: [
                    Text('Villager ID: \t${villager!['Villager_ID'] ?? 'N/A'}'),
                    Text('Full Name: \t${villager!['Full_Name'] ?? 'N/A'}'),
                    Text('Email: \t${villager!['Email'] ?? 'N/A'}'),
                    Text('Phone Number: \t${villager!['Phone_No'] ?? 'N/A'}'),
                    Text('NIC: \t${villager!['NIC'] ?? 'N/A'}'),
                    Text(
                      'Date of Birth: \t${villager!['DOB'] != null ? DateTime.parse(villager!['DOB']).toLocal().toString().split(' ')[0] : 'N/A'}',
                    ),
                    Text('Address: \t${villager!['Address'] ?? 'N/A'}'),
                    Text(
                      'Regional Division: \t${villager!['RegionalDivision'] ?? 'N/A'}',
                    ),
                    Text('Status: \t${villager!['Status'] ?? 'N/A'}'),
                    Text('Area ID: \t${villager!['Area_ID'] ?? 'N/A'}'),
                    Text('Latitude: \t${villager!['Latitude'] ?? 'N/A'}'),
                    Text('Longitude: \t${villager!['Longitude'] ?? 'N/A'}'),
                    Text(
                      'Election Participant: \t${villager!['IsElectionParticipant'] == true ? 'Yes' : 'No'}',
                    ),
                    Text(
                      'Alive Status: \t${villager!['AliveStatus'] ?? 'N/A'}',
                    ),
                    SizedBox(height: 20),
                    ElevatedButton(
                      child: Text('Back to Allowance Requests'),
                      onPressed: () => Navigator.pop(context),
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
