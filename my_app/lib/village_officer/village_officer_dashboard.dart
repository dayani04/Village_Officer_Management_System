import 'package:flutter/material.dart';

class VillageOfficerDashboard extends StatefulWidget {
  const VillageOfficerDashboard({Key? key}) : super(key: key);

  @override
  State<VillageOfficerDashboard> createState() => _VillageOfficerDashboardState();
}

class _VillageOfficerDashboardState extends State<VillageOfficerDashboard> {
  int selectedIndex = 0;
  int? selectedSubIndex;

  final List<Map<String, dynamic>> sidebarSections = [
    {'title': 'Dashboard', 'icon': Icons.dashboard, 'hasSubmenu': false},
    {
      'title': 'Villagers',
      'icon': Icons.people,
      'hasSubmenu': true,
      'submenu': [
        {'title': 'Add Villager', 'route': '/add_villager'},
        {'title': 'Villagers', 'route': '/villagers'},
        {'title': 'Houses', 'route': '/villager_location_search'},
      ],
    },
    {
      'title': 'Requests',
      'icon': Icons.assignment,
      'hasSubmenu': true,
      'submenu': [
        {'title': 'Allowance', 'route': '/requests_for_allowances'},
        {'title': 'Certificate', 'route': '/requests_for_certificates'},
        {'title': 'ID Cards', 'route': '/requests_for_id_cards'},
        {'title': 'Permits', 'route': '/requests_for_permits'},
        {'title': 'Election', 'route': '/requests_for_elections'},
        {'title': 'Voter List', 'route': '/eligible_voters'},
      ],
    },
    {
      'title': 'Holders',
      'icon': Icons.verified_user,
      'hasSubmenu': true,
      'submenu': [
        {'title': 'Allowance', 'route': '/allowance_owners'},
        {'title': 'Permit', 'route': '/permits_owner'},
      ],
    },
    {
      'title': 'Village Officers',
      'icon': Icons.person_add,
      'hasSubmenu': false,
      'route': '/villager_officers',
    },
    {
      'title': 'Notifications',
      'icon': Icons.notifications,
      'hasSubmenu': false,
      'route': '/village_officer_notifications',
    },
    {
      'title': 'My Profile',
      'icon': Icons.account_circle,
      'hasSubmenu': false,
      'route': '/village_officer_profile',
    },
    {
      'title': 'Logout',
      'icon': Icons.logout,
      'hasSubmenu': false,
      'route': '/login',
    },
  ];

