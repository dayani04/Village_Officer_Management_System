import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:typed_data';
import 'package:path_provider/path_provider.dart';
import 'package:open_filex/open_filex.dart';
import 'dart:io';
import 'secretary_dashboard.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SecretaryElectionApplicationsPage extends StatefulWidget {
  const SecretaryElectionApplicationsPage({Key? key}) : super(key: key);

  @override
  State<SecretaryElectionApplicationsPage> createState() =>
      _SecretaryElectionApplicationsPageState();
}

class _SecretaryElectionApplicationsPageState
    extends State<SecretaryElectionApplicationsPage> {
  bool _loading = true;
  String? _error;
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
    return prefs.getString('token');
  }

  Future<void> fetchApplications() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/election-applications/'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          applications = List<Map<String, dynamic>>.from(
            data,
          ).where((app) => app['status'] == 'Send').toList();
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'Failed to fetch applications: \n${response.body}';
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

  void handleStatusChange(
    String villagerId,
    String electionrecodeID,
    String newStatus,
  ) {
    setState(() {
      statusUpdates['$villagerId-$electionrecodeID'] = newStatus;
    });
  }

  Future<void> handleSend(
    String villagerId,
    String electionrecodeID,
    String electionType,
    String fullName,
  ) async {
    final newStatus = statusUpdates['$villagerId-$electionrecodeID'];
    if (newStatus == null || newStatus.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Please select a status'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    try {
      final statusRes = await http.put(
        Uri.parse(
          'http://localhost:5000/api/election-applications/$villagerId/$electionrecodeID/status',
        ),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'status': newStatus}),
      );
      if (statusRes.statusCode != 200) throw Exception(statusRes.body);
      final message =
          'Your election application for $electionType has been updated to $newStatus.';
      final notifRes = await http.post(
        Uri.parse(
          'http://localhost:5000/api/election-applications/notifications/',
        ),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'villagerId': villagerId, 'message': message}),
      );
      if (notifRes.statusCode != 200) throw Exception(notifRes.body);
      setState(() {
        applications.removeWhere(
          (app) =>
              app['Villager_ID'] == villagerId &&
              app['electionrecodeID'] == electionrecodeID &&
              newStatus != 'Send',
        );
        statusUpdates.remove('$villagerId-$electionrecodeID');
        sentNotifications.add('$villagerId-$electionrecodeID');
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Status updated and notification sent to $fullName'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to update status or send notification: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> handleDownload(String filename) async {
    try {
      final response = await http.get(
        Uri.parse(
          'http://localhost:5000/api/election-applications/download/$filename',
        ),
      );
      if (response.statusCode == 200) {
        final bytes = response.bodyBytes;
        final dir = await getTemporaryDirectory();
        final file = File('${dir.path}/$filename');
        await file.writeAsBytes(bytes);
        await OpenFilex.open(file.path);
      } else {
        throw Exception('Failed to download document: ${response.body}');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to download document: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void handleViewDetails(String villagerId) {
    Navigator.pushNamed(
      context,
      '/secretary_election_applications_villager_view',
      arguments: {'villagerId': villagerId},
    );
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
                            'Election Applications (Status: Send)',
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
                            'Election Applications (Status: Send)',
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
                                  DataColumn(label: Text('Election Type')),
                                  DataColumn(label: Text('Apply Date')),
                                  DataColumn(label: Text('Document')),
                                  DataColumn(label: Text('Status')),
                                  DataColumn(label: Text('Action')),
                                  DataColumn(label: Text('Action')),
                                ],
                                rows: applications.isNotEmpty
                                    ? applications.map((app) {
                                        final key =
                                            '${app['Villager_ID']}-${app['electionrecodeID']}';
                                        return DataRow(
                                          cells: [
                                            DataCell(
                                              Text(app['Full_Name'] ?? 'N/A'),
                                            ),
                                            DataCell(
                                              Text(app['Villager_ID'] ?? 'N/A'),
                                            ),
                                            DataCell(
                                              Text(
                                                app['Election_Type'] ?? 'N/A',
                                              ),
                                            ),
                                            DataCell(
                                              Text(
                                                app['apply_date'] != null &&
                                                        app['apply_date'] != ''
                                                    ? _formatDate(
                                                        app['apply_date'],
                                                      )
                                                    : 'N/A',
                                              ),
                                            ),
                                            DataCell(
                                              TextButton(
                                                onPressed: () => handleDownload(
                                                  app['document_path'],
                                                ),
                                                child: const Text(
                                                  'Download',
                                                  style: TextStyle(
                                                    color: Color(0xFF7a1632),
                                                  ),
                                                ),
                                              ),
                                            ),
                                            DataCell(
                                              DropdownButton<String>(
                                                value:
                                                    statusUpdates[key] ??
                                                    app['status'],
                                                items:
                                                    [
                                                          'Pending',
                                                          'Send',
                                                          'Rejected',
                                                          'Confirm',
                                                        ]
                                                        .map(
                                                          (status) =>
                                                              DropdownMenuItem(
                                                                value: status,
                                                                child: Text(
                                                                  status,
                                                                ),
                                                              ),
                                                        )
                                                        .toList(),
                                                onChanged: (val) =>
                                                    handleStatusChange(
                                                      app['Villager_ID'],
                                                      app['electionrecodeID'],
                                                      val!,
                                                    ),
                                              ),
                                            ),
                                            DataCell(
                                              IconButton(
                                                icon: Icon(
                                                  Icons.mail,
                                                  color:
                                                      sentNotifications
                                                          .contains(key)
                                                      ? Colors.grey
                                                      : Colors.green,
                                                ),
                                                onPressed:
                                                    sentNotifications.contains(
                                                      key,
                                                    )
                                                    ? null
                                                    : () => handleSend(
                                                        app['Villager_ID'],
                                                        app['electionrecodeID'],
                                                        app['Election_Type'],
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
                                                  backgroundColor: const Color(
                                                    0xFF7a1632,
                                                  ),
                                                  foregroundColor: Colors.white,
                                                  padding:
                                                      const EdgeInsets.symmetric(
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
                                                style: TextStyle(
                                                  color: Colors.grey,
                                                ),
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
