import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as villagerApi from '../src/api/villager';

interface VillagerFormData {
  villager_id: string;
  full_name: string;
  email: string;
  password: string;
  phone_no: string;
  nic: string;
  dob: string;
  address: string;
  regional_division: string;
  status: string;
  area_id: string;
  latitude: string;
  longitude: string;
  is_participant: boolean;
  alive_status: string;
  job: string;
  gender: string;
  marital_status: string;
}

export default function AddVillager() {
  const router = useRouter();
  const [formData, setFormData] = useState<VillagerFormData>({
    villager_id: '',
    full_name: '',
    email: '',
    password: '',
    phone_no: '',
    nic: '',
    dob: '',
    address: '',
    regional_division: '',
    status: 'Active',
    area_id: '',
    latitude: '',
    longitude: '',
    is_participant: false,
    alive_status: 'Alive',
    job: '',
    gender: 'Other',
    marital_status: 'Unmarried',
  });
  const [errors, setErrors] = useState<Partial<VillagerFormData>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<VillagerFormData> = {};
    
    if (!formData.villager_id.trim()) newErrors.villager_id = 'Villager ID is required';
    if (!formData.full_name.trim()) newErrors.full_name = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.phone_no.trim()) newErrors.phone_no = 'Phone Number is required';
    
    if (formData.latitude && (isNaN(Number(formData.latitude)) || Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    if (formData.longitude && (isNaN(Number(formData.longitude)) || Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof VillagerFormData, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      await villagerApi.addVillager(formData);
      Alert.alert('Success', 'Villager added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Error adding villager:', error);
      Alert.alert('Error', error.error || 'Failed to add villager');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      villager_id: '',
      full_name: '',
      email: '',
      password: '',
      phone_no: '',
      nic: '',
      dob: '',
      address: '',
      regional_division: '',
      status: 'Active',
      area_id: '',
      latitude: '',
      longitude: '',
      is_participant: false,
      alive_status: 'Alive',
      job: '',
      gender: 'Other',
      marital_status: 'Unmarried',
    });
    setErrors({});
  };

  const handleBack = () => {
    router.back();
  };

  const renderInputField = (
    label: string,
    field: keyof VillagerFormData,
    placeholder: string,
    keyboardType: any = 'default',
    secureTextEntry: boolean = false,
    multiline: boolean = false
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}:</Text>
      <TextInput
        style={[
          styles.input,
          errors[field] && styles.inputError,
          multiline && styles.inputMultiline
        ]}
        value={formData[field] as string}
        onChangeText={(value) => handleChange(field, value)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderSelectField = (
    label: string,
    field: keyof VillagerFormData,
    options: { label: string; value: string }[]
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}:</Text>
      <View style={styles.selectContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.selectOption,
              formData[field] === option.value && styles.selectOptionSelected
            ]}
            onPress={() => handleChange(field, option.value)}
          >
            <Text style={[
              styles.selectOptionText,
              formData[field] === option.value && styles.selectOptionTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Villager</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          {renderInputField('Villager ID', 'villager_id', 'Enter Villager ID')}
          {renderInputField('Full Name', 'full_name', 'Enter Full Name')}
          {renderInputField('Email', 'email', 'Enter Email', 'email-address')}
          {renderInputField('Password', 'password', 'Enter Password', 'default', true)}
          {renderInputField('Phone Number', 'phone_no', 'Enter Phone Number', 'phone-pad')}
          {renderInputField('NIC', 'nic', 'Enter NIC (optional)')}
          {renderInputField('Date of Birth', 'dob', 'Select Date of Birth')}
          {renderInputField('Address', 'address', 'Enter Address (optional)', 'default', false, true)}
          {renderInputField('Regional Division', 'regional_division', 'Enter Regional Division (optional)')}
          {renderInputField('Job', 'job', 'Enter Job (optional)')}
          
          {renderSelectField('Gender', 'gender', [
            { label: 'Male', value: 'Male' },
            { label: 'Female', value: 'Female' },
            { label: 'Other', value: 'Other' },
          ])}
          
          {renderSelectField('Marital Status', 'marital_status', [
            { label: 'Married', value: 'Married' },
            { label: 'Unmarried', value: 'Unmarried' },
            { label: 'Divorced', value: 'Divorced' },
            { label: 'Widowed', value: 'Widowed' },
            { label: 'Separated', value: 'Separated' },
          ])}
          
          {renderSelectField('Status', 'status', [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ])}
          
          {renderSelectField('Alive Status', 'alive_status', [
            { label: 'Alive', value: 'Alive' },
            { label: 'Deceased', value: 'Deceased' },
          ])}
          
          {renderInputField('Area ID', 'area_id', 'Enter Area ID (optional)')}
          {renderInputField('Latitude', 'latitude', 'Enter Latitude (optional)', 'numeric')}
          {renderInputField('Longitude', 'longitude', 'Enter Longitude (optional)', 'numeric')}
          
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Election Participant:</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>No</Text>
              <Switch
                value={formData.is_participant}
                onValueChange={(value) => handleChange('is_participant', value)}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.white}
              />
              <Text style={styles.switchLabel}>Yes</Text>
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>Add Villager</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
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
  scrollContent: {
    padding: Spacing.md,
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.base,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  selectOption: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  selectOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectOptionText: {
    fontSize: Typography.sm,
    color: Colors.text,
  },
  selectOptionTextSelected: {
    color: Colors.white,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  switchLabel: {
    fontSize: Typography.base,
    color: Colors.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButton: {
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    backgroundColor: Colors.border,
  },
  buttonText: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: Colors.white,
  },
  cancelButtonText: {
    color: Colors.text,
  },
});
