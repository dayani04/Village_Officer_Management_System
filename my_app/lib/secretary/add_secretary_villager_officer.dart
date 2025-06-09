import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AddSecretaryVillagerOfficerPage extends StatefulWidget {
  const AddSecretaryVillagerOfficerPage({Key? key}) : super(key: key);

  @override
  State<AddSecretaryVillagerOfficerPage> createState() =>
      _AddSecretaryVillagerOfficerPageState();
}

class _AddSecretaryVillagerOfficerPageState
    extends State<AddSecretaryVillagerOfficerPage> {
  final _formKey = GlobalKey<FormState>();
  bool _submitting = false;
  String? _error;
  Map<String, dynamic> officer = {
    'villager_officer_id': '',
    'full_name': '',
    'email': '',
    'password': '',
    'phone_no': '',
    'nic': '',
    'dob': '',
    'address': '',
    'regional_division': '',
    'status': 'Active',
    'area_id': '',
  };

  Future<void> addOfficer() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/villager-officers/'),
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer $token', // Add if needed
        },
        body: json.encode(officer),
      );
      if (response.statusCode == 200 || response.statusCode == 201) {
        if (mounted) {
          Navigator.pop(context, true); // Return to previous page
        }
      } else {
        setState(() {
          _error = 'Failed to add officer: ${response.body}';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error: $e';
      });
    } finally {
      setState(() {
        _submitting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Villager Officer')),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(24),
          margin: const EdgeInsets.symmetric(vertical: 32, horizontal: 16),
          decoration: BoxDecoration(
            color: const Color(0xFFF9F9F9),
            borderRadius: BorderRadius.circular(8),
            boxShadow: const [
              BoxShadow(
                color: Colors.black12,
                blurRadius: 8,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                if (_error != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: Text(_error!, style: const TextStyle(color: Colors.red)),
                  ),
                buildTextField(
                  'Officer ID',
                  'villager_officer_id',
                  required: true,
                ),
                buildTextField('Full Name', 'full_name', required: true),
                buildTextField(
                  'Email',
                  'email',
                  keyboardType: TextInputType.emailAddress,
                  required: true,
                ),
                buildTextField(
                  'Password',
                  'password',
                  obscureText: true,
                  required: true,
                ),
                buildTextField(
                  'Phone Number',
                  'phone_no',
                  keyboardType: TextInputType.phone,
                  required: true,
                ),
                buildTextField('NIC', 'nic'),
                buildTextField(
                  'Date of Birth',
                  'dob',
                  keyboardType: TextInputType.datetime,
                  isDate: true,
                ),
                buildTextField('Address', 'address'),
                buildTextField('Regional Division', 'regional_division'),
                DropdownButtonFormField<String>(
                  value: officer['status'],
                  decoration: const InputDecoration(labelText: 'Status'),
                  items: ['Active', 'Inactive']
                      .map((s) => DropdownMenuItem(value: s, child: Text(s)))
                      .toList(),
                  onChanged: (val) => setState(() => officer['status'] = val!),
                  validator: (val) => val == null ? 'Status required' : null,
                ),
                buildTextField('Area ID', 'area_id'),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    ElevatedButton(
                      onPressed: _submitting ? null : addOfficer,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF7a1632),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                      ),
                      child: _submitting
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Add Officer'),
                    ),
                    const SizedBox(width: 12),
                    OutlinedButton(
                      onPressed: _submitting
                          ? null
                          : () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget buildTextField(
    String label,
    String key, {
    TextInputType keyboardType = TextInputType.text,
    bool required = false,
    bool obscureText = false,
    bool isDate = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        initialValue: officer[key] ?? '',
        keyboardType: keyboardType,
        obscureText: obscureText,
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
        ),
        validator: (value) {
          if (required && (value == null || value.trim().isEmpty)) {
            return '$label is required';
          }
          if (key == 'email' && value != null && value.isNotEmpty) {
            final emailRegex = RegExp(
              r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
            );
            if (!emailRegex.hasMatch(value)) return 'Invalid email format';
          }
          if (key == 'password' && value != null && value.length < 6) {
            return 'Password must be at least 6 characters';
          }
          if (key == 'phone_no' && value != null && value.isNotEmpty) {
            // Remove any non-digit characters for validation
            final cleanedPhone = value.replaceAll(RegExp(r'\D'), '');
            if (cleanedPhone.length != 10) {
              return 'Phone number must be 10 digits';
            }
          }
          return null;
        },
        onChanged: (val) {
          setState(() {
            officer[key] = val;
          });
        },
        readOnly: isDate,
        onTap: isDate
            ? () async {
                DateTime? picked = await showDatePicker(
                  context: context,
                  initialDate: officer[key].isNotEmpty
                      ? DateTime.tryParse(officer[key]) ?? DateTime.now()
                      : DateTime.now(),
                  firstDate: DateTime(1900),
                  lastDate: DateTime.now(),
                );
                if (picked != null) {
                  setState(() {
                    officer[key] = picked.toIso8601String().split('T')[0];
                  });
                }
              }
            : null,
      ),
    );
  }
}