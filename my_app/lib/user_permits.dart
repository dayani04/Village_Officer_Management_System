import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'user_permitspr.dart';

class UserPermitsPage extends StatefulWidget {
  const UserPermitsPage({super.key});

  @override
  State<UserPermitsPage> createState() => _UserPermitsPageState();
}

class _UserPermitsPageState extends State<UserPermitsPage> {
  bool loading = true;
  String? error;
  List<dynamic> permitTypes = [];
  String? selectedType;
  String? userEmail;

  @override
  void initState() {
    super.initState();
    fetchPermitTypesAndProfile();
  }

  Future<void> fetchPermitTypesAndProfile() async {
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
      // Fetch permit types
      final permitsRes = await http.get(
        Uri.parse('http://localhost:5000/api/permits'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (permitsRes.statusCode != 200)
        throw Exception('Failed to fetch permit types');
      final permits = jsonDecode(permitsRes.body);
      setState(() {
        permitTypes = permits;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  void handleApply() {
    if (selectedType == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Please select a permit type.')));
      return;
    }
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => UserPermitsPRPage(
          email: userEmail ?? '',
          permitType: selectedType!,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Apply for Permit'),
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
                    'Apply for Permit',
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
                    items: permitTypes.map<DropdownMenuItem<String>>((permit) {
                      return DropdownMenuItem<String>(
                        value: permit['Permits_Type'],
                        child: Text(permit['Permits_Type']),
                      );
                    }).toList(),
                    onChanged: (v) => setState(() => selectedType = v),
                    decoration: InputDecoration(labelText: 'Permit Type'),
                  ),
                  SizedBox(height: 24),
                  Center(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF921940),
                      ),
                      onPressed: handleApply,
                      child: Text('Next'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
