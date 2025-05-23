import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../../../../api/secretary';
import './SecretaryProfile.css';

const SecretaryProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    address: '',
    regional_division: '',
    status: 'Active',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [secretaryId, setSecretaryId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await api.getProfile();
        console.log('Fetched secretary profile:', profileData);
        setProfile(profileData);
        setFormData({
          full_name: profileData.Full_Name || '',
          email: profileData.Email || '',
          phone_no: profileData.Phone_No || '',
          address: profileData.Address || '',
          regional_division: profileData.RegionalDivision || '',
          status: profileData.Status || 'Active',
        });
        setLoading(false);
      } catch (err) {
        setError(err.error || 'Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.full_name || !formData.email || !formData.phone_no) {
        setError('Full Name, Email, and Phone Number are required');
        return;
      }

      const updatePayload = {
        full_name: formData.full_name,
        email: formData.email,
        phone_no: formData.phone_no,
        address: formData.address,
        regional_division: formData.regional_division,
        status: formData.status,
      };

      await api.updateSecretary(profile.Secretary_ID, updatePayload);
      setProfile({
        ...profile,
        Full_Name: formData.full_name,
        Email: formData.email,
        Phone_No: formData.phone_no,
        Address: formData.address,
        RegionalDivision: formData.regional_division,
        Status: formData.status,
      });
      setEditMode(false);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to update profile: ' + err.message);
    }
  };

  const handlePasswordChangeRequest = async () => {
    try {
      const response = await api.requestPasswordOtp(profile.Email);
      setSecretaryId(response.secretaryId);
      setOtpMode(true);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to send OTP');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.verifyPasswordOtp(secretaryId, otp, newPassword);
      setOtpMode(false);
      setOtp('');
      setNewPassword('');
      setSecretaryId(null);
      setError('Password updated successfully');
    } catch (err) {
      setError(err.error || 'Invalid OTP or failed to update password');
    }
  };

  const handleBack = () => {
    navigate('/SecretaryDashboard');
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Secretary Profile</h1>
      {error && <div className="error-message">{error}</div>}

      {editMode ? (
        <form onSubmit={handleEditSubmit} className="profile-form">
          <div className="profile-field">
            <label>Full Name:</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="profile-field">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="profile-field">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-field">
            <label>Regional Division:</label>
            <input
              type="text"
              name="regional_division"
              value={formData.regional_division}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-field">
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-buttons">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : otpMode ? (
        <form onSubmit={handlePasswordSubmit} className="otp-form">
          <div className="profile-field">
            <label>OTP (sent to {profile.Email}):</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div className="profile-field">
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="save-button">
              Verify & Update Password
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setOtpMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="profile-details">
            <div className="profile-field">
              <label>Secretary ID:</label>
              <span>{profile.Secretary_ID}</span>
            </div>
            <div className="profile-field">
              <label>Full Name:</label>
              <span>{profile.Full_Name}</span>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <span>{profile.Email}</span>
            </div>
            <div className="profile-field">
              <label>Phone Number:</label>
              <span>{profile.Phone_No}</span>
            </div>
            <div className="profile-field">
              <label>NIC:</label>
              <span>{profile.NIC || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Date of Birth:</label>
              <span>{profile.DOB ? new Date(profile.DOB).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Address:</label>
              <span>{profile.Address || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Regional Division:</label>
              <span>{profile.RegionalDivision || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Status:</label>
              <span>{profile.Status}</span>
            </div>
            <div className="profile-field">
              <label>Area ID:</label>
              <span>{profile.Area_ID || 'N/A'}</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="edit-button" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
            <button className="password-button" onClick={handlePasswordChangeRequest}>
              Change Password
            </button>
            <button className="back-button" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SecretaryProfile;