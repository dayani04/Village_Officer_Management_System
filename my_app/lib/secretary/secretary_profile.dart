import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'secretary_dashboard.dart';

class SecretaryProfilePage extends StatefulWidget {
  @override
  _SecretaryProfilePageState createState() => _SecretaryProfilePageState();
}

class _SecretaryProfilePageState extends State<SecretaryProfilePage> {
  Map<String, dynamic>? profile;
  bool loading = true;
  bool editMode = false;
  bool otpMode = false;
  String error = '';
  String otp = '';
  String newPassword = '';
  String? secretaryId;
  Map<String, dynamic> formData = {
    'full_name': '',
    'email': '',
    'phone_no': '',
    'address': '',
    'regional_division': '',
    'status': 'Active',
  };

  @override
  void initState() {
    super.initState();
    fetchProfile();
  }

  Future<String> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token') ?? '';
  }

  Future<void> fetchProfile() async {
    setState(() {
      loading = true;
    });
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/secretaries/profile'),
        headers: {'Authorization': 'Bearer $token'},
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          profile = data;
          formData = {
            'full_name': data['Full_Name'] ?? '',
            'email': data['Email'] ?? '',
            'phone_no': data['Phone_No'] ?? '',
            'address': data['Address'] ?? '',
            'regional_division': data['RegionalDivision'] ?? '',
            'status': data['Status'] ?? 'Active',
          };
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch profile';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  Future<void> updateProfile() async {
    try {
      final token = await getToken();
      final response = await http.put(
        Uri.parse(
          'http://localhost:5000/api/secretaries/${profile!['Secretary_ID']}',
        ),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'full_name': formData['full_name'],
          'email': formData['email'],
          'phone_no': formData['phone_no'],
          'address': formData['address'],
          'regional_division': formData['regional_division'],
          'status': formData['status'],
        }),
      );
      if (response.statusCode == 200) {
        setState(() {
          profile = {
            ...profile!,
            'Full_Name': formData['full_name'],
            'Email': formData['email'],
            'Phone_No': formData['phone_no'],
            'Address': formData['address'],
            'RegionalDivision': formData['regional_division'],
            'Status': formData['status'],
          };
          editMode = false;
          error = '';
        });
      } else {
        setState(() {
          error = 'Failed to update profile';
        });
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    }
  }

  Future<void> requestPasswordOtp() async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/secretaries/request-otp'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({'email': profile!['Email']}),
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          secretaryId = data['secretaryId'];
          otpMode = true;
          error = '';
        });
      } else {
        setState(() {
          error = 'Failed to send OTP';
        });
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    }
  }

  Future<void> verifyPasswordOtp() async {
    try {
      final token = await getToken();
      final response = await http.post(
        Uri.parse(
          'http://localhost:5000/api/secretaries/$secretaryId/verify-otp',
        ),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({'otp': otp, 'newPassword': newPassword}),
      );
      if (response.statusCode == 200) {
        setState(() {
          otpMode = false;
          otp = '';
          newPassword = '';
          secretaryId = null;
          error = 'Password updated successfully';
        });
      } else {
        setState(() {
          error = 'Invalid OTP or failed to update password';
        });
      }
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return Scaffold(
        body: Row(
          children: [
            Container(
              width: 250,
              color: Color(0xFF9C284F),
              child: const SecretaryDashboard(),
            ),
            const Expanded(child: Center(child: CircularProgressIndicator())),
          ],
        ),
      );
    }
    return Scaffold(
      body: Row(
        children: [
          Container(
            width: 250,
            color: Color(0xFF9C284F),
            child: const SecretaryDashboard(),
          ),
          Expanded(
            child: Center(
              child: Container(
                width: 900,
                margin: const EdgeInsets.all(24),
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9F9F9),
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
                ),
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      Text(
                        'Secretary Profile',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      if (error.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8.0),
                          child: Text(
                            error,
                            style: TextStyle(color: Colors.red),
                          ),
                        ),
                      if (editMode)
                        _buildEditForm()
                      else if (otpMode)
                        _buildOtpForm()
                      else
                        _buildProfileDetails(),
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

  Widget _buildEditForm() {
    return Form(
      child: Column(
        children: [
          _formField('Full Name', 'full_name'),
          _formField(
            'Email',
            'email',
            keyboardType: TextInputType.emailAddress,
          ),
          _formField(
            'Phone Number',
            'phone_no',
            keyboardType: TextInputType.phone,
          ),
          _formField('Address', 'address'),
          _formField('Regional Division', 'regional_division'),
          DropdownButtonFormField<String>(
            value: formData['status'],
            decoration: InputDecoration(labelText: 'Status'),
            items: [
              'Active',
              'Inactive',
            ].map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
            onChanged: (val) => setState(() => formData['status'] = val!),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                child: Text('Save Changes'),
                onPressed: updateProfile,
              ),
              SizedBox(width: 16),
              OutlinedButton(
                child: Text('Cancel'),
                onPressed: () => setState(() => editMode = false),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _formField(String label, String key, {TextInputType? keyboardType}) {
    return TextFormField(
      initialValue: formData[key],
      decoration: InputDecoration(labelText: label),
      keyboardType: keyboardType,
      onChanged: (val) => setState(() => formData[key] = val),
    );
  }

  Widget _buildOtpForm() {
    return Form(
      child: Column(
        children: [
          TextFormField(
            decoration: InputDecoration(
              labelText: 'OTP (sent to ${profile!['Email']})',
            ),
            onChanged: (val) => setState(() => otp = val),
          ),
          TextFormField(
            decoration: InputDecoration(labelText: 'New Password'),
            obscureText: true,
            onChanged: (val) => setState(() => newPassword = val),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                child: Text('Verify & Update Password'),
                onPressed: verifyPasswordOtp,
              ),
              SizedBox(width: 16),
              OutlinedButton(
                child: Text('Cancel'),
                onPressed: () => setState(() => otpMode = false),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildProfileDetails() {
    return Column(
      children: [
        _profileField('Secretary ID', profile!['Secretary_ID']),
        _profileField('Full Name', profile!['Full_Name']),
        _profileField('Email', profile!['Email']),
        _profileField('Phone Number', profile!['Phone_No']),
        _profileField('NIC', profile!['NIC']),
        _profileField('Date of Birth', profile!['DOB']),
        _profileField('Address', profile!['Address']),
        _profileField('Regional Division', profile!['RegionalDivision']),
        _profileField('Status', profile!['Status']),
        _profileField('Area ID', profile!['Area_ID']),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              child: Text('Edit Profile'),
              onPressed: () => setState(() => editMode = true),
            ),
            SizedBox(width: 16),
            ElevatedButton(
              child: Text('Change Password'),
              onPressed: requestPasswordOtp,
            ),
            SizedBox(width: 16),
            OutlinedButton(
              child: Text('Back to Dashboard'),
              onPressed: () => Navigator.pop(context),
            ),
          ],
        ),
      ],
    );
  }

  Widget _profileField(String label, dynamic value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Text(
              '$label:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(flex: 3, child: Text(value?.toString() ?? 'N/A')),
        ],
      ),
    );
  }
}
