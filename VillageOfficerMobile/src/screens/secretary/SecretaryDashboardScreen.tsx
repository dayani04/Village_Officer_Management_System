import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import {
  fetchVillageTotal,
  fetchVillageParticipantTotal,
  fetchHouseCount,
} from '../../api/villager';

const { width } = Dimensions.get('window');

interface DashboardCard {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const SecretaryDashboardScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard cards data
  const [cardData, setCardData] = useState<DashboardCard[]>([
    { title: 'Total Villagers', value: 'Loading...', icon: 'people-outline', color: '#4caf50' },
    { title: 'Active Participants', value: 'Loading...', icon: 'checkmark-circle-outline', color: '#2196f3' },
    { title: 'Total Houses', value: 'Loading...', icon: 'home-outline', color: '#ff9800' },
    { title: 'Pending Requests', value: '23', icon: 'time-outline', color: '#f44336' },
  ]);

  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
  const [showHoldersDropdown, setShowHoldersDropdown] = useState(false);
  const requestItems = [
    { id: 'allowance', title: 'Allowance Requests', icon: 'card-outline' },
    { id: 'nic', title: 'NIC Requests', icon: 'id-card-outline' },
    { id: 'permit', title: 'Permit Requests', icon: 'key-outline' },
    { id: 'election', title: 'Election Requests', icon: 'bar-chart-outline' },
  ];

  const holdersItems = [
    { id: 'allowance', title: 'Allowance Holders', icon: 'card-outline' },
    { id: 'permit', title: 'Permit Holders', icon: 'key-outline' },
  ];

