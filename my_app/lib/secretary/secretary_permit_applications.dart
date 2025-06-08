import 'package:flutter/material.dart';
import 'package:my_app/secretary/secretary_dashboard.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:open_filex/open_filex.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SecretaryPermitApplicationsPage extends StatefulWidget {
  const SecretaryPermitApplicationsPage({Key? key}) : super(key: key);

  @override
  State<SecretaryPermitApplicationsPage> createState() =>
      _SecretaryPermitApplicationsPageState();
}

class _SecretaryPermitApplicationsPageState
    extends State<SecretaryPermitApplicationsPage> {
  List<dynamic> applications = [];
  bool loading = true;
  String? error;
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
      loading = true;
      error = null;
    });
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/permit-applications/'),
        headers: token != null ? {'Authorization': 'Bearer $token'} : {},
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final sendApplications = (data as List)
            .where((app) => app['status'] == 'Send')
            .toList();
        setState(() {
          applications = sendApplications;
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch permit applications';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to fetch permit applications';
        loading = false;
      });
    }
  }

  void handleStatusChange(
    String villagerId,
    String permitsId,
    String newStatus,
  ) {
    setState(() {
      statusUpdates['$villagerId-$permitsId'] = newStatus;
    });
  }

  Future<void> handleSend(
    String villagerId,
    String permitsId,
    String permitType,
    String fullName,
  ) async {
    final newStatus = statusUpdates['$villagerId-$permitsId'];
    if (newStatus == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a status'),
          backgroundColor: Color(0xFFF43F3F),
        ),
      );
      return;
    }
    try {
      final token = await getToken();
      // Update status
      final statusRes = await http.put(
        Uri.parse(
          'http://localhost:5000/api/permit-applications/$villagerId/$permitsId/status',
        ),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({'status': newStatus}),
      );
      if (statusRes.statusCode != 200)
        throw Exception('Failed to update status');

      // Save notification
      final notifRes = await http.post(
        Uri.parse(
          'http://localhost:5000/api/permit-applications/notifications/',
        ),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'villagerId': villagerId,
          'message':
              'Your permit application for $permitType has been updated to $newStatus.',
        }),
      );
      if (notifRes.statusCode != 200)
        throw Exception('Failed to send notification');

      setState(() {
        applications.removeWhere(
          (app) =>
              app['Villager_ID'] == villagerId &&
              app['Permits_ID'] == permitsId &&
              newStatus != 'Send',
        );
        statusUpdates.remove('$villagerId-$permitsId');
        sentNotifications.add('$villagerId-$permitsId');
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
          content: Text('Failed to update status or send notification'),
          backgroundColor: Color(0xFFF43F3F),
        ),
      );
    }
  }

  Future<void> handleDownload(String filename) async {
    try {
      final token = await getToken();
      final response = await http.get(
        Uri.parse(
          'http://localhost:5000/api/permit-applications/download/$filename',
        ),
        headers: token != null ? {'Authorization': 'Bearer $token'} : {},
      );
      if (response.statusCode == 200) {
        final bytes = response.bodyBytes;
        final dir = await getTemporaryDirectory();
        final file = File('${dir.path}/$filename');
        await file.writeAsBytes(bytes);
        await OpenFilex.open(file.path);
      } else {
        throw Exception('Failed to download document');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to download document'),
          backgroundColor: Color(0xFFF43F3F),
        ),
      );
    }
  }

  void handleViewDetails(String villagerId) {
    Navigator.pushNamed(
      context,
      '/secretary_permit_applications_villager_view',
      arguments: {'villagerId': villagerId},
    );
  }

  void handleBack() {
    Navigator.pushNamed(context, '/secretary/secretary_dashboard');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Container(
            width: 250,
            color: Colors.white,
            child: const SecretaryDashboard(),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Center(
                child: Container(
                  constraints: const BoxConstraints(maxWidth: 1200),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF9F9F9),
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: loading
                      ? const Center(child: CircularProgressIndicator())
                      : error != null
                      ? Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Text(
                              'Permit Applications (Status: Send)',
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
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF7A1632),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 20,
                                  vertical: 10,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                              onPressed: handleBack,
                              child: const Text('Back to Dashboard'),
                            ),
                          ],
                        )
                      : Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            const Text(
                              'Permit Applications (Status: Send)',
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
                                    DataColumn(label: Text('Permit Type')),
                                    DataColumn(label: Text('Apply Date')),
                                    DataColumn(label: Text('Document')),
                                    DataColumn(label: Text('Police Report')),
                                    DataColumn(label: Text('Status')),
                                    DataColumn(label: Text('Action')),
                                    DataColumn(label: Text('Action')),
                                  ],
                                  rows: applications.isNotEmpty
                                      ? applications.map((app) {
                                          final key =
                                              '${app['Villager_ID']}-${app['Permits_ID']}';
                                          return DataRow(
                                            cells: [
                                              DataCell(
                                                Text(app['Full_Name'] ?? 'N/A'),
                                              ),
                                              DataCell(
                                                Text(
                                                  app['Villager_ID'] ?? 'N/A',
                                                ),
                                              ),
                                              DataCell(
                                                Text(
                                                  app['Permits_Type'] ?? 'N/A',
                                                ),
                                              ),
                                              DataCell(
                                                Text(
                                                  app['apply_date'] ?? 'N/A',
                                                ),
                                              ),
                                              DataCell(
                                                InkWell(
                                                  onTap: () => handleDownload(
                                                    app['document_path'],
                                                  ),
                                                  child: const Text(
                                                    'Download',
                                                    style: TextStyle(
                                                      color: Color(0xFF007bff),
                                                      decoration: TextDecoration
                                                          .underline,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                              DataCell(
                                                InkWell(
                                                  onTap: () => handleDownload(
                                                    app['police_report_path'],
                                                  ),
                                                  child: const Text(
                                                    'Download',
                                                    style: TextStyle(
                                                      color: Color(0xFF007bff),
                                                      decoration: TextDecoration
                                                          .underline,
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
                                                  onChanged: (value) {
                                                    if (value != null)
                                                      handleStatusChange(
                                                        app['Villager_ID'],
                                                        app['Permits_ID'],
                                                        value,
                                                      );
                                                  },
                                                ),
                                              ),
                                              DataCell(
                                                IconButton(
                                                  icon: Icon(
                                                    Icons.mail,
                                                    color:
                                                        sentNotifications
                                                            .contains(key)
                                                        ? Colors.green
                                                        : Color(0xFF7A1632),
                                                  ),
                                                  onPressed:
                                                      sentNotifications
                                                          .contains(key)
                                                      ? null
                                                      : () => handleSend(
                                                          app['Villager_ID'],
                                                          app['Permits_ID'],
                                                          app['Permits_Type'],
                                                          app['Full_Name'],
                                                        ),
                                                  tooltip: 'Send Notification',
                                                ),
                                              ),
                                              DataCell(
                                                ElevatedButton(
                                                  style: ElevatedButton.styleFrom(
                                                    backgroundColor:
                                                        const Color(0xFF7A1632),
                                                    foregroundColor:
                                                        Colors.white,
                                                    padding:
                                                        const EdgeInsets.symmetric(
                                                          horizontal: 10,
                                                          vertical: 5,
                                                        ),
                                                    shape: RoundedRectangleBorder(
                                                      borderRadius:
                                                          BorderRadius.circular(
                                                            4,
                                                          ),
                                                    ),
                                                  ),
                                                  onPressed: () =>
                                                      handleViewDetails(
                                                        app['Villager_ID'],
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
                                                  'No applications with status \"Send\"',
                                                  style: TextStyle(
                                                    color: Color(0xFF333333),
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
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF7A1632),
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 20,
                                    vertical: 10,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                ),
                                onPressed: handleBack,
                                child: const Text('Back to Dashboard'),
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
}
