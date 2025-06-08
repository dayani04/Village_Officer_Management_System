import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
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
    fetchVillager();
  }

  Future<void> fetchVillager() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/${widget.villagerId}'),
        headers: {'Content-Type': 'application/json'},
      );
      if (response.statusCode == 200) {
        setState(() {
          villager = json.decode(response.body);
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to fetch villager: ${response.body}';
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
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
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
                constraints: const BoxConstraints(maxWidth: 900),
                margin: const EdgeInsets.symmetric(vertical: 32),
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9F9F9),
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: _loading
                    ? const Center(child: CircularProgressIndicator())
                    : _error != null
                    ? Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'Allowance Application Villager Details',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF333333),
                            ),
                          ),
                          const SizedBox(height: 20),
                          Text(
                            _error!,
                            style: const TextStyle(color: Color(0xFFF43F3F)),
                          ),
                          const SizedBox(height: 20),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF7A1632),
                              foregroundColor: Colors.white,
                            ),
                            onPressed: handleBack,
                            child: const Text('Back'),
                          ),
                        ],
                      )
                    : villager == null
                    ? const SizedBox.shrink()
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Text(
                            'Allowance Application Villager Details',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF333333),
                            ),
                          ),
                          const SizedBox(height: 20),
                          ...villager!.entries.map(
                            (entry) => Padding(
                              padding: const EdgeInsets.symmetric(
                                vertical: 6.0,
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    flex: 2,
                                    child: Text(
                                      '${entry.key}:',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  Expanded(
                                    flex: 3,
                                    child: Text(
                                      entry.value?.toString() ?? 'N/A',
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                          Center(
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF7A1632),
                                foregroundColor: Colors.white,
                              ),
                              onPressed: handleBack,
                              child: const Text('Back'),
                            ),
                          ),
                        ],
                      ),
              ),
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
