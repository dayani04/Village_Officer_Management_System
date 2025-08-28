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
  int? userAge;

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
      userAge = _calculateAge(profile['DOB']);
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
      // Filter NIC types based on age
      List<dynamic> filteredNics = nics;
      if (userAge != null) {
        if (userAge! <= 15) {
          filteredNics = nics
              .where((nic) => nic['NIC_Type'] == 'postal ID Card')
              .toList();
        } else if (userAge! >= 16) {
          filteredNics = nics
              .where((nic) => nic['NIC_Type'] == 'National ID Card')
              .toList();
        }
      } else {
        filteredNics = [];
      }
      setState(() {
        nicTypes = filteredNics;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  int? _calculateAge(String? dob) {
    if (dob == null || dob.isEmpty) return null;
    try {
      final dobDate = DateTime.parse(dob);
      final currentDate = DateTime(2025, 6, 12); // match React code
      int age = currentDate.year - dobDate.year;
      int monthDiff = currentDate.month - dobDate.month;
      if (monthDiff < 0 || (monthDiff == 0 && currentDate.day < dobDate.day)) {
        age--;
      }
      return age;
    } catch (_) {
      return null;
    }
  }

  void handleNext() {
    if (userEmail == null || userEmail!.isEmpty || selectedType == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select an ID card type.')),
      );
      return;
    }
    if (userAge != null) {
      if (userAge! <= 15 && selectedType != 'postal ID Card') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('You are not eligible for National ID Card.'),
          ),
        );
        return;
      }
      if (userAge! >= 16 && selectedType != 'National ID Card') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('You are not eligible for Postal ID Card.'),
          ),
        );
        return;
      }
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
        title: const Text('Apply for ID Card'),
        backgroundColor: const Color(0xFF921940),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text('Error: $error'))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Apply for ID Card',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Email:',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  Text(
                    userEmail ?? '',
                    style: const TextStyle(color: Colors.black87),
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    value: selectedType,
                    items: nicTypes.map<DropdownMenuItem<String>>((nic) {
                      return DropdownMenuItem<String>(
                        value: nic['NIC_Type'],
                        child: Text(nic['NIC_Type']),
                      );
                    }).toList(),
                    onChanged: (v) => setState(() => selectedType = v),
                    decoration: const InputDecoration(
                      labelText: 'ID Card Type',
                    ),
                  ),
                  if (userAge != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        userAge! <= 15
                            ? 'You are only eligible for Postal ID Card. Your age: $userAge'
                            : 'You are only eligible for National ID Card. Your age: $userAge',
                        style: TextStyle(
                          color: userAge! <= 15 ? Colors.red : Colors.orange,
                        ),
                      ),
                    ),
                  const SizedBox(height: 24),
                  Center(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF921940),
                      ),
                      onPressed: loading || userEmail == null || userAge == null
                          ? null
                          : handleNext,
                      child: const Text('Next'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
