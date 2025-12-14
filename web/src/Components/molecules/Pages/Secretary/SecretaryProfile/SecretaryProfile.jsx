import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaEdit, FaLock, FaCheck, FaTimes } from 'react-icons/fa';
import * as api from '../../../../../api/secretary';
import './SecretaryProfile.css';

const SecretaryProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otpMode, setOtpMode] = useState(false);

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
        setLoading(false);
      } catch (err) {
        setError(err.error || 'Failed to fetch profile');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch profile', {
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
        status: formData.status,
        area_id: formData.area_id,
      };
      await api.updateSecretary(profile.Secretary_ID, payload);
      setProfile({
        ...profile,
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

  const handlePasswordChangeRequest = async () => {
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
      await api.requestPasswordOtp(otpData.email);
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
    const { otp, newPassword, secretaryId } = otpData;

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
      await api.verifyPasswordOtp(secretaryId, otp, newPassword);
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
    navigate('/SecretaryDashBoard'); // Consistent with other components
  };

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <h1>My Profile</h1>
        <div className="error-message">{error || 'Unable to load profile'}</div>
        <div className="profile-actions">
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-header-simple">
        <h1 className="page-title">Secretary Profile</h1>
        <p className="officer-name">{profile.Full_Name}</p>
       
      </div>
      
      <div className="profiles-container">
        {error && <div className="error-message">{error}</div>}

        {editMode ? (
          <div className="edit-mode-container">
            <div className="edit-header">
              <h2>Edit Profile Information</h2>
              <button className="close-button" onClick={() => setEditMode(false)}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="profile-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="profile-field">
                    <label><FaUser /> Full Name</label>
                    <input 
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="profile-field">
                    <label><FaEnvelope /> Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="profile-field">
                    <label><FaPhone /> Phone Number</label>
                    <input
                      type="tel"
                      name="phone_no"
                      value={formData.phone_no}
                      onChange={handleInputChange}
                      required
                      placeholder="+94 XX XXX XXXX"
                    />
                  </div>
                  <div className="profile-field">
                    <label><FaCalendar /> Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Location & Details</h3>
                <div className="form-row">
                  <div className="profile-field">
                    <label><FaMapMarkerAlt /> Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Your residential address"
                    />
                  </div>
                  <div className="profile-field">
                    <label>Regional Division</label>
                    <input
                      type="text"
                      name="regional_division"
                      value={formData.regional_division}
                      onChange={handleInputChange}
                      placeholder="Your regional division"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="profile-field">
                    <label>NIC</label>
                    <input
                      type="text"
                      name="nic"
                      value={formData.nic}
                      onChange={handleInputChange}
                      placeholder="Your NIC number"
                    />
                  </div>
                  <div className="profile-field">
                    <label>Area ID</label>
                    <input
                      type="text"
                      name="area_id"
                      value={formData.area_id}
                      onChange={handleInputChange}
                      placeholder="Your area ID"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="save-button">
                  <FaCheck /> Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditMode(false)}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        ) : otpMode ? (
          <div className="otp-mode-container">
            <div className="otp-header">
              <h2>Change Password</h2>
              <p>Enter OTP sent to your email and set a new password</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="otp-form">
              <div className="profile-field">
                <label>OTP Verification Code</label>
                <input
                  type="text"
                  name="otp"
                  value={otpData.otp}
                  onChange={handleOtpChange}
                  required
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
                <small>Sent to: {otpData.email}</small>
              </div>
              <div className="profile-field">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={otpData.newPassword}
                  onChange={handleOtpChange}
                  required
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="save-button">
                  <FaCheck /> Verify & Update Password
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setOtpMode(false)}
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="profile-view-container">
            <div className="info-cards-grid">
              <div className="info-card primary">
                <div className="card-header">
                  <FaUser className="card-icon" />
                  <h3>Personal Information</h3>
                </div>
                <div className="card-content">
                  <div className="info-item">
                    <label>Full Name</label>
                    <span>{profile.Full_Name}</span>
                  </div>
                  <div className="info-item">
                    <label>NIC</label>
                    <span>{profile.NIC || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Date of Birth</label>
                    <span>{profile.DOB ? new Date(profile.DOB).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Secretary ID</label>
                    <span>{profile.Secretary_ID}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-card secondary">
                <div className="card-header">
                  <FaEnvelope className="card-icon" />
                  <h3>Contact Information</h3>
                </div>
                <div className="card-content">
                  <div className="info-item">
                    <label>Email</label>
                    <span>{profile.Email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone Number</label>
                    <span>{profile.Phone_No}</span>
                  </div>
                  <div className="info-item">
                    <label>Address</label>
                    <span>{profile.Address || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Regional Division</label>
                    <span>{profile.RegionalDivision || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-card tertiary">
                <div className="card-header">
                  <FaBriefcase className="card-icon" />
                  <h3>Professional Details</h3>
                </div>
                <div className="card-content">
                  <div className="info-item">
                    <label>Status</label>
                    <span className={`status-badge ${profile.Status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {profile.Status}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Area ID</label>
                    <span>{profile.Area_ID || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Registration Date</label>
                    <span>{profile.Created_Date ? new Date(profile.Created_Date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Last Updated</label>
                    <span>{profile.Updated_Date ? new Date(profile.Updated_Date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="action-panel">
              <h3>Quick Actions</h3>
              <div className="action-buttons-grid">
                <button className="action-button" onClick={() => setEditMode(true)}>
                  <FaEdit /> Edit Profile
                </button>
                <button className="action-button" onClick={handlePasswordChangeRequest}>
                  <FaLock /> Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </section>
  );
};

export default SecretaryProfile;