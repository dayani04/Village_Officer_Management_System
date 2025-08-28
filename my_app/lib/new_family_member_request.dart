import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class NewFamilyMemberRequestPage extends StatefulWidget {
  const NewFamilyMemberRequestPage({Key? key}) : super(key: key);

  @override
  State<NewFamilyMemberRequestPage> createState() =>
      _NewFamilyMemberRequestPageState();
}

class _NewFamilyMemberRequestPageState
    extends State<NewFamilyMemberRequestPage> {
  final _formKey = GlobalKey<FormState>();
  String relationship = '';
  PlatformFile? document;
  PlatformFile? residenceCertificate;
  String? error;
  String? success;
  bool loading = false;

  Future<void> pickFile(String which) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg'],
      withData: true,
    );
    if (result != null) {
      setState(() {
        if (which == 'document') {
          document = result.files.single;
        } else {
          residenceCertificate = result.files.single;
        }
      });
    }
  }

  Future<void> handleSubmit() async {
    setState(() {
      error = null;
      success = null;
      loading = true;
    });
    if (!_formKey.currentState!.validate() ||
        document == null ||
        residenceCertificate == null) {
      setState(() {
        error = 'All fields and files are required';
        loading = false;
      });
      return;
    }
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      var uri = Uri.parse(
        'http://localhost:5000/api/villagers/new-family-member-request',
      );
      var request = http.MultipartRequest('POST', uri);
      request.headers['Authorization'] = 'Bearer $token';
      request.fields['relationship'] = relationship;
      if (document != null && document!.bytes != null) {
        request.files.add(
          http.MultipartFile.fromBytes(
            'document',
            document!.bytes!,
            filename: document!.name,
          ),
        );
      }
      if (residenceCertificate != null && residenceCertificate!.bytes != null) {
        request.files.add(
          http.MultipartFile.fromBytes(
            'residenceCertificate',
            residenceCertificate!.bytes!,
            filename: residenceCertificate!.name,
          ),
        );
      }
      final response = await request.send();
      if (response.statusCode == 200 || response.statusCode == 201) {
        setState(() {
          success = 'New family member request submitted successfully';
        });
        await Future.delayed(const Duration(seconds: 2));
        if (mounted) Navigator.of(context).pop();
      } else {
        setState(() {
          error = 'Failed to submit request';
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to submit request';
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Request for New Family Member'),
        backgroundColor: const Color(0xFF921940),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              if (error != null)
                Text(error!, style: const TextStyle(color: Colors.red)),
              if (success != null)
                Text(success!, style: const TextStyle(color: Colors.green)),
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Relationship to Family Member',
                ),
                onChanged: (v) => relationship = v,
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Expanded(
                    child: Text('Birth Certificate or NIC (PDF, PNG, JPG):'),
                  ),
                  ElevatedButton(
                    onPressed: loading ? null : () => pickFile('document'),
                    child: Text(document == null ? 'Upload' : 'Change'),
                  ),
                  if (document != null)
                    Padding(
                      padding: const EdgeInsets.only(left: 8),
                      child: Text(
                        document!.name,
                        style: const TextStyle(fontSize: 12),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Expanded(
                    child: Text(
                      'Residence Confirmation Certificate (PDF, PNG, JPG):',
                    ),
                  ),
                  ElevatedButton(
                    onPressed: loading
                        ? null
                        : () => pickFile('residenceCertificate'),
                    child: Text(
                      residenceCertificate == null ? 'Upload' : 'Change',
                    ),
                  ),
                  if (residenceCertificate != null)
                    Padding(
                      padding: const EdgeInsets.only(left: 8),
                      child: Text(
                        residenceCertificate!.name,
                        style: const TextStyle(fontSize: 12),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: loading ? null : handleSubmit,
                    child: loading
                        ? const CircularProgressIndicator()
                        : const Text('Submit Request'),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: loading ? null : () => Navigator.pop(context),
                    child: const Text('Cancel'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
