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
import * as villagerApi from '../src/api/villager';

interface Voter {
  Villager_ID: string;
  Full_Name: string;
  Address: string;
  DOB: string;
  RegionalDivision: string;
  Status: string;
  Area_ID: string;
}

export default function EligibleVoters() {
  const router = useRouter();
  const [voters, setVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchVotersData();
  }, []);

  const fetchVotersData = async () => {
    try {
      const data = await villagerApi.fetchVillagers();
      const eligibleVoters = data.filter((villager: Voter) => {
        if (!villager.DOB || typeof villager.DOB !== 'string') return false;
        const dob = new Date(villager.DOB);
        if (isNaN(dob.getTime())) return false;
        const today = new Date('2025-05-25');
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          return age - 1 === 18;
        }
        return age === 18;
      });
      setVoters(eligibleVoters);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching voters:', err);
      setError(err.error || 'Failed to fetch voter data');
      setLoading(false);
      Alert.alert('Error', err.error || 'Failed to fetch voter data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVotersData();
    setRefreshing(false);
  };

  const handleSendNotification = async (villagerId: string, fullName: string) => {
    try {
      const message = 'Congratulations on turning 18! You are now eligible to vote.';
      await villagerApi.sendNotification(villagerId, message);
      setSentNotifications((prev) => new Set(prev).add(villagerId));
      Alert.alert('Success', `Notification sent to ${fullName}`);
    } catch (err: any) {
      console.error('Error sending notification:', err);
      Alert.alert('Error', err.error || 'Failed to send notification');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    if (!dateString || typeof dateString !== 'string') return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dob: string) => {
    if (!dob || typeof dob !== 'string') return 'N/A';
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) return 'N/A';
    const today = new Date('2025-05-25');
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  const renderVoterCard = (voter: Voter) => {
    const age = calculateAge(voter.DOB);
    const isNotificationSent = sentNotifications.has(voter.Villager_ID);

    return (
      <View key={voter.Villager_ID} style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.voterInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="white" />
            </View>
            <View style={styles.voterDetails}>
              <Text style={styles.voterName}>{voter.Full_Name}</Text>
              <Text style={styles.voterId}>ID: {voter.Villager_ID}</Text>
              <Text style={styles.ageBadge}>Age: {age}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.notificationButton, isNotificationSent && styles.notificationSent]}
            onPress={() => handleSendNotification(voter.Villager_ID, voter.Full_Name)}
            disabled={isNotificationSent}
          >
            <Ionicons 
              name={isNotificationSent ? "checkmark" : "mail-outline"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Address */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="home-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{voter.Address || 'N/A'}</Text>
            </View>
          </View>

          {/* Date of Birth */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{formatDate(voter.DOB)}</Text>
            </View>
          </View>

          {/* Regional Division */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="location-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Regional Division</Text>
              <Text style={styles.infoValue}>{voter.RegionalDivision || 'N/A'}</Text>
            </View>
          </View>

          {/* Status */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="checkmark-circle-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{voter.Status || 'N/A'}</Text>
            </View>
          </View>

          {/* Area ID */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="map-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Area ID</Text>
              <Text style={styles.infoValue}>{voter.Area_ID || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Notification Status */}
        <View style={styles.cardFooter}>
          <View style={styles.notificationStatus}>
            <Ionicons 
              name={isNotificationSent ? "checkmark-circle" : "time-outline"} 
              size={16} 
              color={isNotificationSent ? Colors.success : Colors.textLight} 
            />
            <Text style={[
              styles.notificationStatusText,
              isNotificationSent && styles.notificationSentText
            ]}>
              {isNotificationSent ? 'Notification Sent' : 'Notification Pending'}
            </Text>
          </View>
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
          <Text style={styles.headerTitle}>Eligible Voters (Age 18)</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading eligible voters...</Text>
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
          <Text style={styles.headerTitle}>Eligible Voters (Age 18)</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchVotersData}>
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
        <Text style={styles.headerTitle}>Eligible Voters (Age 18)</Text>
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
          {voters.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Ionicons name="people-outline" size={48} color={Colors.textLight} />
              <Text style={styles.noDataText}>No eligible voters found</Text>
              <Text style={styles.noDataSubtext}>No voters aged 18 found in the system</Text>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              <Text style={styles.resultsCount}>{voters.length} eligible voters found</Text>
              {voters.map(renderVoterCard)}
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
  resultsCount: {
    fontSize: Typography.base,
    color: Colors.textLight,
    marginBottom: Spacing.md,
    textAlign: 'center',
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
  voterInfo: {
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
  voterDetails: {
    flex: 1,
  },
  voterName: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  voterId: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  ageBadge: {
    fontSize: Typography.sm,
    color: Colors.success,
    fontWeight: '600',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationSent: {
    backgroundColor: Colors.success,
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
  cardFooter: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  notificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationStatusText: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginLeft: Spacing.xs,
  },
  notificationSentText: {
    color: Colors.success,
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
    marginBottom: Spacing.sm,
  },
  noDataSubtext: {
    fontSize: Typography.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
