import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'village_officer_sidebar.dart';

class AddVillagerPage extends StatefulWidget {
  const AddVillagerPage({Key? key}) : super(key: key);

  @override
  State<AddVillagerPage> createState() => _AddVillagerPageState();
}

class _AddVillagerPageState extends State<AddVillagerPage> {
  final _formKey = GlobalKey<FormState>();
  final Map<String, dynamic> formData = {
    'villager_id': '',
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
    'latitude': '',
    'longitude': '',
    'is_participant': false,
    'alive_status': 'Alive',
    'job': '',
    'gender': 'Other',
    'marital_status': 'Unmarried',
  };
  bool loading = false;

  void showToast(String msg, {Color color = Colors.red}) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(msg), backgroundColor: color));
  }

  Future<void> handleSubmit() async {
    if (!_formKey.currentState!.validate()) {
      showToast('Please fix the errors in the form');
      return;
    }
    setState(() => loading = true);
    try {
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/villagers'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(formData),
      );
      if (response.statusCode == 201) {
        showToast('Villager added successfully', color: Colors.green);
        Navigator.pop(context);
      } else {
        final err = json.decode(response.body);
        showToast(err['error'] ?? 'Failed to add villager');
      }
    } catch (e) {
      showToast('Failed to add villager');
    }
    setState(() => loading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 1, selectedSubIndex: 0),
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
                              'Villager ID',
                              'villager_id',
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
                            _buildTextField('Job', 'job'),
                            _buildDropdown('Gender', 'gender', [
                              'Male',
                              'Female',
                              'Other',
                            ]),
                            _buildDropdown('Marital Status', 'marital_status', [
                              'Married',
                              'Unmarried',
                              'Divorced',
                              'Widowed',
                              'Separated',
                            ]),
                            _buildDropdown('Status', 'status', [
                              'Active',
                              'Inactive',
                            ]),
                            _buildTextField('Area ID', 'area_id'),
                            _buildTextField(
                              'Latitude',
                              'latitude',
                              number: true,
                              min: -90,
                              max: 90,
                            ),
                            _buildTextField(
                              'Longitude',
                              'longitude',
                              number: true,
                              min: -180,
                              max: 180,
                            ),
                            SwitchListTile(
                              title: Text('Election Participant'),
                              value: formData['is_participant'] == true,
                              onChanged: (v) => setState(
                                () => formData['is_participant'] = v,
                              ),
                            ),
                            _buildDropdown('Alive Status', 'alive_status', [
                              'Alive',
                              'Deceased',
                            ]),
                            const SizedBox(height: 24),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                ElevatedButton(
                                  onPressed: handleSubmit,
                                  child: Text('Add Villager'),
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
    bool number = false,
    double? min,
    double? max,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextFormField(
        initialValue: formData[key]?.toString() ?? '',
        decoration: InputDecoration(labelText: label),
        obscureText: obscure,
        keyboardType: number
            ? TextInputType.numberWithOptions(decimal: true)
            : (date ? TextInputType.datetime : TextInputType.text),
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
          if (number && v != null && v.isNotEmpty) {
            final n = double.tryParse(v);
            if (n == null) return '$label must be a number';
            if (min != null && n < min) return '$label must be ≥ $min';
            if (max != null && n > max) return '$label must be ≤ $max';
          }
          return null;
        },
        onChanged: (v) => formData[key] = v,
      ),
    );
  }

  Widget _buildDropdown(String label, String key, List<String> options) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: DropdownButtonFormField<String>(
        value: formData[key] ?? options.first,
        items: options
            .map((s) => DropdownMenuItem(value: s, child: Text(s)))
            .toList(),
        onChanged: (v) => setState(() => formData[key] = v),
        decoration: InputDecoration(labelText: label),
      ),
    );
  }
}