  Widget _buildSidebar() {
    return Container(
      width: 250,
      color: const Color(0xFF9C284F),
      child: ListView(
        children: [
          const SizedBox(height: 40),
          ...List.generate(sidebarSections.length, (index) {
            final section = sidebarSections[index];
            if (section['hasSubmenu'] == true) {
              return Theme(
                data: Theme.of(context).copyWith(
                  dividerColor: Colors.transparent,
                  splashColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                  hoverColor: Colors.white10,
                  unselectedWidgetColor: Colors.white,
                  colorScheme: const ColorScheme.light(primary: Colors.white),
                ),
                child: ExpansionTile(
                  leading: Icon(section['icon'], color: Colors.white),
                  title: Text(
                    section['title'],
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  backgroundColor: Colors.transparent,
                  collapsedBackgroundColor: Colors.transparent,
                  iconColor: Colors.white,
                  collapsedIconColor: Colors.white,
                  initiallyExpanded: selectedIndex == index,
                  children: [
                    ...List.generate(section['submenu'].length, (subIdx) {
                      return ListTile(
                        contentPadding: const EdgeInsets.only(
                          left: 56,
                          right: 16,
                        ),
                        title: Text(
                          section['submenu'][subIdx]['title'],
                          style: TextStyle(
                            color: selectedIndex == index &&
                                    selectedSubIndex == subIdx
                                ? const Color(0xFF9C284F)
                                : Colors.white,
                            fontWeight: selectedIndex == index &&
                                    selectedSubIndex == subIdx
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                        tileColor: selectedIndex == index &&
                                selectedSubIndex == subIdx
                            ? Colors.white24
                            : Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        onTap: () {
                          setState(() {
                            selectedIndex = index;
                            selectedSubIndex = subIdx;
                          });
                          Navigator.pushReplacementNamed(
                            context,
                            section['submenu'][subIdx]['route'],
                          );
                        },
                      );
                    }),
                  ],
                  onExpansionChanged: (expanded) {
                    if (expanded) {
                      setState(() {
                        selectedIndex = index;
                        selectedSubIndex = null;
                      });
                    }
                  },
                ),
              );
            } else {
              return ListTile(
                leading: Icon(section['icon'], color: Colors.white),
                title: Text(
                  section['title'],
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                selected: selectedIndex == index && selectedSubIndex == null,
                selectedTileColor: Colors.white24,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                onTap: () {
                  setState(() {
                    selectedIndex = index;
                    selectedSubIndex = null;
                  });
                  Navigator.pushReplacementNamed(
                    context,
                    section['route'] ?? '/village_officer_dashboard_home',
                  );
                },
              );
            }
          }),
        ],
      ),
    );
  }

  Widget _buildMainContent() {
    final section = sidebarSections[selectedIndex];
    if (section['hasSubmenu'] == true && selectedSubIndex != null) {
      final submenuTitle = section['submenu'][selectedSubIndex]['title'];
      return Center(
        child: Text(
          '$submenuTitle',
          style: const TextStyle(fontSize: 24),
        ),
      );
    }
    switch (selectedIndex) {
      case 0:
        return _dashboardCards();
      default:
        return Center(
          child: Text(
            section['title'],
            style: const TextStyle(fontSize: 24),
          ),
        );
    }
  }

  Widget _dashboardCards() {
    return Padding(
      padding: const EdgeInsets.all(32.0),
      child: GridView.count(
        crossAxisCount: 2,
        crossAxisSpacing: 24,
        mainAxisSpacing: 24,
        shrinkWrap: true,
        children: [
          _dashboardCard(
            'Requests',
            Icons.assignment,
            Colors.deepPurple,
            onTap: () {
              setState(() {
                selectedIndex = 2; // Index of "Requests"
                selectedSubIndex = null;
              });
              Navigator.pushReplacementNamed(
                context,
                '/requests_for_allowances',
              );
            },
          ),
          _dashboardCard(
            'Villagers',
            Icons.people,
            Colors.teal,
            onTap: () {
              setState(() {
                selectedIndex = 1; // Index of "Villagers"
                selectedSubIndex = 1; // Index of "Villagers" submenu
              });
              Navigator.pushReplacementNamed(context, '/villagers');
            },
          ),
          _dashboardCard(
            'Notifications',
            Icons.notifications,
            Colors.orange,
            onTap: () {
              setState(() {
                selectedIndex = 5; // Index of "Notifications"
                selectedSubIndex = null;
              });
              Navigator.pushReplacementNamed(
                context,
                '/village_officer_notifications',
              );
            },
          ),
          _dashboardCard(
            'Profile',
            Icons.account_circle,
            Colors.blueGrey,
            onTap: () {
              setState(() {
                selectedIndex = 6; // Index of "My Profile"
                selectedSubIndex = null;
              });
              Navigator.pushReplacementNamed(
                context,
                '/village_officer_profile',
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _dashboardCard(
    String title,
    IconData icon,
    Color color, {
    VoidCallback? onTap,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 48, color: color),
              const SizedBox(height: 16),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
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
      body: Row(
        children: [
          _buildSidebar(),
          Expanded(
            child: Container(
              color: const Color(0xFFF8F9FA),
              child: _buildMainContent(),
            ),
          ),
        ],
      ),
    );
  }
}