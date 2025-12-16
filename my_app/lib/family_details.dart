import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/app_theme.dart';

class FamilyDetailsPage extends StatefulWidget {
  const FamilyDetailsPage({super.key});

  @override
  State<FamilyDetailsPage> createState() => _FamilyDetailsPageState();
}

class _FamilyDetailsPageState extends State<FamilyDetailsPage> {
  bool loading = true;
  String? error;
  List<dynamic> familyMembers = [];
  String? currentUserAddress;

  @override
  void initState() {
    super.initState();
    fetchFamilyMembers();
  }

  Future<void> fetchFamilyMembers() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      // Fetch logged-in villager's profile
      final profileRes = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/profile'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (profileRes.statusCode != 200) {
        throw Exception('Failed to fetch profile');
      }
      final profile = jsonDecode(profileRes.body);
      final address = profile['Address'];
      final latitude = profile['Latitude'];
      final longitude = profile['Longitude'];
      final villagerId = profile['Villager_ID'];

      setState(() {
        currentUserAddress = address;
      });

      // Fetch all villagers
      final villagersRes = await http.get(
        Uri.parse('http://localhost:5000/api/villagers'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );
      if (villagersRes.statusCode != 200) {
        throw Exception('Failed to fetch villagers');
      }
      final allVillagers = jsonDecode(villagersRes.body);

      // Filter family members
      final family = allVillagers
          .where(
            (villager) =>
                villager['Address'] == address &&
                villager['Latitude'] == latitude &&
                villager['Longitude'] == longitude &&
                villager['Villager_ID'] != villagerId,
          )
          .toList();

      setState(() {
        familyMembers = family;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  Widget _buildFamilyMemberCard(Map<String, dynamic> villager, int index) {
    final isParticipant = villager['IsParticipant'] == 1 || villager['IsParticipant'] == true;
    final avatarLetter = (villager['Full_Name'] ?? 'U').toString().isNotEmpty 
        ? villager['Full_Name'][0].toUpperCase() 
        : 'U';
    
    return Container(
      margin: EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          colors: [
            Colors.white,
            Colors.grey.shade50,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF921940), Color(0xFF7a1632)],
                    ),
                    borderRadius: BorderRadius.circular(30),
                    boxShadow: [
                      BoxShadow(
                        color: Color(0xFF921940).withOpacity(0.3),
                        blurRadius: 8,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Text(
                      avatarLetter,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        villager['Full_Name'] ?? 'Unknown',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF2D3748),
                        ),
                      ),
                      SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on_outlined,
                            size: 16,
                            color: Color(0xFF921940),
                          ),
                          SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              villager['Address'] ?? 'N/A',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey.shade600,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isParticipant ? Colors.green.shade100 : Colors.grey.shade200,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        isParticipant ? Icons.how_to_vote : Icons.how_to_vote_outlined,
                        size: 14,
                        color: isParticipant ? Colors.green.shade700 : Colors.grey.shade600,
                      ),
                      SizedBox(width: 4),
                      Text(
                        isParticipant ? 'Voter' : 'Non-Voter',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: isParticipant ? Colors.green.shade700 : Colors.grey.shade600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  _buildInfoRow(
                    Icons.email_outlined,
                    'Email',
                    villager['Email'] ?? 'Not provided',
                  ),
                  SizedBox(height: 8),
                  _buildInfoRow(
                    Icons.phone_outlined,
                    'Phone',
                    villager['Phone_No'] ?? 'Not provided',
                  ),
                  SizedBox(height: 8),
                  _buildInfoRow(
                    Icons.gps_fixed_outlined,
                    'Location',
                    'Lat: ${villager['Latitude'] ?? 'N/A'}, Lng: ${villager['Longitude'] ?? 'N/A'}',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: Color(0xFF921940).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            size: 16,
            color: Color(0xFF921940),
          ),
        ),
        SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey.shade500,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                value,
                style: TextStyle(
                  fontSize: 14,
                  color: Color(0xFF2D3748),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton(String text, IconData icon, VoidCallback onPressed) {
    return Expanded(
      child: Container(
        height: 56,
        margin: EdgeInsets.symmetric(horizontal: 4),
        child: ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: Color(0xFF921940),
            foregroundColor: Colors.white,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 20),
              SizedBox(width: 8),
              Flexible(
                child: Text(
                  text,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Color(0xFF921940),
        foregroundColor: Colors.white,
        title: Row(
          children: [
            Icon(Icons.family_restroom, size: 24),
            SizedBox(width: 12),
            Text(
              'Family Members',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: fetchFamilyMembers,
            icon: Icon(Icons.refresh),
            tooltip: 'Refresh',
          ),
        ],
      ),
      body: loading
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF921940)),
                    strokeWidth: 3,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Loading family members...',
                    style: TextStyle(
                      color: Colors.grey.shade600,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            )
          : error != null
          ? Center(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Colors.red.shade400,
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Something went wrong',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.red.shade600,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      error!,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.grey.shade600,
                      ),
                    ),
                    SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: fetchFamilyMembers,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF921940),
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      ),
                      child: Text('Try Again'),
                    ),
                  ],
                ),
              ),
            )
          : Column(
              children: [
                if (currentUserAddress != null) ...[
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(20),
                    margin: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Color(0xFF921940), Color(0xFF7a1632)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Color(0xFF921940).withOpacity(0.3),
                          blurRadius: 12,
                          offset: Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.home, color: Colors.white, size: 24),
                            SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Current Address',
                                    style: TextStyle(
                                      color: Colors.white.withOpacity(0.8),
                                      fontSize: 14,
                                    ),
                                  ),
                                  Text(
                                    currentUserAddress!,
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 12),
                        Row(
                          children: [
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                '${familyMembers.length} Family Members',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
                SizedBox(height: 16),
                Expanded(
                  child: familyMembers.isEmpty
                      ? Center(
                          child: Padding(
                            padding: EdgeInsets.all(24),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.people_outline,
                                  size: 80,
                                  color: Colors.grey.shade400,
                                ),
                                SizedBox(height: 16),
                                Text(
                                  'No family members found',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.grey.shade600,
                                  ),
                                ),
                                SizedBox(height: 8),
                                Text(
                                  'No other family members are registered at your address.',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: Colors.grey.shade500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        )
                      : Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16),
                          child: ListView.builder(
                            physics: BouncingScrollPhysics(),
                            itemCount: familyMembers.length,
                            itemBuilder: (context, index) {
                              return _buildFamilyMemberCard(
                                familyMembers[index] as Map<String, dynamic>,
                                index,
                              );
                            },
                          ),
                        ),
                ),
                Container(
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 10,
                        offset: Offset(0, -2),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          _buildActionButton(
                            'New Born',
                            Icons.child_care,
                            () {
                              Navigator.pushNamed(
                                context,
                                '/family-new-born-request',
                              );
                            },
                          ),
                          _buildActionButton(
                            'Add Member',
                            Icons.person_add,
                            () {
                              Navigator.pushNamed(
                                context,
                                '/family-new-family-member-request',
                              );
                            },
                          ),
                        ],
                      ),
                      SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: OutlinedButton(
                          onPressed: () => Navigator.pop(context),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: Color(0xFF921940)),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.arrow_back, size: 20, color: Color(0xFF921940)),
                              SizedBox(width: 8),
                              Text(
                                'Back to Dashboard',
                                style: TextStyle(
                                  color: Color(0xFF921940),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
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
}
