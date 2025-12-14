import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, FaBriefcase, FaEdit, FaLock, FaMap, FaUpload, FaCheck, FaTimes } from 'react-icons/fa';
import * as api from '../../../../../api/villager';
import './UserProfile.css';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612
};

const libraries = ['places'];

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [villagerId, setVillagerId] = useState(null);
  const [locationMode, setLocationMode] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [villagerLocation, setVillagerLocation] = useState(null);
  const [map, setMap] = useState(null);

  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  useEffect(() => {
    const fetchProfileAndLocation = async () => {
      try {
        const profileData = await api.getProfile();
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
          dob: profileData.DOB ? new Date(profileData.DOB).toISOString().split('T')[0] : '',
          religion: profileData.Religion || 'Others',
          race: profileData.Race || 'Sinhalese'
        });

        if (profileData.Latitude && profileData.Longitude) {
          setVillagerLocation({
            lat: parseFloat(profileData.Latitude),
            lng: parseFloat(profileData.Longitude)
          });
          setLatitude(profileData.Latitude.toString());
          setLongitude(profileData.Longitude.toString());
        } else {
          setVillagerLocation(null);
        }

        setLoading(false);
      } catch (err) {
        setError(err.error || 'Failed to fetch profile or location');
        setLoading(false);
      }
    };

    fetchProfileAndLocation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
        is_election_participant: formData.is_election_participant,
        alive_status: formData.alive_status,
        job: formData.job,
        gender: formData.gender,
        marital_status: formData.marital_status,
        dob: formData.dob,
        religion: formData.religion,
        race: formData.race
      };

      await api.updateVillager(profile.Villager_ID, updatePayload);
      setProfile({
        ...profile,
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
    } catch (err) {
      setError(err.error || 'Failed to update profile: ' + err.message);
    }
  };

  const handlePasswordChangeRequest = async () => {
    try {
      const response = await api.requestPasswordOtp(profile.Email);
      setVillagerId(response.villagerId);
      setOtpMode(true);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to send OTP');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.verifyPasswordOtp(villagerId, otp, newPassword);
      setOtpMode(false);
      setOtp('');
      setNewPassword('');
      setVillagerId(null);
      setError('Password updated successfully');
    } catch (err) {
      setError(err.error || 'Invalid OTP or failed to update password');
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!latitude || !longitude) {
        setError('Latitude and Longitude are required');
        return;
      }

      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        setError('Invalid Latitude or Longitude values');
        return;
      }

      await api.updateVillagerLocation(profile.Villager_ID, lat, lng);
      setVillagerLocation({ lat, lng });
      setProfile(prevProfile => ({ ...prevProfile, Latitude: lat, Longitude: lng }));
      setLocationMode(false);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to update location: ' + err.message);
    }
  };

  const handleBack = () => {
    navigate('/user_dashboard');
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  const mapCenter = villagerLocation || defaultCenter;

  return (
    <section className="profile-page">
      <NavBar/>
      <br/>
      <div className="profile-hero">
        <button className="back-button" onClick={handleBack} title="Back to Dashboard">
          <FaArrowLeft />
        </button>
        
        <div className="hero-content">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <FaUser />
            </div>
            <div className="status-badge active">{profile.Status}</div>
          </div>
          <br/>
          
          <div className="hero-text">
            <h1 className="profile-title">{profile.Full_Name}</h1>
            <p className="profile-subtitle">Villager ID: {profile.Villager_ID}</p>
          </div>
          
          <div className="hero-actions">
            <button className="action-button primary" onClick={() => setEditMode(true)}>
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
      </div> <br/>
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
                <h3>Location & Employment</h3>
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
                    <label><FaBriefcase /> Job</label>
                    <input
                      type="text"
                      name="job"
                      value={formData.job}
                      onChange={handleInputChange}
                      placeholder="Your occupation"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Personal Details</h3>
                <div className="form-row">
                  <div className="profile-field">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="profile-field">
                    <label>Marital Status</label>
                    <select
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleInputChange}
                    >
                      <option value="Married">Married</option>
                      <option value="Unmarried">Unmarried</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="profile-field">
                    <label>Religion</label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                    >
                      <option value="Buddhism">Buddhism</option>
                      <option value="Hinduism">Hinduism</option>
                      <option value="Islam">Islam</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className="profile-field">
                    <label>Race</label>
                    <select
                      name="race"
                      value={formData.race}
                      onChange={handleInputChange}
                    >
                      <option value="Sinhalese">Sinhalese</option>
                      <option value="Sri Lankan Tamils">Sri Lankan Tamils</option>
                      <option value="Sri Lankan Moors">Sri Lankan Moors</option>
                      <option value="Indian Tamils">Indian Tamils</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Status & Participation</h3>
                <div className="form-row">
                  <div className="profile-field">
                    <label>Alive Status</label>
                    <select
                      name="alive_status"
                      value={formData.alive_status}
                      onChange={handleInputChange}
                    >
                      <option value="Alive">Alive</option>
                      <option value="Deceased">Deceased</option>
                    </select>
                  </div>
                  <div className="profile-field checkbox-field">
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        name="is_election_participant"
                        checked={formData.is_election_participant}
                        onChange={handleInputChange}
                        id="election-participant"
                      />
                      <label htmlFor="election-participant" className="checkbox-label">
                        <span className="checkmark"></span>
                        Upcoming Election Participant
                      </label>
                    </div>
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
              <p>Enter the OTP sent to your email and set a new password</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="otp-form">
              <div className="profile-field">
                <label>OTP Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
                <small>Sent to: {profile.Email}</small>
              </div>
              <div className="profile-field">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
        ) : locationMode ? (
          <div className="location-mode-container">
            <div className="location-header">
              <h2><FaMap /> {villagerLocation ? 'Update Your Location' : 'Add Your Location'}</h2>
              <p>Click on the map or enter coordinates to set your location</p>
            </div>
            
            <div className="map-container">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={mapCenter}
                  zoom={villagerLocation ? 15 : 10}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  onClick={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setLatitude(lat.toFixed(8));
                    setLongitude(lng.toFixed(8));
                  }}
                  className="google-map"
                >
                  {villagerLocation && <Marker position={villagerLocation} />}
                </GoogleMap>
              ) : (
                <div className="map-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading map...</p>
                </div>
              )}
            </div>

            <form onSubmit={handleLocationSubmit} className="location-form">
              <div className="coordinates-input">
                <div className="profile-field">
                  <label>Latitude</label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="e.g., 6.9271"
                    required
                  />
                </div>
                <div className="profile-field">
                  <label>Longitude</label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="e.g., 79.8612"
                    required
                  />
                </div>
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="save-button">
                  <FaMapMarkerAlt /> {villagerLocation ? 'Update Location' : 'Save Location'}
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setLocationMode(false)}
                >
                  <FaTimes /> Back to Profile
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
                    <label>Gender</label>
                    <span>{profile.Gender || 'N/A'}</span>
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
                    <label>Job</label>
                    <span>{profile.Job || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Marital Status</label>
                    <span>{profile.Marital_Status || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Religion</label>
                    <span>{profile.Religion || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Race</label>
                    <span>{profile.Race || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-card quaternary">
                <div className="card-header">
                  <FaMapMarkerAlt className="card-icon" />
                  <h3>Location & Status</h3>
                </div>
                <div className="card-content">
                  <div className="info-item">
                    <label>Area ID</label>
                    <span>{profile.Area_ID || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Location</label>
                    <span>
                      {villagerLocation
                        ? `Lat: ${villagerLocation.lat.toFixed(6)}, Lng: ${villagerLocation.lng.toFixed(6)}`
                        : 'Not set'}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Status</label>
                    <span className="status-badge">{profile.Status}</span>
                  </div>
                  <div className="info-item">
                    <label>Election Participant</label>
                    <span>{profile.IsParticipant ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-card fifth">
                <div className="card-header">
                  <FaUser className="card-icon" />
                  <h3>Account Details</h3>
                </div>
                <div className="card-content">
                  <div className="info-item">
                    <label>Villager ID</label>
                    <span>{profile.Villager_ID}</span>
                  </div>
                  <div className="info-item">
                    <label>Registration Date</label>
                    <span>{profile.Created_Date ? new Date(profile.Created_Date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Last Updated</label>
                    <span>{profile.Updated_Date ? new Date(profile.Updated_Date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Account Status</label>
                    <span className="status-badge active">{profile.Status}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-card sixth">
                <div className="card-header">
                  <FaBriefcase className="card-icon" />
                  <h3>Additional Info</h3>
                </div>
                <div className="card-content">
                  <div className="info-item">
                    <label>Alive Status</label>
                    <span>{profile.Alive_Status || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Marital Status</label>
                    <span>{profile.Marital_Status || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Religion</label>
                    <span>{profile.Religion || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <label>Race</label>
                    <span>{profile.Race || 'N/A'}</span>
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
                <button className="action-button" onClick={() => setLocationMode(true)}>
                  <FaMap /> {villagerLocation ? 'Update Location' : 'Add Location'}
                </button>
                <button className="action-button" onClick={() => navigate('/upload-documents')}>
                  <FaUpload /> Upload Documents
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </section>
  );
};

export default UserProfile;