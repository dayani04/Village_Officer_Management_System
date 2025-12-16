import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Animated,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { useAuth } from '../../context/AuthContext';
import {
  fetchVillageTotal,
  fetchVillageParticipantTotal,
  fetchHouseCount,
} from '../../api/villager';

console.log('VillageOfficerDashboardScreen component loaded successfully!');

interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const VillageOfficerDashboardScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [cardData, setCardData] = useState<DashboardCard[]>([
    { title: 'Total Villagers', value: 'Loading...', icon: 'people-outline', color: '#4caf50' },
    { title: 'Active Participants', value: 'Loading...', icon: 'checkmark-circle-outline', color: '#2196f3' },
    { title: 'Total House', value: 'Loading...', icon: 'home-outline', color: '#ff9800' },
    { title: 'Pending Requests', value: '23', icon: 'time-outline', color: '#f44336' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
  const [showHoldersDropdown, setShowHoldersDropdown] = useState(false);

  const dropdownAnimation = new Animated.Value(0);
  const holdersAnimation = new Animated.Value(0);

  const requestItems = [
    { id: 'allowance', title: 'Allowance', icon: 'card-outline', count: undefined },
    { id: 'certificate', title: 'Certificate', icon: 'document-text-outline', count: undefined },
    { id: 'nic-card', title: 'NIC Card', icon: 'id-card-outline', count: undefined },
    { id: 'permits', title: 'Permits', icon: 'key-outline', count: undefined },
    { id: 'election', title: 'Election', icon: 'bar-chart-outline', count: undefined },
    { id: 'vote-list', title: 'Vote List', icon: 'list-outline', count: undefined },
    // { id: 'new-born', title: 'New Born', icon: 'person-outline', count: undefined },
    // { id: 'new-villager', title: 'New Villager', icon: 'person-add-outline', count: undefined },
    // { id: 'other', title: 'Other', icon: 'folder-outline', count: 2 },
  ];

  const holdersItems = [
    { id: 'allowance', title: 'Allowance', icon: 'card-outline', count: undefined },
    { id: 'permit', title: 'Permit', icon: 'key-outline', count: undefined },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [totalVillagers, totalParticipants, totalHouses] = await Promise.all([
          fetchVillageTotal(),
          fetchVillageParticipantTotal(),
          fetchHouseCount(),
        ]);
        
        setCardData([
          { title: 'Total Villagers', value: totalVillagers.toString(), icon: 'people-outline', color: '#4caf50' },
          { title: 'Active Participants', value: totalParticipants.toString(), icon: 'checkmark-circle-outline', color: '#2196f3' },
          { title: 'Total House', value: totalHouses.toString(), icon: 'home-outline', color: '#ff9800' },
          { title: 'Pending Requests', value: '23', icon: 'time-outline', color: '#f44336' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => router.push('/' as any) }
      ]
    );
  };

  const toggleRequestsDropdown = () => {
    if (showRequestsDropdown) {
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setShowRequestsDropdown(false));
    } else {
      setShowRequestsDropdown(true);
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const toggleHoldersDropdown = () => {
    if (showHoldersDropdown) {
      Animated.timing(holdersAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setShowHoldersDropdown(false));
    } else {
      setShowHoldersDropdown(true);
      Animated.timing(holdersAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleRequestPress = (item: any) => {
    if (item.id === 'allowance') {
      router.push('/requests-for-allowances' as any);
      toggleRequestsDropdown();
    } else if (item.id === 'certificate') {
      router.push('/requests-for-certificates' as any);
      toggleRequestsDropdown();
    } else if (item.id === 'nic-card') {
      router.push('/requests-for-nic-cards' as any);
      toggleRequestsDropdown();
    } else if (item.id === 'permits') {
      router.push('/requests-for-permits' as any);
      toggleRequestsDropdown();
    } else if (item.id === 'election') {
      router.push('/requests-for-elections' as any);
      toggleRequestsDropdown();
    } else if (item.id === 'vote-list') {
      router.push('/eligible-voters' as any);
      toggleRequestsDropdown();
    } else if (item.id === 'new-born') {
      router.push('/requests-for-new-born' as any);
      toggleRequestsDropdown();
    } else if (item.id === 'new-villager') {
      router.push('/requests-for-new-villagers' as any);
      toggleRequestsDropdown();
    } else {
      Alert.alert(
        `${item.title}`,
        `${item.count || 0} pending requests\n\nFeature coming soon!`,
        [{ text: 'OK', style: 'default' }]
      );
      toggleRequestsDropdown();
    }
  };

  const handleHoldersPress = (item: any) => {
    if (item.id === 'allowance') {
      router.push('/holders-allowance' as any);
      toggleHoldersDropdown();
    } else if (item.id === 'permit') {
      router.push('/holders.permit' as any);
      toggleHoldersDropdown();
    } else {
      Alert.alert(
        `${item.title}`,
        `${item.count || 0} items\n\nFeature coming soon!`,
        [{ text: 'OK', style: 'default' }]
      );
      toggleHoldersDropdown();
    }
  };

  const menuItems = [
    { title: 'Villagers', icon: 'people-outline', route: '/village-officer-villagers' },
    { title: 'Houses', icon: 'home-outline', route: '/village-officer-houses' },
    { title: 'Requests', icon: 'document-text-outline', route: '/' },
    { title: 'Holders', icon: 'card-outline', route: '/' },
    // { title: 'Village Officer', icon: 'shield-outline', route: '/village-officer-management' },
    { title: 'Notifications', icon: 'notifications-outline', route: '/village-officer-notifications' },
    { title: 'My Profile', icon: 'person-outline', route: '/village-officer-profile' },
  ];

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
          <Text style={styles.headerTitle}>Village Officer Dashboard</Text>
        </View>

        <ScrollView style={styles.scrollContent}>
          {/* Welcome Message */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome, {user?.name || 'Village Officer'}!</Text>
            <Text style={styles.subtitle}>Manage your village efficiently</Text>
          </View>

          {/* Dashboard Cards */}
          <View style={styles.cardsContainer}>
            {cardData.map((card, index) => (
              <View key={index} style={[styles.card, { backgroundColor: card.color }]}>
                <View style={styles.cardIcon}>
                  <Ionicons name={card.icon as any} size={32} color="white" />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardValue}>{card.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Management</Text>
            {menuItems.map((item, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    if (item.route === '/village-officer-villagers' || 
                        item.route === '/village-officer-houses' || 
                        item.route === '/village-officer-notifications' || 
                        item.route === '/village-officer-profile' || 
                        item.route === '/village-officer-management') {
                      router.push(item.route as any);
                    } else if (item.title === 'Requests') {
                      toggleRequestsDropdown();
                    } else if (item.title === 'Holders') {
                      toggleHoldersDropdown();
                    } else {
                      Alert.alert('Coming Soon', `${item.title} feature will be available soon.`);
                    }
                  }}
                >
                  <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
                  <Text style={styles.menuText}>{item.title}</Text>
                  <Ionicons 
                    name={
                      (item.title === 'Requests' && showRequestsDropdown) || 
                      (item.title === 'Holders' && showHoldersDropdown)
                        ? 'chevron-up' 
                        : 'chevron-forward'
                    } 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
                
                {/* Requests Dropdown */}
                {item.title === 'Requests' && showRequestsDropdown && (
                  <View style={styles.dropdownContainer}>
                    {requestItems.map((requestItem) => (
                      <TouchableOpacity
                        key={requestItem.id}
                        style={styles.dropdownItem}
                        onPress={() => handleRequestPress(requestItem)}
                      >
                        <View style={styles.dropdownIcon}>
                          <Ionicons name={requestItem.icon as any} size={20} color={Colors.primary} />
                          {(requestItem.count && requestItem.count > 0) && (
                            <View style={styles.countBadge}>
                              <Text style={styles.countBadgeText}>{requestItem.count}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.dropdownText}>{requestItem.title}</Text>
                        <Ionicons name="chevron-forward" size={16} color="#999" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Holders Dropdown */}
                {item.title === 'Holders' && showHoldersDropdown && (
                  <View style={styles.dropdownContainer}>
                    {holdersItems.map((holderItem) => (
                      <TouchableOpacity
                        key={holderItem.id}
                        style={styles.dropdownItem}
                        onPress={() => handleHoldersPress(holderItem)}
                      >
                        <View style={styles.dropdownIcon}>
                          <Ionicons name={holderItem.icon as any} size={20} color={Colors.primary} />
                          {(holderItem.count && holderItem.count > 0) && (
                            <View style={styles.countBadge}>
                              <Text style={styles.countBadgeText}>{holderItem.count}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.dropdownText}>{holderItem.title}</Text>
                        <Ionicons name="chevron-forward" size={16} color="#999" />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Fixed Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => router.push('/village-officer-profile' as any)}
          >
            <Ionicons name="person-outline" size={24} color={Colors.primary} />
            <Text style={styles.footerText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={() => router.push('/village-officer-notifications' as any)}
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
  menuContainer: {
    padding: Spacing.md,
  },
  menuTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: Spacing.md,
  },
  menuItem: {
    backgroundColor: 'white',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuText: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: Typography.base,
    color: '#333',
  },
  dropdownContainer: {
    backgroundColor: 'white',
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
    borderBottomColor: Colors.border,
  },
  dropdownIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    position: 'relative',
  },
  dropdownText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  countBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#f44336',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeText: {
    color: 'white',
    fontSize: Typography.xs,
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

export default VillageOfficerDashboardScreen;