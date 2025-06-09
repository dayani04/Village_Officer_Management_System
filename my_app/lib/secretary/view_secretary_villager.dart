import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'secretary_dashboard.dart';

class ViewSecretaryVillagerPage extends StatefulWidget {
  final String villagerId;

  const ViewSecretaryVillagerPage({Key? key, required this.villagerId})
      : super(key: key);

  @override
  _ViewSecretaryVillagerPageState createState() =>
      _ViewSecretaryVillagerPageState();
}

class _ViewSecretaryVillagerPageState extends State<ViewSecretaryVillagerPage> {
  Map<String, dynamic>? villager;
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchVillager();
  }

  Future<void> fetchVillager() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/${widget.villagerId}'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          villager = json.decode(response.body);
          loading = false;
        });
      } else {
        setState(() {
          error = response.statusCode == 401
              ? 'Unauthorized: Please log in again'
              : 'Failed to fetch villager: ${response.body}';
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
      setState(() {
        error = 'Failed to fetch villager: $e';
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
    Navigator.pushReplacementNamed(context, '/secretary_villagers');
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
                      : error != null || villager == null
                          ? Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Text(
                                  'Villager Details',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF333333),
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  error ?? 'Villager not found',
                                  style: const TextStyle(color: Color(0xFFF43F3F)),
                                ),
                                const SizedBox(height: 24),
                                ElevatedButton(
                                  onPressed: handleBack,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF7A1632),
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Back to Villagers'),
                                ),
                              ],
                            )
                          : Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Villager Details',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF333333),
                                  ),
                                ),
                                const SizedBox(height: 24),
                                _buildProfileField(
                                  'Villager ID',
                                  villager!['Villager_ID']?.toString() ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Full Name',
                                  villager!['Full_Name'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Email',
                                  villager!['Email'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Phone',
                                  villager!['Phone_No'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Address',
                                  villager!['Address'] ?? 'N/A',
                                ),
                                _buildProfileField(
                                  'Date of Birth',
                                  villager!['DOB'] != null
                                      ? _formatDate(villager!['DOB'])
                                      : 'N/A',
                                ),
                                _buildProfileField(
                                  'NIC',
                                  villager!['NIC'] ?? 'N/A',
                                ),
                                const SizedBox(height: 24),
                                Center(
                                  child: ElevatedButton(
                                    onPressed: handleBack,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF7A1632),
                                      foregroundColor: Colors.white,
                                    ),
                                    child: const Text('Back to Villagers'),
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