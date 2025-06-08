import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';

class UserPermitsIDPage extends StatefulWidget {
  final String email;
  final String permitType;
  final File? policeReportFile;
  final PlatformFile? policeReportPlatformFile;
  const UserPermitsIDPage({
    super.key,
    required this.email,
    required this.permitType,
    this.policeReportFile,
    this.policeReportPlatformFile,
  });
  @override
  State<UserPermitsIDPage> createState() => _UserPermitsIDPageState();
}

class _UserPermitsIDPageState extends State<UserPermitsIDPage> {
  File? idDocumentFile;
  PlatformFile? idDocumentPlatformFile;

  void pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg'],
      withData: kIsWeb,
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
              'ID document selected: ${result.files.single.name} (web, bytes only)',
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
            content: Text('ID document selected: ${result.files.single.name}'),
          ),
        );
      }
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('No file selected.')));
    }
  }

  void handleSubmit() {
    if (!kIsWeb && idDocumentFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please upload an ID document file.')),
      );
      return;
    }
    if (kIsWeb && idDocumentPlatformFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please upload an ID document file.')),
      );
      return;
    }
    // Here you would submit the application with all files
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Application submitted (not implemented)')),
    );
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
            ElevatedButton(
              onPressed: pickFile,
              child: Text(
                idDocumentFile == null && idDocumentPlatformFile == null
                    ? 'Upload ID Document'
                    : 'Change ID Document',
              ),
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
                  onPressed: () => Navigator.pop(context),
                  child: Text('Back'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF921940),
                  ),
                ),
                ElevatedButton(
                  onPressed: handleSubmit,
                  child: Text('Submit'),
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
