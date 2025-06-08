import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class EditVillagerOfficerPage extends StatefulWidget {
  final String officerId;
  const EditVillagerOfficerPage({Key? key, required this.officerId})
    : super(key: key);

  @override
  State<EditVillagerOfficerPage> createState() =>
      _EditVillagerOfficerPageState();
}

class _EditVillagerOfficerPageState extends State<EditVillagerOfficerPage> {
  final _formKey = GlobalKey<FormState>();
  Map<String, dynamic> officer = {
    'full_name': '',
    'email': '',
    'phone_no': '',
    'nic': '',
    'dob': '',
    'address': '',
    'regional_division': '',
    'status': 'Active',
    'area_id': '',
  };
  bool loading = true;

  void showToast(String msg, {Color color = Colors.red}) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(msg), backgroundColor: color));
  }

  @override
  void initState() {
    super.initState();
    fetchOfficer();
  }

  Future<void> fetchOfficer() async {
    setState(() => loading = true);
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.get(
        Uri.parse(
          'http://localhost:5000/api/villager-officers/${widget.officerId}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          officer = {
            'full_name': data['Full_Name'] ?? '',
            'email': data['Email'] ?? '',
            'phone_no': data['Phone_No'] ?? '',
            'nic': data['NIC'] ?? '',
            'dob': data['DOB'] ?? '',
            'address': data['Address'] ?? '',
            'regional_division': data['RegionalDivision'] ?? '',
            'status': data['Status'] ?? 'Active',
            'area_id': data['Area_ID'] ?? '',
          };
          loading = false;
        });
      } else {
        showToast('Failed to fetch officer');
        setState(() => loading = false);
      }
    } catch (e) {
      showToast('Failed to fetch officer');
      setState(() => loading = false);
    }
  }

  Future<void> handleSubmit() async {
    if (!_formKey.currentState!.validate()) {
      showToast('Please fill all required fields');
      return;
    }
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      final response = await http.put(
        Uri.parse(
          'http://localhost:5000/api/villager-officers/${widget.officerId}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'full_name': officer['full_name'],
          'email': officer['email'],
          'phone_no': officer['phone_no'],
          'status': officer['status'],
        }),
      );
      if (response.statusCode == 200) {
        showToast('Officer updated successfully', color: Colors.green);
        Navigator.pop(context);
      } else {
        final err = json.decode(response.body);
        showToast(err['error'] ?? 'Failed to update officer');
      }
    } catch (e) {
      showToast('Failed to update officer');
    }
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
                                  child: Text('Update Officer'),
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
    bool date = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextFormField(
        initialValue: officer[key]?.toString() ?? '',
        decoration: InputDecoration(labelText: label),
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
