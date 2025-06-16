import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'user_idcard_upload.dart'; // The upload page

class UserIDCardPage extends StatefulWidget {
  const UserIDCardPage({super.key});

  @override
  State<UserIDCardPage> createState() => _UserIDCardPageState();
}

class _UserIDCardPageState extends State<UserIDCardPage> {
  bool loading = true;
  String? error;
  List<dynamic> nicTypes = [];
  String? selectedType;
  String? userEmail;

  @override
  void initState() {
    super.initState();
    fetchNicTypesAndProfile();
  }

  Future<void> fetchNicTypesAndProfile() async {
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
      // Fetch NIC types
      final nicsRes = await http.get(
        Uri.parse('http://localhost:5000/api/nics'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (nicsRes.statusCode != 200)
        throw Exception('Failed to fetch NIC types');
      final nics = jsonDecode(nicsRes.body);
      setState(() {
        nicTypes = nics;
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
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Please select an ID card type.')));
      return;
    }
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => UserIDCardUploadPage(
          email: userEmail ?? '',
          nicType: selectedType!,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Apply for ID Card'),
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
                    'Apply for ID Card',
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
                    items: nicTypes.map<DropdownMenuItem<String>>((nic) {
                      return DropdownMenuItem<String>(
                        value: nic['NIC_Type'],
                        child: Text(nic['NIC_Type']),
                      );
                    }).toList(),
                    onChanged: (v) => setState(() => selectedType = v),
                    decoration: InputDecoration(labelText: 'ID Card Type'),
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
