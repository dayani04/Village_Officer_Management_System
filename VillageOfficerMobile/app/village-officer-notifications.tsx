import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as electionApi from '../src/api/election';

interface Election {
  ID: string;
  Type: string;
}

interface Notification {
  notification_id: string;
  Type: string;
  message: string;
  created_at: string;
}

export default function VillageOfficerNotifications() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    electionType: '',
    message: '',
  });
  const [electionTypes, setElectionTypes] = useState<Election[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const [elections, fetchedNotifications] = await Promise.all([
        electionApi.fetchElections(),
        electionApi.fetchElectionNotifications(),
      ]);

      setElectionTypes(elections || []);
      setNotifications(fetchedNotifications || []);
    } catch (err: any) {
      const msg = err.error || err.message || 'Unknown error occurred';
      setError('Failed to load data: ' + msg);
      console.error('Load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'electionType' && value) {
      setFormData((prev) => ({
        ...prev,
        message: `Apply now for the ${value} election! Registration is open.`,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.electionType || !formData.message.trim()) {
      Alert.alert('Missing Fields', 'Please select an election and enter a message.');
      return;
    }

    try {
      setSubmitting(true);
      await electionApi.sendElectionNotification(formData.electionType, formData.message);
      await loadData();
      Alert.alert('Success!', 'Notification sent successfully');
      setFormData({ electionType: '', message: '' });
    } catch (err: any) {
      Alert.alert('Error', err.error || err.message || 'Failed to send notification');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotification = (notificationId: string, electionType: string) => {
    Alert.alert(
      'Delete Notification?',
      `This will remove the notification for "${electionType}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await electionApi.deleteElectionNotification(notificationId);
              await loadData();
              Alert.alert('Deleted!', 'Notification removed.');
            } catch (err: any) {
              Alert.alert('Error', 'Could not delete notification.');
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  const getAvailableElections = () => {
    return electionTypes.filter(
      (election) => !notifications.some((n) => n.Type === election.Type)
    );
  };

  const renderNotificationCard = (notification: Notification) => (
    <View key={notification.notification_id} style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <Text style={styles.electionType}>{notification.Type}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(notification.notification_id, notification.Type)}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.notificationMessage}>{notification.message}</Text>
      
      <Text style={styles.notificationDate}>
        {new Date(notification.created_at).toLocaleString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Manage Notifications</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading data...</Text>
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
        <Text style={styles.headerTitle}>Manage Notifications</Text>
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
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Send New Notification Form */}
          <View style={styles.formCard}>
            <Text style={styles.cardTitle}>Send New Notification</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Election Type *</Text>
              <View style={styles.selectContainer}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    const availableElections = getAvailableElections();
                    if (availableElections.length === 0) {
                      Alert.alert('No Elections', 'All elections have notifications already.');
                      return;
                    }
                    Alert.alert(
                      'Select Election',
                      'Choose an election type:',
                      availableElections.map((election) => ({
                        text: election.Type,
                        onPress: () => handleInputChange('electionType', election.Type),
                      }))
                    );
                  }}
                >
                  <Text style={styles.selectButtonText}>
                    {formData.electionType || '-- Select Election --'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={Colors.textLight} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Message *</Text>
              <TextInput
                style={styles.textArea}
                value={formData.message}
                onChangeText={(value) => handleInputChange('message', value)}
                placeholder="Enter your notification message..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!submitting}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={submitting || !!error}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Send Notification</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* List of Sent Notifications */}
          <View style={styles.notificationsCard}>
            <Text style={styles.cardTitle}>
              Sent Notifications ({notifications.length})
            </Text>

            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off-outline" size={48} color={Colors.textLight} />
                <Text style={styles.emptyStateText}>
                  No notifications have been sent yet.
                </Text>
              </View>
            ) : (
              <View style={styles.notificationsList}>
                {notifications.map(renderNotificationCard)}
              </View>
            )}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.error,
    flex: 1,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  notificationsCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  selectContainer: {
    marginBottom: Spacing.sm,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  selectButtonText: {
    fontSize: Typography.base,
    color: Colors.text,
    flex: 1,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.base,
    color: Colors.text,
    backgroundColor: Colors.white,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
  notificationsList: {
    gap: Spacing.md,
  },
  notificationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  electionType: {
    fontSize: Typography.base,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationMessage: {
    fontSize: Typography.base,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: Typography.sm,
    color: Colors.textLight,
  },
});
