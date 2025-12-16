import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import { fetchVillager, updateVillager } from '../src/api/villager';

interface FormData {
  full_name: string;
  email: string;
  phone_no: string;
  address: string;
  regional_division: string;
  status: string;
  is_election_participant: boolean;
  alive_status: string;
}

interface Errors {
  [key: string]: string;
}

export default function EditVillager() {
  const router = useRouter();
  const { villagerId } = useLocalSearchParams();
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone_no: '',
    address: '',
    regional_division: '',
    status: 'Active',
    is_election_participant: false,
    alive_status: 'Alive',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (villagerId) {
      fetchVillagerData();
    }
  }, [villagerId]);

  const fetchVillagerData = async () => {
    try {
      const data = await fetchVillager(villagerId as string);
      setFormData({
        full_name: data.Full_Name || '',
        email: data.Email || '',
        phone_no: data.Phone_No || '',
        address: data.Address || '',
        regional_division: data.RegionalDivision || '',
        status: data.Status || 'Active',
        is_election_participant: Boolean(data.IsParticipant),
        alive_status: data.Alive_Status || 'Alive',
      });
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching villager:', err);
      setFetchError(err.error || 'Failed to fetch villager data');
      setLoading(false);
      Alert.alert('Fetch Error', err.error || 'Failed to fetch villager data');
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone_no.trim()) {
      newErrors.phone_no = 'Phone Number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setSubmitting(true);
      await updateVillager(villagerId as string, formData);
      
      Alert.alert(
        'Success!',
        'Villager updated successfully',
        [
          {
            text: 'OK',
            onPress: () => router.push('/village-officer-villagers' as any),
          },
        ]
      );
    } catch (err: any) {
      console.error('Error updating villager:', err);
      Alert.alert('Update Failed', err.error || 'Failed to update villager');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/village-officer-villagers' as any);
  };

  const renderInput = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    keyboardType: any = 'default',
    multiline: boolean = false
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          errors[field] && styles.inputError,
        ]}
        value={formData[field].toString()}
        onChangeText={(value) => handleChange(field, value)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize="words"
        autoCorrect={false}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderSwitch = (label: string, field: keyof FormData) => (
    <View style={styles.switchField}>
      <Text style={styles.switchLabel}>{label}:</Text>
      <Switch
        value={formData[field] as boolean}
        onValueChange={(value) => handleChange(field, value)}
        trackColor={{ false: Colors.gray, true: Colors.primaryLight }}
        thumbColor={formData[field] as boolean ? Colors.primary : Colors.white}
      />
    </View>
  );

  const renderPicker = (label: string, field: keyof FormData, options: string[]) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}:</Text>
      <View style={styles.pickerContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.pickerOption,
              formData[field] === option && styles.pickerOptionSelected,
            ]}
            onPress={() => handleChange(field, option)}
          >
            <Text
              style={[
                styles.pickerOptionText,
                formData[field] === option && styles.pickerOptionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Villager</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading villager data...</Text>
        </View>
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Villager</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorText}>Error: {fetchError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchVillagerData}>
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
        <Text style={styles.headerTitle}>Edit Villager</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Required Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Information</Text>
            {renderInput('Full Name', 'full_name', 'Enter Full Name')}
            {renderInput('Email', 'email', 'Enter Email', 'email-address')}
            {renderInput('Phone Number', 'phone_no', 'Enter Phone Number', 'phone-pad')}
          </View>

          {/* Optional Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            {renderInput('Address', 'address', 'Enter Address (optional)', 'default', true)}
            {renderInput('Regional Division', 'regional_division', 'Enter Regional Division (optional)')}
          </View>

          {/* Status Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Information</Text>
            {renderPicker('Status', 'status', ['Active', 'Inactive'])}
            {renderSwitch('Election Participant', 'is_election_participant')}
            {renderPicker('Alive Status', 'alive_status', ['Alive', 'Deceased'])}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Update Villager</Text>
            )}
          </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  formContainer: {
    paddingBottom: Spacing.xl,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
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
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  field: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.base,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.base,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  switchField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  switchLabel: {
    fontSize: Typography.base,
    color: Colors.text,
    fontWeight: '500',
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  pickerOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.sm,
    alignItems: 'center',
  },
  pickerOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pickerOptionText: {
    fontSize: Typography.sm,
    color: Colors.text,
  },
  pickerOptionTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  submitButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
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
