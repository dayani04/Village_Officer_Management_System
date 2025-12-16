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
import { submitCertificateApplication, checkRecentApplication } from '../src/api/certificateApplication';
import { getProfile } from '../src/api/villager';

const UserCertificateScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    reason: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0); // Optional: fetch real count later

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await getProfile();
        setFormData(prev => ({
          ...prev,
          email: profile.Email || '',
        }));
        setLoading(false);
      } catch (err: any) {
        setError(err?.error || err?.message || 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!formData.email) {
      Alert.alert('Validation Error', 'Email is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Validation Error', 'Invalid email format');
      return;
    }

    if (!formData.reason.trim()) {
      Alert.alert('Validation Error', 'Reason is required');
      return;
    }

    setSubmitting(true);
    try {
      const recentApplicationCheck = await checkRecentApplication(formData.email);

      if (recentApplicationCheck.hasRecentApplication) {
        setSubmitting(false);
        Alert.alert(
          'Application Restriction',
          `You have already applied for a certificate on ${new Date(recentApplicationCheck.applicationDate).toLocaleDateString()}. You can only apply once every 6 months. Please try again after ${6 - recentApplicationCheck.monthsSinceApplication} month(s).`
        );
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('reason', formData.reason);

      await submitCertificateApplication(formDataToSend);

      Alert.alert('Success', 'Certificate application submitted successfully', [
        { text: 'OK', onPress: () => router.push('/(user)/dashboard' as any) }
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
          <Text style={styles.loadingText}>Loading...</Text>
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
          <Text style={styles.headerTitle}>Certificate Application</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          {error && <Text style={styles.error}>{error}</Text>}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            editable={false}
            placeholder="Email"
          />

          <Text style={styles.label}>Reason</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.reason}
            onChangeText={(text) => setFormData(prev => ({ ...prev, reason: text }))}
            placeholder="Enter reason for certificate application"
            multiline
            numberOfLines={4}
            editable={!submitting}
          />

          <TouchableOpacity
            style={[styles.submit, submitting && styles.disabled]}
            disabled={submitting}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitText}>Submit Application</Text>
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

export default UserCertificateScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Prevents content from being hidden under footer
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
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontSize: Typography.lg,
    fontWeight: 'bold',
  },
  content: { padding: Spacing.lg },
  label: { fontWeight: '600', marginTop: Spacing.md },
  input: {
    backgroundColor: '#eee',
    padding: Spacing.md,
    borderRadius: 6,
    marginTop: 4,
    fontSize: Typography.base,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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

  // Footer Styles (Identical to all other screens)
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
  footerIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  activeIcon: {
    color: Colors.primary,
  },
  inactiveIcon: {
    color: '#888',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: Colors.primary,
  },
  inactiveText: {
    color: '#888',
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