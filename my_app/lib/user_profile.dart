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
        body: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF921940),
                Color(0xFF6D1841),
                Color(0xFF4A0F2E),
              ],
            ),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  'Loading Profile...',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }
    if (profile == null) {
      return Scaffold(
        body: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Color(0xFF921940),
                Color(0xFF6D1841),
                Color(0xFF4A0F2E),
              ],
            ),
          ),
          child: Center(
            child: Container(
              padding: EdgeInsets.all(24),
              margin: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.error_outline,
                    color: Color(0xFF921940),
                    size: 48,
                  ),
                  SizedBox(height: 16),
                  Text(
                    error ?? 'No profile found',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 16,
                      color: Color(0xFF2D2D2D),
                    ),
                  ),
                  SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF921940),
                    ),
                    child: Text('Back', style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    }

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF921940),
              Color(0xFF6D1841),
              Color(0xFF4A0F2E),
            ],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: EdgeInsets.all(20),
                child: Row(
                  children: [
                    Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: IconButton(
                        icon: Icon(Icons.arrow_back, color: Colors.white),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        'My Profile',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              
              // Profile Content
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(30),
                      topRight: Radius.circular(30),
                    ),
                  ),
                  child: SingleChildScrollView(
                    padding: EdgeInsets.all(20),
                    child: Column(
                      children: [
                        // Profile Header Card
                        _buildProfileHeader(),
                        SizedBox(height: 24),
                        
                        // Error Message
                        if (error != null)
                          Container(
                            padding: EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.red.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                Icon(Icons.error_outline, color: Colors.red, size: 20),
                                SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    error!,
                                    style: TextStyle(color: Colors.red, fontSize: 14),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        
                        if (error != null) SizedBox(height: 16),
                        
                        // Content based on mode
                        if (editMode)
                          _buildEditForm()
                        else if (locationMode)
                          _buildLocationSection()
                        else
                          _buildProfileDetails(),
                        
                        SizedBox(height: 24),
                        
                        // Action Buttons
                        _buildActions(),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileHeader() {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF921940), Color(0xFF6D1841)],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.person,
              size: 40,
              color: Colors.white,
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  profile!['Full_Name'] ?? 'Unknown',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'ID: ${profile!['Villager_ID']}',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.8),
                    fontSize: 14,
                  ),
                ),
                SizedBox(height: 4),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    profile!['Status'] ?? 'Unknown',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileDetails() {
    return Column(
      children: [
        _infoCard('Personal Information', [
          _infoItem('Full Name', profile!['Full_Name']),
          _infoItem('Email', profile!['Email']),
          _infoItem('Phone Number', profile!['Phone_No']),
          _infoItem('NIC', profile!['NIC'] ?? 'N/A'),
          _infoItem('Date of Birth', profile!['DOB'] ?? 'N/A'),
        ]),
        
        SizedBox(height: 16),
        
        _infoCard('Location Information', [
          _infoItem('Address', profile!['Address'] ?? 'N/A'),
          _infoItem('Regional Division', profile!['RegionalDivision'] ?? 'N/A'),
          _infoItem('Area ID', profile!['Area_ID']?.toString() ?? 'N/A'),
          _infoItem(
            'Location',
            villagerLocation != null
                ? 'Lat: ${villagerLocation!.latitude.toStringAsFixed(4)}, Lng: ${villagerLocation!.longitude.toStringAsFixed(4)}'
                : 'Not set',
          ),
        ]),
        
        SizedBox(height: 16),
        
        _infoCard('Additional Information', [
          _infoItem('Job', profile!['Job'] ?? 'N/A'),
          _infoItem('Gender', profile!['Gender'] ?? 'N/A'),
          _infoItem('Marital Status', profile!['Marital_Status'] ?? 'N/A'),
          _infoItem('Alive Status', profile!['Alive_Status'] ?? 'N/A'),
          _infoItem(
            'Election Participant',
            profile!['IsParticipant'] == true ? 'Yes' : 'No',
          ),
        ]),
      ],
    );
  }

  Widget _infoCard(String title, List<Widget> children) {
    return Container(
      decoration: BoxDecoration(
        color: Color(0xFFF8F9FA),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Color(0xFF921940).withOpacity(0.1),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
              ),
            ),
            child: Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF921940),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(children: children),
          ),
        ],
      ),
    );
  }

  Widget _infoItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: Color(0xFF666666),
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                color: Color(0xFF2D2D2D),
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEditForm() {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Color(0xFFF8F9FA),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Edit Profile',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF921940),
            ),
          ),
          SizedBox(height: 20),
          
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
          
          SizedBox(height: 16),
          
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Text(
                  'Upcoming Election Participant:',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF2D2D2D),
                  ),
                ),
                Spacer(),
                Switch(
                  value: formData['is_election_participant'] ?? false,
                  onChanged: (v) => setState(() => formData['is_election_participant'] = v),
                  activeColor: Color(0xFF921940),
                ),
              ],
            ),
          ),
          
          SizedBox(height: 16),
          
          // Location coordinates
          Text(
            'Location Coordinates',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: Color(0xFF2D2D2D),
            ),
          ),
          SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: TextFormField(
                    decoration: InputDecoration(
                      labelText: 'Latitude',
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.all(12),
                    ),
                    initialValue: latitude,
                    keyboardType: TextInputType.numberWithOptions(decimal: true),
                    onChanged: (v) => setState(() => latitude = v),
                  ),
                ),
              ),
              SizedBox(width: 8),
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: TextFormField(
                    decoration: InputDecoration(
                      labelText: 'Longitude',
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.all(12),
                    ),
                    initialValue: longitude,
                    keyboardType: TextInputType.numberWithOptions(decimal: true),
                    onChanged: (v) => setState(() => longitude = v),
                  ),
                ),
              ),
            ],
          ),
          
          SizedBox(height: 24),
          
          // Action Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF921940),
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: updateProfile,
                  child: Text(
                    'Save Changes',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF6C757D),
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: () => setState(() => editMode = false),
                  child: Text(
                    'Cancel',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _editTextField(String label, String key) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
        ),
        child: TextFormField(
          decoration: InputDecoration(
            labelText: label,
            border: InputBorder.none,
            contentPadding: EdgeInsets.all(12),
          ),
          initialValue: formData[key] ?? '',
          onChanged: (v) => formData[key] = v,
        ),
      ),
    );
  }

  Widget _editDropdown(String label, String key, List<String> options) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8),
        ),
        child: DropdownButtonFormField<String>(
          value: formData[key],
          decoration: InputDecoration(
            labelText: label,
            border: InputBorder.none,
            contentPadding: EdgeInsets.all(12),
          ),
          items: options
              .map((o) => DropdownMenuItem(value: o, child: Text(o)))
              .toList(),
          onChanged: (v) => setState(() => formData[key] = v),
        ),
      ),
    );
  }

  Widget _buildLocationSection() {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Color(0xFFF8F9FA),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            villagerLocation != null ? 'Update Location' : 'Add Location',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF921940),
            ),
          ),
          SizedBox(height: 16),
          
          Container(
            height: 300,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
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
          ),
          
          SizedBox(height: 16),
          
          Text(
            'Click on the map to select a location or enter coordinates manually:',
            style: TextStyle(
              color: Color(0xFF666666),
              fontSize: 14,
            ),
          ),
          
          SizedBox(height: 12),
          
          Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: TextFormField(
                    decoration: InputDecoration(
                      labelText: 'Latitude',
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.all(12),
                    ),
                    initialValue: latitude,
                    onChanged: (v) => latitude = v,
                  ),
                ),
              ),
              SizedBox(width: 8),
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: TextFormField(
                    decoration: InputDecoration(
                      labelText: 'Longitude',
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.all(12),
                    ),
                    initialValue: longitude,
                    onChanged: (v) => longitude = v,
                  ),
                ),
              ),
            ],
          ),
          
          SizedBox(height: 24),
          
          // Action Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF921940),
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: updateLocation,
                  child: Text(
                    villagerLocation != null ? 'Update Location' : 'Save Location',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF6C757D),
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  onPressed: () => setState(() => locationMode = false),
                  child: Text(
                    'Back to Profile',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActions() {
    return Row(
      children: [
        Expanded(
          child: Container(
            height: 50,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF921940), Color(0xFF6D1841)],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () => setState(() => editMode = true),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.edit, size: 18, color: Colors.white),
                  SizedBox(width: 8),
                  Text(
                    'Edit Profile',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        SizedBox(width: 12),
        Expanded(
          child: Container(
            height: 50,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF2196F3), Color(0xFF1976D2)],
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onPressed: () => setState(() => locationMode = true),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.location_on, size: 18, color: Colors.white),
                  SizedBox(width: 8),
                  Text(
                    villagerLocation != null ? 'Update Location' : 'Add Location',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
