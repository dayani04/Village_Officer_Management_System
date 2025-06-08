import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'village_officer_sidebar.dart';

class AddVillagerOfficerPage extends StatefulWidget {
  const AddVillagerOfficerPage({Key? key}) : super(key: key);

  @override
  State<AddVillagerOfficerPage> createState() => _AddVillagerOfficerPageState();
}

class _AddVillagerOfficerPageState extends State<AddVillagerOfficerPage> {
  final _formKey = GlobalKey<FormState>();
  final Map<String, dynamic> officer = {
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
  bool loading = false;

  void showToast(String msg, {Color color = Colors.red}) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(msg), backgroundColor: color));
  }

  Future<void> handleSubmit() async {
    if (!_formKey.currentState!.validate()) {
      showToast('Please fill all required fields');
      return;
    }
    setState(() => loading = true);
    try {
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/villager-officers'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(officer),
      );
      if (response.statusCode == 201) {
        showToast('Officer added successfully', color: Colors.green);
        Navigator.pop(context);
      } else {
        final err = json.decode(response.body);
        showToast(err['error'] ?? 'Failed to add officer');
      }
    } catch (e) {
      showToast('Failed to add officer');
    }
    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 4),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: loading
                  ? Center(child: CircularProgressIndicator())
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(24),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            _buildTextField(
                              'Officer ID',
                              'villager_officer_id',
                              required: true,
                            ),
                            _buildTextField(
                              'Full Name',
                              'full_name',
                              required: true,
                            ),
                            _buildTextField(
                              'Email',
                              'email',
                              required: true,
                              email: true,
                            ),
                            _buildTextField(
                              'Password',
                              'password',
                              required: true,
                              obscure: true,
                            ),
                            _buildTextField(
                              'Phone Number',
                              'phone_no',
                              required: true,
                            ),
                            _buildTextField('NIC', 'nic'),
                            _buildTextField('Date of Birth', 'dob', date: true),
                            _buildTextField('Address', 'address'),
                            _buildTextField(
                              'Regional Division',
                              'regional_division',
                            ),
                            _buildDropdown('Status', 'status', [
                              'Active',
                              'Inactive',
                            ]),
                            _buildTextField('Area ID', 'area_id'),
                            const SizedBox(height: 24),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                ElevatedButton(
                                  onPressed: handleSubmit,
                                  child: Text('Add Officer'),
                                ),
                                const SizedBox(width: 16),
                                OutlinedButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: Text('Cancel'),
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

  Widget _buildTextField(
    String label,
    String key, {
    bool required = false,
    bool email = false,
    bool obscure = false,
    bool date = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextFormField(
        initialValue: officer[key]?.toString() ?? '',
        decoration: InputDecoration(labelText: label),
        obscureText: obscure,
        keyboardType: date ? TextInputType.datetime : TextInputType.text,
        validator: (v) {
          if (required && (v == null || v.isEmpty)) return '$label is required';
          if (email &&
              v != null &&
              v.isNotEmpty &&
              !RegExp(
                r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$',
              ).hasMatch(v)) {
            return 'Invalid email format';
          }
          return null;
        },
        onChanged: (v) => officer[key] = v,
      ),
    );
  }

  Widget _buildDropdown(String label, String key, List<String> options) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: DropdownButtonFormField<String>(
        value: officer[key] ?? options.first,
        items: options
            .map((s) => DropdownMenuItem(value: s, child: Text(s)))
            .toList(),
        onChanged: (v) => setState(() => officer[key] = v),
        decoration: InputDecoration(labelText: label),
      ),
    );
  }
}
