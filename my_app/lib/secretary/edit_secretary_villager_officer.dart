import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class EditSecretaryVillagerOfficerPage extends StatefulWidget {
  final String officerId;
  const EditSecretaryVillagerOfficerPage({Key? key, required this.officerId})
      : super(key: key);

  @override
  State<EditSecretaryVillagerOfficerPage> createState() =>
      _EditSecretaryVillagerOfficerPageState();
}

class _EditSecretaryVillagerOfficerPageState
    extends State<EditSecretaryVillagerOfficerPage> {
  final _formKey = GlobalKey<FormState>();
  bool _loading = true;
  bool _submitting = false;
  String? _error;
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

  // Replace this with your actual token retrieval logic (e.g., from secure storage)
  Future<String?> getToken() async {
    // Example: Retrieve token from secure storage or shared preferences
    // For now, returning a placeholder token or null
    return 'YOUR_AUTH_TOKEN_HERE'; // Replace with actual token retrieval
  }

  @override
  void initState() {
    super.initState();
    fetchOfficer();
  }

  Future<void> fetchOfficer() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final token = await getToken();
      if (token == null) {
        setState(() {
          _error = 'No authentication token available';
          _loading = false;
        });
        return;
      }
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villager-officers/${widget.officerId}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          officer = {
            'full_name': data['Full_Name'] ?? data['full_name'] ?? '',
            'email': data['Email'] ?? data['email'] ?? '',
            'phone_no': data['Phone_No'] ?? data['phone_no'] ?? '',
            'nic': data['NIC'] ?? data['nic'] ?? '',
            'dob': (data['DOB'] ?? data['dob'] ?? '').toString().split('T')[0],
            'address': data['Address'] ?? data['address'] ?? '',
            'regional_division': data['RegionalDivision'] ?? data['regional_division'] ?? '',
            'status': data['Status'] ?? data['status'] ?? 'Active',
            'area_id': data['Area_ID'] ?? data['area_id'] ?? '',
          };
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to fetch officer: ${response.body}';
          _loading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error: $e';
        _loading = false;
      });
    }
  }

  Future<void> updateOfficer() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _submitting = true;
      _error = null;
    });
    try {
      final token = await getToken();
      if (token == null) {
        setState(() {
          _error = 'No authentication token available';
          _submitting = false;
        });
        return;
      }
      final response = await http.put(
        Uri.parse('http://localhost:5000/api/villager-officers/${widget.officerId}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'full_name': officer['full_name'],
          'email': officer['email'],
          'phone_no': officer['phone_no'].replaceAll(RegExp(r'\D'), ''),
          'nic': officer['nic'],
          'dob': officer['dob'],
          'address': officer['address'],
          'regional_division': officer['regional_division'],
          'status': officer['status'],
          'area_id': officer['area_id'],
        }),
      );
      if (response.statusCode == 200) {
        if (mounted) {
          Navigator.pop(context, true);
        }
      } else {
        setState(() {
          _error = 'Failed to update officer: ${response.body}';
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
    if (_loading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Edit Villager Officer')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }
    if (_error != null) {
      return Scaffold(
        appBar: AppBar(title: Text('Edit Villager Officer')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(_error!, style: const TextStyle(color: Colors.red)),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Back to Officers'),
              ),
            ],
          ),
        ),
      );
    }
    return Scaffold(
      appBar: AppBar(title: Text('Edit Villager Officer')),
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
                buildTextField('Full Name', 'full_name', required: true),
                buildTextField(
                  'Email',
                  'email',
                  keyboardType: TextInputType.emailAddress,
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
                      onPressed: _submitting ? null : updateOfficer,
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
                          : const Text('Update Officer'),
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
    bool isDate = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: TextFormField(
        initialValue: officer[key] ?? '',
        keyboardType: keyboardType,
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
          if (key == 'phone_no' && value != null && value.isNotEmpty) {
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