import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mime_type/mime_type.dart';
import 'package:http_parser/http_parser.dart';

class UserIDCardUploadPage extends StatefulWidget {
  final String email;
  final String nicType;
  const UserIDCardUploadPage({
    super.key,
    required this.email,
    required this.nicType,
  });

  @override
  State<UserIDCardUploadPage> createState() => _UserIDCardUploadPageState();
}

class _UserIDCardUploadPageState extends State<UserIDCardUploadPage> {
  File? documentFile;
  PlatformFile? documentPlatformFile; // For web
  bool isLoading = false;

  void pickDocumentFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg'],
      withData: kIsWeb,
    );
    if (result != null) {
      if (kIsWeb) {
        setState(() {
          documentPlatformFile = result.files.single;
          documentFile = null;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Document selected: ${result.files.single.name} (web, bytes only)',
            ),
          ),
        );
      } else if (result.files.single.path != null) {
        setState(() {
          documentFile = File(result.files.single.path!);
          documentPlatformFile = null;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Document selected: ${result.files.single.name}'),
          ),
        );
      }
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('No file selected.')));
    }
  }

  Future<void> handleSubmit() async {
    if ((!kIsWeb && documentFile == null) ||
        (kIsWeb && documentPlatformFile == null)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please upload an ID card document.')),
      );
      return;
    }
    setState(() {
      isLoading = true;
    });
    try {
      String? token;
      try {
        final prefs = await SharedPreferences.getInstance();
        token = prefs.getString('token');
      } catch (_) {}

      var uri = Uri.parse('http://localhost:5000/api/nic-applications/');
      var request = http.MultipartRequest('POST', uri);
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      if (kIsWeb) {
        String? documentMime;
        if (documentPlatformFile != null) {
          documentMime = mime(documentPlatformFile!.name);
          if (documentMime == null) {
            if (documentPlatformFile!.name.toLowerCase().endsWith('.pdf')) {
              documentMime = 'application/pdf';
            } else if (documentPlatformFile!.name.toLowerCase().endsWith(
              '.png',
            )) {
              documentMime = 'image/png';
            } else if (documentPlatformFile!.name.toLowerCase().endsWith(
                  '.jpg',
                ) ||
                documentPlatformFile!.name.toLowerCase().endsWith('.jpeg')) {
              documentMime = 'image/jpeg';
            }
          }
        }
        if (documentPlatformFile != null &&
            documentPlatformFile!.bytes != null) {
          request.files.add(
            http.MultipartFile.fromBytes(
              'document',
              documentPlatformFile!.bytes!,
              filename: documentPlatformFile!.name,
              contentType: documentMime != null
                  ? MediaType.parse(documentMime)
                  : null,
            ),
          );
        }
      } else {
        if (documentFile != null) {
          request.files.add(
            await http.MultipartFile.fromPath('document', documentFile!.path),
          );
        }
      }
      request.fields['email'] = widget.email;
      request.fields['nicType'] = widget.nicType;
      var response = await request.send();
      if (response.statusCode == 201 || response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Application submitted successfully!')),
        );
        setState(() {
          documentFile = null;
          documentPlatformFile = null;
        });
        Navigator.pop(context); // Go back or to dashboard
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Submission failed: ${response.statusCode}')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Submission failed: ${e.toString()}')),
      );
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  Widget _creativeUploadSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 16),
        const Text(
          'Upload Document (PDF, JPG, PNG)',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        if (documentFile != null || documentPlatformFile != null)
          Column(
            children: [
              Text(
                kIsWeb && documentPlatformFile != null
                    ? documentPlatformFile!.name
                    : documentFile != null
                    ? documentFile!.path.split(Platform.pathSeparator).last
                    : '',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              if (kIsWeb &&
                  documentPlatformFile != null &&
                  documentPlatformFile!.bytes != null)
                TextButton(
                  onPressed: () {
                    // Download logic for web (optional)
                  },
                  child: const Text('Download'),
                ),
              TextButton(
                onPressed: () {
                  setState(() {
                    documentFile = null;
                    documentPlatformFile = null;
                  });
                },
                child: const Text('Delete'),
              ),
            ],
          ),
        if (documentFile == null && documentPlatformFile == null)
          ElevatedButton.icon(
            icon: const Icon(Icons.attach_file),
            label: const Text('Upload Document'),
            onPressed: isLoading ? null : pickDocumentFile,
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Upload ID Card Document'),
        backgroundColor: Color(0xFF921940),
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
                Text('Email: \\${widget.email}'),
                Text('ID Card Type: \\${widget.nicType}'),
                _creativeUploadSection(),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    OutlinedButton(
                      onPressed: isLoading
                          ? null
                          : () => Navigator.pop(context),
                      child: const Text('Back'),
                    ),
                    ElevatedButton(
                      onPressed: isLoading ? null : handleSubmit,
                      child: isLoading
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
