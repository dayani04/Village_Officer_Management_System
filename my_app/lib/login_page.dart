import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'user_dashboard.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';
  String? _position;
  bool _loading = false;
  String? _error;

  Future<void> _login() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    String? url;
    if (_position == 'villager') {
      url = 'http://localhost:5000/api/villagers/login';
    } else if (_position == 'village_officer') {
      url = 'http://localhost:5000/api/villager-officers/login';
    } else if (_position == 'secretary') {
      url = 'http://localhost:5000/api/secretaries/login';
    }

    if (url == null) {
      setState(() {
        _error = 'Please select a position';
        _loading = false;
      });
      return;
    }

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': _email, 'password': _password}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['token'] != null) {
        // Save token
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', data['token']);
        // Navigate to dashboard (replace with your navigation logic)
        if (_position == 'villager') {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  UserDashboard(/* pass user data if needed */),
              settings: RouteSettings(arguments: data),
            ),
          );
        } else if (_position == 'village_officer') {
          Navigator.pushReplacementNamed(
            context,
            '/village_officer/village_officer_dashboard',
            arguments: data,
          );
        } else if (_position == 'secretary') {
          Navigator.pushReplacementNamed(
            context,
            '/secretary/secretary_dashboard',
            arguments: data,
          );
        }
      } else {
        setState(() {
          _error =
              data['error'] ?? 'Login failed. Please check your credentials.';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'An error occurred. Please try again.';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF9FBFA),
      appBar: AppBar(title: Text('Login')),
      body: Center(
        child: Container(
          width: 400,
          padding: EdgeInsets.all(30),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 6,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (_error != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Text(_error!, style: TextStyle(color: Colors.red)),
                  ),
                TextFormField(
                  decoration: InputDecoration(labelText: 'Email'),
                  keyboardType: TextInputType.emailAddress,
                  onChanged: (v) => _email = v,
                  validator: (v) =>
                      v == null || v.isEmpty ? 'Enter email' : null,
                ),
                SizedBox(height: 16),
                TextFormField(
                  decoration: InputDecoration(labelText: 'Password'),
                  obscureText: true,
                  onChanged: (v) => _password = v,
                  validator: (v) =>
                      v == null || v.isEmpty ? 'Enter password' : null,
                ),
                SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _position,
                  decoration: InputDecoration(labelText: 'Position'),
                  items: [
                    DropdownMenuItem(
                      value: 'villager',
                      child: Text('Villager'),
                    ),
                    DropdownMenuItem(
                      value: 'village_officer',
                      child: Text('Village Officer'),
                    ),
                    DropdownMenuItem(
                      value: 'secretary',
                      child: Text('Secretary'),
                    ),
                  ],
                  onChanged: (v) => setState(() => _position = v),
                  validator: (v) => v == null ? 'Select position' : null,
                ),
                SizedBox(height: 24),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF921940),
                    minimumSize: Size(double.infinity, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  onPressed: _loading
                      ? null
                      : () {
                          if (_formKey.currentState!.validate()) {
                            _login();
                          }
                        },
                  child: _loading
                      ? CircularProgressIndicator()
                      : Text('Login', style: TextStyle(color: Colors.white)),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/forgot_password');
                  },
                  child: Text(
                    'Forgot Password?',
                    style: TextStyle(color: Colors.blue),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
