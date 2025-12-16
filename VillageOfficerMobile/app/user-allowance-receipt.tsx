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

interface AllowanceReceipt {
  id: string;
  Allowances_Type: string;
  apply_date: string;
  receipt_path: string;
}

const UserAllowanceReceiptScreen: React.FC = () => {
  const router = useRouter();
  const [receipts, setReceipts] = useState<AllowanceReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Mock API call - replace with actual API call
      // const data = await fetchConfirmedAllowanceApplications();
      console.log("Loading allowance receipts...");
      
      // Mock data for demonstration
      const mockData: AllowanceReceipt[] = [
        {
          id: '1',
          Allowances_Type: 'Senior Citizen Allowance',
          apply_date: '2024-01-15',
          receipt_path: 'senior_allowance_001.pdf',
        },
        {
          id: '2',
          Allowances_Type: 'Disability Allowance',
          apply_date: '2024-02-20',
          receipt_path: 'disability_allowance_002.pdf',
        },
        {
          id: '3',
          Allowances_Type: 'Widow Allowance',
          apply_date: '2024-03-10',
          receipt_path: '',
        },
        {
          id: '4',
          Allowances_Type: 'Student Allowance',
          apply_date: '2024-04-05',
          receipt_path: 'student_allowance_004.pdf',
        },
      ];
      
      setReceipts(mockData);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching allowance receipts:', err);
      const errorMessage = (err as any).response?.data?.error || (err as any).message || 'Failed to fetch your allowance receipts';
      setError(errorMessage);
      setLoading(false);
      Alert.alert('Error', errorMessage);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReceipts();
    setRefreshing(false);
  };

  const handleDownload = async (filename: string) => {
    try {
      if (!filename) {
        Alert.alert('Not Available', 'Allowance receipt is not available for download');
        return;
      }

      // Mock download URL - replace with actual API endpoint
      const downloadUrl = `https://your-api-url.com/api/download/${filename}`;
      
      console.log('Downloading receipt:', filename);
      
      // For now, create a mock PDF content (in real app, download from API)
      const mockPdfContent = 'JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFIvTGFuZyhlbi1VUykgL1N0cnVjdFRyZWVSb290IDEgMCBSPj4KZW5kb2JqCjEgMCBvYmoKPDAvVHlwZS9TdHJ1Y3RUcmVlL1BhcmVudCAwIFIvS2lkcyBbMyAwIFJdPj4KZW5kb2JqCjIgMCBvYmoKPDwvVHlwZS9QYWdlL1BhcmVudCAxIDAgUi9NZWRpYUJveFswIDAgNjEyIDc5Ml0vQ29udGVudHMgMyAwIFIvUmVzb3VyY2VzIDw8L0ZvbnQ8PC9GMSA0IDAgUj4+Pj4+PgplbmRvYmoKMyAwIG9iago8PC9MZW5ndGggNDQ+PnN0cmVhbQKQlQKL0YxIDEyIFRGCjcyIDcyMCBUZAooQWxsb3dhbmNlIFJlY2VpcHQpIFRqCkVUCjRFRgoKZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCjw8L1R5cGUvRm9udC9TdWJ0eXBlL1R5cGUxL0Jhc2VGb250L0hlbZ2V0aWNhPj4KZW5kb2JqCnhyZWYKNSAwIFIKJSVFT0YK';
      
      // Get the document directory path
      const documentDir = FileSystem.documentDirectory || '';
      const fileUri = `${documentDir}${filename}`;
      
      // Write file to device storage using base64 encoding
      await FileSystem.writeAsStringAsync(fileUri, mockPdfContent, {
        encoding: 'base64',
      });
      
      console.log('File saved to:', fileUri);
      
      // Check if sharing is available and share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Allowance Receipt',
        });
      } else {
        // If sharing is not available, just show success message
        Alert.alert(
          'Download Complete',
          `Allowance receipt saved to device storage!\n\nFile: ${filename}\nLocation: Documents folder`,
          [{ text: 'OK' }]
        );
      }
      
    } catch (err: any) {
      console.error('Error downloading allowance receipt:', err);
      const errorMessage = (err as any).response?.data?.error || (err as any).message || 'Failed to download receipt';
      setError(errorMessage);
      setLoading(false);
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

  const renderReceiptItem = ({ item }: { item: AllowanceReceipt }) => (
    <View style={styles.receiptItem}>
      <View style={styles.receiptInfo}>
        <Text style={styles.allowanceType}>{item.Allowances_Type || 'N/A'}</Text>
        <Text style={styles.applicationDate}>
          Applied: {formatDate(item.apply_date)}
        </Text>
      </View>
      <View style={styles.downloadSection}>
        {item.receipt_path ? (
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => handleDownload(item.receipt_path)}
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
      <Ionicons name="receipt-outline" size={64} color={Colors.textLight} />
      <Text style={styles.emptyStateText}>No allowance receipts available for you</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Allowance Receipts</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your allowance receipts...</Text>
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
          <Text style={styles.headerTitle}>My Allowance Receipts</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadReceipts}>
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
        <Text style={styles.headerTitle}>My Allowance Receipts</Text>
      </View>

      <FlatList
        data={receipts}
        renderItem={renderReceiptItem}
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
  receiptItem: {
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
  receiptInfo: {
    flex: 1,
  },
  allowanceType: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  applicationDate: {
    fontSize: Typography.sm,
    color: Colors.textLight,
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

export default UserAllowanceReceiptScreen;