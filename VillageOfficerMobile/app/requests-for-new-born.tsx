import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as villagerApi from '../src/api/villager';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

interface NewBornRequest {
  Email: string;
  Address: string;
  Villager_ID: string;
  Relationship: string;
  BirthCertificatePath: string;
  MotherNicPath: string;
  FatherNicPath: string;
  MarriageCertificatePath: string;
  ResidenceCertificatePath: string;
}

export default function RequestsForNewBorn() {
  const router = useRouter();
  const [requests, setRequests] = useState<NewBornRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await villagerApi.fetchNewBornRequests();
      setRequests(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.error || 'Failed to fetch new born requests');
      setLoading(false);
      Alert.alert('Error', err.error || 'Failed to fetch new born requests');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const handleDownload = async (filename: string) => {
    try {
      if (!filename) {
        Alert.alert('Not Available', 'Document is not available for download');
        return;
      }

      console.log('Downloading document:', filename);
      
      // Download the document from API
      const blobData = await villagerApi.downloadNewBornDocument(filename);
      
      // Check if the response is actually an HTML error page
      if (blobData.type === 'text/html') {
        // Convert blob to text to check for error content
        const text = await blobData.text();
        if (text.includes('<html>') || text.includes('Error') || text.includes('404')) {
          throw new Error('Server returned an error page instead of the document');
        }
      }
      
      // Convert blob to base64 for React Native file system
      const base64Data = await blobToBase64(blobData);
      
      // Get the document directory path
      const documentDir = FileSystem.documentDirectory || '';
      const fileUri = `${documentDir}${filename}`;
      
      // Write file to device storage using base64 encoding
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: 'base64',
      });
      
      console.log('File saved to:', fileUri);
      
      // Check if sharing is available and share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share New Born Document',
        });
      } else {
        // If sharing is not available, just show success message
        Alert.alert(
          'Download Complete',
          `Document saved to device storage!\n\nFile: ${filename}\nLocation: Documents folder`,
          [{ text: 'OK' }]
        );
      }
      
    } catch (err: any) {
      console.error('Error downloading document:', err);
      const errorMessage = err.error || err.message || 'Failed to download document';
      Alert.alert('Download Failed', errorMessage);
    }
  };

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix to get pure base64
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleBack = () => {
    router.back();
  };

  const renderRequestCard = (request: NewBornRequest, index: number) => {
    return (
      <View key={`${request.Villager_ID}-${index}`} style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.requestInfo}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-outline" size={24} color="white" />
            </View>
            <View style={styles.requestDetails}>
              <Text style={styles.requestTitle}>New Born Request</Text>
              <Text style={styles.requestId}>ID: {request.Villager_ID}</Text>
              <Text style={styles.relationship}>{request.Relationship}</Text>
            </View>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Email */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{request.Email || 'N/A'}</Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="home-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{request.Address || 'N/A'}</Text>
            </View>
          </View>

          {/* Relationship */}
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="people-outline" size={18} color={Colors.textLight} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Relationship</Text>
              <Text style={styles.infoValue}>{request.Relationship || 'N/A'}</Text>
            </View>
          </View>

          {/* Documents Section */}
          <View style={styles.documentsSection}>
            <Text style={styles.documentsTitle}>Documents</Text>
            
            {/* Birth Certificate */}
            {request.BirthCertificatePath && (
              <TouchableOpacity
                style={styles.documentRow}
                onPress={() => handleDownload(request.BirthCertificatePath)}
              >
                <View style={styles.documentIcon}>
                  <Ionicons name="document-outline" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.documentName}>Birth Certificate</Text>
                <Ionicons name="download-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            )}

            {/* Mother NIC */}
            {request.MotherNicPath && (
              <TouchableOpacity
                style={styles.documentRow}
                onPress={() => handleDownload(request.MotherNicPath)}
              >
                <View style={styles.documentIcon}>
                  <Ionicons name="id-card-outline" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.documentName}>Mother NIC</Text>
                <Ionicons name="download-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            )}

            {/* Father NIC */}
            {request.FatherNicPath && (
              <TouchableOpacity
                style={styles.documentRow}
                onPress={() => handleDownload(request.FatherNicPath)}
              >
                <View style={styles.documentIcon}>
                  <Ionicons name="id-card-outline" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.documentName}>Father NIC</Text>
                <Ionicons name="download-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            )}

            {/* Marriage Certificate */}
            {request.MarriageCertificatePath && (
              <TouchableOpacity
                style={styles.documentRow}
                onPress={() => handleDownload(request.MarriageCertificatePath)}
              >
                <View style={styles.documentIcon}>
                  <Ionicons name="document-text-outline" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.documentName}>Marriage Certificate</Text>
                <Ionicons name="download-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            )}

            {/* Residence Certificate */}
            {request.ResidenceCertificatePath && (
              <TouchableOpacity
                style={styles.documentRow}
                onPress={() => handleDownload(request.ResidenceCertificatePath)}
              >
                <View style={styles.documentIcon}>
                  <Ionicons name="home-outline" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.documentName}>Residence Certificate</Text>
                <Ionicons name="download-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Born Requests</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading new born requests...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Born Requests</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchRequests}>
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
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Born Requests</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          {requests.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Ionicons name="person-outline" size={48} color={Colors.textLight} />
              <Text style={styles.noDataText}>No new born requests found</Text>
              <Text style={styles.noDataSubtext}>No new born registration requests in the system</Text>
            </View>
          ) : (
            <View style={styles.cardsContainer}>
              <Text style={styles.resultsCount}>{requests.length} new born requests found</Text>
              {requests.map((request, index) => renderRequestCard(request, index))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.error,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    fontSize: Typography.base,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
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
  resultsCount: {
    fontSize: Typography.base,
    color: Colors.textLight,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  cardsContainer: {
    paddingBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  requestDetails: {
    flex: 1,
  },
  requestTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  requestId: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  relationship: {
    fontSize: Typography.sm,
    color: Colors.success,
    fontWeight: '600',
  },
  cardBody: {
    padding: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: Typography.base,
    color: Colors.text,
    fontWeight: '500',
  },
  documentsSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  documentsTitle: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: '#f8f9fa',
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.sm,
  },
  documentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  documentName: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noDataText: {
    marginTop: Spacing.md,
    fontSize: Typography.lg,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  noDataSubtext: {
    fontSize: Typography.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
