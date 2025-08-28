import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http_parser/http_parser.dart';

class UserPermitsIDPage extends StatefulWidget {
  final String email;
  final String permitType;
  final String requiredDate;
  final File? policeReportFile;
  final PlatformFile? policeReportPlatformFile;
  const UserPermitsIDPage({
    super.key,
    required this.email,
    required this.permitType,
    required this.requiredDate,
    this.policeReportFile,
    this.policeReportPlatformFile,
  });
  @override
  State<UserPermitsIDPage> createState() => _UserPermitsIDPageState();
}

class _UserPermitsIDPageState extends State<UserPermitsIDPage> {
  File? idDocumentFile;
  PlatformFile? idDocumentPlatformFile;
  bool loading = false;

  void pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg'],
      withData: kIsWeb,
    );
    if (result != null) {
      final file = result.files.single;
      final allowedTypes = ['pdf', 'png', 'jpg', 'jpeg'];
      final ext = file.extension?.toLowerCase();
      if (ext == null || !allowedTypes.contains(ext)) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Only PDF, PNG, or JPG files are allowed')),
        );
        return;
      }
      setState(() {
        if (kIsWeb) {
          idDocumentPlatformFile = file;
          idDocumentFile = null;
        } else if (file.path != null) {
          idDocumentFile = File(file.path!);
          idDocumentPlatformFile = null;
        }
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('ID document selected: ${file.name}')),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('No file selected.')));
    }
  }

  void handleDelete() {
    setState(() {
      idDocumentFile = null;
      idDocumentPlatformFile = null;
    });
  }

  Future<void> handleSubmit() async {
    if (loading) return;
    if (widget.email.isEmpty ||
        widget.permitType.isEmpty ||
        widget.requiredDate.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('All fields are required.')));
      return;
    }
    if ((!kIsWeb && idDocumentFile == null) ||
        (kIsWeb && idDocumentPlatformFile == null)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please upload an ID document file.')),
      );
      return;
    }
    if ((!kIsWeb && widget.policeReportFile == null) ||
        (kIsWeb && widget.policeReportPlatformFile == null)) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Police report file is missing.')));
      return;
    }

    setState(() {
      loading = true;
    });
    try {
      // Prepare multipart request
      final uri = Uri.parse('http://localhost:5000/api/permit-applications/');
      var request = http.MultipartRequest('POST', uri);

      // Add fields
      request.fields['email'] = widget.email;
      request.fields['permitType'] = widget.permitType;
      request.fields['requiredDate'] = widget.requiredDate;

      // Add police report file
      if (kIsWeb && widget.policeReportPlatformFile != null) {
        // Guess MIME type for police report
        final policeExt = widget.policeReportPlatformFile!.extension
            ?.toLowerCase();
        String policeMime = 'application/pdf';
        if (policeExt == 'png')
          policeMime = 'image/png';
        else if (policeExt == 'jpg' || policeExt == 'jpeg')
          policeMime = 'image/jpeg';
        request.files.add(
          http.MultipartFile.fromBytes(
            'policeReport',
            widget.policeReportPlatformFile!.bytes!,
            filename: widget.policeReportPlatformFile!.name,
            contentType: MediaType(
              policeMime.split('/')[0],
              policeMime.split('/')[1],
            ),
          ),
        );
      } else if (widget.policeReportFile != null) {
        request.files.add(
          await http.MultipartFile.fromPath(
            'policeReport',
            widget.policeReportFile!.path,
          ),
        );
      }

      // Add ID document file
      if (kIsWeb && idDocumentPlatformFile != null) {
        // Guess MIME type for ID document
        final idExt = idDocumentPlatformFile!.extension?.toLowerCase();
        String idMime = 'application/pdf';
        if (idExt == 'png')
          idMime = 'image/png';
        else if (idExt == 'jpg' || idExt == 'jpeg')
          idMime = 'image/jpeg';
        request.files.add(
          http.MultipartFile.fromBytes(
            'document',
            idDocumentPlatformFile!.bytes!,
            filename: idDocumentPlatformFile!.name,
            contentType: MediaType(idMime.split('/')[0], idMime.split('/')[1]),
          ),
        );
      } else if (idDocumentFile != null) {
        request.files.add(
          await http.MultipartFile.fromPath('document', idDocumentFile!.path),
        );
      }

      // Add Authorization header
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }

      // Send request
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      if (response.statusCode == 201) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Permit application submitted successfully!')),
        );
        Future.delayed(Duration(milliseconds: 500), () {
          if (mounted) Navigator.of(context).popUntil((route) => route.isFirst);
        });
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to submit application: ${response.body}'),
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to submit application.')));
    } finally {
      if (mounted)
        setState(() {
          loading = false;
        });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Upload ID Document'),
        backgroundColor: Color(0xFF921940),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Email: ${widget.email}'),
            Text('Permit Type: ${widget.permitType}'),
            Text('Required Date: ${widget.requiredDate}'),
            Text(
              'Police Report: ' +
                  (kIsWeb
                      ? (widget.policeReportPlatformFile?.name ?? 'None')
                      : (widget.policeReportFile != null
                            ? widget.policeReportFile!.path
                                  .split(Platform.pathSeparator)
                                  .last
                            : 'None')),
            ),
            SizedBox(height: 24),
            Row(
              children: [
                ElevatedButton(
                  onPressed: loading ? null : pickFile,
                  child: Text(
                    idDocumentFile == null && idDocumentPlatformFile == null
                        ? '📎 Upload ID Document'
                        : 'Change ID Document',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF921940),
                  ),
                ),
                if (idDocumentFile != null || idDocumentPlatformFile != null)
                  Padding(
                    padding: const EdgeInsets.only(left: 8.0),
                    child: ElevatedButton(
                      onPressed: loading ? null : handleDelete,
                      child: Text('Delete'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey,
                      ),
                    ),
                  ),
              ],
            ),
            if (idDocumentFile != null || idDocumentPlatformFile != null)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Text(
                  'Selected: ' +
                      (kIsWeb
                          ? idDocumentPlatformFile?.name ?? ''
                          : (idDocumentFile != null
                                ? idDocumentFile!.path
                                      .split(Platform.pathSeparator)
                                      .last
                                : '')),
                ),
              ),
            SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: loading ? null : () => Navigator.pop(context),
                  child: Text('Back'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF921940),
                  ),
                ),
                ElevatedButton(
                  onPressed: loading ? null : handleSubmit,
                  child: Text(loading ? 'Submitting...' : 'Submit'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF921940),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
