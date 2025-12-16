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
import { fetchPermits, checkVillagerPermitApplication, submitPermitApplication } from '../src/api/permit';
import { getProfile } from '../src/api/villager';

interface Permit {
  Permits_ID: number;
  Permits_Type: string;
}

const UserPermitScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    type: '',
    requiredDate: '',
  });
  const [permitTypes, setPermitTypes] = useState<Permit[]>([]);
  const [activePermits, setActivePermits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [villagerId, setVillagerId] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0); // Optional: fetch real count

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await getProfile();
        setFormData(prev => ({
          ...prev,
          email: profile.Email || '',
        }));
        setVillagerId(profile.Villager_ID);

        const permits = await fetchPermits();
        setPermitTypes(permits);

        if (profile.Villager_ID) {
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1;
          const applications = await checkVillagerPermitApplication(profile.Villager_ID, year, month);
          const active = applications.filter((app: any) => new Date(app.required_date) >= currentDate);
          setActivePermits(active.map((app: any) => app.Permits_Type));
        }

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

  const validateDate = (date: string): boolean => {
    const parsedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(parsedDate.getTime()) && parsedDate > today;
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.type || !formData.requiredDate) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Validation Error', 'Invalid email format');
      return;
    }

    if (!validateDate(formData.requiredDate)) {
      Alert.alert('Validation Error', 'Required date must be a valid future date');
      return;
    }

    if (activePermits.includes(formData.type)) {
      Alert.alert('Validation Error', `You have an active application for ${formData.type}. Please wait until the required date has passed.`);
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('permitType', formData.type);
      formDataToSend.append('requiredDate', formData.requiredDate);

      await submitPermitApplication(formDataToSend);

      Alert.alert('Success', 'Permit application submitted successfully', [
        { text: 'OK', onPress: () => router.push('/(user)/dashboard' as any) }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.error || 'Failed to submit permit application');
    } finally {
      setSubmitting(false);
    }
  };

  const showDatePicker = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    Alert.alert(
      'Select Date',
      'Please enter a future date in YYYY-MM-DD format',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Info',
          onPress: () => {
            Alert.alert(
              'Date Format',
              `Minimum date: ${tomorrow.toISOString().split('T')[0]}\n\nPlease enter the date manually in the field above.`
            );
          }
        }
      ]
    );
  };

  // Loading State
  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading permits...</Text>
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
          <Text style={styles.headerTitle}>Permit Application</Text>
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

          <Text style={styles.label}>Permit Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              const availablePermits = permitTypes.filter(
                (permit: Permit) => !activePermits.includes(permit.Permits_Type)
              );

              if (availablePermits.length === 0) {
                Alert.alert('No Permits', 'No available permits for you at the moment');
                return;
              }

              const options = availablePermits.map((permit: Permit) => ({
                text: permit.Permits_Type,
                onPress: () => setFormData(prev => ({ ...prev, type: permit.Permits_Type }))
              }));

              Alert.alert(
                'Select Permit',
                'Choose a permit type:',
                [...options, { text: 'Cancel', style: 'cancel' }]
              );
            }}
          >
            <Text>{formData.type || 'Select permit type'}</Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          <Text style={styles.label}>Required Date</Text>
          <View style={styles.dateContainer}>
            <TextInput
              style={styles.dateInput}
              value={formData.requiredDate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, requiredDate: text }))}
              placeholder="YYYY-MM-DD"
            />
            <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
              <Ionicons name="calendar" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {formData.requiredDate && !validateDate(formData.requiredDate) && (
            <Text style={styles.warning}>
              Required date must be a future date
            </Text>
          )}

          {activePermits.length > 0 && (
            <Text style={styles.activePermitsNote}>
              Active permits: {activePermits.join(', ')}
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

export default UserPermitScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer
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
  },
  dropdown: {
    backgroundColor: '#eee',
    padding: Spacing.md,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateInput: {
    flex: 1,
    backgroundColor: '#eee',
    padding: Spacing.md,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  dateButton: {
    padding: Spacing.md,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  warning: {
    color: '#856404',
    marginTop: Spacing.sm,
    backgroundColor: '#fff3cd',
    padding: Spacing.sm,
    borderRadius: 6,
  },
  activePermitsNote: {
    color: '#155724',
    marginTop: Spacing.sm,
    backgroundColor: '#d4edda',
    padding: Spacing.sm,
    borderRadius: 6,
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

  // Footer Styles (Same across all screens)
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