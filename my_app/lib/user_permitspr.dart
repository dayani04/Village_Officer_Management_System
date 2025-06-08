import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mime_type/mime_type.dart';
import 'package:http_parser/http_parser.dart';

class UserPermitsPRPage extends StatefulWidget {
  final String email;
  final String permitType;
  const UserPermitsPRPage({
    super.key,
    required this.email,
    required this.permitType,
  });

  @override
  State<UserPermitsPRPage> createState() => _UserPermitsPRPageState();
}

class _UserPermitsPRPageState extends State<UserPermitsPRPage> {
  File? policeReportFile;
  PlatformFile? policeReportPlatformFile; // For web
  File? idDocumentFile;
  PlatformFile? idDocumentPlatformFile; // For web
  bool isLoading = false;

  void pickPoliceReportFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg'],
      withData: kIsWeb, // get bytes for web
    );
    if (result != null) {
      if (kIsWeb) {
        setState(() {
          policeReportPlatformFile = result.files.single;
          policeReportFile = null;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Police report file selected: \\${result.files.single.name} (web, bytes only)',
            ),
          ),
        );
      } else if (result.files.single.path != null) {
        setState(() {
          policeReportFile = File(result.files.single.path!);
          policeReportPlatformFile = null;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Police report file selected: \\${result.files.single.name}',
            ),
          ),
        );
      }
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('No file selected.')));
    }
  }

  void pickIdDocumentFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg'],
      withData: kIsWeb, // get bytes for web
    );
    if (result != null) {
      if (kIsWeb) {
        setState(() {
          idDocumentPlatformFile = result.files.single;
          idDocumentFile = null;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'ID document selected: \\${result.files.single.name} (web, bytes only)',
            ),
          ),
        );
      } else if (result.files.single.path != null) {
        setState(() {
          idDocumentFile = File(result.files.single.path!);
          idDocumentPlatformFile = null;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'ID document selected: \\${result.files.single.name}',
            ),
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
    if ((!kIsWeb && policeReportFile == null) ||
        (kIsWeb && policeReportPlatformFile == null)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please upload a police report file.')),
      );
      return;
    }
    if ((!kIsWeb && idDocumentFile == null) ||
        (kIsWeb && idDocumentPlatformFile == null)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please upload an ID document file.')),
      );
      return;
    }
    setState(() {
      isLoading = true;
    });
    try {
      // Get JWT token if needed
      String? token;
      try {
        final prefs = await SharedPreferences.getInstance();
        token = prefs.getString('token');
      } catch (_) {}

      var uri = Uri.parse('http://localhost:5000/api/permit-applications/');
      var request = http.MultipartRequest('POST', uri);
      if (token != null) {
        request.headers['Authorization'] = 'Bearer ' + token;
      }
      if (kIsWeb) {
        String? policeReportMime;
        String? idDocumentMime;
        if (policeReportPlatformFile != null) {
          policeReportMime = mime(policeReportPlatformFile!.name);
          if (policeReportMime == null) {
            if (policeReportPlatformFile!.name.toLowerCase().endsWith('.pdf')) {
              policeReportMime = 'application/pdf';
            } else if (policeReportPlatformFile!.name.toLowerCase().endsWith(
              '.png',
            )) {
              policeReportMime = 'image/png';
            } else if (policeReportPlatformFile!.name.toLowerCase().endsWith(
                  '.jpg',
                ) ||
                policeReportPlatformFile!.name.toLowerCase().endsWith(
                  '.jpeg',
                )) {
              policeReportMime = 'image/jpeg';
            }
          }
        }
        if (idDocumentPlatformFile != null) {
          idDocumentMime = mime(idDocumentPlatformFile!.name);
          if (idDocumentMime == null) {
            if (idDocumentPlatformFile!.name.toLowerCase().endsWith('.pdf')) {
              idDocumentMime = 'application/pdf';
            } else if (idDocumentPlatformFile!.name.toLowerCase().endsWith(
              '.png',
            )) {
              idDocumentMime = 'image/png';
            } else if (idDocumentPlatformFile!.name.toLowerCase().endsWith(
                  '.jpg',
                ) ||
                idDocumentPlatformFile!.name.toLowerCase().endsWith('.jpeg')) {
              idDocumentMime = 'image/jpeg';
            }
          }
        }
        if (policeReportPlatformFile != null &&
            policeReportPlatformFile!.bytes != null) {
          request.files.add(
            http.MultipartFile.fromBytes(
              'policeReport',
              policeReportPlatformFile!.bytes!,
              filename: policeReportPlatformFile!.name,
              contentType: policeReportMime != null
                  ? MediaType.parse(policeReportMime)
                  : null,
            ),
          );
        }
        if (idDocumentPlatformFile != null &&
            idDocumentPlatformFile!.bytes != null) {
          request.files.add(
            http.MultipartFile.fromBytes(
              'document',
              idDocumentPlatformFile!.bytes!,
              filename: idDocumentPlatformFile!.name,
              contentType: idDocumentMime != null
                  ? MediaType.parse(idDocumentMime)
                  : null,
            ),
          );
        }
      } else {
        if (policeReportFile != null) {
          request.files.add(
            await http.MultipartFile.fromPath(
              'policeReport',
              policeReportFile!.path,
            ),
          );
        }
        if (idDocumentFile != null) {
          request.files.add(
            await http.MultipartFile.fromPath('document', idDocumentFile!.path),
          );
        }
      }
      request.fields['email'] = widget.email;
      request.fields['permitType'] = widget.permitType;
      var response = await request.send();
      if (response.statusCode == 201 || response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Application submitted successfully!')),
        );
        setState(() {
          policeReportFile = null;
          idDocumentFile = null;
          policeReportPlatformFile = null;
          idDocumentPlatformFile = null;
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Submission failed: \\${response.statusCode}'),
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Submission failed: \\${e.toString()}')),
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
          'Upload Police Report & ID Document (PDF, JPG, PNG)',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        // Police Report
        const Text(
          'Police Report',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        if (kIsWeb
            ? policeReportPlatformFile != null
            : policeReportFile != null)
          Column(
            children: [
              Text(
                kIsWeb && policeReportPlatformFile != null
                    ? policeReportPlatformFile!.name
                    : policeReportFile != null
                    ? policeReportFile!.path.split(Platform.pathSeparator).last
                    : '',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              if (kIsWeb &&
                  policeReportPlatformFile != null &&
                  policeReportPlatformFile!.bytes != null)
                TextButton(
                  onPressed: () {
                    // Download logic for web (optional)
                  },
                  child: const Text('Download'),
                ),
              TextButton(
                onPressed: () {
                  setState(() {
                    policeReportFile = null;
                    policeReportPlatformFile = null;
                  });
                },
                child: const Text('Delete'),
              ),
            ],
          ),
        if (policeReportFile == null && policeReportPlatformFile == null)
          ElevatedButton.icon(
            icon: const Icon(Icons.attach_file),
            label: const Text('Upload Police Report'),
            onPressed: isLoading ? null : pickPoliceReportFile,
          ),
        const SizedBox(height: 16),
        // ID Document
        const Text(
          'ID Document',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        if (kIsWeb ? idDocumentPlatformFile != null : idDocumentFile != null)
          Column(
            children: [
              Text(
                kIsWeb && idDocumentPlatformFile != null
                    ? idDocumentPlatformFile!.name
                    : idDocumentFile != null
                    ? idDocumentFile!.path.split(Platform.pathSeparator).last
                    : '',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              if (kIsWeb &&
                  idDocumentPlatformFile != null &&
                  idDocumentPlatformFile!.bytes != null)
                TextButton(
                  onPressed: () {
                    // Download logic for web (optional)
                  },
                  child: const Text('Download'),
                ),
              TextButton(
                onPressed: () {
                  setState(() {
                    idDocumentFile = null;
                    idDocumentPlatformFile = null;
                  });
                },
                child: const Text('Delete'),
              ),
            ],
          ),
        if (idDocumentFile == null && idDocumentPlatformFile == null)
          ElevatedButton.icon(
            icon: const Icon(Icons.attach_file),
            label: const Text('Upload ID Document'),
            onPressed: isLoading ? null : pickIdDocumentFile,
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Apply for Permit'),
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
                Text('Permit Type: \\${widget.permitType}'),
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
