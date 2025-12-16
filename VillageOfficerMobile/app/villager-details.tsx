import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as villagerApi from '../src/api/villager';

interface VillagerDetails {
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
  Latitude: number;
  Longitude: number;
  IsElectionParticipant: boolean;
  AliveStatus: string;
}

export default function VillagerDetailsScreen() {
  const router = useRouter();
  const { villagerId } = router.params as { villagerId?: string };
  const [villager, setVillager] = useState<VillagerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVillagerDetails();
  }, [villagerId]);

  const fetchVillagerDetails = async () => {
    if (!villagerId) {
      const errorMessage = 'Invalid villager ID';
      console.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      Alert.alert('Error', errorMessage);
      return;
    }

    try {
      console.log('Fetching villager with ID:', villagerId);
      const data = await villagerApi.fetchVillager(villagerId);
      console.log('Villager data:', data);
      
      if (!data) {
        throw new Error('No villager data returned');
      }
      
      setVillager(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      const errorMessage = err.error || err.message || 'Failed to fetch villager details';
      setError(errorMessage);
      setLoading(false);
      Alert.alert('Error', errorMessage);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Allowance Applicant Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error || !villager) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Villager Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>
            {error ? 'Error' : 'Villager Not Found'}
          </Text>
          <Text style={styles.errorMessage}>
            {error || 'The requested villager details could not be found.'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Allowance Applicant Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.villagerName}>{villager.Full_Name}</Text>
            <Text style={styles.villagerId}>ID: {villager.Villager_ID}</Text>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="mail-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{villager.Email || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="call-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{villager.Phone_No || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="card-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>NIC</Text>
                <Text style={styles.infoValue}>{villager.NIC || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="calendar-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{formatDate(villager.DOB)}</Text>
              </View>
            </View>
          </View>

          {/* Location Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Information</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="home-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{villager.Address || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Regional Division</Text>
                <Text style={styles.infoValue}>{villager.RegionalDivision || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="map-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Area ID</Text>
                <Text style={styles.infoValue}>{villager.Area_ID || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="pin-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Coordinates</Text>
                <Text style={styles.infoValue}>
                  {villager.Latitude && villager.Longitude 
                    ? `${villager.Latitude}, ${villager.Longitude}`
                    : 'N/A'
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* Status Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Information</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>{villager.Status || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Alive Status</Text>
                <Text style={styles.infoValue}>{villager.AliveStatus || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.textLight} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Election Participant</Text>
                <Text style={styles.infoValue}>
                  {villager.IsElectionParticipant ? 'Yes' : 'No'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 50,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
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
  errorTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.error,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    fontSize: Typography.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  villagerName: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  villagerId: {
    fontSize: Typography.sm,
    color: Colors.textLight,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: Typography.base,
    color: Colors.text,
    fontWeight: '500',
  },
});
