import 'package:flutter/material.dart';

class AppTheme {
  static const Color primaryColor = Color(0xFF921940);
  static const Color textLight = Colors.white;
  
  static ThemeData get lightTheme {
    return ThemeData(
      primaryColor: primaryColor,
    );
  }
}
