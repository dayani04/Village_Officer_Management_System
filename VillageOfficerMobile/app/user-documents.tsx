import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../src/context/AuthContext';
import { getProfile, updateVillagerDocuments, downloadDocument } from '../src/api/villager';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';

const UserDocumentsScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [uploading, setUploading] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ birthCertificate?: string; nicCopy?: string }>({});
  const [existingDocuments, setExistingDocuments] = useState<{ birthCertificate?: any; nicCopy?: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExistingDocuments();
  }, []);

  const fetchExistingDocuments = async () => {
    try {
      const profileData = await getProfile();
      console.log('Profile data:', profileData);
      
      // Check if documents exist in profile using same field names as web
      const documents = {
        birthCertificate: profileData.BirthCertificate || null,
        nicCopy: profileData.NICCopy || null
      };
      
      setExistingDocuments(documents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  const handleDownload = async (documentUrl: string, documentType: string) => {
    try {
      console.log('Downloading document:', documentUrl);
      
      // Download the document blob from API
      const blobData = await downloadDocument(documentUrl);
      
      // Convert blob to base64 for React Native
      const reader = new FileReader();
      reader.readAsDataURL(blobData);
      
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result as string;
          const base64Content = base64Data.split(',')[1]; // Remove data:image/pdf;base64, prefix
          
          // Create filename
          const filename = documentUrl.split('/').pop() || `${documentType.replace(' ', '_')}.pdf`;
          
          // Get the document directory path
          const documentDir = FileSystem.documentDirectory || '';
          const fileUri = `${documentDir}${filename}`;
          
          // Write file to device storage using base64 encoding
          await FileSystem.writeAsStringAsync(fileUri, base64Content, {
            encoding: 'base64',
          });
          
          console.log('File saved to:', fileUri);
          
          // Check if sharing is available and share the file
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri, {
              mimeType: 'application/pdf',
              dialogTitle: `Share ${documentType}`,
            });
          } else {
            // If sharing is not available, just show success message
            Alert.alert(
              'Download Complete',
              `${documentType} saved to device storage!\n\nFile: ${filename}\nLocation: Documents folder`,
              [{ text: 'OK' }]
            );
          }
          
        } catch (fileError) {
          console.error('Error saving file:', fileError);
          Alert.alert('Save Error', 'Failed to save document to device storage.');
        }
      };
      
    } catch (error: any) {
      console.error('Error downloading document:', error);
      Alert.alert('Download Failed', error.error || 'Failed to download document. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const pickDocument = async (documentType: 'birthCertificate' | 'nicCopy') => {
    try {
      setUploading(documentType);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'image/*',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        setUploading('');
        return;
      }

      const file = result.assets[0];
      console.log('Selected file:', file);

      // Validate file
      if (file.size && file.size > 10 * 1024 * 1024) { // 10MB limit
        Alert.alert('File Too Large', 'Please select a file smaller than 10MB');
        setUploading('');
        return;
      }

      // Upload file (simulate for now)
      await uploadDocument(file, documentType);
      
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
      setUploading('');
    }
  };

  const uploadDocument = async (file: any, documentType: 'birthCertificate' | 'nicCopy') => {
    try {
      // Create FormData like web version
      const formData = new FormData();
      
      if (documentType === 'birthCertificate') {
        formData.append('birthCertificate', file);
      } else {
        formData.append('nicCopy', file);
      }
      
      console.log(`Uploading ${documentType}:`, file.name);
      
      // Use the same API as web version
      await updateVillagerDocuments(formData);
      
      setUploadedFiles(prev => ({
        ...prev,
        [documentType]: file.name
      }));
      
      setUploading('');
      
      // Refresh documents after upload
      await fetchExistingDocuments();
      
      Alert.alert(
        'Upload Successful',
        `${documentType === 'birthCertificate' ? 'Birth Certificate' : 'NIC Copy'} uploaded successfully!`,
        [{ text: 'OK' }]
      );
      
    } catch (error: any) {
      console.error('Error uploading document:', error);
      Alert.alert('Upload Failed', error.error || 'Failed to upload document. Please try again.');
      setUploading('');
    }
  };

  const handleBirthCertificateUpload = () => {
    pickDocument('birthCertificate');
  };

  const handleNICCopyUpload = () => {
    pickDocument('nicCopy');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Management</Text>
      </View>

      {/* Existing Documents */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Existing Documents</Text>
        
        <View style={styles.documentCard}>
          <Text style={styles.documentTitle}>Birth Certificate</Text>
          <Text style={styles.documentDescription}>
            Your uploaded birth certificate
          </Text>
          
          {existingDocuments.birthCertificate ? (
            <View style={styles.existingFile}>
              <Text style={styles.existingFileName}>
                📄 {existingDocuments.birthCertificate.split('/').pop()}
              </Text>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleDownload(existingDocuments.birthCertificate, 'Birth Certificate')}
              >
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noDocument}>
              <Text style={styles.noDocumentText}>No birth certificate uploaded</Text>
            </View>
          )}
        </View>

        <View style={styles.documentCard}>
          <Text style={styles.documentTitle}>NIC Copy</Text>
          <Text style={styles.documentDescription}>
            Your uploaded NIC copy
          </Text>
          
          {existingDocuments.nicCopy ? (
            <View style={styles.existingFile}>
              <Text style={styles.existingFileName}>
                📄 {existingDocuments.nicCopy.split('/').pop()}
              </Text>
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={() => handleDownload(existingDocuments.nicCopy, 'NIC Copy')}
              >
                <Text style={styles.downloadButtonText}>Download</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noDocument}>
              <Text style={styles.noDocumentText}>No NIC copy uploaded</Text>
            </View>
          )}
        </View>

        {/* Upload New Documents */}
        <Text style={styles.sectionTitle}>Upload New Documents</Text>
        <View style={styles.documentCard}>
          <Text style={styles.documentTitle}>Birth Certificate</Text>
          <Text style={styles.documentDescription}>
            Upload your birth certificate for verification
          </Text>
          
          {uploadedFiles.birthCertificate && (
            <View style={styles.uploadedFile}>
              <Text style={styles.uploadedFileText}>
                ✓ Uploaded: {uploadedFiles.birthCertificate}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[
              styles.uploadButton,
              uploadedFiles.birthCertificate && styles.uploadButtonDisabled,
              uploading === 'birthCertificate' && styles.uploadButtonUploading
            ]} 
            onPress={handleBirthCertificateUpload}
            disabled={!!uploadedFiles.birthCertificate || uploading === 'birthCertificate'}
          >
            {uploading === 'birthCertificate' ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.uploadButtonText}>
                {uploadedFiles.birthCertificate ? 'Uploaded' : 'Upload Birth Certificate'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.documentCard}>
          <Text style={styles.documentTitle}>NIC Copy</Text>
          <Text style={styles.documentDescription}>
            Upload a copy of your National Identity Card
          </Text>
          
          {uploadedFiles.nicCopy && (
            <View style={styles.uploadedFile}>
              <Text style={styles.uploadedFileText}>
                ✓ Uploaded: {uploadedFiles.nicCopy}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[
              styles.uploadButton,
              uploadedFiles.nicCopy && styles.uploadButtonDisabled,
              uploading === 'nicCopy' && styles.uploadButtonUploading
            ]} 
            onPress={handleNICCopyUpload}
            disabled={!!uploadedFiles.nicCopy || uploading === 'nicCopy'}
          >
            {uploading === 'nicCopy' ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.uploadButtonText}>
                {uploadedFiles.nicCopy ? 'Uploaded' : 'Upload NIC Copy'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Upload Guidelines</Text>
          <Text style={styles.infoText}>• Supported formats: PDF, PNG, JPG</Text>
          <Text style={styles.infoText}>• Maximum file size: 10MB</Text>
          <Text style={styles.infoText}>• Ensure documents are clear and readable</Text>
          <Text style={styles.infoText}>• Documents will be verified by admin</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
    marginTop: Spacing.lg,
  },
  documentCard: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  documentDescription: {
    fontSize: Typography.sm,
    color: '#6c757d',
    marginBottom: Spacing.md,
  },
  existingFile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.sm,
  },
  existingFileName: {
    fontSize: Typography.sm,
    color: '#495057',
    fontWeight: '500',
    flex: 1,
  },
  downloadButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
  },
  downloadButtonText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
  },
  noDocument: {
    backgroundColor: '#fff3cd',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.sm,
  },
  noDocumentText: {
    fontSize: Typography.sm,
    color: '#856404',
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  uploadedFile: {
    backgroundColor: '#e8f5e8',
    padding: Spacing.sm,
    borderRadius: Spacing.borderRadius.sm,
    marginBottom: Spacing.md,
  },
  uploadedFileText: {
    color: '#2e7d32',
    fontSize: Typography.sm,
    fontWeight: '600',
  },
  uploadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  uploadButtonUploading: {
    backgroundColor: '#1976d2',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.sm,
    color: '#6c757d',
    marginBottom: Spacing.xs,
  },
});

export default UserDocumentsScreen;
