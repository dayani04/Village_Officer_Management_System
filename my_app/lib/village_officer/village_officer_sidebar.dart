import 'package:flutter/material.dart';

class VillageOfficerSidebar extends StatelessWidget {
  final int selectedIndex;
  final int? selectedSubIndex;
  final Function(int, [int?])? onSelect;

  const VillageOfficerSidebar({
    Key? key,
    required this.selectedIndex,
    this.selectedSubIndex,
    this.onSelect,
  }) : super(key: key);

  static final List<Map<String, dynamic>> sidebarSections = [
    {
      'title': 'Dashboard',
      'icon': Icons.dashboard,
      'hasSubmenu': false,
      'route': '/village_officer_dashboard_home',
    },
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

  @override
  Widget build(BuildContext context) {
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
                            color:
                                selectedIndex == index &&
                                    selectedSubIndex == subIdx
                                ? const Color(0xFF9C284F)
                                : Colors.white,
                            fontWeight:
                                selectedIndex == index &&
                                    selectedSubIndex == subIdx
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                        tileColor:
                            selectedIndex == index && selectedSubIndex == subIdx
                            ? Colors.white24
                            : Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        onTap: () {
                          if (onSelect != null) {
                            onSelect!(index, subIdx);
                          } else {
                            Navigator.pushReplacementNamed(
                              context,
                              section['submenu'][subIdx]['route'],
                            );
                          }
                        },
                      );
                    }),
                  ],
                  onExpansionChanged: (expanded) {
                    if (expanded && onSelect != null) {
                      onSelect!(index, null);
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
                  if (onSelect != null) {
                    onSelect!(index, null);
                  } else {
                    Navigator.pushReplacementNamed(
                      context,
                      section['route'] ?? '/village_officer_dashboard_home',
                    );
                  }
                },
              );
            }
          }),
        ],
      ),
    );
  }
}
