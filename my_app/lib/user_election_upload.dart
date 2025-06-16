import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'package:mime_type/mime_type.dart';
import 'package:http_parser/http_parser.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserElectionUploadPage extends StatefulWidget {
  final String email;
  final String electionType;

  const UserElectionUploadPage({
    Key? key,
    required this.email,
    required this.electionType,
  }) : super(key: key);

  @override
  State<UserElectionUploadPage> createState() => _UserElectionUploadPageState();
}

class _UserElectionUploadPageState extends State<UserElectionUploadPage> {
  PlatformFile? _file;
  bool _loading = false;
  String? _error;
  String? _success;

  Future<void> _pickFile() async {
    setState(() {
      _error = null;
      _success = null;
    });
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
      withData: true,
    );
    if (result != null && result.files.isNotEmpty) {
      final file = result.files.first;
      final mime = mimeFromExtension(file.extension ?? '');
      if (mime == null ||
          !(mime == 'application/pdf' || mime.startsWith('image/'))) {
        setState(() {
          _error = 'Only PDF, JPG, or PNG files are allowed.';
        });
        return;
      }
      setState(() {
        _file = file;
      });
    }
  }

  void _deleteFile() {
    setState(() {
      _file = null;
      _error = null;
      _success = null;
    });
  }

  Future<void> _submit() async {
    if (_file == null) {
      setState(() {
        _error = 'Please upload a valid document.';
      });
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
      _success = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      // Try both possible token keys
      String? token = prefs.getString('jwt_token') ?? prefs.getString('token');
      if (token == null || token.isEmpty) {
        setState(() {
          _loading = false;
          _error = 'You are not logged in. Please log in again.';
        });
        return;
      }
      final uri = Uri.parse('http://localhost:5000/api/election-applications/');
      final request = http.MultipartRequest('POST', uri)
        ..fields['email'] = widget.email
        ..fields['electionType'] = widget.electionType;
      final mime =
          mimeFromExtension(_file!.extension ?? '') ??
          'application/octet-stream';
      request.files.add(
        http.MultipartFile.fromBytes(
          'document',
          _file!.bytes!,
          filename: _file!.name,
          contentType: MediaType.parse(mime),
        ),
      );
      request.headers['Authorization'] = 'Bearer $token';
      final response = await request.send();
      if (response.statusCode == 200) {
        setState(() {
          _success = 'Application submitted successfully!';
          _file = null;
        });
        await Future.delayed(const Duration(seconds: 1));
        if (mounted)
          Navigator.of(
            context,
          ).popUntil((route) => route.isFirst); // Go to dashboard
      } else {
        setState(() {
          _error = 'Submission failed. Please try again.';
        });
      }
    } catch (e) {
      setState(() {
        _error = 'An error occurred: $e';
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
      appBar: AppBar(
        title: const Text('Election Application'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: _loading ? null : () => Navigator.of(context).pop(),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Container(
            padding: const EdgeInsets.all(24),
            constraints: const BoxConstraints(maxWidth: 400),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 8,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 16),
                const Text(
                  'Upload ID/License/Passport',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text(
                  'Accepted: PDF, JPG, PNG',
                  style: TextStyle(color: Colors.grey[700]),
                ),
                const SizedBox(height: 16),
                if (_file != null)
                  Column(
                    children: [
                      Text(
                        _file!.name,
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      if (kIsWeb && _file!.bytes != null)
                        TextButton(
                          onPressed: () {
                            // Download logic for web (optional)
                          },
                          child: const Text('Download'),
                        ),
                      TextButton(
                        onPressed: _deleteFile,
                        child: const Text('Delete'),
                      ),
                    ],
                  ),
                if (_file == null)
                  ElevatedButton.icon(
                    icon: const Icon(Icons.attach_file),
                    label: const Text('Upload Document'),
                    onPressed: _loading ? null : _pickFile,
                  ),
                const SizedBox(height: 16),
                if (_error != null)
                  Text(_error!, style: const TextStyle(color: Colors.red)),
                if (_success != null)
                  Text(_success!, style: const TextStyle(color: Colors.green)),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    OutlinedButton(
                      onPressed: _loading
                          ? null
                          : () => Navigator.of(context).pop(),
                      child: const Text('Back'),
                    ),
                    ElevatedButton(
                      onPressed: _loading ? null : _submit,
                      child: _loading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Submit'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
      backgroundColor: const Color(0xFFF8F9FA),
    );
  }
}

// To use this page, push it with:
// Navigator.push(context, MaterialPageRoute(
//   builder: (context) => UserElectionUploadPage(email: email, electionType: type),
// ));
