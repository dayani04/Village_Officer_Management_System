import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class ViewVillagerPage extends StatefulWidget {
  final String villagerId;
  const ViewVillagerPage({
    Key? key,
    required this.villagerId,
    required String villageId,
  }) : super(key: key);

  @override
  State<ViewVillagerPage> createState() => _ViewVillagerPageState();
}

class _ViewVillagerPageState extends State<ViewVillagerPage> {
  Map? villager;
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
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) {
        setState(() {
          error = 'No authentication token found. Please log in again.';
          loading = false;
        });
        return;
      }
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
          error = 'Failed to fetch villager';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to fetch villager';
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return Center(child: CircularProgressIndicator());
    if (error != null) return Center(child: Text(error!));
    if (villager == null) return Center(child: Text('Villager not found'));
    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 1, selectedSubIndex: 1),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: Padding(
                padding: const EdgeInsets.all(24),
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
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      child: Text('Back to Villagers'),
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
