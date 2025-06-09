import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'secretary_dashboard.dart';

class SecretaryAllowanceApplicationsVillagerViewPage extends StatefulWidget {
  final String villagerId;
  const SecretaryAllowanceApplicationsVillagerViewPage({
    Key? key,
    required this.villagerId,
  }) : super(key: key);

  @override
  State<SecretaryAllowanceApplicationsVillagerViewPage> createState() =>
      _SecretaryAllowanceApplicationsVillagerViewPageState();
}

class _SecretaryAllowanceApplicationsVillagerViewPageState
    extends State<SecretaryAllowanceApplicationsVillagerViewPage> {
  bool _loading = true;
  String? _error;
  Map<String, dynamic>? villager;

  @override
  void initState() {
    super.initState();
    if (widget.villagerId.isEmpty) {
      setState(() {
        _error = 'Invalid Villager ID';
        _loading = false;
      });
      return;
    }
    fetchVillager();
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    debugPrint('DEBUG: Retrieved token: $token');
    return token;
  }

  Future<void> fetchVillager() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final token = await getToken();
      if (token == null) {
        throw Exception('No token found. Please log in again.');
      }
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/${widget.villagerId}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      debugPrint('DEBUG: Fetch villager response: ${response.statusCode} ${response.body}');
      if (response.statusCode == 200) {
        setState(() {
          villager = json.decode(response.body);
          _loading = false;
        });
      } else {
        setState(() {
          _error = response.statusCode == 401
              ? 'Unauthorized: Please log in again'
              : 'Failed to fetch villager: ${response.body}';
          _loading = false;
        });
        if (response.statusCode == 401 && mounted) {
          Navigator.pushReplacementNamed(context, '/login');
        }
      }
    } catch (e) {
      debugPrint('DEBUG: Fetch villager error: $e');
      setState(() {
        _error = 'Error: $e';
        _loading = false;
      });
    }
  }

  void handleBack() {
    Navigator.pushReplacementNamed(context, '/secretary_allowance_applications');
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null || dateStr.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day}/${date.month}/${date.year}';
    } catch (_) {
      return dateStr;
    }
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
              color: const Color(0xFFF8F9FA),
              child: Scaffold(
                appBar: AppBar(
                  title: const Text('Allowance Application Villager Details'),
                  backgroundColor: const Color(0xFF7A1632),
                  foregroundColor: Colors.white,
                  elevation: 0,
                ),
                body: _loading
                    ? const Center(child: CircularProgressIndicator())
                    : _error != null || villager == null
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  _error ?? 'Villager not found',
                                  style: const TextStyle(color: Colors.red),
                                ),
                                const SizedBox(height: 16),
                                ElevatedButton(
                                  onPressed: handleBack,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF7A1632),
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Back to Applications'),
                                ),
                              ],
                            ),
                          )
                        : Padding(
                            padding: const EdgeInsets.all(24.0),
                            child: Card(
                              elevation: 2,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.all(24.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Villager ID: ${villager!['Villager_ID'] ?? 'N/A'}',
                                      style: const TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      'Full Name: ${villager!['Full_Name'] ?? 'N/A'}',
                                      style: const TextStyle(fontSize: 18),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      'Email: ${villager!['Email'] ?? 'N/A'}',
                                      style: const TextStyle(fontSize: 18),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      'Phone: ${villager!['Phone_No'] ?? 'N/A'}',
                                      style: const TextStyle(fontSize: 18),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      'Address: ${villager!['Address'] ?? 'N/A'}',
                                      style: const TextStyle(fontSize: 18),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      'Date of Birth: ${_formatDate(villager!['DOB'])}',
                                      style: const TextStyle(fontSize: 18),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      'NIC: ${villager!['NIC'] ?? 'N/A'}',
                                      style: const TextStyle(fontSize: 18),
                                    ),
                                    const SizedBox(height: 24),
                                    ElevatedButton(
                                      onPressed: handleBack,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: const Color(0xFF7A1632),
                                        foregroundColor: Colors.white,
                                      ),
                                      child: const Text('Back to Applications'),
                                    ),
                                  ],
                                ),
                              ),
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