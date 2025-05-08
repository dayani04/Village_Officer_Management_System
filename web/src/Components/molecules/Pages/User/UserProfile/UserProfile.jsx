import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import * as api from '../../../../../api/villager';
import './UserProfile.css';

// Google Maps settings
const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 6.9271, // Default to a central location (e.g., Kandy, Sri Lanka)
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [villagerId, setVillagerId] = useState(null); // New state for villagerId
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
      });
      setEditMode(false);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to update profile: ' + err.message);
    }
  };

  const handlePasswordChangeRequest = async () => {
    try {
      const response = await api.requestPasswordOtp(profile.Email); // Use profile.Email
      setVillagerId(response.villagerId); // Store villagerId from response
      setOtpMode(true);
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to send OTP');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.verifyPasswordOtp(villagerId, otp, newPassword); // Use stored villagerId
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
    navigate('/UserDashboard');
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  const mapCenter = villagerLocation || defaultCenter;

  return (
    <div className="profile-container">
      <h1>Villager Profile</h1>
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
            <label>Upcoming Election Participant:</label>
            <input
              type="checkbox"
              name="is_election_participant"
              checked={formData.is_election_participant}
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
      ) : locationMode ? (
        <div className="location-section">
          <h3>{villagerLocation ? 'Your Location' : 'Add Your Location'}</h3>
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
            >
              {villagerLocation && <Marker position={villagerLocation} />}
            </GoogleMap>
          ) : (
            <div>Loading Map...</div>
          )}

          <form onSubmit={handleLocationSubmit} className="location-form">
            <p>Click on the map to select a location or enter coordinates manually:</p>
            <div className="profile-field">
              <label>Latitude:</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 6.9271"
                required
              />
            </div>
            <div className="profile-field">
              <label>Longitude:</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., 79.8612"
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="save-button">
                {villagerLocation ? 'Update Location' : 'Save Location'}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setLocationMode(false)}
              >
                Back to Profile
              </button>
            </div>
          </form>
        </div>
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
            <div className="profile-field">
              <label>Location:</label>
              <span>
                {villagerLocation
                  ? `Lat: ${villagerLocation.lat.toFixed(8)}, Lng: ${villagerLocation.lng.toFixed(8)}`
                  : 'Not set'}
              </span>
            </div>
            <div className="profile-field">
              <label>Upcoming Election Participant:</label>
              <span>{profile.IsParticipant ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="edit-button" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
            <button className="password-button" onClick={handlePasswordChangeRequest}>
              Change Password
            </button>
            <button className="location-button" onClick={() => setLocationMode(true)}>
              {villagerLocation ? 'View/Update Location' : 'Add Location'}
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