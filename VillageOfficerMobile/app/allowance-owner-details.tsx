import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
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
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(new Set());
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<AllowanceApplication | null>(null);

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

  const handleStatusChange = (villagerId: string, allowancesId: string, newStatus: string) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [`${villagerId}-${allowancesId}`]: newStatus,
    }));
  };

  const handleSend = async (villagerId: string, allowancesId: string, allowanceType: string, fullName: string) => {
    const newStatus = statusUpdates[`${villagerId}-${allowancesId}`];
    if (!newStatus) {
      Alert.alert('Status Required', 'Please select a status');
      return;
    }

    try {
      await allowanceApi.updateAllowanceApplicationStatus(villagerId, allowancesId, newStatus);
      const message = `Your allowance application for ${allowanceType} has been updated to ${newStatus}.`;
      await allowanceApi.saveNotification(villagerId, message);

      setApplications((prev) =>
        prev.filter(
          (app) =>
            !(app.Villager_ID === villagerId && app.Allowances_ID === allowancesId && newStatus !== "Send")
        )
      );

      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${allowancesId}`];
        return updated;
      });
      setSentNotifications((prev) => new Set(prev).add(`${villagerId}-${allowancesId}`));

      Alert.alert('Success', `Status updated and notification sent to ${fullName}`);
    } catch (err: any) {
      Alert.alert('Update Failed', err.error || 'Failed to update status or send notification');
    }
  };

  const handleViewDetails = (villagerId: string) => {
    router.push(`/secretary-allowance-applications-villager-view/${villagerId}` as any);
  };

  const handleBack = () => {
    router.back();
  };

  const showStatusModal = (application: AllowanceApplication) => {
    setSelectedApplication(application);
    setStatusModalVisible(true);
  };

  const handleStatusSelect = (status: string) => {
    if (selectedApplication) {
      handleStatusChange(selectedApplication.Villager_ID, selectedApplication.Allowances_ID, status);
      setStatusModalVisible(false);
    }
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
      case 'send': return '#ff9800';
      case 'rejected': return '#f44336';
      case 'confirm': return '#4caf50';
      default: return '#666';
    }
  };

  const renderApplicationItem = ({ item }: { item: AllowanceApplication }) => {
    const key = `${item.Villager_ID}-${item.Allowances_ID}`;
    const currentStatus = statusUpdates[key] || item.status;
    const isSent = sentNotifications.has(key);

    return (
      <View style={styles.applicationCard}>
        {/* Header with name and status */}
        <View style={styles.applicationHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={32} color="white" />
          </View>
          <View style={styles.applicantInfo}>
            <Text style={styles.applicantName}>{item.Full_Name || 'N/A'}</Text>
            <Text style={styles.applicantId}>ID: {item.Villager_ID || 'N/A'}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatus) }]}>
            <Text style={styles.statusText}>{currentStatus.toUpperCase()}</Text>
          </View>
        </View>

        {/* Details rows */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="card-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.detailLabel}>Allowance Type</Text>
            <Text style={styles.detailValue}>{item.Allowances_Type || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.detailLabel}>Apply Date</Text>
            <Text style={styles.detailValue}>{formatDate(item.apply_date)}</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => showStatusModal(item)}
          >
            <Ionicons name="list-outline" size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Change Status</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isSent && styles.actionButtonDisabled]}
            onPress={() => handleSend(item.Villager_ID, item.Allowances_ID, item.Allowances_Type, item.Full_Name)}
            disabled={isSent}
          >
            <Ionicons name={isSent ? "checkmark-circle" : "mail-outline"} size={20} color={isSent ? '#999' : Colors.primary} />
            <Text style={[styles.actionButtonText, isSent && { color: '#999' }]}>{isSent ? 'Sent' : 'Send'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#4caf50' }]}
            onPress={() => handleViewDetails(item.Villager_ID)}
          >
            <Ionicons name="eye-outline" size={20} color="white" />
            <Text style={styles.actionButtonTextWhite}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Loading, error, empty states (same as before but with updated styles)
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

      {/* Status Modal */}
      <Modal
        visible={statusModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Status</Text>
            <Text style={styles.modalSubtitle}>
              {selectedApplication?.Full_Name} - {selectedApplication?.Allowances_Type}
            </Text>

            {['Send', 'Rejected', 'Confirm'].map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.statusOption}
                onPress={() => handleStatusSelect(status)}
              >
                <View style={[styles.statusOptionBadge, { backgroundColor: getStatusColor(status) }]}>
                  <Text style={styles.statusOptionText}>{status}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setStatusModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: Spacing.xs,
  },
  applicantId: {
    fontSize: Typography.base,
    color: '#666',
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
  detailsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
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
    width: 90,
  },
  detailValue: {
    flex: 1,
    fontSize: Typography.base,
    color: '#333',
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  actionButtonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  actionButtonText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  actionButtonTextWhite: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  modalSubtitle: {
    fontSize: Typography.base,
    color: '#666',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  statusOption: {
    marginBottom: Spacing.sm,
  },
  statusOptionBadge: {
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
  },
  statusOptionText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  cancelButtonText: {
    color: Colors.primary,
    fontSize: Typography.base,
    fontWeight: '600',
  },
});

export default SecretaryAllowanceApplicationsScreen;