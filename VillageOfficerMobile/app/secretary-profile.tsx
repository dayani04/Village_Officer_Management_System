import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as secretaryApi from '../src/api/secretary';

interface SecretaryProfile {
  Secretary_ID: string;
  Full_Name: string;
  Email: string;
  Phone_No: string;
  NIC?: string;
  DOB?: string;
  Address?: string;
  RegionalDivision?: string;
  Status: string;
  Area_ID?: string;
  Created_Date?: string;
  Updated_Date?: string;
}

const SecretaryProfileScreen: React.FC = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<SecretaryProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    nic: '',
    dob: '',
    address: '',
    regional_division: '',
    status: 'Active',
    area_id: '',
  });
  const [otpData, setOtpData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    secretaryId: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const profileData = await secretaryApi.getProfile();
      console.log('Fetched secretary profile:', profileData);
      setProfile(profileData);
      setFormData({
        full_name: profileData.Full_Name || '',
        email: profileData.Email || '',
        phone_no: profileData.Phone_No || '',
        nic: profileData.NIC || '',
        dob: profileData.DOB ? profileData.DOB.split('T')[0] : '',
        address: profileData.Address || '',
        regional_division: profileData.RegionalDivision || '',
        status: profileData.Status || 'Active',
        area_id: profileData.Area_ID || '',
      });
      setOtpData({
        email: profileData.Email || '',
        otp: '',
        newPassword: '',
        secretaryId: profileData.Secretary_ID || '',
      });
    } catch (err: any) {
      const errorMsg = err.error || 'Failed to fetch profile';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (name: string, value: string) => {
    setOtpData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const { full_name, email, phone_no } = formData;

    if (!full_name || !email || !phone_no) {
      setError('Full Name, Email, and Phone are required');
      Alert.alert('Error', 'Full Name, Email, and Phone are required');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      Alert.alert('Error', 'Invalid email format');
      return;
    }

    try {
      const payload = {
        full_name,
        email,
        phone_no,
        nic: formData.nic,
        dob: formData.dob,
        address: formData.address,
        regional_division: formData.regional_division,
        status: formData.status,
        area_id: formData.area_id,
      };
      
      await secretaryApi.updateSecretary(profile!.Secretary_ID, payload);
      
      setProfile({
        ...profile!,
        Full_Name: payload.full_name,
        Email: payload.email,
        Phone_No: payload.phone_no,
        NIC: payload.nic,
        DOB: payload.dob,
        Address: payload.address,
        RegionalDivision: payload.regional_division,
        Status: payload.status,
        Area_ID: payload.area_id,
      });
      
      setEditMode(false);
      setError('');
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err: any) {
      const errorMsg = err.error || err.message || 'Failed to update profile';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    }
  };

  const handlePasswordChangeRequest = async () => {
    if (!otpData.email) {
      setError('Email is missing');
      Alert.alert('Error', 'Email is missing');
      return;
    }

    try {
      await secretaryApi.requestPasswordOtp(otpData.email);
      setOtpMode(true);
      setError('');
      Alert.alert('Success', 'OTP sent to your email');
    } catch (err: any) {
      const errorMsg = err.error || err.message || 'Failed to send OTP';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    }
  };

  const handlePasswordSubmit = async () => {
    const { otp, newPassword, secretaryId } = otpData;

    if (!otp || !newPassword) {
      setError('OTP and new password are required');
      Alert.alert('Error', 'OTP and new password are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await secretaryApi.verifyPasswordOtp(secretaryId, otp, newPassword);
      setOtpMode(false);
      setOtpData(prev => ({ ...prev, otp: '', newPassword: '' }));
      setError('');
      Alert.alert('Success', 'Password updated successfully');
    } catch (err: any) {
      const errorMsg = err.error || err.message || 'Failed to update password';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Unable to load profile'}</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secretary Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        {editMode ? (
          <View style={styles.editContainer}>
            <View style={styles.editHeader}>
              <Text style={styles.editTitle}>Edit Profile Information</Text>
              <TouchableOpacity onPress={() => setEditMode(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={Colors.error} />
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.full_name}
                  onChangeText={(value) => handleInputChange('full_name', value)}
                  placeholder="Enter your full name"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone_no}
                  onChangeText={(value) => handleInputChange('phone_no', value)}
                  placeholder="+94 XX XXX XXXX"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dob}
                  onChangeText={(value) => handleInputChange('dob', value)}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Location & Details</Text>
              
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(value) => handleInputChange('address', value)}
                  placeholder="Your residential address"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Regional Division</Text>
                <TextInput
                  style={styles.input}
                  value={formData.regional_division}
                  onChangeText={(value) => handleInputChange('regional_division', value)}
                  placeholder="Your regional division"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>NIC</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nic}
                  onChangeText={(value) => handleInputChange('nic', value)}
                  placeholder="Your NIC number"
                />
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Area ID</Text>
                <TextInput
                  style={styles.input}
                  value={formData.area_id}
                  onChangeText={(value) => handleInputChange('area_id', value)}
                  placeholder="Your area ID"
                />
              </View>
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity onPress={handleEditSubmit} style={styles.saveButton}>
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditMode(false)} style={styles.cancelButton}>
                <Ionicons name="close" size={20} color={Colors.error} />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : otpMode ? (
          <View style={styles.otpContainer}>
            <View style={styles.otpHeader}>
              <Text style={styles.otpTitle}>Change Password</Text>
              <Text style={styles.otpSubtitle}>Enter OTP sent to your email and set a new password</Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>OTP Verification Code</Text>
              <TextInput
                style={styles.input}
                value={otpData.otp}
                onChangeText={(value) => handleOtpChange('otp', value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                keyboardType="numeric"
              />
              <Text style={styles.helperText}>Sent to: {otpData.email}</Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={otpData.newPassword}
                onChangeText={(value) => handleOtpChange('newPassword', value)}
                placeholder="Enter new password"
                secureTextEntry
              />
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity onPress={handlePasswordSubmit} style={styles.saveButton}>
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.saveButtonText}>Verify & Update Password</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setOtpMode(false)} style={styles.cancelButton}>
                <Ionicons name="close" size={20} color={Colors.error} />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.viewContainer}>
            <Text style={styles.profileName}>{profile.Full_Name}</Text>

            <View style={styles.cardsContainer}>
              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="person" size={20} color={Colors.primary} />
                  <Text style={styles.cardTitle}>Personal Information</Text>
                </View>
                <View style={styles.cardContent}>
                  <InfoItem label="Full Name" value={profile.Full_Name} />
                  <InfoItem label="NIC" value={profile.NIC || 'N/A'} />
                  <InfoItem label="Date of Birth" value={formatDate(profile.DOB)} />
                  <InfoItem label="Secretary ID" value={profile.Secretary_ID} />
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="mail" size={20} color={Colors.primary} />
                  <Text style={styles.cardTitle}>Contact Information</Text>
                </View>
                <View style={styles.cardContent}>
                  <InfoItem label="Email" value={profile.Email} />
                  <InfoItem label="Phone Number" value={profile.Phone_No} />
                  <InfoItem label="Address" value={profile.Address || 'N/A'} />
                  <InfoItem label="Regional Division" value={profile.RegionalDivision || 'N/A'} />
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.cardHeader}>
                  <Ionicons name="briefcase" size={20} color={Colors.primary} />
                  <Text style={styles.cardTitle}>Professional Details</Text>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <View style={[styles.statusBadge, profile.Status === 'Active' ? styles.statusActive : styles.statusInactive]}>
                      <Text style={styles.statusText}>{profile.Status}</Text>
                    </View>
                  </View>
                  <InfoItem label="Area ID" value={profile.Area_ID || 'N/A'} />
                  <InfoItem label="Registration Date" value={formatDate(profile.Created_Date)} />
                  <InfoItem label="Last Updated" value={formatDate(profile.Updated_Date)} />
                </View>
              </View>
            </View>

            <View style={styles.actionPanel}>
              <Text style={styles.actionTitle}>Quick Actions</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => setEditMode(true)} style={styles.actionButton}>
                  <Ionicons name="create" size={20} color={Colors.primary} />
                  <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePasswordChangeRequest} style={styles.actionButton}>
                  <Ionicons name="lock" size={20} color={Colors.primary} />
                  <Text style={styles.actionButtonText}>Change Password</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
  scrollView: {
    flex: 1,
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
    color: '#666',
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
    marginBottom: Spacing.md,
  },
  viewContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  cardsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  cardContent: {
    gap: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  infoLabel: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: Typography.sm,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
  },
  statusActive: {
    backgroundColor: '#4caf50',
  },
  statusInactive: {
    backgroundColor: '#f44336',
  },
  statusText: {
    color: 'white',
    fontSize: Typography.xs,
    fontWeight: 'bold',
  },
  actionPanel: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionButtonText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  editContainer: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  editTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  formSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  fieldContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: Spacing.borderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.base,
    backgroundColor: '#f8f9fa',
  },
  helperText: {
    fontSize: Typography.xs,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  formButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
  },
  saveButtonText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    color: Colors.error,
    fontSize: Typography.sm,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  otpContainer: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  otpHeader: {
    marginBottom: Spacing.lg,
  },
  otpTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  otpSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default SecretaryProfileScreen;
