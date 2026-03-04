import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../api/villager';
import { Ionicons } from '@expo/vector-icons';

interface OptionCardProps {
  icon: string;
  buttonText: string;
  onPress: () => void;
  notificationCount?: number;
}

const OptionCard: React.FC<OptionCardProps> = ({
  icon,
  buttonText,
  onPress,
  notificationCount = 0,
}) => {
  return (
    <TouchableOpacity style={styles.optionCard} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <View style={styles.buttonContainer}>
        <Text style={styles.optionButtonText}>{buttonText}</Text>
        {notificationCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const UserDashboardScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('User');
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const profileData = await getProfile();
      setUserName(profileData.full_name || profileData.name || 'User');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  // Updated Logout Handler – Now redirects to login page after logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout(); // Clear auth state (token, user, etc.)
            router.push('/'); // Redirect to login screen (adjust route if needed)
            // Common alternatives:
            // router.push('/login');
            // router.push('/(auth)/login');
            // router.replace('/') – use replace() if you don't want back navigation to dashboard
          },
        },
      ]
    );
  };

  const navigateToScreen = (screenName: string) => {
    switch (screenName) {
      case 'UserProfile':
        router.push('/user-profile' as any);
        break;
      case 'FamilyDetails':
        router.push('/family-details' as any);
        break;
      case 'Notifications':
        router.push('/notifications' as any);
        break;
      case 'Certificates':
        router.push('/user-certificates-download' as any);
        break;
      case 'ElectionApplication':
        router.push('/user-election' as any);
        break;
      case 'AllowanceApplication':
        router.push('/user-allowance' as any);
        break;
      case 'PermitApplication':
        router.push('/user-permit' as any);
        break;
      case 'CertificateApplication':
        router.push('/user-certificate' as any);
        break;
      case 'IDCardApplication':
        router.push('/user-idcard' as any);
        break;
      default:
        Alert.alert('Coming Soon', `The ${screenName} feature is under development.`);
    }
  };

  const handleFooterPress = (tab: string, route?: string) => {
    setActiveTab(tab);
    if (route) {
      navigateToScreen(route);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.optionsGrid}>
            <OptionCard
              icon="👤"
              buttonText="Edit Profile"
              onPress={() => navigateToScreen('UserProfile')}
            />
            <OptionCard
              icon="👨‍👩‍👧‍👦"
              buttonText="Family Details"
              onPress={() => navigateToScreen('FamilyDetails')}
            />
            <OptionCard
              icon="🔔"
              buttonText="Notifications"
              onPress={() => navigateToScreen('Notifications')}
              notificationCount={notificationCount}
            />
            <OptionCard
              icon="📜"
              buttonText="Permit & Certificates"
              onPress={() => navigateToScreen('Certificates')}
            />
          </View>
        </View>

        {/* Application Processes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Processes</Text>
          <View style={styles.optionsGrid}>
            <OptionCard
              icon="🗳️"
              buttonText="Apply for Election"
              onPress={() => navigateToScreen('ElectionApplication')}
            />
            <OptionCard
              icon="💰"
              buttonText="Apply for Allowance"
              onPress={() => navigateToScreen('AllowanceApplication')}
            />
            <OptionCard
              icon="🪪"
              buttonText="Apply for Permit"
              onPress={() => navigateToScreen('PermitApplication')}
            />
            <OptionCard
              icon="📄"
              buttonText="Apply for Certificate"
              onPress={() => navigateToScreen('CertificateApplication')}
            />
            <OptionCard
              icon="🪪"
              buttonText="Apply for ID Card"
              onPress={() => navigateToScreen('IDCardApplication')}
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleFooterPress('home')}
        >
          <Ionicons
            name="home-outline"
            size={26}
            color={activeTab === 'home' ? '#333' : '#888'}
          />
          <Text style={[styles.footerText, activeTab === 'home' && styles.activeFooterText]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleFooterPress('profile', 'UserProfile')}
        >
          <Ionicons
            name="person-outline"
            size={26}
            color={activeTab === 'profile' ? '#333' : '#888'}
          />
          <Text style={[styles.footerText, activeTab === 'profile' && styles.activeFooterText]}>
            Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleFooterPress('family', 'FamilyDetails')}
        >
          <Ionicons
            name="people-outline"
            size={26}
            color={activeTab === 'family' ? '#333' : '#888'}
          />
          <Text style={[styles.footerText, activeTab === 'family' && styles.activeFooterText]}>
            Family
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => handleFooterPress('notifications', 'Notifications')}
        >
          <View>
            <Ionicons
              name="notifications-outline"
              size={26}
              color={activeTab === 'notifications' ? '#333' : '#888'}
            />
            {notificationCount > 0 && (
              <View style={styles.footerBadge}>
                <Text style={styles.footerBadgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.footerText, activeTab === 'notifications' && styles.activeFooterText]}>
            Notifications
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#921940',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  section: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 18,
    marginLeft: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    minHeight: 180,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  cardIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  buttonContainer: {
    position: 'relative',
    width: '100%',
  },
  optionButtonText: {
    backgroundColor: '#921940',
    color: 'white',
    textAlign: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  notificationBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#f43f3f',
    borderRadius: 14,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
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

export default UserDashboardScreen;