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
import * as permitApplicationApi from '../src/api/permitApplication';

interface PermitHolder {
  Villager_ID: string;
  Full_Name: string;
  Permits_ID: string;
  Permits_Type: string;
  Phone_No: string;
  Address: string;
  status: string;
  apply_date: string;
}

const HoldersPermitScreen: React.FC = () => {
  const router = useRouter();
  const [holders, setHolders] = useState<PermitHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfirmedApplications();
  }, []);

  const fetchConfirmedApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await permitApplicationApi.fetchConfirmedPermitApplications();
      console.log('Fetched confirmed permit applications:', data);
      setHolders(data);
    } catch (err: any) {
      console.error('Error fetching confirmed applications:', err);
      setError(err.error || 'Failed to fetch confirmed permit applications');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchConfirmedApplications();
    setRefreshing(false);
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

  const handleViewDetails = (villagerId: string) => {
    console.log('Navigating to villager details:', villagerId);
    // Navigate to permit owner details page with query parameter
    router.push({ pathname: '/permit-owner-details', params: { villagerId } } as any);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading permit holders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Permit Holders</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchConfirmedApplications}>
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmed Permit Owners</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{holders.length}</Text>
          <Text style={styles.summaryLabel}>Total Holders</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {holders.filter(h => h.status && h.status.toLowerCase() === 'confirmed').length}
          </Text>
          <Text style={styles.summaryLabel}>Confirmed</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {holders.filter(h => h.status && h.status.toLowerCase() === 'send').length}
          </Text>
          <Text style={styles.summaryLabel}>Send</Text>
        </View>
      </View>

      {/* Holders List */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>All Confirmed Permit Owners</Text>
        {holders.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Ionicons name="document-outline" size={48} color={Colors.textLight} />
            <Text style={styles.noDataText}>No confirmed permit owners found</Text>
            <Text style={styles.noDataSubtext}>No permit applications have been confirmed yet</Text>
          </View>
        ) : (
          holders.map((holder) => (
            <TouchableOpacity
              key={`${holder.Villager_ID}-${holder.Permits_ID}`}
              style={styles.holderCard}
              onPress={() => handleViewDetails(holder.Villager_ID)}
            >
              <View style={styles.holderInfo}>
                <View style={styles.holderHeader}>
                  <Text style={styles.holderName}>{holder.Full_Name || 'N/A'}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(holder.status) }]}>
                    <Text style={styles.statusText}>{holder.status?.toUpperCase() || 'UNKNOWN'}</Text>
                  </View>
                </View>
                <Text style={styles.holderId}>ID: {holder.Villager_ID || 'N/A'}</Text>
                <View style={styles.holderDetails}>
                  <Text style={styles.permitType}>{holder.Permits_Type || 'N/A'}</Text>
                  <Text style={styles.phoneNumber}>{holder.Phone_No || 'N/A'}</Text>
                </View>
                <Text style={styles.addressText}>{holder.Address || 'N/A'}</Text>
                <Text style={styles.dateInfo}>
                  Applied: {holder.apply_date ? new Date(holder.apply_date).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
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
  summaryContainer: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  summaryLabel: {
    fontSize: Typography.sm,
    color: '#666',
    marginTop: Spacing.xs,
  },
  listContainer: {
    padding: Spacing.md,
  },
  listTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: Spacing.md,
  },
  holderCard: {
    backgroundColor: 'white',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  holderInfo: {
    flex: 1,
  },
  holderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  holderName: {
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
  holderId: {
    fontSize: Typography.sm,
    color: '#666',
    marginBottom: Spacing.xs,
  },
  holderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  permitType: {
    fontSize: Typography.sm,
    color: '#333',
    fontWeight: '500',
  },
  phoneNumber: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  addressText: {
    fontSize: Typography.sm,
    color: '#666',
    marginBottom: Spacing.xs,
  },
  dateInfo: {
    fontSize: Typography.xs,
    color: '#999',
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

export default HoldersPermitScreen;
