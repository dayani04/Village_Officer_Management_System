import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'secretary_dashboard.dart';

class SecretaryAllowanceOwnersViewPage extends StatefulWidget {
  const SecretaryAllowanceOwnersViewPage({Key? key}) : super(key: key);

  @override
  State<SecretaryAllowanceOwnersViewPage> createState() =>
      _SecretaryAllowanceOwnersViewPageState();
}

class _SecretaryAllowanceOwnersViewPageState
    extends State<SecretaryAllowanceOwnersViewPage> {
  bool _loading = true;
  String? _error;
  Map<String, dynamic>? villager;
  String? villagerId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is Map && args['villagerId'] != null) {
      villagerId = args['villagerId'] as String;
      fetchVillagerDetails();
    } else {
      setState(() {
        _error = 'No villager ID provided.';
        _loading = false;
      });
    }
  }

  Future<void> fetchVillagerDetails() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null || token.isEmpty) {
        setState(() {
          _error = 'No token provided. Please log in again.';
          _loading = false;
        });
        // Optionally redirect to login after a short delay
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            Navigator.pushReplacementNamed(context, '/login');
          }
        });
        return;
      }
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/$villagerId'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          villager = data is List && data.isNotEmpty ? data[0] : data;
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to fetch villager details: \\n${response.body}';
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

  void handleBack() {
    Navigator.pushReplacementNamed(context, '/secretary_allowance_owners');
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return 'N/A';
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
                  title: const Text('Villager Details'),
                  backgroundColor: const Color(0xFF7a1632),
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
                              child: const Text('Back to Allowance Recipients'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF7a1632),
                                foregroundColor: Colors.white,
                              ),
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
                                  'Villager ID:  ${villager!['Villager_ID'] ?? 'N/A'}',
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Full Name:  ${villager!['Full_Name'] ?? 'N/A'}',
                                  style: const TextStyle(fontSize: 18),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Email:  ${villager!['Email'] ?? 'N/A'}',
                                  style: const TextStyle(fontSize: 18),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Phone:  ${villager!['Phone_No'] ?? 'N/A'}',
                                  style: const TextStyle(fontSize: 18),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Address:  ${villager!['Address'] ?? 'N/A'}',
                                  style: const TextStyle(fontSize: 18),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Date of Birth:  ${_formatDate(villager!['DOB'])}',
                                  style: const TextStyle(fontSize: 18),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'NIC:  ${villager!['NIC'] ?? 'N/A'}',
                                  style: const TextStyle(fontSize: 18),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Regional Division:  ${villager!['RegionalDivision'] ?? 'N/A'}',
                                  style: const TextStyle(fontSize: 18),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Status:  ${villager!['Status'] ?? 'N/A'}',
                                  style: const TextStyle(fontSize: 18),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Area ID:  ${villager!['Area_ID'] ?? 'N/A'}',
                                  style: const TextStyle(fontSize: 18),
                                ),
                                const SizedBox(height: 24),
                                ElevatedButton(
                                  onPressed: handleBack,
                                  child: const Text(
                                    'Back to Allowance Recipients',
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF7a1632),
                                    foregroundColor: Colors.white,
                                  ),
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
