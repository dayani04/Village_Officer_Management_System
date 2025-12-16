import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as villageOfficerApi from '../src/api/villageOfficer';

interface OfficerData {
  villager_officer_id: string;
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
}

const AddVillageOfficerScreen: React.FC = () => {
  const router = useRouter();
  const [officer, setOfficer] = useState<OfficerData>({
    villager_officer_id: '',
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
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name: keyof OfficerData, value: string) => {
    setOfficer((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    const { villager_officer_id, full_name, email, password, phone_no } = officer;

    if (!villager_officer_id || !full_name || !email || !password || !phone_no) {
      Alert.alert('Error', 'Required fields are missing');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Invalid email format');
      return;
    }

    try {
      setLoading(true);
      await villageOfficerApi.addVillageOfficer(officer);
      
      Alert.alert(
        'Success',
        'Officer added successfully',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (err: any) {
      console.error('Error adding officer:', err);
      Alert.alert('Error', err.error || 'Failed to add officer');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Village Officer</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <View style={styles.field}>
          <Text style={styles.label}>Officer ID *</Text>
          <TextInput
            style={styles.input}
            value={officer.villager_officer_id}
            onChangeText={(value) => handleInputChange('villager_officer_id', value)}
            placeholder="Enter Officer ID"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={officer.full_name}
            onChangeText={(value) => handleInputChange('full_name', value)}
            placeholder="Enter Full Name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={officer.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            value={officer.password}
            onChangeText={(value) => handleInputChange('password', value)}
            placeholder="Enter Password"
            placeholderTextColor="#999"
            secureTextEntry
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={officer.phone_no}
            onChangeText={(value) => handleInputChange('phone_no', value)}
            placeholder="Enter Phone Number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>NIC</Text>
          <TextInput
            style={styles.input}
            value={officer.nic}
            onChangeText={(value) => handleInputChange('nic', value)}
            placeholder="Enter NIC (optional)"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date of Birth</Text>
          <TextInput
            style={styles.input}
            value={officer.dob}
            onChangeText={(value) => handleInputChange('dob', value)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={officer.address}
            onChangeText={(value) => handleInputChange('address', value)}
            placeholder="Enter Address (optional)"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Regional Division</Text>
          <TextInput
            style={styles.input}
            value={officer.regional_division}
            onChangeText={(value) => handleInputChange('regional_division', value)}
            placeholder="Enter Regional Division (optional)"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Status *</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusOption,
                officer.status === 'Active' && styles.statusOptionActive
              ]}
              onPress={() => handleInputChange('status', 'Active')}
            >
              <Text style={[
                styles.statusOptionText,
                officer.status === 'Active' && styles.statusOptionTextActive
              ]}>
                Active
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusOption,
                officer.status === 'Inactive' && styles.statusOptionActive
              ]}
              onPress={() => handleInputChange('status', 'Inactive')}
            >
              <Text style={[
                styles.statusOptionText,
                officer.status === 'Inactive' && styles.statusOptionTextActive
              ]}>
                Inactive
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Area ID</Text>
          <TextInput
            style={styles.input}
            value={officer.area_id}
            onChangeText={(value) => handleInputChange('area_id', value)}
            placeholder="Enter Area ID (optional)"
            placeholderTextColor="#999"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.submitButtonText}>Adding...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Add Officer</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
  formContainer: {
    padding: Spacing.md,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: '600',
    color: '#333',
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: Spacing.borderRadius.sm,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statusOption: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: Spacing.borderRadius.sm,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statusOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  statusOptionText: {
    fontSize: Typography.base,
    color: '#333',
  },
  statusOptionTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: 'bold',
  },
});

export default AddVillageOfficerScreen;
