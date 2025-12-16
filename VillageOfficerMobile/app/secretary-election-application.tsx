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
import * as electionApi from '../src/api/electionApplication';

interface ElectionApplication {
  Villager_ID: string;
  electionrecodeID: string;
  Full_Name: string;
  Election_Type: string;
  apply_date: string;
  status: string;
  document_path?: string;
}

const SecretaryElectionApplicationsScreen: React.FC = () => {
  const router = useRouter();
  const [applications, setApplications] = useState<ElectionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>({});
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await electionApi.fetchElectionApplications();
      const sendApplications = data.filter((app: ElectionApplication) => app.status === "Send");
      setApplications(sendApplications);
    } catch (err: any) {
      console.error('Error fetching election applications:', err);
      setError(err.error || 'Failed to fetch election applications');
      Alert.alert('Fetch Error', err.error || 'Failed to fetch election applications');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleStatusChange = (villagerId: string, electionrecodeID: string, newStatus: string) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [`${villagerId}-${electionrecodeID}`]: newStatus,
    }));
  };

  const handleSend = async (villagerId: string, electionrecodeID: string, electionType: string, fullName: string) => {
    const newStatus = statusUpdates[`${villagerId}-${electionrecodeID}`];
    if (!newStatus) {
      Alert.alert('Status Required', 'Please select a status');
      return;
    }

    try {
      await electionApi.updateElectionApplicationStatus(villagerId, electionrecodeID, newStatus);
      const message = `Your election application for ${electionType} has been updated to ${newStatus}.`;
      await electionApi.saveNotification(villagerId, message);

      setApplications((prev) =>
        prev.filter(
          (app) =>
            !(app.Villager_ID === villagerId && app.electionrecodeID === electionrecodeID && newStatus !== "Send")
        )
      );

      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${electionrecodeID}`];
        return updated;
      });
      setSentNotifications((prev) => new Set(prev).add(`${villagerId}-${electionrecodeID}`));

      Alert.alert('Success', `Status updated and notification sent to ${fullName}`);
    } catch (err: any) {
      Alert.alert('Update Failed', err.error || 'Failed to update status or send notification');
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      await electionApi.downloadDocument(filename);
      Alert.alert('Success', `Document ${filename} downloaded successfully`);
    } catch (err: any) {
      Alert.alert('Download Failed', err.error || 'Failed to download document');
    }
  };

  const handleViewDetails = (villagerId: string) => {
    // Replace this with actual navigation when ready
    // router.push(`/secretary-election-applications-villager-view/${villagerId}`);
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
      case 'send': return '#ff9800';
      case 'rejected': return '#f44336';
      case 'confirm':
      case 'confirmed': return '#4caf50';
      default: return '#666';
    }
  };

  const renderApplicationItem = ({ item }: { item: ElectionApplication }) => {
    const key = `${item.Villager_ID}-${item.electionrecodeID}`;
    const currentStatus = statusUpdates[key] || item.status;
    const isSent = sentNotifications.has(key);

    return (
      <View style={styles.applicationCard}>
        <View style={styles.applicationHeader}>
          <Text style={styles.electionType}>{item.Election_Type}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatus) }]}>
            <Text style={styles.statusText}>{currentStatus.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.applicationDetails}>
          <Text style={styles.applicationDetail}>Applicant: {item.Full_Name || 'N/A'}</Text>
          <Text style={styles.applicationDetail}>ID: {item.Villager_ID || 'N/A'}</Text>
          <Text style={styles.applicationDetail}>Applied: {formatDate(item.apply_date)}</Text>
          <Text style={styles.applicationDetail}>Application ID: {item.electionrecodeID}</Text>
        </View>

        {/* Status Selection Row */}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status</Text>
          <TouchableOpacity
            style={[styles.statusButton, isSent && styles.statusButtonDisabled]}
            onPress={() => {
              Alert.alert(
                'Select Status',
                'Choose new status for this application',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Send', onPress: () => handleStatusChange(item.Villager_ID, item.electionrecodeID, 'Send') },
                  { text: 'Rejected', onPress: () => handleStatusChange(item.Villager_ID, item.electionrecodeID, 'Rejected') },
                  { text: 'Confirm', onPress: () => handleStatusChange(item.Villager_ID, item.electionrecodeID, 'Confirm') },
                ]
              );
            }}
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

        {/* Document Download */}
        {item.document_path && (
          <View style={styles.documentRow}>
            <Text style={styles.documentLabel}>Document:</Text>
            <TouchableOpacity
              style={styles.documentButton}
              onPress={() => handleDownload(item.document_path!)}
            >
              <Ionicons name="document-text-outline" size={16} color={Colors.primary} />
              <Text style={styles.documentButtonText}>Download Document</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.sendButton, isSent && styles.sendButtonDisabled]}
            onPress={() => handleSend(item.Villager_ID, item.electionrecodeID, item.Election_Type, item.Full_Name)}
            disabled={isSent}
          >
            <Ionicons 
              name={isSent ? "checkmark-circle" : "mail-outline"} 
              size={20} 
              color={isSent ? '#999' : 'white'} 
            />
            <Text style={[styles.sendButtonText, isSent && { color: '#999' }]}>
              {isSent ? 'Sent' : 'Send'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewDetailsButton, isSent && styles.viewDetailsButtonDisabled]}
            onPress={() => handleViewDetails(item.Villager_ID)}
            disabled={isSent}
          >
            <Ionicons 
              name="eye-outline" 
              size={20} 
              color={isSent ? '#999' : 'white'} 
            />
            <Text style={[styles.viewDetailsButtonText, isSent && { color: '#999' }]}>
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
          <Text style={styles.headerTitle}>Election Applications (Send)</Text>
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
          <Text style={styles.headerTitle}>Election Applications (Send)</Text>
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
        <Text style={styles.headerTitle}>Election Applications (Send)</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={applications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => `${item.Villager_ID}-${item.electionrecodeID}`}
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
  electionType: {
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
  documentRow: {
    marginBottom: Spacing.md,
  },
  documentLabel: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#e3f2fd',
  },
  documentButtonText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  sendButtonText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  viewDetailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
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

export default SecretaryElectionApplicationsScreen;
