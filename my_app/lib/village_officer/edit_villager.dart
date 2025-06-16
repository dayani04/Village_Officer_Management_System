import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class EditVillagerPage extends StatefulWidget {
  final String villagerId;
  const EditVillagerPage({Key? key, required this.villagerId})
    : super(key: key);

  @override
  State<EditVillagerPage> createState() => _EditVillagerPageState();
}

class _EditVillagerPageState extends State<EditVillagerPage> {
  final _formKey = GlobalKey<FormState>();
  Map<String, dynamic> formData = {};
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
        final data = json.decode(response.body);
        setState(() {
          formData = Map<String, dynamic>.from(data);
          // Fix: ensure IsParticipant is always a bool
          formData['IsParticipant'] =
              data['IsParticipant'] == true ||
              data['IsParticipant'] == 1 ||
              data['IsParticipant'] == '1';
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

  Future<void> updateVillager() async {
    if (!_formKey.currentState!.validate()) return;
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'No authentication token found. Please log in again.',
            ),
          ),
        );
        return;
      }
      // Prepare payload to match backend expectations
      final payload = {
        'full_name': formData['Full_Name'] ?? '',
        'email': formData['Email'] ?? '',
        'phone_no': formData['Phone_No'] ?? '',
        'address': formData['Address'] ?? '',
        'regional_division': formData['RegionalDivision'] ?? '',
        'status': formData['Status'] ?? 'Active',
        'is_election_participant': formData['IsParticipant'] == true,
        'alive_status': formData['Alive_Status'] ?? 'Alive',
        'job': formData['Job'],
        'gender': formData['Gender'],
        'marital_status': formData['Marital_Status'],
      };
      final response = await http.put(
        Uri.parse('http://localhost:5000/api/villagers/${widget.villagerId}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(payload),
      );
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Villager updated')));
        Navigator.pop(context);
      } else {
        String msg = 'Failed to update villager';
        try {
          final err = json.decode(response.body);
          if (err['error'] != null) msg = err['error'];
        } catch (_) {}
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(msg)));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to update villager')));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return Center(child: CircularProgressIndicator());
    if (error != null) return Center(child: Text(error!));
    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 1, selectedSubIndex: 1),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Form(
                  key: _formKey,
                  child: ListView(
                    children: [
                      TextFormField(
                        initialValue: formData['Full_Name'] ?? '',
                        decoration: InputDecoration(labelText: 'Full Name'),
                        onChanged: (v) => formData['Full_Name'] = v,
                        validator: (v) =>
                            v == null || v.isEmpty ? 'Required' : null,
                      ),
                      TextFormField(
                        initialValue: formData['Email'] ?? '',
                        decoration: InputDecoration(labelText: 'Email'),
                        onChanged: (v) => formData['Email'] = v,
                        validator: (v) =>
                            v == null || v.isEmpty ? 'Required' : null,
                      ),
                      TextFormField(
                        initialValue: formData['Phone_No'] ?? '',
                        decoration: InputDecoration(labelText: 'Phone Number'),
                        onChanged: (v) => formData['Phone_No'] = v,
                        validator: (v) =>
                            v == null || v.isEmpty ? 'Required' : null,
                      ),
                      TextFormField(
                        initialValue: formData['Address'] ?? '',
                        decoration: InputDecoration(labelText: 'Address'),
                        onChanged: (v) => formData['Address'] = v,
                      ),
                      TextFormField(
                        initialValue: formData['RegionalDivision'] ?? '',
                        decoration: InputDecoration(
                          labelText: 'Regional Division',
                        ),
                        onChanged: (v) => formData['RegionalDivision'] = v,
                      ),
                      DropdownButtonFormField(
                        value: formData['Status'] ?? 'Active',
                        items: ['Active', 'Inactive']
                            .map(
                              (s) => DropdownMenuItem(value: s, child: Text(s)),
                            )
                            .toList(),
                        onChanged: (v) => formData['Status'] = v,
                        decoration: InputDecoration(labelText: 'Status'),
                      ),
                      SwitchListTile(
                        title: Text('Election Participant'),
                        value: formData['IsParticipant'] == true,
                        onChanged: (v) =>
                            setState(() => formData['IsParticipant'] = v),
                      ),
                      DropdownButtonFormField(
                        value: formData['Alive_Status'] ?? 'Alive',
                        items: ['Alive', 'Deceased']
                            .map(
                              (s) => DropdownMenuItem(value: s, child: Text(s)),
                            )
                            .toList(),
                        onChanged: (v) => formData['Alive_Status'] = v,
                        decoration: InputDecoration(labelText: 'Alive Status'),
                      ),
                      const SizedBox(height: 24),
                      Row(
                        children: [
                          ElevatedButton(
                            onPressed: updateVillager,
                            child: Text('Update Villager'),
                          ),
                          const SizedBox(width: 16),
                          OutlinedButton(
                            onPressed: () => Navigator.pop(context),
                            child: Text('Back'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
