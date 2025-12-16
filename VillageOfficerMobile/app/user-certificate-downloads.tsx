import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserConfirmedCertificates } from '../src/api/certificateApplication';

interface Certificate {
  id: string;
  certificate_type: string;
  apply_date: string;
  status: string;
  certificate_path: string;
}

const UserCertificateDownloadsScreen: React.FC = () => {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log("Loading certificates...");
      const data = await fetchUserConfirmedCertificates();
      
      // Transform the data to match the interface
      const transformedData = data.map((item: any, index: number) => ({
        id: item.id || index.toString(),
        certificate_type: item.certificate_type || 'N/A',
        apply_date: item.apply_date || item.required_date || new Date().toISOString(),
        status: item.status || 'Pending',
        certificate_path: item.certificate_path || null,
      }));
      
      setCertificates(transformedData);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching certificates:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch your certificates';
      setError(errorMessage);
      setLoading(false);
      Alert.alert('Error', errorMessage);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCertificates();
    setRefreshing(false);
  };

  const handleDownload = async (filename: string) => {
    try {
      if (!filename) {
        Alert.alert('Not Available', 'Certificate is not available for download');
        return;
      }

      console.log('Downloading certificate:', filename);
      
      // Get auth token
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        Alert.alert('Authentication Error', 'Please login again to download certificates');
        return;
      }
      
      // For React Native, we'll use a different approach
      // Create a download URL and use FileSystem.downloadAsync
      const API_URL = 'http://172.20.10.3:5000/api';
      const downloadUrl = `${API_URL}/certificate-applications/download/${filename}`;
      
      // Get the document directory path
      const documentDir = FileSystem.documentDirectory || '';
      const fileUri = `${documentDir}${filename}`;
      
      // Download the file directly with authentication headers
      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        },
        (downloadProgressInfo) => {
          const progress = downloadProgressInfo.totalBytesWritten / downloadProgressInfo.totalBytesExpectedToWrite;
          console.log(`Download progress: ${Math.round(progress * 100)}%`);
        }
      );
      
      try {
        const result = await downloadResumable.downloadAsync();
        console.log('File downloaded to:', result?.uri);
        
        // Check if sharing is available and share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result!.uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share Certificate',
          });
        } else {
          // If sharing is not available, just show success message
          Alert.alert(
            'Download Complete',
            `Certificate saved to device storage!\n\nFile: ${filename}\nLocation: Documents folder`,
            [{ text: 'OK' }]
          );
        }
      } catch (downloadError) {
        console.error('Download failed:', downloadError);
        throw downloadError;
      }
      
    } catch (err: any) {
      console.error('Error downloading certificate:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to download certificate';
      setError(errorMessage);
      Alert.alert('Download Failed', errorMessage);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  const getCertificateTypeLabel = (type: string): string => {
    switch (type) {
      case 'birth':
        return 'Birth Certificate';
      case 'residence':
        return 'Residence Certificate';
      case 'marriage':
        return 'Marriage Certificate';
      default:
        return type || 'Certificate';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'rejected':
        return Colors.error;
      default:
        return Colors.gray;
    }
  };

  const renderCertificateItem = ({ item }: { item: Certificate }) => (
    <View style={styles.certificateItem}>
      <View style={styles.certificateInfo}>
        <Text style={styles.certificateType}>
          {getCertificateTypeLabel(item.certificate_type)}
        </Text>
        <Text style={styles.applicationDate}>
          Applied: {formatDate(item.apply_date)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.downloadSection}>
        {item.certificate_path ? (
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => handleDownload(item.certificate_path)}
          >
            <Ionicons name="download-outline" size={20} color="white" />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.notAvailableContainer}>
            <Text style={styles.notAvailableText}>Not Available</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={64} color={Colors.textLight} />
      <Text style={styles.emptyStateText}>No certificates available for you</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Certificates</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your certificates...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Certificates</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadCertificates}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Certificates</Text>
      </View>

      <FlatList
        data={certificates}
        renderItem={renderCertificateItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xl,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
  },
  retryButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  listContainer: {
    padding: Spacing.md,
  },
  certificateItem: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateType: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  applicationDate: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: Typography.xs,
    fontWeight: '600',
  },
  downloadSection: {
    marginLeft: Spacing.md,
  },
  downloadButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    minWidth: 100,
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  notAvailableContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
  },
  notAvailableText: {
    color: Colors.textLight,
    fontSize: Typography.sm,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyStateText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default UserCertificateDownloadsScreen;