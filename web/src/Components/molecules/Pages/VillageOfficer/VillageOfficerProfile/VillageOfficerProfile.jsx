import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerOfficerApi from '../../../../../api/villageOfficer';
import './VillageOfficerProfile.css';

const VillageOfficerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [formData, setFormData] = useState({
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
  const [otpData, setOtpData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    officerId: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await villagerOfficerApi.getProfile();
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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch profile';
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage, {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (e) => {
    const { name, value } = e.target;
    setOtpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { full_name, email, phone_no } = formData;

    if (!full_name || !email || !phone_no) {
      setError('Full Name, Email, and Phone are required');
      toast.error('Full Name, Email, and Phone are required', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      toast.error('Invalid email format', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
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
        area_id: formData.area_id,
      };
      await villagerOfficerApi.updateVillageOfficer(profile.Villager_Officer_ID, payload);
      setProfile({
        ...profile,
        Full_Name: payload.full_name,
        Email: payload.email,
        Phone_No: payload.phone_no,
        NIC: payload.nic,
        DOB: payload.dob,
        Address: payload.address,
        RegionalDivision: payload.regional_division,
        Area_ID: payload.area_id,
      });
      setEditMode(false);
      setError('');
      toast.success('Profile updated successfully', {
        style: {
          background: '#4CAF50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update profile';
      setError(errorMsg);
      toast.error(errorMsg, {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleRequestOtp = async () => {
    if (!otpData.email) {
      setError('Email is missing');
      toast.error('Email is missing', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    try {
      await villagerOfficerApi.requestPasswordOtp(otpData.email);
      setOtpMode(true);
      setError('');
      toast.success('OTP sent to your email', {
        style: {
          background: '#4CAF50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to send OTP';
      setError(errorMsg);
      toast.error(errorMsg, {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { otp, newPassword, officerId } = otpData;

    if (!otp || !newPassword) {
      setError('OTP and new password are required');
      toast.error('OTP and new password are required', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      toast.error('Password must be at least 6 characters', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    try {
      await villagerOfficerApi.verifyPasswordOtp(officerId, otp, newPassword);
      setOtpMode(false);
      setOtpData((prev) => ({ ...prev, otp: '', newPassword: '' }));
      setError('');
      toast.success('Password updated successfully', {
        style: {
          background: '#4CAF50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update password';
      setError(errorMsg);
      toast.error(errorMsg, {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/VillageOfficerDashBoard');
  };

  if (loading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="profile-container">Loading profile...</div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="profile-container">
          <h1>My Profile</h1>
          <div className="error-message">{error || 'Unable to load profile'}</div>
          <div className="profile-actions">
            <button className="back-button" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
          <Toaster />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full flex flex-col p-4">
      <div className="profile-container">
        <h1>My Profile</h1>
        {error && <div className="error-message">{error}</div>}

        {editMode ? (
          <form onSubmit={handleEditSubmit} className="profile-form">
            <div className="profile-field">
              <label>Officer ID:</label>
              <input type="text" value={profile.Villager_Officer_ID || ''} disabled />
            </div>
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
              <label>Phone:</label>
              <input
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="profile-field">
              <label>NIC:</label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleInputChange}
              />
            </div>
            <div className="profile-field">
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
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
              <label>Area ID:</label>
              <input
                type="text"
                name="area_id"
                value={formData.area_id}
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
              <label>OTP (sent to {otpData.email}):</label>
              <input
                type="text"
                name="otp"
                value={otpData.otp}
                onChange={handleOtpChange}
                required
              />
            </div>
            <div className="profile-field">
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={otpData.newPassword}
                onChange={handleOtpChange}
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
                <label>Officer ID:</label>
                <span>{profile.Villager_Officer_ID || 'N/A'}</span>
              </div>
              <div className="profile-field">
                <label>Full Name:</label>
                <span>{profile.Full_Name || 'N/A'}</span>
              </div>
              <div className="profile-field">
                <label>Email:</label>
                <span>{profile.Email || 'N/A'}</span>
              </div>
              <div className="profile-field">
                <label>Phone:</label>
                <span>{profile.Phone_No || 'N/A'}</span>
              </div>
              <div className="profile-field">
                <label>NIC:</label>
                <span>{profile.NIC || 'N/A'}</span>
              </div>
              <div className="profile-field">
                <label>Date of Birth:</label>
                <span>
                  {profile.DOB ? new Date(profile.DOB).toLocaleDateString() : 'N/A'}
                </span>
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
                <span>{profile.Status || 'N/A'}</span>
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
              <button className="password-button" onClick={handleRequestOtp}>
                Change Password
              </button>
              <button className="back-button" onClick={handleBack}>
                Back to Dashboard
              </button>
            </div>
          </>
        )}
        <Toaster />
      </div>
    </section>
  );
};

export default VillageOfficerProfile;