import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as villageOfficerApi from '../src/api/villageOfficer';

interface VillageOfficer {
  Villager_Officer_ID: string;
  Full_Name: string;
  Email: string;
  Phone_No: string;
  Status: string;
}

const VillageOfficerManagementScreen: React.FC = () => {
  const router = useRouter();
  const [officers, setOfficers] = useState<VillageOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await villageOfficerApi.fetchVillageOfficers();
      console.log('Fetched village officers:', data);
      setOfficers(data);
    } catch (err: any) {
      console.error('Error fetching village officers:', err);
      setError(err.error || 'Failed to fetch village officers');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOfficers();
    setRefreshing(false);
  };

  const handleDeleteOfficer = async (id: string, fullName: string) => {
    Alert.alert(
      'Are you sure?',
      `You won't be able to revert this! This will delete ${fullName}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await villageOfficerApi.deleteVillageOfficer(id);
              setOfficers(officers.filter((officer) => officer.Villager_Officer_ID !== id));
              
              Alert.alert(
                'Deleted!',
                `Officer ${fullName} deleted successfully`,
                [{ text: 'OK', style: 'default' }]
              );
            } catch (err: any) {
              console.error('Error deleting village officer:', err);
              Alert.alert(
                'Delete Failed',
                err.error || 'Failed to delete officer',
                [{ text: 'OK', style: 'default' }]
              );
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (id: string, currentStatus: string, fullName: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await villageOfficerApi.updateVillageOfficerStatus(id, newStatus);
      setOfficers(
        officers.map((officer) =>
          officer.Villager_Officer_ID === id ? { ...officer, Status: newStatus } : officer
        )
      );
      
      Alert.alert(
        'Status Updated',
        `Status updated for ${fullName}`,
        [{ text: 'OK', style: 'default' }]
      );
    } catch (err: any) {
      console.error('Error updating officer status:', err);
      Alert.alert(
        'Status Update Failed',
        err.error || 'Failed to update status',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleAddOfficer = () => {
    router.push('/add-village-officer' as any);
  };

  const handleEditOfficer = (id: string) => {
    router.push(`/village-officer-edit/${id}` as any);
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? '#4caf50' : '#f44336';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading village officers...</Text>
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
          <Text style={styles.headerTitle}>Village Officers</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOfficers}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Village Officers</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Add Officer Button */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddOfficer}>
          <Ionicons name="person-add-outline" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Officer</Text>
        </TouchableOpacity>
      </View>

      {/* Officers List */}
      <View style={styles.listContainer}>
        {officers.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Ionicons name="people-outline" size={48} color={Colors.textLight} />
            <Text style={styles.noDataText}>No village officers found</Text>
            <Text style={styles.noDataSubtext}>Add officers to manage your village</Text>
          </View>
        ) : (
          officers.map((officer) => (
            <View key={officer.Villager_Officer_ID} style={styles.officerCard}>
              <View style={styles.officerInfo}>
                <View style={styles.officerHeader}>
                  <Text style={styles.officerName}>{officer.Full_Name || 'N/A'}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(officer.Status) }]}>
                    <Text style={styles.statusText}>{officer.Status || 'UNKNOWN'}</Text>
                  </View>
                </View>
                
                <View style={styles.officerDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="card-outline" size={16} color={Colors.primary} />
                    <Text style={styles.detailLabel}>ID:</Text>
                    <Text style={styles.detailValue}>{officer.Villager_Officer_ID || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="mail-outline" size={16} color={Colors.primary} />
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{officer.Email || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="call-outline" size={16} color={Colors.primary} />
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{officer.Phone_No || 'N/A'}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteOfficer(officer.Villager_Officer_ID, officer.Full_Name)}
                >
                  <Ionicons name="trash-outline" size={20} color="#f44336" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleToggleStatus(officer.Villager_Officer_ID, officer.Status, officer.Full_Name)}
                >
                  <Ionicons 
                    name={officer.Status === 'Active' ? 'toggle-outline' : 'toggle'} 
                    size={20} 
                    color={getStatusColor(officer.Status)} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  actionsContainer: {
    padding: Spacing.md,
  },
  addButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: 'bold',
    marginLeft: Spacing.sm,
  },
  listContainer: {
    padding: Spacing.md,
  },
  officerCard: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  officerInfo: {
    flex: 1,
  },
  officerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  officerName: {
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
  officerDetails: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: Typography.sm,
    color: '#666',
    width: 50,
    marginLeft: Spacing.sm,
  },
  detailValue: {
    fontSize: Typography.sm,
    color: '#333',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xl,
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
});

export default VillageOfficerManagementScreen;
