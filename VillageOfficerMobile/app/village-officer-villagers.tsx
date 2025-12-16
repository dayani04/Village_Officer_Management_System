import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import { fetchVillagers, deleteVillager } from '../src/api/villager';

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
  NIC?: string;
  DOB?: string;
  Job?: string;
  Gender?: string;
  Religion?: string;
  Race?: string;
}

export default function VillageOfficerVillagers() {
  const router = useRouter();
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredVillagers, setFilteredVillagers] = useState<Villager[]>([]);

  useEffect(() => {
    fetchVillagersData();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = villagers.filter(villager =>
        villager.Full_Name.toLowerCase().includes(searchText.toLowerCase()) ||
        villager.Villager_ID.toLowerCase().includes(searchText.toLowerCase()) ||
        villager.Email.toLowerCase().includes(searchText.toLowerCase()) ||
        villager.Phone_No.includes(searchText)
      );
      setFilteredVillagers(filtered);
    } else {
      setFilteredVillagers(villagers);
    }
  }, [searchText, villagers]);

  const fetchVillagersData = async () => {
    try {
      setLoading(true);
      const data = await fetchVillagers();
      setVillagers(data);
      setFilteredVillagers(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching villagers:', err);
      setError(err.error || 'Failed to fetch villager data');
      setLoading(false);
      Alert.alert('Fetch Error', err.error || 'Failed to fetch villager data');
    }
  };

  const handleDelete = async (villagerId: string) => {
    Alert.alert(
      'Are you sure?',
      "You won't be able to revert this!",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVillager(villagerId);
              setVillagers(villagers.filter((villager) => villager.Villager_ID !== villagerId));
              Alert.alert('Success', 'Villager deleted successfully');
            } catch (err: any) {
              console.error('Error deleting villager:', err);
              Alert.alert('Delete Failed', err.error || 'Failed to delete villager');
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.push('/village-officer-dashboard' as any);
  };

  const handleAddVillager = () => {
    router.push('/add-villager' as any);
  };

  const handleView = (villagerId: string) => {
    router.push(`/village-officer-view-villager?villagerId=${villagerId}` as any);
  };

  const handleEdit = (villagerId: string) => {
    router.push(`/village-officer-edit-villager?villagerId=${villagerId}` as any);
  };

  const renderVillagerItem = ({ item }: { item: Villager }) => (
    <View style={styles.villagerCard}>
      <View style={styles.villagerHeader}>
        <Text style={styles.villagerName}>{item.Full_Name || 'N/A'}</Text>
        <Text style={styles.villagerId}>ID: {item.Villager_ID || 'N/A'}</Text>
      </View>
      
      <View style={styles.villagerDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Area ID:</Text>
          <Text style={styles.detailValue}>{item.Area_ID || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Address:</Text>
          <Text style={styles.detailValue}>{item.Address || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{item.Email || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{item.Phone_No || 'N/A'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Participant:</Text>
          <Text style={[styles.detailValue, item.IsParticipant ? styles.participantYes : styles.participantNo]}>
            {item.IsParticipant ? 'Yes' : 'No'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Division:</Text>
          <Text style={styles.detailValue}>{item.RegionalDivision || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleView(item.Villager_ID)}
        >
          <Ionicons name="eye-outline" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item.Villager_ID)}
        >
          <Ionicons name="create-outline" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.Villager_ID)}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Villagers</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading villagers...</Text>
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
          <Text style={styles.headerTitle}>All Villagers</Text>
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Villagers</Text>
        <TouchableOpacity onPress={handleAddVillager} style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, ID, email, or phone..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={Colors.textLight}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredVillagers.length} {filteredVillagers.length === 1 ? 'villager' : 'villagers'} found
        </Text>
      </View>

      {/* Villagers List */}
      {filteredVillagers.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Ionicons name="people-outline" size={48} color={Colors.textLight} />
          <Text style={styles.noDataText}>
            {searchText ? 'No villagers found matching your search' : 'No villagers found'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredVillagers}
          renderItem={renderVillagerItem}
          keyExtractor={(item) => item.Villager_ID}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
  addButton: {
    padding: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Spacing.borderRadius.sm,
  },
  placeholder: {
    width: 40,
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
  resultsContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  resultsText: {
    fontSize: Typography.sm,
    color: Colors.textLight,
  },
  listContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  villagerCard: {
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
  villagerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  villagerName: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  villagerId: {
    fontSize: Typography.sm,
    color: Colors.textLight,
  },
  villagerDetails: {
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    fontWeight: '500',
    width: 80,
  },
  detailValue: {
    fontSize: Typography.sm,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  participantYes: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  participantNo: {
    color: '#f44336',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#2196f3',
  },
  editButton: {
    backgroundColor: '#ff9800',
  },
  deleteButton: {
    backgroundColor: '#f44336',
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
    fontSize: Typography.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
