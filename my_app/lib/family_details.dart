import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class FamilyDetailsPage extends StatefulWidget {
  const FamilyDetailsPage({super.key});

  @override
  State<FamilyDetailsPage> createState() => _FamilyDetailsPageState();
}

class _FamilyDetailsPageState extends State<FamilyDetailsPage> {
  bool loading = true;
  String? error;
  List<dynamic> familyMembers = [];

  @override
  void initState() {
    super.initState();
    fetchFamilyMembers();
  }

  Future<void> fetchFamilyMembers() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      // Fetch logged-in villager's profile
      final profileRes = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (profileRes.statusCode != 200) {
        throw Exception('Failed to fetch profile');
      }
      final profile = jsonDecode(profileRes.body);
      final address = profile['Address'];
      final latitude = profile['Latitude'];
      final longitude = profile['Longitude'];
      final villagerId = profile['Villager_ID'];

      // Fetch all villagers
      final villagersRes = await http.get(
        Uri.parse('http://localhost:5000/api/villagers'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (villagersRes.statusCode != 200) {
        throw Exception('Failed to fetch villagers');
      }
      final allVillagers = jsonDecode(villagersRes.body);

      // Filter family members
      final family = allVillagers
          .where(
            (villager) =>
                villager['Address'] == address &&
                villager['Latitude'] == latitude &&
                villager['Longitude'] == longitude &&
                villager['Villager_ID'] != villagerId,
          )
          .toList();

      setState(() {
        familyMembers = family;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Family Members'),
        backgroundColor: Color(0xFF921940),
      ),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text('Error: $error'))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Family Members',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 16),
                  familyMembers.isEmpty
                      ? Text('No family members found at your address.')
                      : Expanded(
                          child: ListView.builder(
                            itemCount: familyMembers.length,
                            itemBuilder: (context, idx) {
                              final villager = familyMembers[idx];
                              return Card(
                                margin: EdgeInsets.symmetric(vertical: 8),
                                child: Padding(
                                  padding: const EdgeInsets.all(12.0),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        villager['Full_Name'] ?? '',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                      SizedBox(height: 4),
                                      Text(
                                        'Address: ${villager['Address'] ?? 'N/A'}',
                                      ),
                                      Text('Email: ${villager['Email'] ?? ''}'),
                                      Text(
                                        'Phone: ${villager['Phone_No'] ?? ''}',
                                      ),
                                      Text(
                                        'Coordinates: Lat: ${villager['Latitude']}, Lng: ${villager['Longitude']}',
                                      ),
                                      Text(
                                        'Election Participate: ${(villager['IsParticipant'] == 1 || villager['IsParticipant'] == true) ? 'Yes' : 'No'}',
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                  SizedBox(height: 20),
                  Center(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF7a1632),
                      ),
                      onPressed: () => Navigator.pop(context),
                      child: Text('Back to Dashboard'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
