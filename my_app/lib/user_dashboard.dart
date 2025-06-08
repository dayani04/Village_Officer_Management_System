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
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => UserPermitCertificatesPage()),
      );
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
    } else {
      Navigator.pushNamed(context, route);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage('/background.jpg'), // Place your image in assets
            fit: BoxFit.cover,
          ),
        ),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
          child: ListView(
            padding: EdgeInsets.all(20),
            children: [
              Text(
                t('personalInformation'),
                style: Theme.of(context).textTheme.titleLarge,
              ),
              SizedBox(height: 12),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                children: [
                  _dashboardCard(
                    context,
                    imageUrl:
                        "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
                    label: t('editProfile'),
                    route: '/user_profile',
                  ),
                  _dashboardCard(
                    context,
                    imageUrl:
                        "https://img.freepik.com/premium-photo/happy-young-sri-lankan-family-family-portrait_1106493-124766.jpg",
                    label: t('familyDetails'),
                    route: '/family_details',
                  ),
                  _dashboardCard(
                    context,
                    imageUrl:
                        "https://www.shutterstock.com/image-photo/woman-holding-megaphone-speaker-on-600nw-2502342615.jpg",
                    label: t('announcement'),
                    route: '/notification',
                  ),
                  _dashboardCard(
                    context,
                    imageUrl:
                        "https://cdn-icons-png.freepik.com/512/7132/7132557.png",
                    label: t('permitcertificates'),
                    route: '/user_permit_certificates',
                  ),
                  _dashboardCard(
                    context,
                    imageUrl:
                        "https://www.cookieyes.com/wp-content/uploads/2022/05/Privacy-policy-01-1.png",
                    label: t('approvedvillageofficerceritificates'),
                    route: '/privacy_policy',
                  ),
                ],
              ),
              SizedBox(height: 32),
              Text(
                t('applicationProcesses'),
                style: Theme.of(context).textTheme.titleLarge,
              ),
              SizedBox(height: 12),
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                children: [
                  _dashboardCard(
                    context,
                    imageUrl:
                        "https://dwtyzx6upklss.cloudfront.net/Pictures/2000xAny/3/5/7/21357_pri_boardelections_hero_777797.png",
                    label: t('applyElection'),
                    route: '/user_election',
                  ),
                  _dashboardCard(
                    context,
                    imageUrl:
                        "https://hermoney.com/wp-content/uploads/2021/10/cute-little-girl-holding-coin-of-money-and-put-in-pink-piggy-bank-with-blur-background-subject-is_t20_B8QV8K-840x487.jpg",
                    label: t('applyAllowance'),
                    route: '/user_allowances',
                  ),
                  _dashboardCard(
                    context,
                    imageUrl:
                        "https://www.cal-pacs.org/wp-content/uploads/2015/04/workpermit-scaled.jpeg",
                    label: t('applyPermit'),
                    route: '/user_permits',
                  ),
                  _dashboardCard(
                    context,
                    imageUrl:
                        "https://memberclicks.com/wp-content/uploads/2021/12/membership-certificate-1-scaled.jpg",
                    label: t('applyCertificate'),
                    route: '/user_certificates',
                  ),
                  _dashboardCard(
                    context,
                    imageUrl:
                        "https://colombotimes.lk/data/202308/1693292532_6126010NIC.jpg",
                    label: t('applyIDCard'),
                    route: '/user_id_card',
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _dashboardCard(
    BuildContext context, {
    required String imageUrl,
    required String label,
    required String route,
  }) {
    return Card(
      elevation: 3,
      child: InkWell(
        onTap: () => _navigate(context, route),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.network(imageUrl, height: 60, width: 60, fit: BoxFit.cover),
            SizedBox(height: 10),
            Text(label, textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  }
}
