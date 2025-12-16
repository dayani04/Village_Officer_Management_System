import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'theme/main_navigation.dart';

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
              builder: (context) => MainNavigation(
                /* pass user data if needed */
              ),
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
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF921940),
              Color(0xFF6D1841),
              Color(0xFF4A0F2E),
            ],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo and Title
                Container(
                  padding: EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.location_city,
                    size: 60,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 24),
                Text(
                  'Village Management',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'Sign in to continue',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.white.withOpacity(0.8),
                  ),
                ),
                SizedBox(height: 40),
                
                // Login Form Card
                Container(
                  padding: EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 20,
                        offset: Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        if (_error != null)
                          Container(
                            padding: EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.red.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                Icon(Icons.error_outline, color: Colors.red, size: 20),
                                SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    _error!,
                                    style: TextStyle(color: Colors.red, fontSize: 14),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        SizedBox(height: 20),
                        
                        // Email Field
                        Container(
                          decoration: BoxDecoration(
                            color: Color(0xFFF8F9FA),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: TextFormField(
                            decoration: InputDecoration(
                              labelText: 'Email',
                              prefixIcon: Icon(Icons.email_outlined, color: Color(0xFF921940)),
                              border: InputBorder.none,
                              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            ),
                            keyboardType: TextInputType.emailAddress,
                            onChanged: (v) => _email = v,
                            validator: (v) => v == null || v.isEmpty ? 'Enter email' : null,
                          ),
                        ),
                        SizedBox(height: 16),
                        
                        // Password Field
                        Container(
                          decoration: BoxDecoration(
                            color: Color(0xFFF8F9FA),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: TextFormField(
                            decoration: InputDecoration(
                              labelText: 'Password',
                              prefixIcon: Icon(Icons.lock_outline, color: Color(0xFF921940)),
                              border: InputBorder.none,
                              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            ),
                            obscureText: true,
                            onChanged: (v) => _password = v,
                            validator: (v) => v == null || v.isEmpty ? 'Enter password' : null,
                          ),
                        ),
                        SizedBox(height: 16),
                        
                        // Position Dropdown
                        Container(
                          decoration: BoxDecoration(
                            color: Color(0xFFF8F9FA),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: DropdownButtonFormField<String>(
                            value: _position,
                            decoration: InputDecoration(
                              labelText: 'Position',
                              prefixIcon: Icon(Icons.person_outline, color: Color(0xFF921940)),
                              border: InputBorder.none,
                              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            ),
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
                        ),
                        SizedBox(height: 24),
                        
                        // Login Button
                        Container(
                          width: double.infinity,
                          height: 50,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [Color(0xFF921940), Color(0xFF6D1841)],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
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
                                ? Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      SizedBox(
                                        width: 20,
                                        height: 20,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                        ),
                                      ),
                                      SizedBox(width: 12),
                                      Text('Signing in...', style: TextStyle(color: Colors.white)),
                                    ],
                                  )
                                : Text(
                                    'Login',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                          ),
                        ),
                        SizedBox(height: 16),
                        
                        // Forgot Password
                        TextButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/forgot_password');
                          },
                          child: Text(
                            'Forgot Password?',
                            style: TextStyle(
                              color: Color(0xFF921940),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
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
