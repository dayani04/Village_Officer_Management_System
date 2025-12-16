import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Required for clean icons
import { getVillagerNotifications, markNotificationAsRead } from '../src/api/villager';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';

const NotificationScreen: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getVillagerNotifications();
        const unreadNotifications = data.filter((notif: any) => !notif.Is_Read);
        setNotifications(unreadNotifications);
        setNotificationCount(unreadNotifications.length);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching notifications:', err);
        setError(err.error || 'Failed to fetch notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => prev.filter(notif => notif.Notification_ID !== notificationId));
      setNotificationCount(prev => prev - 1);
      Alert.alert('Success', 'Notification marked as read');
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      Alert.alert('Error', err.error || 'Failed to mark notification as read');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
  };

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
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
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        {/* Notifications List */}
        <View style={styles.content}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error}</Text>
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.noNotificationsContainer}>
              <Text style={styles.noNotificationsText}>
                No unread notifications found
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {notifications.map(notification => (
                <View key={notification.Notification_ID} style={styles.notificationCard}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationId}>
                      ID: {notification.Notification_ID || 'N/A'}
                    </Text>
                    <Text style={styles.notificationStatus}>
                      {notification.Is_Read ? 'Read' : 'Unread'}
                    </Text>
                  </View>

                  <Text style={styles.notificationMessage}>
                    {notification.Message || 'N/A'}
                  </Text>

                  <Text style={styles.notificationDate}>
                    {formatDate(notification.Created_At)}
                  </Text>

                  <TouchableOpacity
                    style={styles.markReadButton}
                    onPress={() => handleMarkAsRead(notification.Notification_ID)}
                  >
                    <Text style={styles.markReadButtonText}>Mark as Read</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Footer - Clean Neutral Icons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => router.push('/user-dashboard')}
        >
          <Ionicons name="home-outline" size={26} color="#888" />
          <Text style={styles.footerText}>Home</Text>
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

        <TouchableOpacity style={styles.footerItem}>
          <View>
            <Ionicons name="notifications-outline" size={26} color="#333" />
            {notificationCount > 0 && (
              <View style={styles.footerBadge}>
                <Text style={styles.footerBadgeText}>{notificationCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.activeFooterText}>Notifications</Text>
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
  noNotificationsContainer: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  noNotificationsText: {
    fontSize: Typography.base,
    color: '#6c757d',
    textAlign: 'center',
  },
  notificationsList: {
    marginBottom: Spacing.lg,
  },
  notificationCard: {
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
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  notificationId: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  notificationStatus: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: '#28a745',
  },
  notificationMessage: {
    fontSize: Typography.base,
    color: Colors.text,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: Typography.sm,
    color: '#6c757d',
    marginBottom: Spacing.md,
  },
  markReadButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  markReadButtonText: {
    color: 'white',
    fontSize: Typography.sm,
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

export default NotificationScreen;