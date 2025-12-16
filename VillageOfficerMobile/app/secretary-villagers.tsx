import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,   // ← Re-added this
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as villagerApi from '../src/api/villager';

interface Villager {
  Villager_ID: string;
  Full_Name: string;
  Area_ID: string;
  Address: string;
  Email: string;
  Phone_No: string;
  IsParticipant: boolean;
  RegionalDivision: string;
}

const SecretaryVillagersScreen: React.FC = () => {
  const router = useRouter();
  const [villagers, setVillagers] = useState<Villager[]>([]);
  const [filteredVillagers, setFilteredVillagers] = useState<Villager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchVillagersData();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredVillagers(villagers);
    } else {
      const filtered = villagers.filter((villager) =>
        villager.Full_Name.toLowerCase().includes(searchText.toLowerCase()) ||
        villager.Villager_ID.toLowerCase().includes(searchText.toLowerCase()) ||
        villager.Email.toLowerCase().includes(searchText.toLowerCase()) ||
        villager.Phone_No.includes(searchText)
      );
      setFilteredVillagers(filtered);
    }
  }, [searchText, villagers]);

  const fetchVillagersData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await villagerApi.fetchVillagers();
      setVillagers(data);
      setFilteredVillagers(data);
    } catch (err: any) {
      console.error('Error fetching villagers:', err);
      setError(err.error || 'Failed to fetch villager data');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
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
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, ID, email, or phone..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={Colors.textSecondary}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredVillagers.length} {filteredVillagers.length === 1 ? 'villager' : 'villagers'} found
        </Text>
      </View>

      {/* Villagers List or Empty State */}
      {filteredVillagers.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Ionicons name="people-outline" size={60} color={Colors.textSecondary} />
          <Text style={styles.noDataText}>
            {searchText ? 'No villagers match your search' : 'No villagers found'}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background || '#f5f5f5',
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
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
    color: Colors.textSecondary,
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
    elevation: 4,
  },
  villagerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border || '#eee',
  },
  villagerName: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text || '#333',
    flex: 1,
  },
  villagerId: {
    fontSize: Typography.sm,
    color: Colors.textSecondary || '#666',
  },
  villagerDetails: {
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary || '#666',
    fontWeight: '500',
    width: 90,
  },
  detailValue: {
    fontSize: Typography.sm,
    color: Colors.text || '#333',
    flex: 1,
    textAlign: 'right',
  },
  participantYes: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  participantNo: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.base,
    color: Colors.error || '#f44336',
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
    fontWeight: 'bold',
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
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default SecretaryVillagersScreen;