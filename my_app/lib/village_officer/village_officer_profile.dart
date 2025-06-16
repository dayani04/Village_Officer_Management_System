import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class VillageOfficerProfilePage extends StatefulWidget {
  const VillageOfficerProfilePage({Key? key}) : super(key: key);

  @override
  State<VillageOfficerProfilePage> createState() =>
      _VillageOfficerProfilePageState();
}

class _VillageOfficerProfilePageState extends State<VillageOfficerProfilePage> {
  bool loading = true;
  bool editMode = false;
  bool otpMode = false;
  String? error;

  Map<String, dynamic>? profile;
  final _formKey = GlobalKey<FormState>();
  final _otpFormKey = GlobalKey<FormState>();

  // Profile fields
  late TextEditingController fullNameController;
  late TextEditingController emailController;
  late TextEditingController phoneController;
  late TextEditingController nicController;
  late TextEditingController dobController;
  late TextEditingController addressController;
  late TextEditingController regionalDivisionController;
  late TextEditingController areaIdController;

  // OTP fields
  late TextEditingController otpController;
  late TextEditingController newPasswordController;

  @override
  void initState() {
    super.initState();
    fullNameController = TextEditingController();
    emailController = TextEditingController();
    phoneController = TextEditingController();
    nicController = TextEditingController();
    dobController = TextEditingController();
    addressController = TextEditingController();
    regionalDivisionController = TextEditingController();
    areaIdController = TextEditingController();
    otpController = TextEditingController();
    newPasswordController = TextEditingController();
    fetchProfile();
  }

  @override
  void dispose() {
    fullNameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    nicController.dispose();
    dobController.dispose();
    addressController.dispose();
    regionalDivisionController.dispose();
    areaIdController.dispose();
    otpController.dispose();
    newPasswordController.dispose();
    super.dispose();
  }