  useEffect(() => {
    // Check if user is authenticated and is a secretary
    if (!user || user.role !== 'secretary') {
      console.log('User not authenticated or not a secretary, redirecting to login');
      router.push('/' as any);
      return;
    }
    
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if user is authenticated
      console.log('User authenticated:', !!user);
      console.log('User role:', user?.role);
      
      // Debug: Check token in AsyncStorage
      const token = await AsyncStorage.getItem('auth_token');
      console.log('Token in AsyncStorage:', !!token);
      
      const [totalVillagers, participantTotal, houseCount] = await Promise.all([
        fetchVillageTotal(),
        fetchVillageParticipantTotal(),
        fetchHouseCount(),
      ]);

      setCardData([
        { title: 'Total Villagers', value: totalVillagers.toString(), icon: 'people-outline', color: '#4caf50' },
        { title: 'Active Participants', value: participantTotal.toString(), icon: 'checkmark-circle-outline', color: '#2196f3' },
        { title: 'Total Houses', value: houseCount.toString(), icon: 'home-outline', color: '#ff9800' },
        { title: 'Pending Requests', value: '23', icon: 'time-outline', color: '#f44336' },
      ]);

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
      
      // If it's an authentication error, redirect to login
      if (err?.error === 'No token provided' || err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
        console.log('Authentication error detected, redirecting to login');
        logout();
        router.push('/' as any);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            logout();
            router.push('/' as any);
          }
        }
      ]
    );
  };

  const renderDashboardCard = (card: DashboardCard, index: number) => (
    <View key={index} style={[styles.card, { backgroundColor: card.color }]}>
      <View style={styles.cardIcon}>
        <Ionicons name={card.icon as any} size={32} color="white" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardValue}>
          {loading ? <ActivityIndicator size="small" color="white" /> : card.value}
        </Text>
      </View>
    </View>
  );

  const toggleRequestsDropdown = () => setShowRequestsDropdown(!showRequestsDropdown);
  const toggleHoldersDropdown = () => setShowHoldersDropdown(!showHoldersDropdown);

  const handleRequestPress = (id: string) => {
    if (id === 'allowance') {
      router.push('/secretary-allowance-aaplication' as any);
    } else if (id === 'nic') {
      router.push('/secretary-nic-application' as any);
    } else if (id === 'permit') {
      router.push('/secretary-permit-applications' as any);
    } else if (id === 'election') {
      router.push('/secretary-election-applications' as any);
    } else {
      router.push(`/requests-${id}` as any);
    }
  };

  const handleHolderPress = (id: string) => {
    if (id === 'allowance') {
      router.push('/holders-allowance' as any);
    } else if (id === 'permit') {
      router.push('/holders.permit' as any);
    } else {
      router.push(`/holders-${id}` as any);
    }
  };

  const renderMenuItems = () => {
    return (
      <>
        {/* Villagers */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('/secretary-villagers')}
        >
          <Ionicons name="people" size={24} color={Colors.primary} />
          <Text style={styles.menuItemText}>Villagers</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>

        {/* Requests */}
        <View>
          <TouchableOpacity style={styles.menuItem} onPress={toggleRequestsDropdown}>
            <Ionicons name="document-text" size={24} color={Colors.primary} />
            <Text style={styles.menuItemText}>Requests</Text>
            <Ionicons 
              name={showRequestsDropdown ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.textLight} 
            />
          </TouchableOpacity>

          {showRequestsDropdown && (
            <View style={styles.dropdownContainer}>
              {requestItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => handleRequestPress(item.id)}
                >
                  <View style={styles.dropdownIcon}>
                    <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.dropdownText}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Holders */}
        <View>
          <TouchableOpacity style={styles.menuItem} onPress={toggleHoldersDropdown}>
            <Ionicons name="card" size={24} color={Colors.primary} />
            <Text style={styles.menuItemText}>Holders</Text>
            <Ionicons 
              name={showHoldersDropdown ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.textLight} 
            />
          </TouchableOpacity>

          {showHoldersDropdown && (
            <View style={styles.dropdownContainer}>
              {holdersItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => handleHolderPress(item.id)}
                >
                  <View style={styles.dropdownIcon}>
                    <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
                  </View>
                  <Text style={styles.dropdownText}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Village Officers */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('/village-officer-management' as any)}
        >
          <Ionicons name="person-add" size={24} color={Colors.primary} />
          <Text style={styles.menuItemText}>Village Officers</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>

        {/* My Profile */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('/secretary-profile' as any)}
        >
          <Ionicons name="person" size={24} color={Colors.primary} />
          <Text style={styles.menuItemText}>My Profile</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header - Now without logout button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Secretary Dashboard</Text>
        </View>

        <ScrollView style={styles.scrollContent}>
          {/* Welcome Message */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome, {user?.name || 'Secretary'}!</Text>
            <Text style={styles.subtitle}>Manage your village efficiently</Text>
          </View>

          {/* Dashboard Cards */}
          <View style={styles.cardsContainer}>
            {cardData.map(renderDashboardCard)}
          </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Quick Actions</Text>
        {renderMenuItems()}
      </View>

        </ScrollView>

        {/* Fixed Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => router.push('/secretary-profile' as any)}
          >
            <Ionicons name="person-outline" size={24} color={Colors.primary} />
            <Text style={styles.footerText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => router.push('/secretary-notifications' as any)}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
            <Text style={styles.footerText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#f44336" />
            <Text style={[styles.footerText, { color: '#f44336' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    paddingTop: Spacing.xl + 20, // Extra padding for status bar
    paddingBottom: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: Typography.xl,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  welcomeContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: '#666',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  cardValue: {
    color: 'white',
    fontSize: Typography.xl,
    fontWeight: 'bold',
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
  },
  errorText: {
    fontSize: Typography.base,
    color: Colors.error,
  },
  menuContainer: {
    padding: Spacing.md,
  },
  menuTitle: {
    fontSize: Typography.lg,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemText: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.text,
    marginLeft: Spacing.md,
  },
  dropdownContainer: {
    backgroundColor: Colors.white,
    marginLeft: Spacing.xl,
    marginRight: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  dropdownText: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.text,
    fontWeight: '500',
  },
  // Footer Styles
  footer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    marginTop: Spacing.xs,
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
});

export default SecretaryDashboardScreen;