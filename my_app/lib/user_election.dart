import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'user_election_upload.dart'; // Create this for the upload step

class UserElectionPage extends StatefulWidget {
  const UserElectionPage({super.key});

  @override
  State<UserElectionPage> createState() => _UserElectionPageState();
}

class _UserElectionPageState extends State<UserElectionPage> {
  bool loading = true;
  String? error;
  List<dynamic> electionTypes = [];
  String? selectedType;
  String? userEmail;

  @override
  void initState() {
    super.initState();
    fetchElectionTypesAndProfile();
  }

  Future<void> fetchElectionTypesAndProfile() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      // Fetch user profile
      final profileRes = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (profileRes.statusCode != 200)
        throw Exception('Failed to fetch profile');
      final profile = jsonDecode(profileRes.body);
      userEmail = profile['Email'];
      // Fetch election types
      final electionsRes = await http.get(
        Uri.parse('http://localhost:5000/api/elections'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (electionsRes.statusCode != 200)
        throw Exception('Failed to fetch election types');
      final elections = jsonDecode(electionsRes.body);
      setState(() {
        electionTypes = elections;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  void handleNext() {
    if (selectedType == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please select an election type.')),
      );
      return;
    }
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => UserElectionUploadPage(
          email: userEmail ?? '',
          electionType: selectedType!,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Apply for Election'),
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
                    'Apply for Election',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 16),
                  Text('Email:', style: TextStyle(fontWeight: FontWeight.bold)),
                  Text(
                    userEmail ?? '',
                    style: TextStyle(color: Colors.black87),
                  ),
                  SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: selectedType,
                    items: electionTypes.map<DropdownMenuItem<String>>((
                      election,
                    ) {
                      return DropdownMenuItem<String>(
                        value: election['Type'],
                        child: Text(election['Type']),
                      );
                    }).toList(),
                    onChanged: (v) => setState(() => selectedType = v),
                    decoration: InputDecoration(labelText: 'Election Type'),
                  ),
                  SizedBox(height: 24),
                  Center(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF921940),
                      ),
                      onPressed: handleNext,
                      child: Text('Next'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
