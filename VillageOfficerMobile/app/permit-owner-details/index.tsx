import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Spacing } from '../../src/constants/spacing';
import { Typography } from '../../src/constants/typography';
import * as permitApplicationApi from '../../src/api/permitApplication';

interface PermitApplication {
  Villager_ID: string;
  Full_Name: string;
  Permits_ID: string;
  Permits_Type: string;
  Phone_No: string;
  Address: string;
  status: string;
  apply_date: string;
  document_filename?: string;
}

interface VillagerDetails {
  Villager_ID: string;
  Full_Name: string;
  Nic_No: string;
  Phone_No: string;
  Address: string;
  Email?: string;
  Date_of_Birth?: string;
  Gender?: string;
  Applications?: PermitApplication[];
}

const PermitOwnerDetailsScreen: React.FC = () => {
  const router = useRouter();
  const { villagerId } = useLocalSearchParams();
  const [villagerDetails, setVillagerDetails] = useState<VillagerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (villagerId) {
      fetchVillagerDetails(villagerId as string);
    }
  }, [villagerId]);

  const fetchVillagerDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch confirmed applications and filter by villager
      const confirmedApplications = await permitApplicationApi.fetchConfirmedPermitApplications();
      const villagerApplications = confirmedApplications.filter((app: PermitApplication) => app.Villager_ID === id);
      
      if (villagerApplications.length === 0) {
        setError('No permit details found for this villager');
        return;
      }
      
      // Create villager details from the first application
      const firstApp = villagerApplications[0];
      const details: VillagerDetails = {
        Villager_ID: firstApp.Villager_ID,
        Full_Name: firstApp.Full_Name,
        Nic_No: '', // Would need to be populated from a proper API
        Phone_No: firstApp.Phone_No,
        Address: firstApp.Address,
        Applications: villagerApplications,
      };
      
      setVillagerDetails(details);
    } catch (err: any) {
      console.error('Error fetching villager details:', err);
      setError(err.error || 'Failed to fetch villager details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return '#999';
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '#4caf50';
      case 'rejected':
        return '#f44336';
      case 'pending':
        return '#ff9800';
      case 'send':
        return '#2196f3';
      default:
        return '#999';
    }
  };

  const handleDownloadDocument = async (filename: string) => {
    try {
      await permitApplicationApi.downloadDocument(filename);
      Alert.alert('Success', `Document ${filename} downloaded successfully`);
    } catch (err: any) {
      Alert.alert('Error', err.error || 'Failed to download document');
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading villager details...</Text>
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
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchVillagerDetails(villagerId as string)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!villagerDetails) {
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
          <Text style={styles.errorText}>No details available</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Villager Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Villager Info Card */}
      <View style={styles.villagerCard}>
        <View style={styles.villagerHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={32} color="white" />
          </View>
          <View style={styles.villagerInfo}>
            <Text style={styles.villagerName}>{villagerDetails.Full_Name}</Text>
            <Text style={styles.villagerId}>ID: {villagerDetails.Villager_ID}</Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{villagerDetails.Phone_No || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="home-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{villagerDetails.Address || 'N/A'}</Text>
          </View>
          
          {villagerDetails.Nic_No && (
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="card-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.detailLabel}>NIC</Text>
              <Text style={styles.detailValue}>{villagerDetails.Nic_No}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Permit Applications */}
      <View style={styles.applicationsContainer}>
        <Text style={styles.sectionTitle}>Permit Applications</Text>
       {villagerDetails.Applications?.map((application, index) => (
          <View key={`${application.Permits_ID}-${index}`} style={styles.applicationCard}>
            <View style={styles.applicationHeader}>
              <Text style={styles.permitType}>{application.Permits_Type}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) }]}>
                <Text style={styles.statusText}>{application.status.toUpperCase()}</Text>
              </View>
            </View>
            
            <View style={styles.applicationDetails}>
              <Text style={styles.applicationDetail}>
                Applied: {application.apply_date ? new Date(application.apply_date).toLocaleDateString() : 'N/A'}
              </Text>
              <Text style={styles.applicationDetail}>
                Application ID: {application.Permits_ID}
              </Text>
            </View>
            
            {application.document_filename && (
              <TouchableOpacity
                style={styles.documentButton}
                onPress={() => handleDownloadDocument(application.document_filename!)}
              >
                <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
                <Text style={styles.documentButtonText}>View Document</Text>
                <Ionicons name="download-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: '#666',
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
  villagerCard: {
    backgroundColor: 'white',
    margin: Spacing.md,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  villagerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  villagerInfo: {
    flex: 1,
  },
  villagerName: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: Spacing.xs,
  },
  villagerId: {
    fontSize: Typography.base,
    color: '#666',
  },
  detailsContainer: {
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: '#666',
    width: 60,
  },
  detailValue: {
    flex: 1,
    fontSize: Typography.base,
    color: '#333',
    fontWeight: '500',
  },
  applicationsContainer: {
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: Spacing.md,
  },
  applicationCard: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  permitType: {
    fontSize: Typography.base,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
  },
  statusText: {
    color: 'white',
    fontSize: Typography.xs,
    fontWeight: 'bold',
  },
  applicationDetails: {
    marginBottom: Spacing.sm,
  },
  applicationDetail: {
    fontSize: Typography.sm,
    color: '#666',
    marginBottom: Spacing.xs,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  documentButtonText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: '500',
    marginHorizontal: Spacing.sm,
  },
});

export default PermitOwnerDetailsScreen;
