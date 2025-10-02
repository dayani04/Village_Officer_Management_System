import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class UserElectionPage extends StatefulWidget {
  const UserElectionPage({super.key});

  @override
  State<UserElectionPage> createState() => _UserElectionPageState();
}

class _UserElectionPageState extends State<UserElectionPage> {
  bool loading = true;
  String? error;
  List<dynamic> electionTypes = [];
  List<String> allowedElectionTypes = [];
  List<String> appliedElections = [];
  String? selectedType;
  String? userEmail;
  int? userAge;
  int? villagerId;

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
      if (profileRes.statusCode != 200) {
        throw Exception('Failed to fetch profile: ${profileRes.statusCode}');
      }
      final profile = jsonDecode(profileRes.body);
      userEmail = profile['Email'] ?? '';
      // Defensive: handle both int and String for Villager_ID
      final rawVillagerId = profile['Villager_ID'];
      if (rawVillagerId is int) {
        villagerId = rawVillagerId;
      } else if (rawVillagerId is String) {
        villagerId = int.tryParse(
          rawVillagerId.replaceAll(RegExp(r'[^0-9]'), ''),
        );
      } else {
        villagerId = null;
      }
      userAge = _calculateAge(profile['DOB']);
      // Fetch election types
      final electionsRes = await http.get(
        Uri.parse('http://localhost:5000/api/elections'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (electionsRes.statusCode != 200) {
        throw Exception('Failed to fetch election types: ${electionsRes.statusCode}');
      }
      final elections = jsonDecode(electionsRes.body);
      // Fetch allowed election types (notifications)
      final notifRes = await http.get(
        Uri.parse('http://localhost:5000/api/election-notifications'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      List<String> allowedTypes = [];
      if (notifRes.statusCode == 200) {
        final notifData = jsonDecode(notifRes.body);
        allowedTypes = List<String>.from(notifData.map((n) => n['Type']));
      }
      // Fetch applied elections for this villager
      List<String> applied = [];
      if (villagerId != null) {
        final appliedRes = await http.get(
          Uri.parse(
            'http://localhost:5000/api/election-applications/villager/$villagerId',
          ),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );
        if (appliedRes.statusCode == 200) {
          final appliedData = jsonDecode(appliedRes.body);
          applied = List<String>.from(
            appliedData.map((app) => app['Type']).where((t) => t != null),
          );
        }
      }
      setState(() {
        electionTypes = elections;
        allowedElectionTypes = allowedTypes;
        appliedElections = applied;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = 'Error: ${e.toString()}';
        loading = false;
      });
    }
  }

  int? _calculateAge(String? dob) {
    if (dob == null || dob.isEmpty) return null;
    try {
      final dobDate = DateTime.parse(dob);
      final currentDate = DateTime.now(); // Updated to use current date
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

  Future<void> handleSubmit() async {
    if (userEmail == null || userEmail!.isEmpty || selectedType == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please provide an email and select an election type.')),
      );
      return;
    }

    if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(userEmail!)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Invalid email format.')),
      );
      return;
    }

    if (userAge == null || userAge! < 17) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'You must be at least 17 years old to apply. Your age: ${userAge ?? 'unknown'}',
          ),
        ),
      );
      return;
    }

    if (!allowedElectionTypes.contains(selectedType)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You are not allowed to apply for this election type.'),
        ),
      );
      return;
    }

    if (appliedElections.contains(selectedType)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('You have already applied for $selectedType.'),
        ),
      );
      return;
    }

    setState(() {
      loading = true;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final formData = <String, String>{
        'email': userEmail!,
        'electionType': selectedType!,
      };

      final request = http.MultipartRequest(
        'POST',
        Uri.parse('http://localhost:5000/api/election-applications/'),
      );
      request.headers['Authorization'] = 'Bearer $token';
      formData.forEach((key, value) {
        request.fields[key] = value;
      });

      final response = await request.send();
      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Election application submitted successfully.')),
        );
        Navigator.pushReplacementNamed(context, '/user_dashboard');
      } else {
        final responseBody = await response.stream.bytesToString();
        throw Exception('Failed to submit application: $responseBody');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Apply for Election'),
        backgroundColor: const Color(0xFF921940),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text(error!))
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Apply for Election',
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
                        items: electionTypes
                            .where((e) => allowedElectionTypes.contains(e['Type']))
                            .map<DropdownMenuItem<String>>((election) {
                              final isApplied = appliedElections.contains(
                                election['Type'],
                              );
                              return DropdownMenuItem<String>(
                                value: election['Type'],
                                enabled: !isApplied,
                                child: Text(
                                  isApplied
                                      ? '${election['Type']} (Already Applied)'
                                      : election['Type'],
                                ),
                              );
                            })
                            .toList(),
                        onChanged: (v) => setState(() => selectedType = v),
                        decoration: const InputDecoration(
                          labelText: 'Election Type',
                        ),
                        disabledHint: Text(
                          userAge != null && userAge! < 17
                              ? 'You must be at least 17 years old to apply. Your age: $userAge'
                              : 'No available elections',
                        ),
                      ),
                      if (userAge != null && userAge! < 17)
                        Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: Text(
                            'You must be at least 17 years old to apply. Your age: $userAge',
                            style: const TextStyle(color: Colors.red),
                          ),
                        ),
                      if (appliedElections.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: Text(
                            'You have already applied for: ${appliedElections.join(", ")}',
                            style: const TextStyle(color: Colors.orange),
                          ),
                        ),
                      const SizedBox(height: 24),
                      Center(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF921940),
                          ),
                          onPressed: loading || userEmail == null || userAge == null || userAge! < 17
                              ? null
                              : handleSubmit,
                          child: Text(loading ? 'Submitting...' : 'Submit'),
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}