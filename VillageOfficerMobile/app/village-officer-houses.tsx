import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import { fetchVillagers } from '../src/api/villager';

const { width, height } = Dimensions.get('window');

interface Villager {
  Villager_ID: string;
  Full_Name: string;
  Area_ID: string;
  Address: string;
  Email: string;
  Phone_No: string;
  IsParticipant: boolean;
  RegionalDivision: string;
  Status: string;
  Latitude?: string;
  Longitude?: string;
  Alive_Status?: string;
  NIC?: string;
  DOB?: string;
  Job?: string;
  Gender?: string;
  Religion?: string;
  Race?: string;
}

interface LocationGroup {
  key: string;
  latitude: number;
  longitude: number;
  villagers: Villager[];
}

const defaultCenter = {
  latitude: 6.9271, // Colombo, Sri Lanka
  longitude: 79.8612,
};

export default function VillageOfficerHouses() {
  const router = useRouter();
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [filteredVillagers, setFilteredVillagers] = useState<Villager[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMapInfo, setShowMapInfo] = useState(false);

  useEffect(() => {
    fetchVillagersData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVillagers(villagers);
      setSelectedLocation(null);
    } else {
      const filtered = villagers.filter(villager =>
        (villager.Full_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         villager.Address?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredVillagers(filtered);
      setSelectedLocation(null);
    }
  }, [searchQuery, villagers]);

  const fetchVillagersData = async () => {
    try {
      setLoading(true);
      const data = await fetchVillagers();
      const validVillagers = data.filter(
        villager => villager.Latitude && villager.Longitude &&
        !isNaN(parseFloat(villager.Latitude)) && !isNaN(parseFloat(villager.Longitude))
      );
      setVillagers(validVillagers);
      setFilteredVillagers(validVillagers);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching villagers:', err);
      setError(err.error || 'Failed to fetch villager data');
      setLoading(false);
      Alert.alert('Fetch Error', err.error || 'Failed to fetch villager data');
    }
  };

  const handleBack = () => {
    router.push('/village-officer-dashboard' as any);
  };

  const handleLocationPress = (locationGroup: LocationGroup) => {
    setSelectedLocation(locationGroup);
  };

  const groupVillagersByLocation = (): LocationGroup[] => {
    const locationMap: { [key: string]: Villager[] } = {};
    filteredVillagers.forEach(villager => {
      if (villager.Latitude && villager.Longitude) {
        const key = `${villager.Latitude},${villager.Longitude}`;
        if (!locationMap[key]) {
          locationMap[key] = [];
        }
        locationMap[key].push(villager);
      }
    });

    return Object.entries(locationMap).map(([key, villagersAtLocation]) => {
      const [lat, lng] = key.split(',').map(coord => parseFloat(coord));
      return {
        key,
        latitude: lat,
        longitude: lng,
        villagers: villagersAtLocation,
      };
    });
  };

  const renderVillagerInfo = (villager: Villager) => (
    <View style={styles.villagerInfo}>
      <Text style={styles.villagerName}>{villager.Full_Name}</Text>
      <Text style={styles.villagerDetail}>Address: {villager.Address || 'N/A'}</Text>
      <Text style={styles.villagerDetail}>Status: {villager.Alive_Status || 'N/A'}</Text>
      <Text style={styles.villagerDetail}>Participant: {villager.IsParticipant ? 'Yes' : 'No'}</Text>
      <Text style={styles.villagerDetail}>Phone: {villager.Phone_No || 'N/A'}</Text>
    </View>
  );

  const renderLocationItem = ({ item }: { item: LocationGroup }) => (
    <TouchableOpacity
      style={styles.locationCard}
      onPress={() => handleLocationPress(item)}
    >
      <View style={styles.locationHeader}>
        <View style={styles.locationIcon}>
          <Ionicons name="location" size={24} color={Colors.primary} />
        </View>
        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>
            {item.villagers.length} {item.villagers.length === 1 ? 'Villager' : 'Villagers'}
          </Text>
          <Text style={styles.locationCoords}>
            {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
      <View style={styles.locationPreview}>
        {item.villagers.slice(0, 2).map((villager, index) => (
          <Text key={villager.Villager_ID} style={styles.previewName}>
            • {villager.Full_Name}
          </Text>
        ))}
        {item.villagers.length > 2 && (
          <Text style={styles.previewMore}>
            +{item.villagers.length - 2} more...
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Villager Locations</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading location data...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Villager Locations</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchVillagersData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const locationGroups = groupVillagersByLocation();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Villager Locations</Text>
        <TouchableOpacity onPress={() => setShowMapInfo(!showMapInfo)} style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Map Info Banner */}
      {showMapInfo && (
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>
            Map view requires Google Maps API key configuration. Currently showing location list.
          </Text>
          <TouchableOpacity onPress={() => setShowMapInfo(false)} style={styles.closeBanner}>
            <Ionicons name="close" size={16} color={Colors.text} />
          </TouchableOpacity>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or address..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.textLight}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredVillagers.length}</Text>
          <Text style={styles.statLabel}>Villagers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{locationGroups.length}</Text>
          <Text style={styles.statLabel}>Locations</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {locationGroups.reduce((sum, loc) => sum + loc.villagers.length, 0)}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Location List */}
      {locationGroups.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Ionicons name="location-outline" size={48} color={Colors.textLight} />
          <Text style={styles.noDataText}>
            {searchQuery ? 'No locations found matching your search' : 'No villager locations found'}
          </Text>
          <Text style={styles.noDataSubtext}>
            Villagers need valid latitude and longitude coordinates
          </Text>
        </View>
      ) : (
        <FlatList
          data={locationGroups}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Selected Location Details */}
      {selectedLocation && (
        <View style={styles.detailsOverlay}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailsTitle}>
                {selectedLocation.villagers.length} {selectedLocation.villagers.length === 1 ? 'Villager' : 'Villagers'} at Location
              </Text>
              <TouchableOpacity onPress={() => setSelectedLocation(null)} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.detailsScroll} nestedScrollEnabled={true}>
              <View style={styles.locationCoordsDetail}>
                <Text style={styles.coordsLabel}>Coordinates:</Text>
                <Text style={styles.coordsValue}>
                  {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </Text>
              </View>
              {selectedLocation.villagers.map((villager) => renderVillagerInfo(villager))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    color: 'white',
    fontSize: Typography.xl,
    fontWeight: 'bold',
  },
  infoButton: {
    padding: Spacing.sm,
  },
  placeholder: {
    width: 40,
  },
  infoBanner: {
    backgroundColor: '#fff3cd',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: Spacing.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sm,
    color: '#856404',
  },
  closeBanner: {
    padding: Spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.base,
    color: Colors.text,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
    alignItems: 'center',
    borderRadius: Spacing.borderRadius.sm,
    marginHorizontal: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  listContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  locationCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  locationCoords: {
    fontSize: Typography.sm,
    color: Colors.textLight,
  },
  locationPreview: {
    paddingLeft: 52,
  },
  previewName: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  previewMore: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontStyle: 'italic',
  },
  villagerInfo: {
    marginBottom: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: Spacing.borderRadius.sm,
  },
  villagerName: {
    fontSize: Typography.base,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  villagerDetail: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  detailsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    margin: Spacing.md,
    maxHeight: height * 0.7,
    width: width * 0.9,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailsTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  detailsScroll: {
    flex: 1,
  },
  locationCoordsDetail: {
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    marginBottom: Spacing.md,
  },
  coordsLabel: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  coordsValue: {
    fontSize: Typography.base,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.base,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
  },
  retryButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noDataText: {
    marginTop: Spacing.md,
    fontSize: Typography.lg,
    color: Colors.textLight,
    textAlign: 'center',
  },
  noDataSubtext: {
    marginTop: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
