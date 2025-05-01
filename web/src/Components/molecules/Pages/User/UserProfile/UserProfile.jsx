import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../../../../api/villager';
import './UserProfile.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
        setFormData({
          full_name: data.Full_Name || '',
          email: data.Email || '',
          phone_no: data.Phone_No || '',
          address: data.Address || '',
          regional_division: data.RegionalDivision || '',
          status: data.Status || 'Active',
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.full_name || !formData.email || !formData.phone_no) {
        setError('Full Name, Email, and Phone Number are required');
        return;
      }

      await api.updateVillager(profile.Villager_ID, formData);
      setProfile({ ...profile, ...formData });
      setEditMode(false);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to update profile: ' + err.message);
    }
  };

  const handlePasswordChangeRequest = async () => {
    try {
      await api.requestPasswordOtp(profile.Villager_ID);
      setOtpMode(true);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to send OTP');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.verifyPasswordOtp(profile.Villager_ID, otp, newPassword);
      setOtpMode(false);
      setOtp('');
      setNewPassword('');
      setError('Password updated successfully');
    } catch (err) {
      setError(err.error || 'Invalid OTP or failed to update password');
    }
  };

  const handleBack = () => {
    navigate('/UserDashboard');
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Villager Profile</h2>
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
              <label>Villager ID:</label>
              <span>{profile.Villager_ID}</span>
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

export default UserProfile;