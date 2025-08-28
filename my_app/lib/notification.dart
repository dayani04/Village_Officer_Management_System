import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class NotificationPage extends StatefulWidget {
  const NotificationPage({super.key});

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  bool loading = true;
  String? error;
  List<dynamic> notifications = [];

  @override
  void initState() {
    super.initState();
    fetchNotifications();
  }

  Future<void> fetchNotifications() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/notifications'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode != 200) {
        throw Exception('Failed to fetch notifications');
      }
      final data = jsonDecode(response.body);
      // Only show unread notifications (like React code)
      final unread = data
          .where((notif) => notif['Is_Read'] == false || notif['Is_Read'] == 0)
          .toList();
      setState(() {
        notifications = unread;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e is Exception
            ? e.toString().replaceFirst('Exception: ', '')
            : e.toString();
        loading = false;
      });
    }
  }

  Future<void> markAsRead(int notificationId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final response = await http.put(
        Uri.parse(
          'http://localhost:5000/api/villagers/notifications/$notificationId/read',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        setState(() {
          notifications.removeWhere(
            (notif) => notif['Notification_ID'] == notificationId,
          );
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Notification marked as read'),
            backgroundColor: Color(0xFF4caf50),
            behavior: SnackBarBehavior.floating,
          ),
        );
      } else {
        throw Exception('Failed to mark as read');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to mark notification as read'),
          backgroundColor: Color(0xFFf43f3f),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  String formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    final date = DateTime.tryParse(dateString);
    if (date == null) return 'N/A';
    return '${date.day}/${date.month}/${date.year} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return Scaffold(
        body: Center(
          child: Container(
            padding: EdgeInsets.all(24),
            child: Text('Loading...', style: TextStyle(fontSize: 18)),
          ),
        ),
      );
    }
    if (error != null && error!.isNotEmpty) {
      return Scaffold(
        body: Center(
          child: Container(
            padding: EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Notifications',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 16),
                Text(
                  'Error: $error',
                  style: TextStyle(color: Color(0xFFF43F3F)),
                ),
                SizedBox(height: 20),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF7a1632),
                  ),
                  onPressed: () => Navigator.pop(context),
                  child: Text('Back to Dashboard'),
                ),
              ],
            ),
          ),
        ),
      );
    }
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Notifications',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 16),
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Color(0xFFF9F9F9),
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 8,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                  child: notifications.isNotEmpty
                      ? SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: DataTable(
                            columns: const [
                              DataColumn(label: Text('Notification ID')),
                              DataColumn(label: Text('Message')),
                              DataColumn(label: Text('Created At')),
                              DataColumn(label: Text('Status')),
                              DataColumn(label: Text('Action')),
                            ],
                            rows: notifications
                                .map(
                                  (notif) => DataRow(
                                    cells: [
                                      DataCell(
                                        Text('${notif['Notification_ID']}'),
                                      ),
                                      DataCell(Text(notif['Message'] ?? 'N/A')),
                                      DataCell(
                                        Text(formatDate(notif['Created_At'])),
                                      ),
                                      DataCell(
                                        Text(
                                          (notif['Is_Read'] == true ||
                                                  notif['Is_Read'] == 1)
                                              ? 'Read'
                                              : 'Unread',
                                        ),
                                      ),
                                      DataCell(
                                        IconButton(
                                          icon: Icon(
                                            Icons.check,
                                            color: Colors.green,
                                          ),
                                          tooltip: 'Mark as Read',
                                          onPressed: () => markAsRead(
                                            notif['Notification_ID'],
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                )
                                .toList(),
                          ),
                        )
                      : Center(
                          child: Text(
                            'No unread notifications found',
                            style: TextStyle(color: Colors.grey),
                          ),
                        ),
                ),
              ),
              SizedBox(height: 20),
              Center(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF7a1632),
                  ),
                  onPressed: () => Navigator.pop(context),
                  child: Text('Back to Dashboard'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
