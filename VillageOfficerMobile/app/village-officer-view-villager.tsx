import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import { fetchVillager, downloadDocument } from '../src/api/villager';

interface Villager {
  Villager_ID: string;
  Full_Name: string;
  Email: string;
  Phone_No: string;
  NIC: string;
  DOB: string;
  Address: string;
  RegionalDivision: string;
  Status: string;
  Area_ID: string;
  Latitude: number;
  Longitude: number;
  IsParticipant: boolean;
  Alive_Status: string;
  BirthCertificate?: string;
  NICCopy?: string;
}

export default function ViewVillager() {
  const router = useRouter();
  const { villagerId } = useLocalSearchParams();
  const [villager, setVillager] = useState<Villager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (villagerId) {
      fetchVillagerDetails();
    }
  }, [villagerId]);

  const fetchVillagerDetails = async () => {
    try {
      const data = await fetchVillager(villagerId as string);
      setVillager(data);
    } catch (err: any) {
      setError(err.error || 'Failed to fetch villager');
    }
    setLoading(false);
  };

  const handleDownload = async (filename: string, documentType: string) => {
    if (!filename) {
      Alert.alert('Error', `${documentType} not available`);
      return;
    }

    try {
      setDownloading(prev => ({ ...prev, [documentType]: true }));
      
      const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
      const blob = await downloadDocument(cleanFilename);
      
      // For React Native, we can't directly download files like web
      // We'll show the filename and inform user about the document
      Alert.alert(
        'Document Available',
        `${documentType} is available: ${filename}\n\nContact administrator to download the document.`,
        [{ text: 'OK' }]
      );
      
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', `Failed to access ${documentType}`);
    } finally {
      setDownloading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const handleBack = () => {
    router.push('/village-officer-villagers' as any);
  };

  const handleEdit = () => {
    router.push(`/village-officer-edit-villager?villagerId=${villagerId}` as any);
  };

  const renderInfoRow = (label: string, value: string | number | boolean) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value?.toString() || 'N/A'}</Text>
    </View>
  );

  const renderDocumentRow = (label: string, filename?: string) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      {filename ? (
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownload(filename, label)}
          disabled={downloading[label]}
        >
          <Ionicons 
            name={downloading[label] ? 'download-outline' : 'document-outline'} 
            size={16} 
            color={Colors.primary} 
          />
          <Text style={styles.downloadButtonText}>
            {downloading[label] ? 'Loading...' : 'View Document'}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.infoValue}>N/A</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Villager Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading villager details...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Villager Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchVillagerDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Villager Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.sectionContent}>
            {renderInfoRow('Villager ID', villager?.Villager_ID)}
            {renderInfoRow('Full Name', villager?.Full_Name)}
            {renderInfoRow('Email', villager?.Email)}
            {renderInfoRow('Phone Number', villager?.Phone_No)}
            {renderInfoRow('NIC', villager?.NIC)}
            {renderInfoRow('Date of Birth', villager?.DOB ? 
              new Date(villager.DOB).toLocaleDateString('en-GB') : 'N/A')}
          </View>
        </View>

        {/* Location Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Information</Text>
          <View style={styles.sectionContent}>
            {renderInfoRow('Address', villager?.Address)}
            {renderInfoRow('Regional Division', villager?.RegionalDivision)}
            {renderInfoRow('Area ID', villager?.Area_ID)}
            {renderInfoRow('Latitude', villager?.Latitude)}
            {renderInfoRow('Longitude', villager?.Longitude)}
          </View>
        </View>

        {/* Status Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status Information</Text>
          <View style={styles.sectionContent}>
            {renderInfoRow('Status', villager?.Status)}
            {renderInfoRow('Election Participant', villager?.IsParticipant ? 'Yes' : 'No')}
            {renderInfoRow('Alive Status', villager?.Alive_Status)}
          </View>
        </View>

        {/* Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          <View style={styles.sectionContent}>
            {renderDocumentRow('Birth Certificate', villager?.BirthCertificate)}
            {renderDocumentRow('NIC Copy', villager?.NICCopy)}
          </View>
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
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    color: 'white',
    fontSize: Typography.xl,
    fontWeight: 'bold',
  },
  editButton: {
    padding: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Spacing.borderRadius.sm,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.text,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionContent: {
    padding: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  infoLabel: {
    fontSize: Typography.base,
    color: Colors.textLight,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: Typography.base,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
  },
  downloadButtonText: {
    color: Colors.primary,
    fontSize: Typography.sm,
    fontWeight: '500',
    marginLeft: Spacing.xs,
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
  errorText: {
    fontSize: Typography.base,
    color: Colors.error,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
  },
  retryButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
});
