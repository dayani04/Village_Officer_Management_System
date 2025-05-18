import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../../../../../api/villager';
import './VillagerDetailsPage.css'; // Assuming a separate CSS file

const VillagerDetailsPage = () => {
  const [villager, setVillager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVillagerData = async () => {
      try {
        const data = await api.fetchVillager(id);
        setVillager(data);
        setLoading(false);
      } catch (err) {
        setError(err.error || 'Failed to fetch villager details');
        setLoading(false);
      }
    };

    fetchVillagerData();
  }, [id]);

  const handleBack = () => {
    navigate('/villager-action');
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (!villager) {
    return (
      <div className="profile-container">
        <h1>Villager Details</h1>
        <div className="error-message">{error || 'Villager not found'}</div>
        <div className="form-buttons">
          <button className="back-button" onClick={handleBack}>
            Back to Villager List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1>Villager Details</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="profile-details">
        <div className="profile-field">
          <label>Villager ID:</label>
          <span>{villager.Villager_ID}</span>
        </div>
        <div className="profile-field">
          <label>Full Name:</label>
          <span>{villager.Full_Name}</span>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <span>{villager.Email}</span>
        </div>
        <div className="profile-field">
          <label>Phone Number:</label>
          <span>{villager.Phone_No}</span>
        </div>
        <div className="profile-field">
          <label>NIC:</label>
          <span>{villager.NIC || 'N/A'}</span>
        </div>
        <div className="profile-field">
          <label>Date of Birth:</label>
          <span>{villager.DOB ? new Date(villager.DOB).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="profile-field">
          <label>Address:</label>
          <span>{villager.Address || 'N/A'}</span>
        </div>
        <div className="profile-field">
          <label>Regional Division:</label>
          <span>{villager.RegionalDivision || 'N/A'}</span>
        </div>
        <div className="profile-field">
          <label>Status:</label>
          <span>{villager.Status}</span>
        </div>
        <div className="profile-field">
          <label>Area ID:</label>
          <span>{villager.Area_ID || 'N/A'}</span>
        </div>
        <div className="profile-field">
          <label>Location:</label>
          <span>
            {villager.Latitude && villager.Longitude
              ? `Lat: ${parseFloat(villager.Latitude).toFixed(8)}, Lng: ${parseFloat(villager.Longitude).toFixed(8)}`
              : 'Not set'}
          </span>
        </div>
        <div className="profile-field">
          <label>Upcoming Election Participant:</label>
          <span>{villager.IsParticipant ? 'Yes' : 'No'}</span>
        </div>
        <div className="profile-field">
          <label>Alive Status:</label>
          <span>{villager.Alive_Status || 'N/A'}</span>
        </div>
      </div>
      <div className="form-buttons">
        <button className="back-button" onClick={handleBack}>
          Back to Villager List
        </button>
      </div>
    </div>
  );
};

export default VillagerDetailsPage;