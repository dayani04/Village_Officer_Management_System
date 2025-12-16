import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { Spacing } from '../src/constants/spacing';
import { Typography } from '../src/constants/typography';
import * as villageOfficerApi from '../src/api/villageOfficer';

interface ProfileData {
  Villager_Officer_ID: string;
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

interface FormData {
  full_name: string;
  email: string;
  phone_no: string;
  nic: string;
  dob: string;
  address: string;
  regional_division: string;
  status: string;
  area_id: string;
}

interface OtpData {
  email: string;
  otp: string;
  newPassword: string;
  officerId: string;
}

export default function VillageOfficerProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone_no: '',
    nic: '',
    dob: '',
    address: '',
    regional_division: '',
    status: '',
    area_id: '',
  });
  const [otpData, setOtpData] = useState<OtpData>({
    email: '',
    otp: '',
    newPassword: '',
    officerId: '',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await villageOfficerApi.getProfile();
      setProfile(data);
      setFormData({
        full_name: data.Full_Name || '',
        email: data.Email || '',
        phone_no: data.Phone_No || '',
        nic: data.NIC || '',
        dob: data.DOB ? data.DOB.split('T')[0] : '',
        address: data.Address || '',
        regional_division: data.RegionalDivision || '',
        status: data.Status || '',
        area_id: data.Area_ID || '',
      });
      setOtpData({
        email: data.Email || '',
        otp: '',
        newPassword: '',
        officerId: data.Villager_Officer_ID || '',
      });
    } catch (err: any) {
      const errorMessage = err.error || err.message || 'Failed to fetch profile';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleOtpChange = (field: keyof OtpData, value: string) => {
    setOtpData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleEditSubmit = async () => {
    const { full_name, email, phone_no } = formData;

    if (!full_name || !email || !phone_no) {
      setError('Full Name, Email, and Phone are required');
      Alert.alert('Validation Error', 'Full Name, Email, and Phone are required');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      Alert.alert('Validation Error', 'Invalid email format');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        full_name,
        email,
        phone_no,
        status: profile?.Status || "Active",
      };
      
      await villageOfficerApi.updateVillageOfficer(profile!.Villager_Officer_ID, payload);
      await fetchProfile();
      setEditMode(false);
      setError('');
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err: any) {
      const errorMsg = err.error || err.message || 'Failed to update profile';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!otpData.email) {
      setError('Email is missing');
      Alert.alert('Error', 'Email is missing');
      return;
    }

    try {
      setSubmitting(true);
      await villageOfficerApi.requestPasswordOtp(otpData.email);
      setOtpMode(true);
      setError('');
      Alert.alert('Success', 'OTP sent to your email');
    } catch (err: any) {
      const errorMsg = err.error || err.message || 'Failed to send OTP';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async () => {
    const { otp, newPassword } = otpData;

    if (!otp || !newPassword) {
      setError('OTP and new password are required');
      Alert.alert('Validation Error', 'OTP and new password are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      Alert.alert('Validation Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setSubmitting(true);
      await villageOfficerApi.verifyPasswordOtp(otpData.officerId, otp, newPassword);
      setOtpMode(false);
      setOtpData((prev) => ({ ...prev, otp: '', newPassword: '' }));
      setError('');
      Alert.alert('Success', 'Password updated successfully');
    } catch (err: any) {
      const errorMsg = err.error || err.message || 'Failed to update password';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const renderInputField = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    keyboardType: any = 'default',
    secureTextEntry: boolean = false
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && field === 'email' && styles.inputError]}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );

  const renderInfoCard = (
    title: string,
    icon: string,
    color: string,
    children: React.ReactNode
  ) => (
    <View style={[styles.infoCard, { borderColor: color }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon as any} size={24} color="white" />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  const renderInfoItem = (label: string, value: string, isStatus?: boolean) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isStatus ? (
        <View style={[
          styles.statusBadge,
          value === 'Active' ? styles.statusActive : styles.statusInactive
        ]}>
          <Text style={styles.statusText}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.infoValue}>{value || 'N/A'}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
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
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error || 'Unable to load profile'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
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
        <Text style={styles.headerTitle}>My Profile</Text>
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
          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.error} />
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          {editMode ? (
            <View style={styles.editContainer}>
              <View style={styles.editHeader}>
                <Text style={styles.editTitle}>Edit Profile Information</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setEditMode(false)}>
                  <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                {renderInputField('Full Name', 'full_name', 'Enter your full name')}
                {renderInputField('Email', 'email', 'your.email@example.com', 'email-address')}
                {renderInputField('Phone Number', 'phone_no', '+94 XX XXX XXXX', 'phone-pad')}
                {renderInputField('Date of Birth', 'dob', 'Select date of birth')}
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Location & Details</Text>
                {renderInputField('Address', 'address', 'Your residential address')}
                {renderInputField('Regional Division', 'regional_division', 'Your regional division')}
                {renderInputField('NIC', 'nic', 'Your NIC number')}
                {renderInputField('Area ID', 'area_id', 'Your area ID')}
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, submitting && styles.buttonDisabled]}
                  onPress={handleEditSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Text style={styles.buttonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setEditMode(false)}
                  disabled={submitting}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : otpMode ? (
            <View style={styles.otpContainer}>
              <View style={styles.otpHeader}>
                <Text style={styles.otpTitle}>Change Password</Text>
                <Text style={styles.otpSubtitle}>Enter the OTP sent to your email and set a new password</Text>
              </View>

              <View style={styles.otpForm}>
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
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton, submitting && styles.buttonDisabled]}
                    onPress={handlePasswordSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <Text style={styles.buttonText}>Verify & Update Password</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setOtpMode(false)}
                    disabled={submitting}
                  >
                    <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.profileContainer}>
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="person" size={48} color={Colors.primary} />
                </View>
                <Text style={styles.profileName}>{profile.Full_Name}</Text>
                <Text style={styles.profileSubtitle}>Village Officer</Text>
              </View>

              {renderInfoCard('Personal Information', 'person', Colors.primary,
                <>
                  {renderInfoItem('Full Name', profile.Full_Name)}
                  {renderInfoItem('NIC', profile.NIC || 'N/A')}
                  {renderInfoItem('Date of Birth', profile.DOB ? new Date(profile.DOB).toLocaleDateString() : 'N/A')}
                  {renderInfoItem('Officer ID', profile.Villager_Officer_ID)}
                </>
              )}

              {renderInfoCard('Contact Information', 'mail', Colors.success,
                <>
                  {renderInfoItem('Email', profile.Email)}
                  {renderInfoItem('Phone Number', profile.Phone_No)}
                  {renderInfoItem('Address', profile.Address || 'N/A')}
                  {renderInfoItem('Regional Division', profile.RegionalDivision || 'N/A')}
                </>
              )}

              {renderInfoCard('Professional Details', 'briefcase', Colors.warning,
                <>
                  {renderInfoItem('Status', profile.Status, true)}
                  {renderInfoItem('Area ID', profile.Area_ID || 'N/A')}
                  {renderInfoItem('Registration Date', profile.Created_Date ? new Date(profile.Created_Date).toLocaleDateString() : 'N/A')}
                  {renderInfoItem('Last Updated', profile.Updated_Date ? new Date(profile.Updated_Date).toLocaleDateString() : 'N/A')}
                </>
              )}

              <View style={styles.actionPanel}>
                <Text style={styles.actionTitle}>Quick Actions</Text>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editActionButton]}
                    onPress={() => setEditMode(true)}
                  >
                    <Ionicons name="create-outline" size={20} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.passwordActionButton]}
                    onPress={handleRequestOtp}
                    disabled={submitting}
                  >
                    <Ionicons name="lock-closed-outline" size={20} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Change Password</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    marginBottom: Spacing.md,
  },
  errorBannerText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.error,
    flex: 1,
  },
  profileContainer: {
    paddingBottom: Spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  profileName: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  profileSubtitle: {
    fontSize: Typography.base,
    color: Colors.textLight,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  cardContent: {
    gap: Spacing.md,
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
    flex: 1,
  },
  infoValue: {
    fontSize: Typography.sm,
    color: Colors.text,
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
  },
  statusActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    color: Colors.success,
  },
  statusInactive: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    color: Colors.error,
  },
  statusText: {
    fontSize: Typography.xs,
    fontWeight: '600',
  },
  actionPanel: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  actionTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  actionButtons: {
    gap: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Spacing.borderRadius.md,
  },
  editActionButton: {
    backgroundColor: Colors.primary,
  },
  passwordActionButton: {
    backgroundColor: Colors.warning,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  editContainer: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
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
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  fieldContainer: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
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
  helperText: {
    fontSize: Typography.xs,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  formButtons: {
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
  saveButton: {
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
  otpContainer: {
    backgroundColor: Colors.white,
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  otpHeader: {
    marginBottom: Spacing.lg,
  },
  otpTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  otpSubtitle: {
    fontSize: Typography.base,
    color: Colors.textLight,
    textAlign: 'center',
  },
  otpForm: {
    gap: Spacing.lg,
  },
});
