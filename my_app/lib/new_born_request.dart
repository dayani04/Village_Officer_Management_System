import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class NewBornRequestPage extends StatefulWidget {
  const NewBornRequestPage({Key? key}) : super(key: key);

  @override
  State<NewBornRequestPage> createState() => _NewBornRequestPageState();
}

class _NewBornRequestPageState extends State<NewBornRequestPage> {
  final _formKey = GlobalKey<FormState>();
  String relationship = '';
  Map<String, PlatformFile?> files = {
    'birthCertificate': null,
    'motherNic': null,
    'fatherNic': null,
    'marriageCertificate': null,
    'residenceCertificate': null,
  };
  String? error;
  String? success;
  bool loading = false;

  Future<void> pickFile(String key) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'png', 'jpg', 'jpeg'],
      withData: true,
    );
    if (result != null) {
      setState(() {
        files[key] = result.files.single;
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
        files.values.any((f) => f == null)) {
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
        'http://localhost:5000/api/villagers/new-born-request',
      );
      var request = http.MultipartRequest('POST', uri);
      request.headers['Authorization'] = 'Bearer $token';
      request.fields['relationship'] = relationship;
      files.forEach((key, file) {
        if (file != null && file.bytes != null) {
          request.files.add(
            http.MultipartFile.fromBytes(key, file.bytes!, filename: file.name),
          );
        }
      });
      final response = await request.send();
      if (response.statusCode == 200 || response.statusCode == 201) {
        setState(() {
          success = 'New born request submitted successfully';
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
        title: const Text('Request for New Born'),
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
                  labelText: 'Relationship to Newborn',
                ),
                onChanged: (v) => relationship = v,
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 12),
              ...[
                ['Birth Certificate', 'birthCertificate'],
                ['Mother\'s NIC', 'motherNic'],
                ['Father\'s NIC', 'fatherNic'],
                ['Marriage Certificate', 'marriageCertificate'],
                ['Residence Confirmation Certificate', 'residenceCertificate'],
              ].map(
                (item) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Row(
                    children: [
                      Expanded(child: Text('${item[0]} (PDF, PNG, JPG):')),
                      ElevatedButton(
                        onPressed: loading ? null : () => pickFile(item[1]!),
                        child: Text(
                          files[item[1]] == null ? 'Upload' : 'Change',
                        ),
                      ),
                      if (files[item[1]] != null)
                        Padding(
                          padding: const EdgeInsets.only(left: 8),
                          child: Text(
                            files[item[1]]!.name,
                            style: const TextStyle(fontSize: 12),
                          ),
                        ),
                    ],
                  ),
                ),
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
