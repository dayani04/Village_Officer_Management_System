import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as allowanceApi from '../src/api/allowanceApplication';

interface AllowanceApplication {
  Villager_ID: string;
  Allowances_ID: string;
  Full_Name: string;
  Allowances_Type: string;
  apply_date: string;
  status: string;
  document_path?: string;
}

const SecretaryAllowanceApplicationsScreen: React.FC = () => {
  const router = useRouter();
  const [applications, setApplications] = useState<AllowanceApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await allowanceApi.fetchAllowanceApplications();
      const sendApplications = data.filter((app: AllowanceApplication) => app.status === "Send");
      setApplications(sendApplications);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.error || 'Failed to fetch allowance applications');
      Alert.alert('Fetch Error', err.error || 'Failed to fetch allowance applications');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleStatusSelect = (application: AllowanceApplication) => {
    Alert.alert(
      'Status Selection',
      `Changing status for ${application.Full_Name}\n\nCurrent options:\n- PENDING\n- SEND\n- REJECTED\n- CONFIRMED`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pending', onPress: () => updateStatus(application, 'Pending') },
        { text: 'Rejected', onPress: () => updateStatus(application, 'Rejected') },
        { text: 'Confirmed', onPress: () => updateStatus(application, 'Confirm') },
      ],
      { cancelable: true }
    );
  };

  const updateStatus = async (application: AllowanceApplication, newStatus: string) => {
    const { Villager_ID, Allowances_ID, Allowances_Type, Full_Name } = application;

    try {
      await allowanceApi.updateAllowanceApplicationStatus(Villager_ID, Allowances_ID, newStatus);

      const message = `Your allowance application for ${Allowances_Type} has been updated to ${newStatus}.`;
      await allowanceApi.saveNotification(Villager_ID, message);

      if (newStatus !== 'Send') {
        setApplications(prev => prev.filter(
          app => !(app.Villager_ID === Villager_ID && app.Allowances_ID === Allowances_ID)
        ));
        setSentNotifications(prev => new Set(prev).add(`${Villager_ID}-${Allowances_ID}`));
      } else {
        setApplications(prev => prev.map(app =>
          app.Villager_ID === Villager_ID && app.Allowances_ID === Allowances_ID
            ? { ...app, status: newStatus }
            : app
        ));
      }

      Alert.alert('Success', `Status updated to ${newStatus} and notification sent to ${Full_Name}`);
    } catch (err: any) {
      Alert.alert('Update Failed', err.error || 'Failed to update status or send notification');
    }
  };

  const handleViewDetails = (villagerId: string) => {
    // Replace this with actual navigation when ready
    // router.push(`/secretary-allowance-applications-villager-view/${villagerId}`);
    Alert.alert('Info', `View details for villager: ${villagerId}`);
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch {
      return 'N/A';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#ffa726';
      case 'send': return '#ff9800';
      case 'rejected': return '#f44336';
      case 'confirm':
      case 'confirmed': return '#4caf50';
      default: return '#666';
    }
  };

  const renderApplicationItem = ({ item }: { item: AllowanceApplication }) => {
    const key = `${item.Villager_ID}-${item.Allowances_ID}`;
    const isSent = sentNotifications.has(key);
    const currentStatus = item.status;

    return (
      <View style={styles.applicationCard}>
        <View style={styles.applicationHeader}>
          <Text style={styles.allowanceType}>{item.Allowances_Type}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatus) }]}>
            <Text style={styles.statusText}>{currentStatus.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.applicationDetails}>
          <Text style={styles.applicationDetail}>Applicant: {item.Full_Name || 'N/A'}</Text>
          <Text style={styles.applicationDetail}>ID: {item.Villager_ID || 'N/A'}</Text>
          <Text style={styles.applicationDetail}>Applied: {formatDate(item.apply_date)}</Text>
          <Text style={styles.applicationDetail}>Application ID: {item.Allowances_ID}</Text>
        </View>

        {/* Status Row with Dropdown Button */}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status</Text>
          <TouchableOpacity
            style={[styles.statusButton, isSent && styles.statusButtonDisabled]}
            onPress={() => handleStatusSelect(item)}
            disabled={isSent}
          >
            <Text style={[styles.statusButtonText, isSent && { color: '#999' }]}>
              {currentStatus}
            </Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={isSent ? '#999' : Colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* View Details Button - Now using Primary Color #921940 */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.viewDetailsButton,
              isSent && styles.viewDetailsButtonDisabled
            ]}
            onPress={() => handleViewDetails(item.Villager_ID)}
            disabled={isSent}
          >
            <Ionicons 
              name="eye-outline" 
              size={20} 
              color={isSent ? '#999' : 'white'} 
            />
            <Text style={[
              styles.viewDetailsButtonText,
              isSent && { color: '#999' }
            ]}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading && applications.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Allowance Applications (Send)</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading applications...</Text>
        </View>
      </View>
    );
  }

  if (error && applications.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Allowance Applications (Send)</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadApplications}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Allowance Applications (Send)</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={applications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => `${item.Villager_ID}-${item.Allowances_ID}`}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Ionicons name="document-text-outline" size={60} color={Colors.textLight} />
            <Text style={styles.noDataText}>No applications with status "Send"</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  listContainer: {
    padding: Spacing.md,
  },
  applicationCard: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
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
  allowanceType: {
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
    marginBottom: Spacing.md,
  },
  applicationDetail: {
    fontSize: Typography.sm,
    color: '#666',
    marginBottom: Spacing.xs,
  },
  statusRow: {
    marginBottom: Spacing.md,
  },
  statusLabel: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  statusButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statusButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  statusButtonText: {
    fontSize: Typography.base,
    color: '#333',
    fontWeight: '500',
  },
  actionContainer: {
    marginTop: Spacing.sm,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary, // Now using your primary color #921940
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
  },
  viewDetailsButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
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
});

export default SecretaryAllowanceApplicationsScreen;