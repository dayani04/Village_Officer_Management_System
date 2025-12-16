import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Switch,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateVillager } from '../../api/villager';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';

interface Profile {
  Villager_ID: string;
  Full_Name: string;
  Email: string;
  Phone_No: string;
  Address: string;
  RegionalDivision: string;
  Status: string;
  IsParticipant: boolean;
  Alive_Status: string;
  Job: string;
  Gender: string;
  Marital_Status: string;
  DOB: string;
  Religion: string;
  Race: string;
  NIC?: string;
  Created_Date?: string;
  Updated_Date?: string;
}

const UserProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // Password change states
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [villagerId, setVillagerId] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    address: '',
    regional_division: '',
    status: 'Active',
    is_election_participant: false,
    alive_status: 'Alive',
    job: '',
    gender: 'Other',
    marital_status: 'Unmarried',
    dob: '',
    religion: 'Others',
    race: 'Sinhalese'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await getProfile();
      setProfile(profileData);
      setFormData({
        full_name: profileData.Full_Name || '',
        email: profileData.Email || '',
        phone_no: profileData.Phone_No || '',
        address: profileData.Address || '',
        regional_division: profileData.RegionalDivision || '',
        status: profileData.Status || 'Active',
        is_election_participant: profileData.IsParticipant || false,
        alive_status: profileData.Alive_Status || 'Alive',
        job: profileData.Job || '',
        gender: profileData.Gender || 'Other',
        marital_status: profileData.Marital_Status || 'Unmarried',
        dob: profileData.DOB || '',
        religion: profileData.Religion || 'Others',
        race: profileData.Race || 'Sinhalese'
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.error || 'Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditSubmit = async () => {
    if (!formData.full_name || !formData.email || !formData.phone_no) {
      setError('Full Name, Email, and Phone Number are required');
      return;
    }

    try {
      const updatePayload = {
        full_name: formData.full_name,
        email: formData.email,
        phone_no: formData.phone_no,
        address: formData.address,
        regional_division: formData.regional_division,
        status: formData.status,
        is_election_participant: formData.is_election_participant,
        alive_status: formData.alive_status,
        job: formData.job,
        gender: formData.gender,
        marital_status: formData.marital_status,
        dob: formData.dob,
        religion: formData.religion,
        race: formData.race
      };

      console.log('Updating profile with payload:', updatePayload);
      await updateVillager(profile!.Villager_ID, updatePayload);
      
      setProfile({
        ...profile!,
        Full_Name: formData.full_name,
        Email: formData.email,
        Phone_No: formData.phone_no,
        Address: formData.address,
        RegionalDivision: formData.regional_division,
        Status: formData.status,
        IsParticipant: formData.is_election_participant,
        Alive_Status: formData.alive_status,
        Job: formData.job,
        Gender: formData.gender,
        Marital_Status: formData.marital_status,
        DOB: formData.dob,
        Religion: formData.religion,
        Race: formData.race
      });
      setEditMode(false);
      setError('');
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err: any) {
      console.error('Profile update error:', err);
      const errorMessage = err.response?.data?.error || err.error || err.message || 'Failed to update profile';
      setError(errorMessage);
    }
  };

  const handlePasswordChangeRequest = async () => {
    try {
      // For now, show a simple alert - you can implement OTP logic later
      Alert.alert(
        'Change Password',
        'Password change functionality will be implemented with OTP verification.',
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      setError(err.error || 'Failed to request password change');
    }
  };

  const handleLocationUpdate = () => {
    // Navigate to dedicated location update page
    router.push('/user-location' as any);
  };

  const handleDocumentUpload = () => {
    // Navigate to document upload page
    router.push('/user-documents' as any);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile.Full_Name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.profileName}>{profile.Full_Name}</Text>
            <Text style={styles.profileId}>ID: {profile.Villager_ID}</Text>
          </View>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Profile Content */}
      {editMode ? (
        <View style={styles.editContainer}>
          <Text style={styles.sectionTitle}>Edit Profile</Text>
          
          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Basic Information</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.full_name}
                onChangeText={(value) => handleInputChange('full_name', value)}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone_no}
                onChangeText={(value) => handleInputChange('phone_no', value)}
                placeholder="+94 XX XXX XXXX"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Date of Birth</Text>
              <TextInput
                style={styles.textInput}
                value={formData.dob}
                onChangeText={(value) => handleInputChange('dob', value)}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          {/* Location & Employment */}
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Location & Employment</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Address</Text>
              <TextInput
                style={styles.textInput}
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Your residential address"
                multiline
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Regional Division</Text>
              <TextInput
                style={styles.textInput}
                value={formData.regional_division}
                onChangeText={(value) => handleInputChange('regional_division', value)}
                placeholder="Your regional division"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Job</Text>
              <TextInput
                style={styles.textInput}
                value={formData.job}
                onChangeText={(value) => handleInputChange('job', value)}
                placeholder="Your occupation"
              />
            </View>
          </View>

          {/* Personal Details */}
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Personal Details</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.pickerContainer}>
                {['Male', 'Female', 'Other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.pickerOption,
                      formData.gender === gender && styles.pickerOptionSelected
                    ]}
                    onPress={() => handleInputChange('gender', gender)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.gender === gender && styles.pickerOptionTextSelected
                    ]}>
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Marital Status</Text>
              <View style={styles.pickerContainer}>
                {['Married', 'Unmarried', 'Divorced', 'Widowed', 'Separated'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.pickerOption,
                      formData.marital_status === status && styles.pickerOptionSelected
                    ]}
                    onPress={() => handleInputChange('marital_status', status)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.marital_status === status && styles.pickerOptionTextSelected
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Religion</Text>
              <View style={styles.pickerContainer}>
                {['Buddhism', 'Hinduism', 'Islam', 'Christianity', 'Others'].map((religion) => (
                  <TouchableOpacity
                    key={religion}
                    style={[
                      styles.pickerOption,
                      formData.religion === religion && styles.pickerOptionSelected
                    ]}
                    onPress={() => handleInputChange('religion', religion)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.religion === religion && styles.pickerOptionTextSelected
                    ]}>
                      {religion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Race</Text>
              <View style={styles.pickerContainer}>
                {['Sinhalese', 'Sri Lankan Tamils', 'Sri Lankan Moors', 'Indian Tamils'].map((race) => (
                  <TouchableOpacity
                    key={race}
                    style={[
                      styles.pickerOption,
                      formData.race === race && styles.pickerOptionSelected
                    ]}
                    onPress={() => handleInputChange('race', race)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.race === race && styles.pickerOptionTextSelected
                    ]}>
                      {race}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Status */}
          <View style={styles.section}>
            <Text style={styles.sectionSubtitle}>Status & Participation</Text>
            
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Alive Status</Text>
              <View style={styles.pickerContainer}>
                {['Alive', 'Deceased'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.pickerOption,
                      formData.alive_status === status && styles.pickerOptionSelected
                    ]}
                    onPress={() => handleInputChange('alive_status', status)}
                  >
                    <Text style={[
                      styles.pickerOptionText,
                      formData.alive_status === status && styles.pickerOptionTextSelected
                    ]}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <View style={styles.switchContainer}>
                <Text style={styles.fieldLabel}>Election Participant</Text>
                <Switch
                  value={formData.is_election_participant}
                  onValueChange={(value) => handleInputChange('is_election_participant', value)}
                  trackColor={{ false: '#767577', true: Colors.primary }}
                  thumbColor={formData.is_election_participant ? '#f5dd4b' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleEditSubmit}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditMode(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.viewContainer}>
          {/* Personal Information Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{profile.Full_Name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NIC</Text>
              <Text style={styles.infoValue}>{profile.NIC || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>
                {profile.DOB ? new Date(profile.DOB).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{profile.Gender || 'N/A'}</Text>
            </View>
          </View>

          {/* Contact Information Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Contact Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile.Email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{profile.Phone_No}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{profile.Address || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Regional Division</Text>
              <Text style={styles.infoValue}>{profile.RegionalDivision || 'N/A'}</Text>
            </View>
          </View>

          {/* Professional Details Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Professional Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Job</Text>
              <Text style={styles.infoValue}>{profile.Job || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Marital Status</Text>
              <Text style={styles.infoValue}>{profile.Marital_Status || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Religion</Text>
              <Text style={styles.infoValue}>{profile.Religion || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Race</Text>
              <Text style={styles.infoValue}>{profile.Race || 'N/A'}</Text>
            </View>
          </View>

          {/* Status Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Status & Account</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <View style={[styles.statusBadge, { backgroundColor: profile.Status === 'Active' ? '#28a745' : '#dc3545' }]}>
                <Text style={styles.statusText}>{profile.Status}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Alive Status</Text>
              <Text style={styles.infoValue}>{profile.Alive_Status || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Election Participant</Text>
              <Text style={styles.infoValue}>{profile.IsParticipant ? 'Yes' : 'No'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Villager ID</Text>
              <Text style={styles.infoValue}>{profile.Villager_ID}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <Text style={styles.actionButtonsTitle}>Quick Actions</Text>
            <View style={styles.actionButtonsGrid}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => setEditMode(true)}
              >
                <Text style={styles.actionButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handlePasswordChangeRequest}
              >
                <Text style={styles.actionButtonText}>Change Password</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleLocationUpdate}
              >
                <Text style={styles.actionButtonText}>Update Location</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleDocumentUpload}
              >
                <Text style={styles.actionButtonText}>Upload Documents</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* Password Change Mode */}
      {passwordMode && (
        <View style={styles.modeContainer}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <Text style={styles.modeDescription}>Enter your email to receive an OTP for password reset</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={profile.Email}
              editable={false}
            />
          </View>
          
          <View style={styles.modeButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setPasswordMode(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handlePasswordChangeRequest}>
              <Text style={styles.saveButtonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.base,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.borderRadius.md,
  },
  retryButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: Spacing.borderRadius.lg,
    marginBottom: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: Spacing.sm,
  },
  backButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: Spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.xxl,
    fontWeight: 'bold',
    color: 'white',
  },
  headerText: {
    flex: 1,
  },
  profileName: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: Spacing.xs,
  },
  profileId: {
    fontSize: Typography.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editContainer: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  viewContainer: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: Typography.lg,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  fieldContainer: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.base,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  pickerOption: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.borderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: 'white',
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
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.xl,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    flex: 1,
    marginRight: Spacing.sm,
  },
  saveButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    flex: 1,
    marginLeft: Spacing.sm,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: '600',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: '#6c757d',
    flex: 1,
  },
  infoValue: {
    fontSize: Typography.sm,
    color: Colors.text,
    flex: 2,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.borderRadius.sm,
  },
  statusText: {
    color: 'white',
    fontSize: Typography.xs,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    backgroundColor: 'white',
    borderRadius: Spacing.borderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonsTitle: {
    fontSize: Typography.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  actionButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.borderRadius.md,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    color: 'white',
    fontSize: Typography.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  modeContainer: {
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
  modeDescription: {
    fontSize: Typography.sm,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
  },
});

export default UserProfileScreen;
