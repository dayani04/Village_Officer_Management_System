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
import { fetchAllowances, checkVillagerAllowanceApplication, submitAllowanceApplication } from '../src/api/allowance';
import { getProfile } from '../src/api/villager';

interface Allowance {
  Allowances_ID: number;
  Allowances_Type: string;
}

const UserAllowanceScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    type: '',
  });
  const [allowanceTypes, setAllowanceTypes] = useState<Allowance[]>([]);
  const [appliedAllowances, setAppliedAllowances] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAge, setUserAge] = useState<number | null>(null);
  const [notificationCount, setNotificationCount] = useState(0); // Optional: fetch real count later

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

        const allowances = await fetchAllowances();

        // Filter Adult Allowances for under 70
        let filteredAllowances = allowances;
        if (age === null || age < 70) {
          filteredAllowances = allowances.filter(
            (allowance: Allowance) => allowance.Allowances_Type !== "Adult Allowances"
          );
        }

        setAllowanceTypes(filteredAllowances);

        if (profile.Villager_ID) {
          const applications = await checkVillagerAllowanceApplication(profile.Villager_ID);
          const appliedTypes = applications.map((app: any) => app.Allowances_Type).filter(Boolean);
          setAppliedAllowances(appliedTypes);
        }

        setLoading(false);
      } catch (err: any) {
        setError(err?.error || err?.message || 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getTranslationKey = (apiType: string): string => {
    const map: { [key: string]: string } = {
      "Adult Allowances": "Adult Allowances",
      "Disabled Allowances": "Disabled Allowances",
      "Widow Allowances": "Widow Allowances",
      "Nutritional And Food Allowance": "Nutritional And Food Allowance",
      "Agriculture And Farming Subsidies Allowances": "Agriculture And Farming Subsidies Allowances",
    };
    return map[apiType] || apiType;
  };

  const handleSubmit = async () => {
    if (!formData.type) {
      Alert.alert('Validation Error', 'Please select an allowance type');
      return;
    }

    if (formData.type === "Adult Allowances" && (userAge === null || userAge < 70)) {
      Alert.alert('Age Restriction', 'Adult Allowances are only available for people 70 years and older');
      return;
    }

    if (appliedAllowances.includes(formData.type)) {
      Alert.alert('Already Applied', 'You have already applied for this allowance');
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('email', formData.email);
      formDataToSend.append('allowanceType', formData.type);

      await submitAllowanceApplication(formDataToSend);

      Alert.alert('Success', 'Allowance application submitted successfully', [
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
          <Text style={styles.loadingText}>Loading allowances...</Text>
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
          <Text style={styles.headerTitle}>Allowance Application</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          {error && <Text style={styles.error}>{error}</Text>}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            editable={false}
          />

          <Text style={styles.label}>Allowance Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => {
              const availableAllowances = allowanceTypes.filter(
                (allowance: Allowance) => !appliedAllowances.includes(allowance.Allowances_Type)
              );

              if (availableAllowances.length === 0) {
                Alert.alert('No Allowances', 'No available allowances for you at the moment');
                return;
              }

              const options = availableAllowances.map((allowance: Allowance) => ({
                text: getTranslationKey(allowance.Allowances_Type),
                onPress: () => setFormData(prev => ({ ...prev, type: allowance.Allowances_Type }))
              }));

              Alert.alert(
                'Select Allowance',
                'Choose an allowance type:',
                [...options, { text: 'Cancel', style: 'cancel' }]
              );
            }}
          >
            <Text>{formData.type || 'Select allowance type'}</Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>

          {formData.type && (
            <Text style={styles.selectedAllowance}>
              Selected: {getTranslationKey(formData.type)}
            </Text>
          )}

          {userAge !== null && userAge < 70 && (
            <Text style={styles.warning}>
              Adult Allowances are only available for people 70 years and older (Your age: {userAge})
            </Text>
          )}

          {appliedAllowances.length > 0 && (
            <Text style={styles.appliedNote}>
              Already applied for: {appliedAllowances.map(type => getTranslationKey(type)).join(', ')}
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

export default UserAllowanceScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Important: prevents content from hiding under footer
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
  selectedAllowance: {
    color: Colors.primary,
    marginTop: Spacing.sm,
    fontWeight: '500',
  },
  warning: {
    color: '#856404',
    marginTop: Spacing.sm,
    backgroundColor: '#fff3cd',
    padding: Spacing.sm,
    borderRadius: 6,
  },
  appliedNote: {
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

  // Footer Styles (Exact same as all other screens)
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