  Future<void> fetchProfile() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      // Get token from SharedPreferences
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
        Uri.parse('http://localhost:5000/api/villager-officers/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        profile = data;
        fullNameController.text = data['Full_Name'] ?? '';
        emailController.text = data['Email'] ?? '';
        phoneController.text = data['Phone_No'] ?? '';
        nicController.text = data['NIC'] ?? '';
        dobController.text = data['DOB'] ?? '';
        addressController.text = data['Address'] ?? '';
        regionalDivisionController.text = data['RegionalDivision'] ?? '';
        areaIdController.text = data['Area_ID'] ?? '';
        setState(() {
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch profile: ' + response.body;
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to fetch profile';
        loading = false;
      });
    }
  }

  Future<void> handleEditSubmit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      loading = true;
      error = null;
    });
    try {
      // Replace with your API call
      // await VillageOfficerApi.updateProfile(...)
      setState(() {
        profile = {
          ...?profile,
          'Full_Name': fullNameController.text,
          'Email': emailController.text,
          'Phone_No': phoneController.text,
          'NIC': nicController.text,
          'DOB': dobController.text,
          'Address': addressController.text,
          'RegionalDivision': regionalDivisionController.text,
          'Area_ID': areaIdController.text,
        };
        editMode = false;
        loading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Profile updated successfully'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      setState(() {
        error = 'Failed to update profile';
        loading = false;
      });
    }
  }

  Future<void> handleRequestOtp() async {
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
      final response = await http.post(
        Uri.parse('http://localhost:5000/api/villager-officers/request-otp'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'email': emailController.text}),
      );
      if (response.statusCode == 200) {
        setState(() {
          otpMode = true;
          loading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('OTP sent to your email'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        setState(() {
          error = 'Failed to send OTP: ' + response.body;
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to send OTP';
        loading = false;
      });
    }
  }

  Future<void> handlePasswordSubmit() async {
    if (!_otpFormKey.currentState!.validate()) return;
    setState(() {
      loading = true;
      error = null;
    });
    try {
      // await VillageOfficerApi.verifyPasswordOtp(profile!['Villager_Officer_ID'], otpController.text, newPasswordController.text);
      setState(() {
        otpMode = false;
        loading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Password updated successfully'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      setState(() {
        error = 'Failed to update password';
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(selectedIndex: 0), // 0 for profile section
          Expanded(
            child: Column(
              children: [
                AppBar(
                  title: const Text('My Profile'),
                  backgroundColor: const Color(0xFF7a1632),
                  automaticallyImplyLeading: false,
                  actions: [
                    if (!loading && !editMode && !otpMode)
                      IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () => setState(() => editMode = true),
                        tooltip: 'Edit Profile',
                      ),
                  ],
                ),
                Expanded(
                  child: loading
                      ? const Center(child: CircularProgressIndicator())
                      : Center(
                          child: SingleChildScrollView(
                            child: Card(
                              margin: const EdgeInsets.all(24),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              elevation: 4,
                              child: Padding(
                                padding: const EdgeInsets.all(24),
                                child: SizedBox(
                                  width: 500,
                                  child: error != null
                                      ? Column(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Text(
                                              error!,
                                              style: const TextStyle(
                                                color: Colors.red,
                                              ),
                                            ),
                                            const SizedBox(height: 16),
                                            ElevatedButton(
                                              onPressed: fetchProfile,
                                              child: const Text('Retry'),
                                            ),
                                          ],
                                        )
                                      : editMode
                                      ? Form(
                                          key: _formKey,
                                          child: Column(
                                            children: [
                                              _profileField(
                                                'Officer ID',
                                                profile?['Villager_Officer_ID'] ??
                                                    '',
                                                enabled: false,
                                              ),
                                              _profileField(
                                                'Full Name',
                                                fullNameController,
                                                requiredField: true,
                                              ),
                                              _profileField(
                                                'Email',
                                                emailController,
                                                requiredField: true,
                                                email: true,
                                              ),
                                              _profileField(
                                                'Phone',
                                                phoneController,
                                                requiredField: true,
                                              ),
                                              _profileField(
                                                'NIC',
                                                nicController,
                                              ),
                                              _profileField(
                                                'Date of Birth',
                                                dobController,
                                                date: true,
                                              ),
                                              _profileField(
                                                'Address',
                                                addressController,
                                              ),
                                              _profileField(
                                                'Regional Division',
                                                regionalDivisionController,
                                              ),
                                              _profileField(
                                                'Area ID',
                                                areaIdController,
                                              ),
                                              const SizedBox(height: 24),
                                              Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: [
                                                  ElevatedButton(
                                                    onPressed: handleEditSubmit,
                                                    style:
                                                        ElevatedButton.styleFrom(
                                                          backgroundColor:
                                                              const Color(
                                                                0xFF7a1632,
                                                              ),
                                                        ),
                                                    child: const Text(
                                                      'Save Changes',
                                                    ),
                                                  ),
                                                  const SizedBox(width: 16),
                                                  OutlinedButton(
                                                    onPressed: () => setState(
                                                      () => editMode = false,
                                                    ),
                                                    child: const Text('Cancel'),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        )
                                      : otpMode
                                      ? Form(
                                          key: _otpFormKey,
                                          child: Column(
                                            children: [
                                              Text(
                                                'OTP sent to ${emailController.text}',
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              const SizedBox(height: 16),
                                              TextFormField(
                                                controller: otpController,
                                                decoration:
                                                    const InputDecoration(
                                                      labelText: 'OTP',
                                                    ),
                                                validator: (v) =>
                                                    v == null || v.isEmpty
                                                    ? 'Enter OTP'
                                                    : null,
                                              ),
                                              const SizedBox(height: 16),
                                              TextFormField(
                                                controller:
                                                    newPasswordController,
                                                decoration:
                                                    const InputDecoration(
                                                      labelText: 'New Password',
                                                    ),
                                                obscureText: true,
                                                validator: (v) =>
                                                    v == null || v.length < 6
                                                    ? 'Password must be at least 6 characters'
                                                    : null,
                                              ),
                                              const SizedBox(height: 24),
                                              Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: [
                                                  ElevatedButton(
                                                    onPressed:
                                                        handlePasswordSubmit,
                                                    style:
                                                        ElevatedButton.styleFrom(
                                                          backgroundColor:
                                                              const Color(
                                                                0xFF7a1632,
                                                              ),
                                                        ),
                                                    child: const Text(
                                                      'Verify & Update Password',
                                                    ),
                                                  ),
                                                  const SizedBox(width: 16),
                                                  OutlinedButton(
                                                    onPressed: () => setState(
                                                      () => otpMode = false,
                                                    ),
                                                    child: const Text('Cancel'),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        )
                                      : Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.stretch,
                                          children: [
                                            _profileDisplay(
                                              'Officer ID',
                                              profile?['Villager_Officer_ID'],
                                            ),
                                            _profileDisplay(
                                              'Full Name',
                                              profile?['Full_Name'],
                                            ),
                                            _profileDisplay(
                                              'Email',
                                              profile?['Email'],
                                            ),
                                            _profileDisplay(
                                              'Phone',
                                              profile?['Phone_No'],
                                            ),
                                            _profileDisplay(
                                              'NIC',
                                              profile?['NIC'],
                                            ),
                                            _profileDisplay(
                                              'Date of Birth',
                                              profile?['DOB'],
                                            ),
                                            _profileDisplay(
                                              'Address',
                                              profile?['Address'],
                                            ),
                                            _profileDisplay(
                                              'Regional Division',
                                              profile?['RegionalDivision'],
                                            ),
                                            _profileDisplay(
                                              'Status',
                                              profile?['Status'],
                                            ),
                                            _profileDisplay(
                                              'Area ID',
                                              profile?['Area_ID'],
                                            ),
                                            const SizedBox(height: 24),
                                            Row(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                ElevatedButton(
                                                  onPressed: () => setState(
                                                    () => editMode = true,
                                                  ),
                                                  style:
                                                      ElevatedButton.styleFrom(
                                                        backgroundColor:
                                                            const Color(
                                                              0xFF7a1632,
                                                            ),
                                                      ),
                                                  child: const Text(
                                                    'Edit Profile',
                                                  ),
                                                ),
                                                const SizedBox(width: 16),
                                                OutlinedButton(
                                                  onPressed: handleRequestOtp,
                                                  child: const Text(
                                                    'Change Password',
                                                  ),
                                                ),
                                                const SizedBox(width: 16),
                                                OutlinedButton(
                                                  onPressed: () => Navigator.of(
                                                    context,
                                                  ).pop(),
                                                  child: const Text(
                                                    'Back to Dashboard',
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ], // End of children for Column (profile display)
                                        ), // End of Column (profile display)
                                ), // End of SizedBox
                              ), // End of Padding
                            ), // End of Card
                          ), // End of SingleChildScrollView
                        ), // End of Center
                ), // End of Expanded
              ], // End of children for main Column
            ), // End of main Column
          ), // End of Expanded
        ], // End of Row children
      ), // End of Row
    ); // End of Scaffold
  }

  Widget _profileField(
    String label,
    dynamic controllerOrValue, {
    bool enabled = true,
    bool requiredField = false,
    bool email = false,
    bool date = false,
  }) {
    if (controllerOrValue is String) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            SizedBox(
              width: 150,
              child: Text(
                label,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(child: Text(controllerOrValue)),
          ],
        ),
      );
    }
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextFormField(
        controller: controllerOrValue,
        enabled: enabled,
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
        ),
        validator: (v) {
          if (requiredField && (v == null || v.isEmpty)) return 'Required';
          if (email &&
              v != null &&
              v.isNotEmpty &&
              !RegExp(
                r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,} ? ?$',
              ).hasMatch(v))
            return 'Invalid email';
          return null;
        },
        onTap: date
            ? () async {
                FocusScope.of(context).requestFocus(FocusNode());
                final picked = await showDatePicker(
                  context: context,
                  initialDate:
                      DateTime.tryParse(dobController.text) ??
                      DateTime(1990, 1, 1),
                  firstDate: DateTime(1900),
                  lastDate: DateTime.now(),
                );
                if (picked != null) {
                  dobController.text = picked.toIso8601String().split('T')[0];
                }
              }
            : null,
        readOnly: date,
      ),
    );
  }

  Widget _profileDisplay(String label, dynamic value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          SizedBox(
            width: 150,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              value != null && value.toString().isNotEmpty
                  ? value.toString()
                  : 'N/A',
            ),
          ),
        ],
      ),
    );
  }
}
