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
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as allowanceApi from '../src/api/allowanceApplication';

interface AllowanceApplication {
  Villager_ID: string;
  Full_Name: string;
  Allowances_ID: string;
  Allowances_Type: string;
  apply_date: string;
  status: string;
  document_filename?: string;
}

export default function RequestsForAllowances() {
  const router = useRouter();
  const [applications, setApplications] = useState<AllowanceApplication[]>([]);
  const [pendingStatuses, setPendingStatuses] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<AllowanceApplication | null>(null);

  const statusOptions = ['Pending', 'Send', 'Rejected', 'Confirmed'];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await allowanceApi.fetchAllowanceApplications();
      console.log('Fetched allowance applications:', data);
      const pendingApplications = data.filter((app: AllowanceApplication) => app.status === 'Pending');
      setApplications(pendingApplications);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.error || 'Failed to fetch allowance applications');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const handleStatusSelect = (villagerId: string, allowancesId: string, application: AllowanceApplication) => {
    // Simple test - show alert first
    Alert.alert(
      'Status Selection',
      `Changing status for ${application.Full_Name}\n\nCurrent options:\n- PENDING\n- SEND\n- REJECTED\n- CONFIRMED`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pending', onPress: () => updateStatusDirectly(villagerId, allowancesId, 'Pending') },
        { text: 'Send', onPress: () => updateStatusDirectly(villagerId, allowancesId, 'Send') },
      ]
    );
  };

  const updateStatusDirectly = async (villagerId: string, allowancesId: string, newStatus: string) => {
    try {
      await allowanceApi.updateAllowanceApplicationStatus(villagerId, allowancesId, newStatus);
      setApplications(applications.filter(app =>
        !(app.Villager_ID === villagerId && app.Allowances_ID === allowancesId)
      ));
      Alert.alert('Success', `Status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Status update error:', err);
      Alert.alert('Error', err.error || 'Failed to update status');
    }
  };

  const handleStatusConfirm = async (villagerId: string, allowancesId: string, newStatus: string) => {
    if (!allowancesId) {
      Alert.alert('Error', 'Allowance ID is missing.');
      return;
    }

    if (!newStatus) {
      Alert.alert('Error', 'No status change selected.');
      return;
    }

    try {
      await allowanceApi.updateAllowanceApplicationStatus(villagerId, allowancesId, newStatus);
      setApplications(applications.filter(app =>
        !(app.Villager_ID === villagerId && app.Allowances_ID === allowancesId)
      ));
      setPendingStatuses(prev => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${allowancesId}`];
        return updated;
      });
      Alert.alert('Success', 'Status updated successfully');
      setShowStatusModal(false);
      setSelectedApplication(null);
    } catch (err: any) {
      console.error('Status update error:', err);
      Alert.alert('Error', err.error || 'Failed to update status');
    }
  };

 const handleViewDetails = (villagerId: string) => {
    console.log('Navigating to villager:', villagerId);
    // Navigate to villager details (you can implement this later)
    Alert.alert('Info', `View details for villager: ${villagerId}`);
  };

  const handleDownload = async (filename: string) => {
    try {
      const blob = await allowanceApi.downloadDocument(filename);
      // For React Native, you would use a library like react-native-fs to save the file
      Alert.alert('Success', `Document ${filename} downloaded successfully`);
    } catch (err: any) {
      Alert.alert('Error', err.error || 'Failed to download document');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderApplicationCard = (application: AllowanceApplication) => {
    const statusKey = `${application.Villager_ID}-${application.Allowances_ID}`;
    const currentStatus = pendingStatuses[statusKey] || application.status || 'Pending';

    return (
      <View key={statusKey} style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.villagerInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-outline" size={24} color="white" />
            </View>
            <View style={styles.villagerDetails}>
              <Text style={styles.villagerName}>{application.Full_Name}</Text>
              <Text style={styles.villagerId}>ID: {application.Villager_ID}</Text>
            </View>
          </View>
          <View style={styles.allowanceType}>
            <Text style={styles.allowanceText}>{application.Allowances_Type}</Text>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
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
                onPress={() => handleStatusSelect(application.Villager_ID, application.Allowances_ID, application)}
              >
                <Text style={styles.statusButtonText}>{currentStatus}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Document Row */}
          {application.document_filename && (
            <TouchableOpacity
              style={styles.documentRow}
              onPress={() => handleDownload(application.document_filename!)}
            >
              <View style={styles.documentIcon}>
                <Ionicons name="document-text-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.documentContent}>
                <Text style={styles.documentText}>View Document</Text>
                <Text style={styles.documentSubtext}>Tap to download</Text>
              </View>
              <Ionicons name="download-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
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
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Allowance Applications</Text>
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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Allowance Applications</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchApplications}>
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
        <Text style={styles.headerTitle}>Allowance Applications</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="card-outline" size={32} color={Colors.primary} />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Pending Applications</Text>
            <Text style={styles.summaryCount}>{applications.length}</Text>
          </View>
        </View>
      </View>

      {/* Applications List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {applications.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Ionicons name="document-outline" size={48} color={Colors.textLight} />
            <Text style={styles.noDataText}>No pending applications found</Text>
            <Text style={styles.noDataSubtext}>All allowance applications have been processed</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {applications.map(renderApplicationCard)}
          </View>
        )}
      </ScrollView>

      {/* Status Selection Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SELECT STATUS</Text>
              <TouchableOpacity onPress={() => setShowStatusModal(false)}>
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            
            {selectedApplication && (
              <View style={styles.modalBody}>
                <Text style={styles.modalVillagerName}>
                  {selectedApplication.Full_Name}
                </Text>
                <Text style={styles.modalVillagerId}>
                  ID: {selectedApplication.Villager_ID}
                </Text>
                
                <Text style={{fontSize: 20, color: '#000000', fontWeight: 'bold', marginBottom: 16}}>
                  Choose New Status:
                </Text>
                
                {statusOptions.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      status === (pendingStatuses[`${selectedApplication.Villager_ID}-${selectedApplication.Allowances_ID}`] || selectedApplication.status) && 
                      styles.selectedStatusOption
                    ]}
                    onPress={() => {
                      setPendingStatuses({
                        ...pendingStatuses,
                        [`${selectedApplication.Villager_ID}-${selectedApplication.Allowances_ID}`]: status,
                      });
                    }}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      status === (pendingStatuses[`${selectedApplication.Villager_ID}-${selectedApplication.Allowances_ID}`] || selectedApplication.status) && 
                      styles.selectedStatusOptionText
                    ]}>
                      {status.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity
                  style={styles.confirmModalButton}
                  onPress={() => {
                    const newStatus = pendingStatuses[`${selectedApplication.Villager_ID}-${selectedApplication.Allowances_ID}`];
                    if (newStatus && newStatus !== selectedApplication.status) {
                      handleStatusConfirm(selectedApplication.Villager_ID, selectedApplication.Allowances_ID, newStatus);
                    } else {
                      setShowStatusModal(false);
                    }
                  }}
                >
                  <Text style={styles.confirmModalButtonText}>CONFIRM</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  summaryContainer: {
    padding: Spacing.md,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryContent: {
    marginLeft: Spacing.md,
  },
  summaryTitle: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  summaryCount: {
    fontSize: Typography.xxl,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    padding: Spacing.md,
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
  allowanceType: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.lg,
  },
  allowanceText: {
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
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  documentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  documentContent: {
    flex: 1,
  },
  documentText: {
    fontSize: Typography.base,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  documentSubtext: {
    fontSize: Typography.sm,
    color: Colors.textLight,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    flex: 1,
    alignItems: 'center',
  },
  viewButtonText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    margin: Spacing.md,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalBody: {
    flex: 1,
  },
  modalVillagerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: Spacing.xs,
  },
  modalVillagerId: {
    fontSize: 14,
    color: '#666666',
    marginBottom: Spacing.md,
  },
  statusOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    
  },
  selectedStatusOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  statusOptionText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  selectedStatusOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  confirmModalButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmModalButtonText: {
    color: 'white',
    fontSize: 16,
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
});
