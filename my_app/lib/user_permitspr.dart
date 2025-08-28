import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
// Removed unused imports

class UserPermitsPRPage extends StatefulWidget {
  final String email;
  final String permitType;
  final String requiredDate;
  const UserPermitsPRPage({
    super.key,
    required this.email,
    required this.permitType,
    required this.requiredDate,
  });

  @override
  State<UserPermitsPRPage> createState() => _UserPermitsPRPageState();
}

class _UserPermitsPRPageState extends State<UserPermitsPRPage> {
  File? policeReportFile;
  PlatformFile? policeReportPlatformFile; // For web
  bool loading = false;

  void pickPoliceReportFile() async {
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
          policeReportPlatformFile = file;
          policeReportFile = null;
        } else if (file.path != null) {
          policeReportFile = File(file.path!);
          policeReportPlatformFile = null;
        }
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Police report file selected: ${file.name}')),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('No file selected.')));
    }
  }

  void handleDelete() {
    setState(() {
      policeReportFile = null;
      policeReportPlatformFile = null;
    });
  }

  void handleNext() {
    if ((kIsWeb && policeReportPlatformFile == null) ||
        (!kIsWeb && policeReportFile == null)) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Please upload a police report')));
      return;
    }
    Navigator.pushNamed(
      context,
      '/user_permits_id',
      arguments: {
        'email': widget.email,
        'permitType': widget.permitType,
        'requiredDate': widget.requiredDate,
        'policeReportFile': policeReportFile,
        'policeReportPlatformFile': policeReportPlatformFile,
      },
    );
  }

  Widget _uploadSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 16),
        const Text(
          'Upload Police Report (PDF, JPG, PNG)',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        if (kIsWeb
            ? policeReportPlatformFile != null
            : policeReportFile != null)
          Row(
            children: [
              Expanded(
                child: Text(
                  kIsWeb && policeReportPlatformFile != null
                      ? policeReportPlatformFile!.name
                      : policeReportFile != null
                      ? policeReportFile!.path
                            .split(Platform.pathSeparator)
                            .last
                      : '',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
              TextButton(
                onPressed: loading ? null : handleDelete,
                child: const Text('Delete'),
              ),
            ],
          ),
        if (policeReportFile == null && policeReportPlatformFile == null)
          ElevatedButton.icon(
            icon: const Icon(Icons.attach_file),
            label: const Text('📎 Upload Police Report'),
            onPressed: loading ? null : pickPoliceReportFile,
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Upload Police Report'),
        backgroundColor: const Color(0xFF921940),
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
                Text('Email: ${widget.email}'),
                Text('Permit Type: ${widget.permitType}'),
                Text('Required Date: ${widget.requiredDate}'),
                _uploadSection(),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    OutlinedButton(
                      onPressed: loading ? null : () => Navigator.pop(context),
                      child: const Text('Back'),
                    ),
                    ElevatedButton(
                      onPressed: loading ? null : handleNext,
                      child: loading
                          ? const Text('Next...')
                          : const Text('Next'),
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
