import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import 'secretary_dashboard.dart';

class SecretaryNICApplicationsPage extends StatefulWidget {
  const SecretaryNICApplicationsPage({Key? key}) : super(key: key);

  @override
  State<SecretaryNICApplicationsPage> createState() =>
      _SecretaryNICApplicationsPageState();
}

class _SecretaryNICApplicationsPageState
    extends State<SecretaryNICApplicationsPage> {
  bool loading = true;
  String? error;
  List<Map<String, dynamic>> applications = [];
  Map<String, String> statusUpdates = {};
  Set<String> sentNotifications = {};

  @override
  void initState() {
    super.initState();
    fetchApplications();
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    debugPrint('DEBUG: Retrieved token: $token');
    return token;
  }

  Future<void> fetchApplications() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final token = await getToken();
      if (token == null) {
        throw Exception('No token found. Please log in again.');
      }
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/nic-applications/'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      debugPrint('DEBUG: Fetch NIC applications response: ${response.statusCode} ${response.body}');
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          applications = List<Map<String, dynamic>>.from(data)
              .where((app) => app['status'] == 'Send')
              .toList();
          loading = false;
        });
      } else {
        setState(() {
          error = response.statusCode == 401
              ? 'Unauthorized: Please log in again'
              : 'Failed to fetch NIC applications: ${response.body}';
          loading = false;
        });
        if (response.statusCode == 401 && mounted) {
          Navigator.pushReplacementNamed(context, '/login');
        }
      }
    } catch (e) {
      debugPrint('DEBUG: Fetch NIC applications error: $e');
      setState(() {
        error = 'Error: $e';
        loading = false;
      });
    }
  }

  void handleStatusChange(String villagerId, String nicId, String newStatus) {
    setState(() {
      statusUpdates['$villagerId-$nicId'] = newStatus;
    });
  }

  Future<void> handleSend(
    String villagerId,
    String nicId,
    String nicType,
    String fullName,
  ) async {
    final newStatus = statusUpdates['$villagerId-$nicId'];
    if (newStatus == null || newStatus.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a status'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    try {
      final token = await getToken();
      if (token == null) {
        throw Exception('No token found. Please log in again.');
      }
      // Update status
      final statusRes = await http.put(
        Uri.parse(
          'http://localhost:5000/api/nic-applications/$villagerId/$nicId/status',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'status': newStatus}),
      );
      debugPrint('DEBUG: Update NIC status response: ${statusRes.statusCode} ${statusRes.body}');
      if (statusRes.statusCode != 200) {
        throw Exception('Failed to update status: ${statusRes.body}');
      }
      // Save notification
      final message =
          'Your NIC application for $nicType has been updated to $newStatus.';
      final notifRes = await http.post(
        Uri.parse(
          'http://localhost:5000/api/nic-applications/notifications/',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'villagerId': villagerId, 'message': message}),
      );
      debugPrint('DEBUG: Send NIC notification response: ${notifRes.statusCode} ${notifRes.body}');
      if (notifRes.statusCode != 200) {
        throw Exception('Failed to send notification: ${notifRes.body}');
      }
      setState(() {
        applications.removeWhere(
          (app) =>
              app['Villager_ID'] == villagerId &&
              app['NIC_ID'] == nicId &&
              newStatus != 'Send',
        );
        statusUpdates.remove('$villagerId-$nicId');
        sentNotifications.add('$villagerId-$nicId');
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Status updated and notification sent to $fullName'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      debugPrint('DEBUG: Handle NIC send error: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to update status or send notification: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> handleDownload(String filename) async {
    if (filename.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('No document available.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    try {
      final token = await getToken();
      if (token == null) {
        throw Exception('No token found. Please log in again.');
      }
      // Normalize filename by removing 'Uploads/' prefix and handling separators
      final normalizedFilename = filename
          .replaceFirst(RegExp(r'^Uploads[\\/]?'), '')
          .split(RegExp(r'[\\/]'))
          .last;
      debugPrint('DEBUG: Attempting to download file: $normalizedFilename');
      final url = 'http://localhost:5000/Uploads/$normalizedFilename';
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        throw Exception('Could not launch document URL.');
      }
    } catch (e) {
      debugPrint('DEBUG: Download NIC error: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to download document: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void handleViewDetails(String villagerId) {
    debugPrint('DEBUG: Navigating to view villager with ID: $villagerId');
    Navigator.pushNamed(
      context,
      '/secretary_nic_applications_villager_view',
      arguments: {'villagerId': villagerId},
    );
  }

  void handleBack() {
    Navigator.pushReplacementNamed(context, '/secretary/secretary_dashboard');
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
            child: Center(
              child: Container(
                constraints: const BoxConstraints(maxWidth: 1200),
                margin: const EdgeInsets.symmetric(vertical: 32),
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: const Color(0xFFF9F9F9),
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
                    : error != null
                        ? Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text(
                                'NIC Applications (Status: Send)',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF333333),
                                ),
                              ),
                              const SizedBox(height: 20),
                              Text(
                                error!,
                                style: const TextStyle(color: Color(0xFFF43F3F)),
                              ),
                              const SizedBox(height: 20),
                              ElevatedButton(
                                onPressed: handleBack,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF7A1632),
                                  foregroundColor: Colors.white,
                                ),
                                child: const Text('Back to Dashboard'),
                              ),
                            ],
                          )
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              const Text(
                                'NIC Applications (Status: Send)',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF333333),
                                ),
                              ),
                              const SizedBox(height: 20),
                              Expanded(
                                child: SingleChildScrollView(
                                  scrollDirection: Axis.horizontal,
                                  child: DataTable(
                                    columns: const [
                                      DataColumn(label: Text('Villager Name')),
                                      DataColumn(label: Text('Villager ID')),
                                      DataColumn(label: Text('NIC Type')),
                                      DataColumn(label: Text('Apply Date')),
                                      DataColumn(label: Text('Document')),
                                      DataColumn(label: Text('Status')),
                                      DataColumn(label: Text('Action')),
                                      DataColumn(label: Text('Action')),
                                    ],
                                    rows: applications.isNotEmpty
                                        ? applications.map((app) {
                                            final key =
                                                '${app['Villager_ID']}-${app['NIC_ID']}';
                                            return DataRow(
                                              cells: [
                                                DataCell(
                                                  Text(app['Full_Name'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(app['Villager_ID'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(app['NIC_Type'] ?? 'N/A'),
                                                ),
                                                DataCell(
                                                  Text(
                                                    app['apply_date'] != null &&
                                                            app['apply_date'] != ''
                                                        ? _formatDate(app['apply_date'])
                                                        : 'N/A',
                                                  ),
                                                ),
                                                DataCell(
                                                  TextButton(
                                                    onPressed: () => handleDownload(
                                                      app['document_path'] ?? '',
                                                    ),
                                                    child: const Text(
                                                      'Download',
                                                      style: TextStyle(
                                                        color: Color(0xFF7A1632),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                                DataCell(
                                                  DropdownButton<String>(
                                                    value: statusUpdates[key] ??
                                                        app['status'],
                                                    items: [
                                                      'Pending',
                                                      'Send',
                                                      'Rejected',
                                                      'Confirm',
                                                    ].map((status) {
                                                      return DropdownMenuItem(
                                                        value: status,
                                                        child: Text(status),
                                                      );
                                                    }).toList(),
                                                    onChanged: (val) => handleStatusChange(
                                                      app['Villager_ID'],
                                                      app['NIC_ID'].toString(),
                                                      val!,
                                                    ),
                                                  ),
                                                ),
                                                DataCell(
                                                  IconButton(
                                                    icon: Icon(
                                                      Icons.mail,
                                                      color: sentNotifications
                                                              .contains(key)
                                                          ? Colors.grey
                                                          : Colors.green,
                                                    ),
                                                    onPressed: sentNotifications
                                                            .contains(key)
                                                        ? null
                                                        : () => handleSend(
                                                              app['Villager_ID'],
                                                              app['NIC_ID'].toString(),
                                                              app['NIC_Type'],
                                                              app['Full_Name'],
                                                            ),
                                                    tooltip: 'Send Notification',
                                                  ),
                                                ),
                                                DataCell(
                                                  ElevatedButton(
                                                    onPressed: () =>
                                                        handleViewDetails(
                                                          app['Villager_ID'],
                                                        ),
                                                    style: ElevatedButton.styleFrom(
                                                      backgroundColor:
                                                          const Color(0xFF7A1632),
                                                      foregroundColor: Colors.white,
                                                      padding: const EdgeInsets.symmetric(
                                                        horizontal: 16,
                                                        vertical: 8,
                                                      ),
                                                    ),
                                                    child: const Text('View'),
                                                  ),
                                                ),
                                              ],
                                            );
                                          }).toList()
                                        : [
                                            const DataRow(
                                              cells: [
                                                DataCell(
                                                  Text(
                                                    'No applications with status "Send"',
                                                    style: TextStyle(color: Colors.grey),
                                                  ),
                                                  placeholder: true,
                                                ),
                                                DataCell.empty,
                                                DataCell.empty,
                                                DataCell.empty,
                                                DataCell.empty,
                                                DataCell.empty,
                                                DataCell.empty,
                                                DataCell.empty,
                                              ],
                                            ),
                                          ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 20),
                              Center(
                                child: ElevatedButton(
                                  onPressed: handleBack,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF7A1632),
                                    foregroundColor: Colors.white,
                                  ),
                                  child: const Text('Back to Dashboard'),
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