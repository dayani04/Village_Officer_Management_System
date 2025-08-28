import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'user_allowances_bc.dart';

class UserAllowancesPage extends StatefulWidget {
  const UserAllowancesPage({Key? key}) : super(key: key);

  @override
  State<UserAllowancesPage> createState() => _UserAllowancesPageState();
}

class _UserAllowancesPageState extends State<UserAllowancesPage> {
  String email = '';
  String selectedType = '';
  List<dynamic> allowanceTypes = [];
  List<String> appliedAllowances = [];
  bool loading = true;
  String? error;
  int? userAge;
  int? villagerId;

  @override
  void initState() {
    super.initState();
    fetchProfileAndAllowances();
  }

  Future<void> fetchProfileAndAllowances() async {
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
      email = profile['Email'] ?? '';
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
      // Calculate age
      userAge = _calculateAge(profile['DOB']);
      // Fetch allowance types
      final allowancesRes = await http.get(
        Uri.parse('http://localhost:5000/api/allowances'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (allowancesRes.statusCode != 200)
        throw Exception('Failed to fetch allowance types');
      final allowances = jsonDecode(allowancesRes.body);
      // Filter allowance types based on age
      List<dynamic> filteredAllowances = allowances;
      if (userAge == null || userAge! < 70) {
        filteredAllowances = allowances
            .where((a) => a['Allowances_Type'] != 'Adult Allowances')
            .toList();
      }
      // Fetch applied allowances for this villager
      List<String> applied = [];
      if (villagerId != null) {
        final appliedRes = await http.get(
          Uri.parse(
            'http://localhost:5000/api/allowance-applications/villager/$villagerId',
          ),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
        );
        if (appliedRes.statusCode == 200) {
          final appliedData = jsonDecode(appliedRes.body);
          applied = List<String>.from(
            appliedData
                .map((app) => app['Allowances_Type'])
                .where((t) => t != null),
          );
        }
      }
      setState(() {
        allowanceTypes = filteredAllowances;
        appliedAllowances = applied;
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
      final currentDate = DateTime(2025, 6, 19); // match React code
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
    if (email.isEmpty || selectedType.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select an allowance type.')),
      );
      return;
    }
    if (selectedType == 'Adult Allowances' &&
        (userAge == null || userAge! < 70)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You are not eligible for Adult Allowances.'),
        ),
      );
      return;
    }
    if (appliedAllowances.contains(selectedType)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('You have already applied for this allowance type.'),
        ),
      );
      return;
    }
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) =>
            UserAllowancesBCPage(email: email, type: selectedType),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Allowance Application')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text('Error: $error'))
          : Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Email',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  TextField(
                    controller: TextEditingController(text: email),
                    enabled: false,
                    decoration: const InputDecoration(),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Allowance Type',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  DropdownButtonFormField<String>(
                    value: selectedType.isEmpty ? null : selectedType,
                    items: allowanceTypes.map<DropdownMenuItem<String>>((item) {
                      final isApplied = appliedAllowances.contains(
                        item['Allowances_Type'],
                      );
                      return DropdownMenuItem<String>(
                        value: item['Allowances_Type'],
                        enabled: !isApplied,
                        child: Text(
                          isApplied
                              ? '${item['Allowances_Type']} (Already Applied)'
                              : item['Allowances_Type'],
                        ),
                      );
                    }).toList(),
                    onChanged: (v) => setState(() => selectedType = v ?? ''),
                    decoration: const InputDecoration(
                      labelText: 'Select Allowance Type',
                    ),
                  ),
                  if (selectedType == 'Adult Allowances' &&
                      userAge != null &&
                      userAge! < 70)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        'You must be at least 70 years old to apply for Adult Allowances. Your age: $userAge',
                        style: TextStyle(color: Colors.red),
                      ),
                    ),
                  if (appliedAllowances.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        'You have already applied for: ${appliedAllowances.join(", ")}',
                        style: TextStyle(color: Colors.orange),
                      ),
                    ),
                  const SizedBox(height: 24),
                  Center(
                    child: ElevatedButton(
                      onPressed: loading || email.isEmpty || userAge == null
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
