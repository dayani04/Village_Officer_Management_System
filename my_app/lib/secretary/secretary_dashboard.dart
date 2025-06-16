import 'package:flutter/material.dart';

class SecretaryDashboard extends StatefulWidget {
  const SecretaryDashboard({Key? key}) : super(key: key);

  @override
  State<SecretaryDashboard> createState() => _SecretaryDashboardState();
}

class _SecretaryDashboardState extends State<SecretaryDashboard> {
  int selectedIndex = 0;
  int? selectedSubIndex;

  final List<Map<String, dynamic>> sidebarSections = [
    {
      'title': 'Dashboard',
      'icon': Icons.dashboard,
      'hasSubmenu': false,
      'route': '/secretary_dashboard_home',
    },
    {
      'title': 'Villagers',
      'icon': Icons.people,
      'hasSubmenu': true,
      'submenu': [
        {'title': 'Villagers', 'route': '/secretary_villagers'},
      ],
    },
    {
      'title': 'Requests',
      'icon': Icons.assignment,
      'hasSubmenu': true,
      'submenu': [
        {'title': 'Allowance', 'route': '/secretary_allowance_applications'},
        {'title': 'ID Cards', 'route': '/secretary_nic_applications'},
        {'title': 'Permits', 'route': '/secretary_permit_applications'},
        {'title': 'Election', 'route': '/secretary_election_applications'},
      ],
    },
    {
      'title': 'Holders',
      'icon': Icons.verified_user,
      'hasSubmenu': true,
      'submenu': [
        {'title': 'Allowance', 'route': '/secretary_allowance_owners'},
        {'title': 'Permit', 'route': '/secretary_permits_owner'},
      ],
    },
    {
      'title': 'Election Holders',
      'icon': Icons.how_to_vote,
      'hasSubmenu': false,
      'route': '/secretary_election_holders',
    },
    {
      'title': 'Village Officer',
      'icon': Icons.person_add,
      'hasSubmenu': false,
      'route': '/secretary_villager_officer_list',
    },
    {
      'title': 'Notifications',
      'icon': Icons.notifications,
      'hasSubmenu': false,
      'route': '/secretary_notifications',
    },
    {
      'title': 'My Profile',
      'icon': Icons.account_circle,
      'hasSubmenu': false,
      'route': '/secretary_profile',
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
                      final submenu = section['submenu'][subIdx];
                      return ListTile(
                        contentPadding: const EdgeInsets.only(
                          left: 56,
                          right: 16,
                        ),
                        title: Text(
                          submenu['title'],
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
                            submenu['route'],
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
                    section['route'],
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
                selectedSubIndex = 0; // Index of "Allowance" submenu
              });
              Navigator.pushReplacementNamed(
                context,
                '/secretary_allowance_applications',
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
                selectedSubIndex = 0; // Index of "Villagers" submenu
              });
              Navigator.pushReplacementNamed(context, '/secretary_villagers');
            },
          ),
          _dashboardCard(
            'Notifications',
            Icons.notifications,
            Colors.orange,
            onTap: () {
              setState(() {
                selectedIndex = 6; // Index of "Notifications"
                selectedSubIndex = null;
              });
              Navigator.pushReplacementNamed(context, '/secretary_notifications');
            },
          ),
          _dashboardCard(
            'Profile',
            Icons.account_circle,
            Colors.blueGrey,
            onTap: () {
              setState(() {
                selectedIndex = 7; // Index of "My Profile"
                selectedSubIndex = null;
              });
              Navigator.pushReplacementNamed(context, '/secretary_profile');
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