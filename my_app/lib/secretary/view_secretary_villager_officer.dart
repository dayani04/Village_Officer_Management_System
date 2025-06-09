import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'secretary_dashboard.dart';

class ViewSecretaryVillagerOfficerPage extends StatefulWidget {
  final String officerId;

  const ViewSecretaryVillagerOfficerPage({Key? key, required this.officerId})
      : super(key: key);

  @override
  _ViewSecretaryVillagerOfficerPageState createState() =>
      _ViewSecretaryVillagerOfficerPageState();
}

class _ViewSecretaryVillagerOfficerPageState
    extends State<ViewSecretaryVillagerOfficerPage> {
  Map<String, dynamic>? officer;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    if (widget.officerId.isEmpty || widget.officerId == ':1') {
      setState(() {
        error = 'Invalid Officer ID';
        loading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Invalid Officer ID'),
            backgroundColor: Color(0xFFF43F3F),
          ),
        );
      }
      return;
    }
    fetchOfficer();
  }

  Future<void> fetchOfficer() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      debugPrint('DEBUG: Fetching officer with ID: ${widget.officerId}');
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villager-officers/${widget.officerId}'), // Fixed URL
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      debugPrint('DEBUG: Fetch officer response: ${response.statusCode} ${response.body}');
      if (response.statusCode == 200) {
        setState(() {
          officer = json.decode(response.body);
          loading = false;
        });
      } else {
        setState(() {
          error = response.statusCode == 401
              ? 'Unauthorized: Please log in again'
              : 'Failed to fetch officer: ${response.body}';
          loading = false;
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(error!),
              backgroundColor: const Color(0xFFF43F3F),
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('DEBUG: Fetch officer error: $e');
      setState(() {
        error = 'Failed to fetch officer: $e';
        loading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error!),
            backgroundColor: const Color(0xFFF43F3F),
          ),
        );
      }
    }
  }

  void handleBack() {
    Navigator.pushReplacementNamed(context, '/secretary_villager_officer_list');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Container(
            width: 250,
            color: const Color(0xFF9C284F),
            child: const SecretaryDashboard(),
          ),
          Expanded(
            child: Container(
              color: const Color(0xFFF9F9F9),
              child: Center(
                child: Container(
                  width: 600,
                  margin: const EdgeInsets.symmetric(vertical: 32),
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: loading
                      ? const Center(child: CircularProgressIndicator())
                      : error != null || officer == null
                          ? Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Text(
                                  'Officer Details',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF333333),
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  error ?? 'Officer not found',
                                  style: const TextStyle(color: Color(0xFFF43F3F)),
                                ),
                                const SizedBox(height: 24),
                                ElevatedButton(
                                  onPressed: handleBack,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF7A1632),
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Back to Officers'),
                                ),
                              ],
                            )
                          : Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Officer Details',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF333333),
                                  ),
                                ),
                                const SizedBox(height: 24),
                                _buildProfileField(
                                  'Officer ID',
                                  officer!['Villager_Officer_ID']?.toString() ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Full Name',
                                  officer!['Full_Name'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Email',
                                  officer!['Email'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Phone',
                                  officer!['Phone_No'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'NIC',
                                  officer!['NIC'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Date of Birth',
                                  officer!['DOB'] != null
                                      ? _formatDate(officer!['DOB'])
                                      : 'N/A',
                                ),
                                _buildProfileField(
                                  'Address',
                                  officer!['Address'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Regional Division',
                                  officer!['RegionalDivision'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Status',
                                  officer!['Status'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Area ID',
                                  officer!['Area_ID']?.toString() ?? 'N/A',
                                ),
                                const SizedBox(height: 24),
                                Center(
                                  child: ElevatedButton(
                                    onPressed: handleBack,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF7A1632),
                                      foregroundColor: Colors.white,
                                    ),
                                    child: const Text('Back to Officers'),
                                  ),
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

  Widget _buildProfileField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            '$label:',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Color(0xFF333333),
            ),
          ),
          Flexible(
            child: Text(
              value,
              style: const TextStyle(color: Color(0xFF333333)),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day}/${date.month}/${date.year}';
    } catch (_) {
      return dateStr;
    }
  }
}