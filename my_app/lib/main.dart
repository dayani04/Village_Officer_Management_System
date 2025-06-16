import 'package:flutter/material.dart';
import 'package:my_app/secretary/secretary_allowance_owners.dart';
import 'package:my_app/secretary/secretary_allowance_owners_view.dart' hide SecretaryAllowanceOwnersPage; // Ensure correct import
import 'login_page.dart';
import 'village_officer/village_officer_dashboard.dart';
import 'secretary/secretary_dashboard.dart';
import 'village_officer/village_officer_profile.dart';
import 'village_officer/villager_location_search.dart';
import 'village_officer/villagers.dart';
import 'village_officer/edit_villager.dart';
import 'village_officer/view_villager.dart';
import 'village_officer/add_villagers.dart';
import 'village_officer/villager_officer_list.dart';
import 'village_officer/add_villager_officer.dart';
import 'village_officer/edit_villager_officer.dart';
import 'village_officer/eligible_voters.dart';
import 'village_officer/allowance_owners.dart';
import 'village_officer/allowance_owners_details.dart';
import 'village_officer/requests_for_allowances.dart';
import 'village_officer/requests_for_allowances_villager_details.dart';
import 'village_officer/requests_for_elections.dart';
import 'village_officer/requests_for_elections_villager_details.dart';
import 'village_officer/requests_for_id_cards.dart';
import 'village_officer/requests_for_id_cards_villager_details.dart';
import 'village_officer/permits_owner.dart';
import 'village_officer/permits_owner_details.dart';
import 'village_officer/requests_for_permits.dart';
import 'village_officer/requests_for_permits_villager_details.dart';
import 'secretary/secretary_profile.dart';
import 'secretary/secretary_villager_officer_list.dart';
import 'secretary/edit_secretary_villager_officer.dart';
import 'secretary/add_secretary_villager_officer.dart';
import 'secretary/view_secretary_villager_officer.dart';
import 'secretary/view_secretary_villager.dart';
import 'secretary/secretary_villagers.dart';
import 'secretary/secretary_allowance_applications.dart';
import 'secretary/secretary_allowance_applications_villager_view.dart';
import 'secretary/secretary_election_applications.dart';
import 'secretary/secretary_election_applications_villager_view.dart';
import 'secretary/secretary_nic_applications.dart';
import 'secretary/secretary_nic_applications_villager_view.dart';
import 'secretary/secretary_permit_applications.dart';
import 'secretary/secretary_permit_applications_villager_view.dart';
import 'secretary/secretary_permits_owner.dart';
import 'secretary/secretary_permits_owner_view.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const LoginPage(),
      routes: {
        '/login': (context) => const LoginPage(),
        '/village_officer_dashboard_home': (context) =>
            const VillageOfficerDashboard(),
        '/village_officer/village_officer_dashboard': (context) =>
            const VillageOfficerDashboard(),
        '/secretary/secretary_dashboard': (context) =>
            const SecretaryDashboard(),
        '/village_officer_profile': (context) =>
            const VillageOfficerProfilePage(),
        '/villager_location_search': (context) =>
            const VillagerLocationSearch(),
        '/villagers': (context) => const VillagersPage(),
        '/add_villager': (context) => const AddVillagerPage(),
        '/villager_officers': (context) => const VillagerOfficerListPage(),
        '/add_villager_officer': (context) => const AddVillagerOfficerPage(),
        '/edit_villager_officer': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          String? officerId;
          if (args is Map && args['officerId'] != null) {
            officerId = args['officerId'] as String;
          } else if (args is String) {
            officerId = args;
          }
          return EditVillagerOfficerPage(officerId: officerId ?? '');
        },
        '/edit_villager': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          String? villagerId;
          if (args is Map && args['villagerId'] != null) {
            villagerId = args['villagerId'] as String;
          } else if (args is String) {
            villagerId = args;
          }
          return EditVillagerPage(villagerId: villagerId ?? '');
        },
        '/view_villager': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          String? villagerId;
          String? villageId;
          if (args is Map) {
            villagerId = args['villagerId'] as String?;
            villageId = args['villageId'] as String?;
          } else if (args is String) {
            villagerId = args;
            villageId = null;
          }
          return ViewVillagerPage(
            villagerId: villagerId ?? '',
            villageId: villageId ?? '',
          );
        },
        '/eligible_voters': (context) => const EligibleVotersPage(),
        '/allowance_owners': (context) => const AllowanceOwnersPage(),
        '/allowance_owners_details': (context) {
          final args =
              ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>?;
          final villagerId = args != null ? args['villagerId'] as String : '';
          return AllowanceOwnersDetailsPage(villagerId: villagerId);
        },
        '/requests_for_allowances': (context) => RequestsForAllowancesPage(),
        '/requests_for_allowances_villager_details': (context) =>
            RequestsForAllowancesVillagerDetailsPage(),
        '/requests_for_elections': (context) => RequestsForElectionsPage(),
        '/requests_for_elections_villager_details': (context) =>
            RequestsForElectionsVillagerDetailsPage(),
        '/requests_for_id_cards': (context) => RequestsForIDCardsPage(),
        '/requests_for_id_cards_villager_details': (context) =>
            RequestsForIDCardsVillagerDetailsPage(),
        '/permits_owner': (context) => PermitsOwnerPage(),
        '/permits_owner_details': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          String? villagerId;
          if (args is Map && args['villagerId'] != null) {
            villagerId = args['villagerId'] as String;
          } else if (args is String) {
            villagerId = args;
          }
          return PermitsOwnerDetailsPage();
        },
        '/requests_for_permits': (context) => RequestsForPermitsPage(),
        '/requests_for_permits_villager_details': (context) {
          final args =
              ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
          final villagerId = args != null ? args['villagerId'] as String : '';
          return RequestsForPermitsVillagerDetailsPage(villagerId: villagerId);
        },
        '/requests_for_certificates': (context) => const Placeholder(),
        '/village_officer_notifications': (context) => const Placeholder(),
        '/secretary_profile': (context) => SecretaryProfilePage(),
        '/secretary_villager_officer_list': (context) =>
            const SecretaryVillagerOfficerListPage(),
        '/edit_secretary_villager_officer': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          final String? officerId;
          if (args is Map && args['officerId'] != null) {
            officerId = args['officerId'] as String;
          } else if (args is String) {
            officerId = args;
          } else {
            officerId = null;
          }
          return EditSecretaryVillagerOfficerPage(officerId: officerId ?? '');
        },
        '/add_secretary_villager_officer': (context) =>
            const AddSecretaryVillagerOfficerPage(),
        '/view_secretary_villager_officer': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          final String? officerId;
          if (args is Map && args['officerId'] != null) {
            officerId = args['officerId'] as String;
          } else if (args is String) {
            officerId = args;
          } else {
            officerId = null;
          }
          return ViewSecretaryVillagerOfficerPage(officerId: officerId ?? '');
        },
        '/view_secretary_villager': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          final String? villagerId;
          if (args is Map && args['villagerId'] != null) {
            villagerId = args['villagerId'] as String;
          } else if (args is String) {
            villagerId = args;
          } else {
            villagerId = null;
          }
          return ViewSecretaryVillagerPage(villagerId: villagerId ?? '');
        },
        '/secretary_villagers': (context) => const SecretaryVillagersPage(),
        '/secretary_allowance_applications': (context) =>
            const SecretaryAllowanceApplicationsPage(),
        '/secretary_allowance_applications_villager_view': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          final String? villagerId;
          if (args is Map && args['villagerId'] != null) {
            villagerId = args['villagerId'] as String;
          } else if (args is String) {
            villagerId = args;
          } else {
            villagerId = null;
          }
          return SecretaryAllowanceApplicationsVillagerViewPage(
            villagerId: villagerId ?? '',
          );
        },
        '/secretary_allowance_owners': (context) =>
            const SecretaryAllowanceOwnersPage(),
        '/secretary_election_applications': (context) =>
            const SecretaryElectionApplicationsPage(),
        '/secretary_election_applications_villager_view': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          final String? villagerId;
          if (args is Map && args['villagerId'] != null) {
            villagerId = args['villagerId'] as String;
          } else if (args is String) {
            villagerId = args;
          } else {
            villagerId = null;
          }
          return SecretaryElectionApplicationsVillagerView(
            villagerId: villagerId ?? '',
          );
        },
        '/secretary_nic_applications': (context) =>
            const SecretaryNICApplicationsPage(),
        '/secretary_nic_applications_villager_view': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          final String? villagerId;
          if (args is Map && args['villagerId'] != null) {
            villagerId = args['villagerId'] as String;
          } else if (args is String) {
            villagerId = args;
          } else {
            villagerId = null;
          }
          return SecretaryNICApplicationsVillagerViewPage(
            villagerId: villagerId ?? '',
          );
        },
        '/secretary_permit_applications': (context) =>
            const SecretaryPermitApplicationsPage(),
        '/secretary_permit_applications_villager_view': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          final String? villagerId;
          if (args is Map && args['villagerId'] != null) {
            villagerId = args['villagerId'] as String;
          } else if (args is String) {
            villagerId = args;
          } else {
            villagerId = null;
          }
          return SecretaryPermitApplicationsVillagerViewPage(
            villagerId: villagerId ?? '',
          );
        },
        '/secretary_permits_owner': (context) =>
            const SecretaryPermitsOwnerPage(),
        '/secretary_permits_owner_view': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          final String? villagerId;
          if (args is Map && args['villagerId'] != null) {
            villagerId = args['villagerId'] as String;
          } else if (args is String) {
            villagerId = args;
          } else {
            villagerId = null;
          }
          return SecretaryPermitsOwnerViewPage(villagerId: villagerId ?? '');
        },
        '/secretary_allowance_owners_view': (context) {
          final args = ModalRoute.of(context)!.settings.arguments;
          final String? villagerId;
          if (args is Map && args['villagerId'] != null) {
            villagerId = args['villagerId'] as String;
          } else if (args is String) {
            villagerId = args;
          } else {
            villagerId = null;
          }
          return SecretaryAllowanceOwnersViewPage(villagerId: villagerId ?? '');
        },
      },
    );
  }
  
  SecretaryAllowanceOwnersViewPage({required String villagerId}) {}
}