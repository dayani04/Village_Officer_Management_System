import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({super.key});

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  bool loading = true;
  bool editMode = false;
  bool otpMode = false;
  bool locationMode = false;
  String? error;
  Map<String, dynamic>? profile;
  Map<String, dynamic> formData = {};
  String otp = '';
  String newPassword = '';
  String latitude = '';
  String longitude = '';
  LatLng? villagerLocation;
  GoogleMapController? mapController;

  final LatLng defaultCenter = LatLng(6.9271, 79.8612);

  @override
  void initState() {
    super.initState();
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    setState(() {
      loading = true;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          profile = data;
          formData = {
            'full_name': data['Full_Name'] ?? '',
            'email': data['Email'] ?? '',
            'phone_no': data['Phone_No'] ?? '',
            'address': data['Address'] ?? '',
            'regional_division': data['RegionalDivision'] ?? '',
            'status': data['Status'] ?? 'Active',
            'is_election_participant': (data['IsParticipant'] is bool)
                ? data['IsParticipant']
                : (data['IsParticipant'] == 1),
            'alive_status': data['Alive_Status'] ?? 'Alive',
            'job': data['Job'] ?? '',
            'gender': data['Gender'] ?? 'Other',
            'marital_status': data['Marital_Status'] ?? 'Unmarried',
          };
          if (data['Latitude'] != null && data['Longitude'] != null) {
            villagerLocation = LatLng(
              double.parse(data['Latitude'].toString()),
              double.parse(data['Longitude'].toString()),
            );
            latitude = data['Latitude'].toString();
            longitude = data['Longitude'].toString();
          }
          loading = false;
        });
      } else {
        setState(() {
          error = 'Failed to fetch profile';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to fetch profile';
        loading = false;
      });
    }
  }

  Future<void> updateProfile() async {
    setState(() {
      loading = true;
    });
    try {
      final response = await http.put(
        Uri.parse(
          'http://localhost:5000/api/villagers/${profile!['Villager_ID']}',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization':
              'Bearer ${(await SharedPreferences.getInstance()).getString('token')!}',
        },
        body: jsonEncode({
          'full_name': formData['full_name'],
          'email': formData['email'],
          'phone_no': formData['phone_no'],
          'address': formData['address'],
          'regional_division': formData['regional_division'],
          'status': formData['status'],
          'is_election_participant': formData['is_election_participant'],
          'alive_status': formData['alive_status'],
          'job': formData['job'],
          'gender': formData['gender'],
          'marital_status': formData['marital_status'],
          'latitude': latitude.isNotEmpty ? double.tryParse(latitude) : null,
          'longitude': longitude.isNotEmpty ? double.tryParse(longitude) : null,
        }),
      );
      if (response.statusCode == 200) {
        await fetchProfile();
        setState(() {
          editMode = false;
          error = null;
        });
      } else {
        setState(() {
          error = 'Failed to update profile';
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to update profile';
      });
    }
    setState(() {
      loading = false;
    });
  }

  Future<void> updateLocation() async {
    setState(() {
      loading = true;
    });
    try {
      final response = await http.put(
        Uri.parse(
          'http://localhost:5000/api/villagers/${profile!['Villager_ID']}/location',
        ),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'latitude': double.parse(latitude),
          'longitude': double.parse(longitude),
        }),
      );
      if (response.statusCode == 200) {
        await fetchProfile();
        setState(() {
          locationMode = false;
          error = null;
        });
      } else {
        setState(() {
          error = 'Failed to update location';
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to update location';
      });
    }
    setState(() {
      loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return Scaffold(
        appBar: AppBar(title: Text('Villager Profile')),
        body: Center(child: CircularProgressIndicator()),
      );
    }
    if (profile == null) {
      return Scaffold(
        appBar: AppBar(title: Text('Villager Profile')),
        body: Center(child: Text(error ?? 'No profile found')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Villager Profile'),
        backgroundColor: Color(0xFF921940),
      ),
      body: SingleChildScrollView(
        child: Container(
          margin: EdgeInsets.all(16),
          padding: EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Color(0xFFF9F9F9),
            borderRadius: BorderRadius.circular(8),
            boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (error != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Text(error!, style: TextStyle(color: Colors.red)),
                ),
              if (editMode)
                _buildEditForm()
              else if (locationMode)
                _buildLocationSection()
              else
                _buildProfileDetails(),
              SizedBox(height: 16),
              _buildActions(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileDetails() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _profileField('Villager ID', profile!['Villager_ID'].toString()),
        _profileField('Full Name', profile!['Full_Name']),
        _profileField('Email', profile!['Email']),
        _profileField('Phone Number', profile!['Phone_No']),
        _profileField('NIC', profile!['NIC'] ?? 'N/A'),
        _profileField('Date of Birth', profile!['DOB'] ?? 'N/A'),
        _profileField('Address', profile!['Address'] ?? 'N/A'),
        _profileField(
          'Regional Division',
          profile!['RegionalDivision'] ?? 'N/A',
        ),
        _profileField('Job', profile!['Job'] ?? 'N/A'),
        _profileField('Gender', profile!['Gender'] ?? 'N/A'),
        _profileField('Marital Status', profile!['Marital_Status'] ?? 'N/A'),
        _profileField('Status', profile!['Status']),
        _profileField('Area ID', profile!['Area_ID']?.toString() ?? 'N/A'),
        _profileField(
          'Location',
          villagerLocation != null
              ? 'Lat: ${villagerLocation!.latitude.toStringAsFixed(8)}, Lng: ${villagerLocation!.longitude.toStringAsFixed(8)}'
              : 'Not set',
        ),
        _profileField(
          'Upcoming Election Participant',
          profile!['IsParticipant'] == true ? 'Yes' : 'No',
        ),
        _profileField('Alive Status', profile!['Alive_Status'] ?? 'N/A'),
      ],
    );
  }

  Widget _profileField(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          SizedBox(
            width: 120,
            child: Text(
              '$label:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  Widget _buildEditForm() {
    return Column(
      children: [
        _editTextField('Full Name', 'full_name'),
        _editTextField('Email', 'email'),
        _editTextField('Phone Number', 'phone_no'),
        _editTextField('Address', 'address'),
        _editTextField('Regional Division', 'regional_division'),
        _editTextField('Job', 'job'),
        _editDropdown('Gender', 'gender', ['Male', 'Female', 'Other']),
        _editDropdown('Marital Status', 'marital_status', [
          'Married',
          'Unmarried',
          'Divorced',
          'Widowed',
          'Separated',
        ]),
        _editDropdown('Alive Status', 'alive_status', ['Alive', 'Deceased']),
        Row(
          children: [
            Text(
              'Upcoming Election Participant:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            Checkbox(
              value: formData['is_election_participant'] ?? false,
              onChanged: (v) =>
                  setState(() => formData['is_election_participant'] = v),
            ),
          ],
        ),
        // Add editable latitude/longitude fields
        Row(
          children: [
            Expanded(
              child: TextFormField(
                decoration: InputDecoration(labelText: 'Latitude'),
                initialValue: latitude,
                keyboardType: TextInputType.numberWithOptions(decimal: true),
                onChanged: (v) => setState(() => latitude = v),
              ),
            ),
            SizedBox(width: 8),
            Expanded(
              child: TextFormField(
                decoration: InputDecoration(labelText: 'Longitude'),
                initialValue: longitude,
                keyboardType: TextInputType.numberWithOptions(decimal: true),
                onChanged: (v) => setState(() => longitude = v),
              ),
            ),
          ],
        ),
        SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF921940),
              ),
              onPressed: updateProfile,
              child: Text('Save Changes'),
            ),
            SizedBox(width: 12),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF7a1632),
              ),
              onPressed: () => setState(() => editMode = false),
              child: Text('Cancel'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _editTextField(String label, String key) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: TextFormField(
        decoration: InputDecoration(labelText: label),
        initialValue: formData[key] ?? '',
        onChanged: (v) => formData[key] = v,
      ),
    );
  }

  Widget _editDropdown(String label, String key, List<String> options) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: DropdownButtonFormField<String>(
        value: formData[key],
        decoration: InputDecoration(labelText: label),
        items: options
            .map((o) => DropdownMenuItem(value: o, child: Text(o)))
            .toList(),
        onChanged: (v) => setState(() => formData[key] = v),
      ),
    );
  }

  Widget _buildLocationSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          villagerLocation != null ? 'Your Location' : 'Add Your Location',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 8),
        SizedBox(
          height: 300,
          child: GoogleMap(
            initialCameraPosition: CameraPosition(
              target: villagerLocation ?? defaultCenter,
              zoom: villagerLocation != null ? 15 : 10,
            ),
            onMapCreated: (controller) => mapController = controller,
            markers: villagerLocation != null
                ? {
                    Marker(
                      markerId: MarkerId('villager'),
                      position: villagerLocation!,
                    ),
                  }
                : {},
            onTap: (latLng) {
              setState(() {
                latitude = latLng.latitude.toStringAsFixed(8);
                longitude = latLng.longitude.toStringAsFixed(8);
              });
            },
          ),
        ),
        SizedBox(height: 8),
        Text(
          'Click on the map to select a location or enter coordinates manually:',
        ),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                decoration: InputDecoration(labelText: 'Latitude'),
                initialValue: latitude,
                onChanged: (v) => latitude = v,
              ),
            ),
            SizedBox(width: 8),
            Expanded(
              child: TextFormField(
                decoration: InputDecoration(labelText: 'Longitude'),
                initialValue: longitude,
                onChanged: (v) => longitude = v,
              ),
            ),
          ],
        ),
        SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF921940),
              ),
              onPressed: updateLocation,
              child: Text(
                villagerLocation != null ? 'Update Location' : 'Save Location',
              ),
            ),
            SizedBox(width: 12),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF7a1632),
              ),
              onPressed: () => setState(() => locationMode = false),
              child: Text('Back to Profile'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActions() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: Color(0xFF7a1632)),
          onPressed: () => setState(() => editMode = true),
          child: Text('Edit Profile'),
        ),
        SizedBox(width: 8),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: Color(0xFF7a1632)),
          onPressed: () => setState(() => locationMode = true),
          child: Text(
            villagerLocation != null ? 'View/Update Location' : 'Add Location',
          ),
        ),
        SizedBox(width: 8),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: Color(0xFF7a1632)),
          onPressed: () => Navigator.pop(context),
          child: Text('Back to Dashboard'),
        ),
      ],
    );
  }
}
