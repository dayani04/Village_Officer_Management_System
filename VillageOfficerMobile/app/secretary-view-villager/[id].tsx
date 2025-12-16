import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Spacing } from '../../src/constants/spacing';
import { Typography } from '../../src/constants/typography';
import * as villagerApi from '../../src/api/villager';

interface Villager {
  Villager_ID: string;
  Full_Name: string;
  Email: string;
  Phone_No: string;
  NIC: string;
  DOB: string;
  Address: string;
  RegionalDivision: string;
  Status: string;
  Area_ID: string;
  Latitude: number | null;
  Longitude: number | null;
  IsElectionParticipant: boolean;
  AliveStatus: string;
}

const SecretaryViewVillagerScreen: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [villager, setVillager] = useState<Villager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVillager();
  }, [id]);

  const fetchVillager = async () => {
    if (!id) {
      setError('No villager ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await villagerApi.fetchVillager(id as string);
      setVillager(data);
    } catch (err: any) {
      console.error('Error fetching villager:', err);
      const errorMessage = err.error || err.message || 'Failed to fetch villager';
      setError(errorMessage);
      Alert.alert(
        'Fetch Error',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const renderInfoRow = (label: string, value: string | number | null | boolean, icon?: string) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelContainer}>
        {icon && <Ionicons name={icon as any} size={20} color={Colors.primary} style={styles.infoIcon} />}
        <Text style={styles.infoLabel}>{label}:</Text>
      </View>
      <Text style={styles.infoValue}>{value?.toString() || 'N/A'}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Villager Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading villager details...</Text>
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
          <Text style={styles.headerTitle}>Villager Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={Colors.error} />
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchVillager}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!villager) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Villager Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.notFoundContainer}>
          <Ionicons name="person-outline" size={60} color={Colors.textLight} />
          <Text style={styles.notFoundText}>Villager not found</Text>
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
        <Text style={styles.headerTitle}>Villager Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Basic Information</Text>
          
          {renderInfoRow('Villager ID', villager.Villager_ID, 'card-outline')}
          {renderInfoRow('Full Name', villager.Full_Name, 'person-outline')}
          {renderInfoRow('Email', villager.Email, 'mail-outline')}
          {renderInfoRow('Phone Number', villager.Phone_No, 'call-outline')}
          {renderInfoRow('NIC', villager.NIC, 'id-card-outline')}
          {renderInfoRow('Date of Birth', formatDate(villager.DOB), 'calendar-outline')}
        </View>

        {/* Location Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Information</Text>
          
          {renderInfoRow('Address', villager.Address, 'location-outline')}
          {renderInfoRow('Regional Division', villager.RegionalDivision, 'map-outline')}
          {renderInfoRow('Area ID', villager.Area_ID, 'home-outline')}
          {renderInfoRow('Latitude', villager.Latitude, 'locate-outline')}
          {renderInfoRow('Longitude', villager.Longitude, 'locate-outline')}
        </View>

        {/* Status Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="toggle-outline" size={20} color={Colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Status:</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: villager.Status === 'Active' ? '#4caf50' : '#f44336' }
            ]}>
              <Text style={styles.statusText}>{villager.Status}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Election Participant:</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: villager.IsElectionParticipant ? '#4caf50' : '#f44336' }
            ]}>
              <Text style={styles.statusText}>{villager.IsElectionParticipant ? 'Yes' : 'No'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Ionicons name="pulse-outline" size={20} color={Colors.primary} style={styles.infoIcon} />
              <Text style={styles.infoLabel}>Alive Status:</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: villager.AliveStatus === 'Alive' ? '#4caf50' : '#f44336' }
            ]}>
              <Text style={styles.statusText}>{villager.AliveStatus}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  card: {
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
  cardTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text || '#333',
    marginBottom: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border || '#eee',
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    marginRight: Spacing.sm,
  },
  infoLabel: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.text || '#333',
  },
  infoValue: {
    fontSize: Typography.base,
    color: Colors.textLight || '#666',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
  },
  statusText: {
    color: 'white',
    fontSize: Typography.sm,
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
    color: Colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.base,
    color: Colors.error,
    textAlign: 'center',
    marginTop: Spacing.md,
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
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  notFoundText: {
    marginTop: Spacing.md,
    fontSize: Typography.lg,
    color: Colors.textLight,
  },
});

export default SecretaryViewVillagerScreen;
