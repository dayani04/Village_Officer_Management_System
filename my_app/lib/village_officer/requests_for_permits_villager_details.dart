import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import 'village_officer_sidebar.dart';

class RequestsForPermitsVillagerDetailsPage extends StatefulWidget {
  final String villagerId;
  RequestsForPermitsVillagerDetailsPage({required this.villagerId});

  @override
  _RequestsForPermitsVillagerDetailsPageState createState() =>
      _RequestsForPermitsVillagerDetailsPageState();
}

class _RequestsForPermitsVillagerDetailsPageState
    extends State<RequestsForPermitsVillagerDetailsPage> {
  Map<String, dynamic>? villager;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchVillager();
  }

  Future<void> fetchVillager() async {
    setState(() {
      loading = true;
    });
    try {
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/${widget.villagerId}'),
        headers: {
          HttpHeaders.authorizationHeader: 'Bearer ${await getToken()}',
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
          VillageOfficerSidebar(selectedIndex: 2, selectedSubIndex: 3),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: ListView(
                  children: [
                    Text('Villager ID: ${villager!['Villager_ID'] ?? 'N/A'}'),
                    Text('Full Name: ${villager!['Full_Name'] ?? 'N/A'}'),
                    Text('Email: ${villager!['Email'] ?? 'N/A'}'),
                    Text('Phone Number: ${villager!['Phone_No'] ?? 'N/A'}'),
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
                      'Election Participant: ${villager!['IsParticipant'] == true ? 'Yes' : 'No'}',
                    ),
                    Text('Alive Status: ${villager!['Alive_Status'] ?? 'N/A'}'),
                    SizedBox(height: 20),
                    ElevatedButton(
                      child: Text('Back to Permit Applications'),
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

// Helper to get token from storage (implement as per your auth logic)
Future<String> getToken() async {
  // Use shared_preferences or your auth provider
  return '';
}
