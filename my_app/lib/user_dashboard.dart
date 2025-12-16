import 'dart:ui';

import 'package:flutter/material.dart';
import 'user_profile.dart';
import 'family_details.dart';
import 'notification.dart';
import 'user_permit_certificates.dart';
import 'user_permits.dart';
import 'user_idcard.dart';
import 'user_election.dart';
import 'user_allowances.dart';

class UserDashboard extends StatelessWidget {
  const UserDashboard({super.key});

  // Dummy translation function (replace with your localization logic)
  String t(String key) {
    // You can use intl or easy_localization for real translations
    switch (key) {
      case 'welcomeMessage':
        return 'Welcome to the User Dashboard!';
      case 'personalInformation':
        return 'Personal Information';
      case 'editProfile':
        return 'Edit Profile';
      case 'familyDetails':
        return 'Family Details';
      case 'announcement':
        return 'Announcement';
      case 'permitcertificates':
        return 'Permit Certificates';
      case 'approvedvillageofficerceritificates':
        return 'Approved Village Officer Certificates';
      case 'applicationProcesses':
        return 'Application Processes';
      case 'applyElection':
        return 'Apply for Election';
      case 'applyAllowance':
        return 'Apply for Allowance';
      case 'applyPermit':
        return 'Apply for Permit';
      case 'applyCertificate':
        return 'Apply for Certificate';
      case 'applyIDCard':
        return 'Apply for ID Card';
      default:
        return key;
    }
  }

  void _navigate(BuildContext context, String route) {
    if (route == '/user_profile') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => UserProfilePage()),
      );
    } else if (route == '/family_details') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => FamilyDetailsPage()),
      );
    } else if (route == '/user_permit_certificates') {
      Navigator.pushNamed(context, '/user_certificates_download');
    } else if (route == '/user_permits') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => UserPermitsPage()),
      );
    } else if (route == '/user_id_card') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => UserIDCardPage()),
      );
    } else if (route == '/user_election') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => UserElectionPage()),
      );
    } else if (route == '/user_allowances') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => UserAllowancesPage()),
      );
    } else if (route == '/notification') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => NotificationPage()),
      );
    } else {
      Navigator.pushNamed(context, route);
    }
  }

  @override
  Widget build(BuildContext context) {
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
                      padding: EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.dashboard,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Dashboard',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'Welcome back!',
                            style: TextStyle(
                              color: Colors.white.withOpacity(0.8),
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.notifications_outlined,
                        color: Colors.white,
                        size: 24,
                      ),
                    ),
                  ],
                ),
              ),
              
              // Main Content
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(30),
                      topRight: Radius.circular(30),
                    ),
                  ),
                  child: ListView(
                    padding: EdgeInsets.all(20),
                    children: [
                      // Quick Actions Section
                      _buildSectionHeader('Quick Actions'),
                      SizedBox(height: 16),
                      _buildQuickActions(context),
                      SizedBox(height: 24),
                      
                      // Services Section
                      _buildSectionHeader(t('services')),
                      SizedBox(height: 12),
                      _buildServicesGrid(context),
                      SizedBox(height: 24),
                      
                      // Applications Section
                      _buildSectionHeader(t('applicationProcesses')),
                      SizedBox(height: 12),
                      _buildApplicationsGrid(context),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 24,
          decoration: BoxDecoration(
            color: Color(0xFF921940),
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        SizedBox(width: 12),
        Text(
          title,
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF2D2D2D),
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _modernCard(
            context: context,
            icon: Icons.person,
            label: t('editProfile'),
            color: Color(0xFF4CAF50),
            onTap: () => _navigate(context, '/user_profile'),
          ),
        ),
        SizedBox(width: 12),
        Expanded(
          child: _modernCard(
            context: context,
            icon: Icons.family_restroom,
            label: t('familyDetails'),
            color: Color(0xFF2196F3),
            onTap: () => _navigate(context, '/family_details'),
          ),
        ),
      ],
    );
  }

  Widget _buildServicesGrid(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.2,
      children: [
        _modernCard(
          context: context,
          icon: Icons.notifications_active,
          label: t('announcement'),
          color: Color(0xFFFF9800),
          onTap: () => _navigate(context, '/notification'),
        ),
        _modernCard(
          context: context,
          icon: Icons.card_membership,
          label: t('permitcertificates'),
          color: Color(0xFF9C27B0),
          onTap: () => _navigate(context, '/user_permit_certificates'),
        ),
      ],
    );
  }

  Widget _buildApplicationsGrid(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.2,
      children: [
        _modernCard(
          context: context,
          icon: Icons.how_to_vote,
          label: t('applyElection'),
          color: Color(0xFFE91E63),
          onTap: () => _navigate(context, '/user_election'),
        ),
        _modernCard(
          context: context,
          icon: Icons.savings,
          label: t('applyAllowance'),
          color: Color(0xFF00BCD4),
          onTap: () => _navigate(context, '/user_allowances'),
        ),
        _modernCard(
          context: context,
          icon: Icons.app_registration,
          label: t('applyPermit'),
          color: Color(0xFF795548),
          onTap: () => _navigate(context, '/user_permits'),
        ),
        _modernCard(
          context: context,
          icon: Icons.description,
          label: t('applyCertificate'),
          color: Color(0xFF607D8B),
          onTap: () => _navigate(context, '/user_certificates'),
        ),
        _modernCard(
          context: context,
          icon: Icons.badge,
          label: t('applyIDCard'),
          color: Color(0xFF3F51B5),
          onTap: () => _navigate(context, '/user_id_card'),
        ),
      ],
    );
  }

  Widget _modernCard({
    required BuildContext context,
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: color,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    icon,
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                SizedBox(height: 12),
                Text(
                  label,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF2D2D2D),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
