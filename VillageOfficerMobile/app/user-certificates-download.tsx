import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';

interface OptionCardProps {
  imgSrc: string;
  altText: string;
  buttonText: string;
  linkTo: string;
}

const OptionCard: React.FC<OptionCardProps> = ({
  imgSrc,
  altText,
  buttonText,
  linkTo,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(linkTo as any);
  };

  return (
    <TouchableOpacity style={styles.optionCard} onPress={handleClick} activeOpacity={0.8}>
      <Image source={{ uri: imgSrc }} style={styles.cardImage} resizeMode="contain" />
      <View style={styles.buttonContainer}>
        <Text style={styles.optionButtonText}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const UserCertificatesDownloadScreen: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const handleBack = () => {
    router.back();
  };

  const options = [
    {
      imgSrc: "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg",
      altText: "Permit Certificates",
      buttonText: "Permit Certificates",
      linkTo: "/user-permit-certificates",
    },
    {
      imgSrc: "https://img.freepik.com/premium-photo/happy-young-sri-lankan-family-family-portrait_1106493-124766.jpg",
      altText: "Allowance Receipt",
      buttonText: "Allowance Receipt",
      linkTo: "/user-allowance-receipt",
    },
    {
      imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1A7ebBxxSVZA3w3X7_6EIOHftpxLuNJHYaQ&s",
      altText: "NIC Receipt",
      buttonText: "NIC Receipt",
      linkTo: "/user-nic-receipt",
    },
    {
      imgSrc: "https://cdn-icons-png.freepik.com/512/7132/7132557.png",
      altText: "Election Receipt",
      buttonText: "Election Receipt",
      linkTo: "/user-election-receipt",
    },
    {
      imgSrc: "https://cdn-icons-png.freepik.com/512/1822/1822916.png",
      altText: "Certificate Downloads",
      buttonText: "Certificate Downloads",
      linkTo: "/user-certificate-downloads",
    },
  ];

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading certificates...</Text>
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
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Download Certificates</Text>
        </View>

        {/* Options Grid */}
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <View key={index} style={styles.optionRow}>
              <OptionCard
                imgSrc={option.imgSrc}
                altText={option.altText}
                buttonText={option.buttonText}
                linkTo={option.linkTo}
              />
              {index < options.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
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

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
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
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionRow: {
    marginBottom: Spacing.md,
  },
  optionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: Spacing.borderRadius.sm,
    marginRight: Spacing.md,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionButtonText: {
    backgroundColor: Colors.primary,
    color: 'white',
    textAlign: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.borderRadius.sm,
    fontSize: Typography.base,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: Spacing.md,
    marginLeft: 76,
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

export default UserCertificatesDownloadScreen;