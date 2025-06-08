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
  bool loading = true;
  String? error;

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
      setState(() {
        allowanceTypes = allowances;
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
    if (email.isEmpty || selectedType.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select an allowance type.')),
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
                      return DropdownMenuItem<String>(
                        value: item['Allowances_Type'],
                        child: Text(item['Allowances_Type']),
                      );
                    }).toList(),
                    onChanged: (v) => setState(() => selectedType = v ?? ''),
                    decoration: const InputDecoration(
                      labelText: 'Select Allowance Type',
                    ),
                  ),
                  const SizedBox(height: 24),
                  Center(
                    child: ElevatedButton(
                      onPressed: handleNext,
                      child: const Text('Next'),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
