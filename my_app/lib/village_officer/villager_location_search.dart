import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'village_officer_sidebar.dart';

class VillagerLocationSearch extends StatefulWidget {
  const VillagerLocationSearch({super.key});

  @override
  _VillagerLocationSearchState createState() => _VillagerLocationSearchState();
}

class _VillagerLocationSearchState extends State<VillagerLocationSearch> {
  List villagers = [];
  List filteredVillagers = [];
  String searchAddress = '';
  LatLng? mapCenter;
  bool loading = true;
  String? error;
  GoogleMapController? mapController;
  Map<String, List> locationMap = {};
  Map<String, dynamic>? selectedLocation;

  final LatLng defaultCenter = LatLng(6.9271, 79.8612);

  @override
  void initState() {
    super.initState();
    fetchVillagers();
  }

  Future<void> fetchVillagers() async {
    setState(() {
      loading = true;
    });
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final response = await http.get(
        Uri.parse('http://localhost:5000/api/villagers/'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final validVillagers = data
            .where(
              (v) =>
                  v['Latitude'] != null &&
                  v['Longitude'] != null &&
                  double.tryParse(v['Latitude'].toString()) != null &&
                  double.tryParse(v['Longitude'].toString()) != null,
            )
            .toList();
        setState(() {
          villagers = validVillagers;
          filteredVillagers = validVillagers;
          mapCenter = defaultCenter;
          loading = false;
        });
        groupVillagersByLocation();
      } else {
        setState(() {
          error = 'Failed to fetch villagers';
          loading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to fetch villagers';
        loading = false;
      });
    }
  }

  void groupVillagersByLocation() {
    locationMap.clear();
    for (var v in filteredVillagers) {
      final key = '${v['Latitude']},${v['Longitude']}';
      if (!locationMap.containsKey(key)) locationMap[key] = [];
      locationMap[key]!.add(v);
    }
  }

  void handleSearch(String address) {
    setState(() {
      searchAddress = address;
      if (address.trim().isEmpty) {
        filteredVillagers = villagers;
        mapCenter = defaultCenter;
      } else {
        filteredVillagers = villagers
            .where(
              (v) => (v['Address'] ?? '').toLowerCase().contains(
                address.toLowerCase(),
              ),
            )
            .toList();
        if (filteredVillagers.isNotEmpty) {
          mapCenter = LatLng(
            double.parse(filteredVillagers[0]['Latitude'].toString()),
            double.parse(filteredVillagers[0]['Longitude'].toString()),
          );
        }
      }
      groupVillagersByLocation();
      selectedLocation = null;
    });
    if (mapController != null && mapCenter != null) {
      mapController!.animateCamera(CameraUpdate.newLatLng(mapCenter!));
    }
  }

  void handleMarkerTap(String key) {
    final villagersAtLocation = locationMap[key]!;
    final latLng = key.split(',').map((e) => double.parse(e)).toList();
    setState(() {
      selectedLocation = {
        'lat': latLng[0],
        'lng': latLng[1],
        'villagers': villagersAtLocation,
      };
      mapCenter = LatLng(latLng[0], latLng[1]);
    });
    if (mapController != null) {
      mapController!.animateCamera(CameraUpdate.newLatLng(mapCenter!));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          VillageOfficerSidebar(
            selectedIndex: 2,
          ), // 2 for location search section
          Expanded(
            child: Column(
              children: [
                AppBar(
                  title: Text('Villager Locations'),
                  backgroundColor: Color(0xFF921940),
                  automaticallyImplyLeading: false,
                ),
                if (loading)
                  Expanded(child: Center(child: CircularProgressIndicator()))
                else if (error != null)
                  Expanded(child: Center(child: Text(error!)))
                else ...[
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: TextField(
                      decoration: InputDecoration(
                        labelText: 'Search by Address',
                        border: OutlineInputBorder(),
                      ),
                      onChanged: handleSearch,
                    ),
                  ),
                  Expanded(
                    child: Row(
                      children: [
                        Expanded(
                          flex: 2,
                          child: GoogleMap(
                            initialCameraPosition: CameraPosition(
                              target: mapCenter ?? defaultCenter,
                              zoom: 10,
                            ),
                            onMapCreated: (controller) {
                              mapController = controller;
                            },
                            markers: locationMap.entries.map((entry) {
                              final key = entry.key;
                              final latLng = key
                                  .split(',')
                                  .map((e) => double.parse(e))
                                  .toList();
                              return Marker(
                                markerId: MarkerId(key),
                                position: LatLng(latLng[0], latLng[1]),
                                onTap: () => handleMarkerTap(key),
                              );
                            }).toSet(),
                          ),
                        ),
                        if (searchAddress.isNotEmpty &&
                            filteredVillagers.isNotEmpty)
                          Expanded(
                            flex: 1,
                            child: Container(
                              margin: EdgeInsets.all(8),
                              padding: EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Color(0xFFF9F9F9),
                                borderRadius: BorderRadius.circular(8),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 4,
                                  ),
                                ],
                              ),
                              child: ListView(
                                children: [
                                  Text(
                                    'Villagers Matching "$searchAddress"',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  ...filteredVillagers.map(
                                    (v) => Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        SizedBox(height: 8),
                                        Text(
                                          v['Full_Name'] ?? '',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Text(
                                          'Address: ${v['Address'] ?? 'N/A'}',
                                        ),
                                        Text('Email: ${v['Email'] ?? ''}'),
                                        Text('Phone: ${v['Phone_No'] ?? ''}'),
                                        Text(
                                          'Coordinates: Lat: ${v['Latitude']}, Lng: ${v['Longitude']}',
                                        ),
                                        Text(
                                          'Election Participate: ${v['IsParticipant'] == 1 ? 'Yes' : 'No'}',
                                        ),
                                        Divider(),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  if (selectedLocation != null)
                    Container(
                      padding: EdgeInsets.all(12),
                      color: Colors.white,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Villagers at ${selectedLocation!['villagers'][0]['Address'] ?? 'this Location'}',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          ...selectedLocation!['villagers'].map<Widget>(
                            (v) => Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  v['Full_Name'] ?? '',
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                Text('Address: ${v['Address'] ?? 'N/A'}'),
                                Text('Email: ${v['Email'] ?? ''}'),
                                Text('Phone: ${v['Phone_No'] ?? ''}'),
                                Text(
                                  'Coordinates: Lat: ${v['Latitude']}, Lng: ${v['Longitude']}',
                                ),
                                Text(
                                  'Election Participate: ${v['IsParticipant'] == 1 ? 'Yes' : 'No'}',
                                ),
                                Divider(),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFF921940),
                      ),
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: Text('Back to Dashboard'),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
