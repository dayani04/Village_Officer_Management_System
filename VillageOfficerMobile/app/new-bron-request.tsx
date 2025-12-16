import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { requestNewBorn } from '../src/api/villager';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';

const NewBornRequestScreen: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    relationship: '',
    birthCertificate: null as any,
    motherNic: null as any,
    fatherNic: null as any,
    marriageCertificate: null as any,
    residenceCertificate: null as any,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFilePick = async (fieldName: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFormData({ ...formData, [fieldName]: file });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleSubmit = async () => {
    if (!formData.relationship || !formData.birthCertificate || !formData.motherNic || 
        !formData.fatherNic || !formData.marriageCertificate || !formData.residenceCertificate) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('relationship', formData.relationship);
    data.append('birthCertificate', {
      uri: formData.birthCertificate.uri,
      name: formData.birthCertificate.name,
      type: formData.birthCertificate.mimeType || 'application/pdf',
    } as any);
    data.append('motherNic', {
      uri: formData.motherNic.uri,
      name: formData.motherNic.name,
      type: formData.motherNic.mimeType || 'application/pdf',
    } as any);
    data.append('fatherNic', {
      uri: formData.fatherNic.uri,
      name: formData.fatherNic.name,
      type: formData.fatherNic.mimeType || 'application/pdf',
    } as any);
    data.append('marriageCertificate', {
      uri: formData.marriageCertificate.uri,
      name: formData.marriageCertificate.name,
      type: formData.marriageCertificate.mimeType || 'application/pdf',
    } as any);
    data.append('residenceCertificate', {
      uri: formData.residenceCertificate.uri,
      name: formData.residenceCertificate.name,
      type: formData.residenceCertificate.mimeType || 'application/pdf',
    } as any);

    try {
      await requestNewBorn(data);
      setSuccess('New born request submitted successfully');
      setTimeout(() => router.back(), 2000);
    } catch (err: any) {
      setError(err.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request for New Born</Text>
      </View>

      {/* Form */}
      <View style={styles.content}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <View style={styles.form}>
          <Text style={styles.label}>Relationship to Newborn:</Text>
          <TextInput
            style={styles.input}
            value={formData.relationship}
            onChangeText={(value) => handleInputChange('relationship', value)}
            placeholder="Enter relationship"
          />

          <Text style={styles.label}>Birth Certificate (PDF, PNG, JPG):</Text>
          <TouchableOpacity 
            style={styles.fileButton}
            onPress={() => handleFilePick('birthCertificate')}
          >
            <Text style={styles.fileButtonText}>
              {formData.birthCertificate ? formData.birthCertificate.name : 'Choose File'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Mother's NIC (PDF, PNG, JPG):</Text>
          <TouchableOpacity 
            style={styles.fileButton}
            onPress={() => handleFilePick('motherNic')}
          >
            <Text style={styles.fileButtonText}>
              {formData.motherNic ? formData.motherNic.name : 'Choose File'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Father's NIC (PDF, PNG, JPG):</Text>
          <TouchableOpacity 
            style={styles.fileButton}
            onPress={() => handleFilePick('fatherNic')}
          >
            <Text style={styles.fileButtonText}>
              {formData.fatherNic ? formData.fatherNic.name : 'Choose File'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Marriage Certificate (PDF, PNG, JPG):</Text>
          <TouchableOpacity 
            style={styles.fileButton}
            onPress={() => handleFilePick('marriageCertificate')}
          >
            <Text style={styles.fileButtonText}>
              {formData.marriageCertificate ? formData.marriageCertificate.name : 'Choose File'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Residence Confirmation Certificate (PDF, PNG, JPG):</Text>
          <TouchableOpacity 
            style={styles.fileButton}
            onPress={() => handleFilePick('residenceCertificate')}
          >
            <Text style={styles.fileButtonText}>
              {formData.residenceCertificate ? formData.residenceCertificate.name : 'Choose File'}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleBack}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
  form: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: Spacing.borderRadius.sm,
    padding: Spacing.md,
    fontSize: Typography.base,
    marginBottom: Spacing.lg,
    backgroundColor: '#f8f9fa',
  },
  fileButton: {
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: Spacing.borderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  fileButtonText: {
    fontSize: Typography.sm,
    color: '#6c757d',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
  },
  button: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: Typography.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  successText: {
    color: '#28a745',
    fontSize: Typography.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
});

export default NewBornRequestScreen;
