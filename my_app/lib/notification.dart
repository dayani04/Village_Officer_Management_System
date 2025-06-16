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
      // Only show unread notifications
      final unread = data
          .where((notif) => notif['Is_Read'] == false || notif['Is_Read'] == 0)
          .toList();
      setState(() {
        notifications = unread;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
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
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Notification marked as read')));
      } else {
        throw Exception('Failed to mark as read');
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${e.toString()}')));
    }
  }

  String formatDate(String? dateString) {
    if (dateString == null) return 'N/A';
    final date = DateTime.tryParse(dateString);
    if (date == null) return 'N/A';
    return '${date.toLocal()}'.split('.')[0];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications'),
        backgroundColor: Color(0xFF921940),
      ),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : error != null
          ? Center(child: Text('Error: $error'))
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Notifications',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 16),
                  Expanded(
                    child: notifications.isEmpty
                        ? Center(child: Text('No unread notifications found'))
                        : ListView.builder(
                            itemCount: notifications.length,
                            itemBuilder: (context, idx) {
                              final notif = notifications[idx];
                              return Card(
                                margin: EdgeInsets.symmetric(vertical: 8),
                                child: ListTile(
                                  title: Text(notif['Message'] ?? 'N/A'),
                                  subtitle: Text(
                                    'Created: ${formatDate(notif['Created_At'])}',
                                  ),
                                  trailing: IconButton(
                                    icon: Icon(
                                      Icons.check,
                                      color: Colors.green,
                                    ),
                                    tooltip: 'Mark as Read',
                                    onPressed: () =>
                                        markAsRead(notif['Notification_ID']),
                                  ),
                                ),
                              );
                            },
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
    );
  }
}
