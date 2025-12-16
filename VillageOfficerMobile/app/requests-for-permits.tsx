import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as permitApplicationApi from '../src/api/permitApplication';

interface PermitApplication {
  Villager_ID: string;
  Full_Name: string;
  Permits_ID: string;
  Permits_Type: string;
  apply_date: string;
  status: string;
}

export default function RequestsForPermits() {
  const router = useRouter();
  const [applications, setApplications] = useState<PermitApplication[]>([]);
  const [pendingStatuses, setPendingStatuses] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await permitApplicationApi.fetchPermitApplications();
      console.log('Fetched permit applications:', data);
      const pendingApplications = data.filter((app: PermitApplication) => app.status === 'Pending');
      setApplications(pendingApplications);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.error || 'Failed to fetch permit applications');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const handleStatusSelect = (villagerId: string, permitsId: string, application: PermitApplication) => {
    Alert.alert(
      'Status Selection',
      `Changing status for ${application.Full_Name}\n\nCurrent options:\n- PENDING\n- SEND\n- REJECTED\n- CONFIRMED`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pending', onPress: () => updateStatusDirectly(villagerId, permitsId, 'Pending') },
        { text: 'Send', onPress: () => updateStatusDirectly(villagerId, permitsId, 'Send') },
        { text: 'Rejected', onPress: () => updateStatusDirectly(villagerId, permitsId, 'Rejected') },
        { text: 'Confirmed', onPress: () => updateStatusDirectly(villagerId, permitsId, 'Confirm') },
      ]
    );
  };

  const updateStatusDirectly = async (villagerId: string, permitsId: string, newStatus: string) => {
    try {
      await permitApplicationApi.updatePermitApplicationStatus(villagerId, permitsId, newStatus);
      setApplications(applications.filter(app =>
        !(app.Villager_ID === villagerId && app.Permits_ID === permitsId)
      ));
      setPendingStatuses(prev => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${permitsId}`];
        return updated;
      });
      Alert.alert('Success', 'Status updated successfully');
    } catch (err: any) {
      console.error('Status update error:', err);
      Alert.alert('Error', err.error || 'Failed to update status');
    }
  };

  const handleViewDetails = (villagerId: string) => {
    console.log('Navigating to villager details:', villagerId);
    // Navigate to villager details (you can implement this later)
    Alert.alert('Info', `View details for villager: ${villagerId}`);
  };

  const handleBack = () => {
    router.back();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'Send': return '#2196f3';
      case 'Rejected': return '#f44336';
      case 'Confirm': return '#4caf50';
      default: return '#757575';
    }
  };

  const renderApplicationCard = (application: PermitApplication) => {
    const statusKey = `${application.Villager_ID}-${application.Permits_ID}`;
    const currentStatus = pendingStatuses[statusKey] || application.status || 'Pending';

    return (
      <View key={statusKey} style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.villagerInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="key" size={24} color="white" />
            </View>
            <View style={styles.villagerDetails}>
              <Text style={styles.villagerName}>{application.Full_Name}</Text>
              <Text style={styles.villagerId}>ID: {application.Villager_ID}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatus) }]}>
            <Text style={styles.statusText}>{currentStatus}</Text>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Permit Type */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="document-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Permit Type</Text>
              <Text style={styles.infoValue}>{application.Permits_Type}</Text>
            </View>
          </View>

          {/* Permit ID */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="key-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Permit ID</Text>
              <Text style={styles.infoValue}>{application.Permits_ID}</Text>
            </View>
          </View>

          {/* Date Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Applied Date</Text>
              <Text style={styles.infoValue}>
                {new Date(application.apply_date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>

          {/* Status Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="flag-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => handleStatusSelect(application.Villager_ID, application.Permits_ID, application)}
              >
                <Text style={styles.statusButtonText}>{currentStatus}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Card Footer */}
        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewDetails(application.Villager_ID)}
          >
            <Ionicons name="eye-outline" size={18} color={Colors.primary} />
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => updateStatusDirectly(application.Villager_ID, application.Permits_ID, currentStatus)}
          >
            <Ionicons name="checkmark-outline" size={18} color="white" />
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Permit Applications</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading applications...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Permit Applications</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchApplications}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Permit Applications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {applications.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Ionicons name="key-outline" size={48} color={Colors.textLight} />
              <Text style={styles.noDataText}>No pending permit applications found</Text>
              <Text style={styles.noDataSubtext}>All permit applications have been processed</Text>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              {applications.map(renderApplicationCard)}
            </View>
          )}
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
    marginBottom: Spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
  },
  retryButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  cardsContainer: {
    paddingBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  villagerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  villagerDetails: {
    flex: 1,
  },
  villagerName: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  villagerId: {
    fontSize: Typography.sm,
    color: Colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.lg,
  },
  statusText: {
    fontSize: Typography.sm,
    color: 'white',
    fontWeight: '600',
  },
  cardBody: {
    padding: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
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
  statusButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statusButtonText: {
    fontSize: Typography.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    flex: 1,
    marginRight: Spacing.sm,
    justifyContent: 'center',
  },
  viewButtonText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    flex: 1,
    marginLeft: Spacing.sm,
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
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
    marginBottom: Spacing.sm,
  },
  noDataSubtext: {
    fontSize: Typography.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
