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
import * as certificateApi from '../src/api/certificateApplication';

interface CertificateApplication {
  application_id: string;
  Villager_ID: string;
  Full_Name: string;
  apply_date: string;
  reason: string;
  status: string;
  document_filename?: string;
}

export default function RequestsForCertificates() {
  const router = useRouter();
  const [applications, setApplications] = useState<CertificateApplication[]>([]);
  const [pendingStatuses, setPendingStatuses] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      console.log("Fetching certificate applications");
      const data = await certificateApi.fetchCertificateApplications();
      console.log('Fetched certificate applications:', data);
      const filteredApplications = data.filter((app: CertificateApplication) => 
        app.status === 'Pending' || app.status === 'Rejected' || app.status === 'Confirm' || app.status === 'Send'
      ).sort((a: CertificateApplication, b: CertificateApplication) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return new Date(b.apply_date).getTime() - new Date(a.apply_date).getTime();
      });
      setApplications(filteredApplications);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.error || 'Failed to fetch certificate applications');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const handleStatusSelect = (villagerId: string, applicationId: string, application: CertificateApplication) => {
    Alert.alert(
      'Status Selection',
      `Changing status for ${application.Full_Name}\n\nCurrent options:\n- PENDING\n- SEND\n- REJECTED\n- CONFIRMED`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pending', onPress: () => updateStatusDirectly(villagerId, applicationId, 'Pending') },
        { text: 'Send', onPress: () => updateStatusDirectly(villagerId, applicationId, 'Send') },
        { text: 'Rejected', onPress: () => updateStatusDirectly(villagerId, applicationId, 'Rejected') },
        { text: 'Confirmed', onPress: () => updateStatusDirectly(villagerId, applicationId, 'Confirm') },
      ]
    );
  };

  const updateStatusDirectly = async (villagerId: string, applicationId: string, newStatus: string) => {
    try {
      await certificateApi.updateCertificateApplicationStatus(applicationId, newStatus);
      // Update the status in the applications state instead of filtering out the row
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.application_id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      Alert.alert('Success', `Status updated to ${newStatus}`);
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

  const handleSendCertificate = (applicationId: string) => {
    console.log('Navigating to send certificate for application:', applicationId);
    Alert.alert('Info', `Send certificate feature coming soon for application: ${applicationId}`);
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

  const renderApplicationCard = (application: CertificateApplication) => {
    const statusKey = `${application.Villager_ID}-${application.application_id}`;
    const currentStatus = pendingStatuses[statusKey] || application.status || 'Pending';

    return (
      <View key={statusKey} style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.villagerInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="white" />
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
          {/* Application ID */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="document-text-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Application ID</Text>
              <Text style={styles.infoValue}>{application.application_id}</Text>
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

          {/* Reason Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Reason</Text>
              <Text style={styles.infoValue}>{application.reason || 'N/A'}</Text>
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
                onPress={() => handleStatusSelect(application.Villager_ID, application.application_id, application)}
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
              onPress={() => Alert.alert('Info', `Document: ${application.document_filename}`)}
            >
              <View style={styles.documentIcon}>
                <Ionicons name="document-text-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.documentContent}>
                <Text style={styles.documentText}>View Document</Text>
                <Text style={styles.documentSubtext}>Tap to view</Text>
              </View>
              <Ionicons name="eye-outline" size={20} color={Colors.primary} />
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

          <TouchableOpacity
            style={[
              styles.certificateButton,
              application.status !== 'Confirm' && styles.disabledButton
            ]}
            onPress={() => handleSendCertificate(application.application_id)}
            disabled={application.status !== 'Confirm'}
          >
            <Ionicons name="mail-outline" size={18} color={application.status === 'Confirm' ? 'white' : Colors.textLight} />
            <Text style={[
              styles.certificateButtonText,
              application.status !== 'Confirm' && styles.disabledButtonText
            ]}>
              Certificate
            </Text>
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
          <Text style={styles.headerTitle}>Certificate Applications</Text>
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
          <Text style={styles.headerTitle}>Certificate Applications</Text>
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
        <Text style={styles.headerTitle}>Certificate Applications</Text>
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
              <Ionicons name="document-outline" size={48} color={Colors.textLight} />
              <Text style={styles.noDataText}>No certificate applications found</Text>
              <Text style={styles.noDataSubtext}>All certificate applications have been processed</Text>
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
  certificateButton: {
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
  disabledButton: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  certificateButtonText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  disabledButtonText: {
    color: Colors.textLight,
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
