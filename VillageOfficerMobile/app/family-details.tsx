import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Required for icons
import { getProfile, fetchVillagers } from '../src/api/villager';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';

const FamilyDetailsScreen: React.FC = () => {
  const router = useRouter();
  const [familyMembers, setFamilyMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const profile = await getProfile();
        const { Address, Latitude, Longitude } = profile;
        const allVillagers = await fetchVillagers();

        const family = allVillagers.filter(
          villager =>
            villager.Address === Address &&
            villager.Latitude === Latitude &&
            villager.Longitude === Longitude &&
            villager.Villager_ID !== profile.Villager_ID
        );

        setFamilyMembers(family);
        setLoading(false);
      } catch (err: any) {
        setError(err.error || 'Failed to fetch family members');
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleNewBornRequest = () => {
    router.push('/new-bron-request');
  };

  const handleNewFamilyMemberRequest = () => {
    router.push('/new-family-member-request');
  };

  // Loading State
  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading family members...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Family Members</Text>
        </View>

        {/* Family Members List */}
        <View style={styles.content}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error}</Text>
            </View>
          ) : familyMembers.length === 0 ? (
            <View style={styles.noMembersContainer}>
              <Text style={styles.noMembersText}>
                No family members found at your address.
              </Text>
            </View>
          ) : (
            <View style={styles.membersList}>
              {familyMembers.map(villager => (
                <View key={villager.Villager_ID} style={styles.memberCard}>
                  <Text style={styles.memberName}>{villager.Full_Name}</Text>
                  <Text style={styles.memberDetail}>
                    <Text style={styles.detailLabel}>Address:</Text>{' '}
                    {villager.Address || 'N/A'}
                  </Text>
                  <Text style={styles.memberDetail}>
                    <Text style={styles.detailLabel}>Email:</Text> {villager.Email}
                  </Text>
                  <Text style={styles.memberDetail}>
                    <Text style={styles.detailLabel}>Phone:</Text> {villager.Phone_No}
                  </Text>
                  <Text style={styles.memberDetail}>
                    <Text style={styles.detailLabel}>Coordinates:</Text> Lat:{' '}
                    {villager.Latitude}, Lng: {villager.Longitude}
                  </Text>
                  <Text style={styles.memberDetail}>
                    <Text style={styles.detailLabel}>Election Participate:</Text>{' '}
                    {villager.IsParticipant ? 'Yes' : 'No'}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleNewBornRequest}
            >
              <Text style={styles.actionButtonText}>Request For New Born</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleNewFamilyMemberRequest}
            >
              <Text style={styles.actionButtonText}>
                Request For New Family Member
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Footer - Clean Neutral Icons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/user-dashboard')}
        >
          <Ionicons
            name="home-outline"
            size={26}
            color="#888"
          />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/user-profile')}
        >
          <Ionicons
            name="person-outline"
            size={26}
            color="#888"
          />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Ionicons
            name="people-outline"
            size={26}
            color="#333" // Active: darker gray
          />
          <Text style={styles.activeFooterText}>Family</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/notifications')}
        >
          <View>
            <Ionicons
              name="notifications-outline"
              size={26}
              color="#888"
            />
            {notificationCount > 0 && (
              <View style={styles.footerBadge}>
                <Text style={styles.footerBadgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.footerText}>Notifications</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.primary,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  backButton: {
    padding: Spacing.sm,
  },
  backButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontSize: Typography.xl,
    fontWeight: 'bold',
    marginLeft: Spacing.md,
  },
  content: {
    padding: Spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.base,
    color: '#dc3545',
    textAlign: 'center',
  },
  noMembersContainer: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  noMembersText: {
    fontSize: Typography.base,
    color: '#6c757d',
    textAlign: 'center',
  },
  membersList: {
    marginBottom: Spacing.lg,
  },
  memberCard: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberName: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  memberDetail: {
    fontSize: Typography.sm,
    color: '#6c757d',
    marginBottom: Spacing.xs,
  },
  detailLabel: {
    fontWeight: '600',
    color: Colors.text,
  },
  actionButtons: {
    marginTop: Spacing.lg,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  actionButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },

  // Clean Neutral Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  footerItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginTop: 4,
  },
  activeFooterText: {
    color: '#333',
    fontWeight: '700',
  },
  footerBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#f43f3f',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  footerBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default FamilyDetailsScreen;