import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import { useAuth } from '../src/context/AuthContext';
import {
  fetchElections,
  fetchElectionNotifications,
  checkVillagerElectionApplication,
  submitElectionApplication,
} from '../src/api/election';
import { getProfile } from '../src/api/villager';

const UserElectionScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    type: '',
  });

  const [electionTypes, setElectionTypes] = useState<any[]>([]);
  const [allowedElectionTypes, setAllowedElectionTypes] = useState<string[]>([]);
  const [appliedElections, setAppliedElections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const calculateAge = (dob: string): number | null => {
    if (!dob) return null;
    const dobDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await getProfile();

        setFormData({
          email: profile.Email || '',
          type: '',
        });

        const age = calculateAge(profile.DOB);
        setUserAge(age);

        const [elections, notifications] = await Promise.all([
          fetchElections(),
          fetchElectionNotifications(),
        ]);

        setElectionTypes(elections);

        const allowedTypes =
          notifications.length > 0
            ? notifications.map((n: any) => n.Type)
            : elections.map((e: any) => e.Type);

        setAllowedElectionTypes(allowedTypes);

        if (profile.Villager_ID) {
          const checks = await Promise.all(
            elections.map((e: any) =>
              checkVillagerElectionApplication(profile.Villager_ID, e.Type)
            )
          );

          const applied = checks
            .flat()
            .map((a: any) => a.Type)
            .filter(Boolean);

          setAppliedElections(applied);
        }
      } catch (err: any) {
        setError(err?.error || err?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getTranslationKey = (apiType: string): string => {
    const map: any = {
      'Presidential Election': 'Presidential Election',
      'Parliament Election': 'Parliament Election',
      'Local Election': 'Local Election',
      'Division Election': 'Division Election',
    };
    return map[apiType] || apiType;
  };

  const handleSubmit = async () => {
    if (!formData.type) {
      Alert.alert('Validation Error', 'Please select an election type');
      return;
    }

    if (userAge === null || userAge < 17) {
      Alert.alert('Age Restriction', 'You must be at least 17 years old');
      return;
    }

    if (!allowedElectionTypes.includes(formData.type)) {
      Alert.alert('Not Allowed', 'This election is not available for you');
      return;
    }

    if (appliedElections.includes(formData.type)) {
      Alert.alert('Already Applied', 'You have already applied for this election');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('email', formData.email);
      fd.append('electionType', formData.type);

      await submitElectionApplication(fd);

      Alert.alert('Success', 'Election application submitted', [
        { text: 'OK', onPress: () => router.push('/(user)/dashboard' as any) },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.error || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading elections...</Text>
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
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Election Application</Text>
        </View>

        <View style={styles.content}>
          {error && <Text style={styles.error}>{error}</Text>}

          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={formData.email} editable={false} />

          <Text style={styles.label}>Election Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              const options = electionTypes
                .filter(
                  (e: any) =>
                    allowedElectionTypes.includes(e.Type) &&
                    !appliedElections.includes(e.Type)
                )
                .map((e: any) => ({
                  text: getTranslationKey(e.Type),
                  onPress: () =>
                    setFormData((p) => ({ ...p, type: e.Type })),
                }));

              if (options.length === 0) {
                Alert.alert(
                  'No Elections',
                  'No available elections for you at the moment'
                );
                return;
              }

              Alert.alert(
                'Select Election',
                '',
                [...options, { text: 'Cancel', style: 'cancel' }]
              );
            }}
          >
            <Text>{formData.type || 'Select election type'}</Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          {userAge !== null && userAge < 17 && (
            <Text style={styles.warning}>
              You must be at least 17 years old (Age: {userAge})
            </Text>
          )}

          <TouchableOpacity
            style={[styles.submit, submitting && styles.disabled]}
            disabled={submitting}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom Footer - Clean Neutral Icons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/user-dashboard')}
        >
          <Ionicons name="home-outline" size={26} color="#333" />
          <Text style={styles.activeFooterText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/user-profile')}
        >
          <Ionicons name="person-outline" size={26} color="#888" />
          <Text style={styles.footerText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/family-details')}
        >
          <Ionicons name="people-outline" size={26} color="#888" />
          <Text style={styles.footerText}>Family</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/notifications')}
        >
          <View>
            <Ionicons name="notifications-outline" size={26} color="#888" />
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

export default UserElectionScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.text,
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: Typography.lg,
    fontWeight: 'bold',
    marginLeft: Spacing.md,
  },
  content: { padding: Spacing.lg },
  label: { fontWeight: '600', marginTop: Spacing.md },
  input: {
    backgroundColor: '#eee',
    padding: Spacing.md,
    borderRadius: 6,
    marginTop: 4,
  },
  dropdown: {
    backgroundColor: '#eee',
    padding: Spacing.md,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  submit: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 6,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  submitText: { color: 'white', fontWeight: '600' },
  disabled: { backgroundColor: '#aaa' },
  error: { color: 'red', marginBottom: Spacing.md },
  warning: { color: '#856404', marginTop: Spacing.sm },

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