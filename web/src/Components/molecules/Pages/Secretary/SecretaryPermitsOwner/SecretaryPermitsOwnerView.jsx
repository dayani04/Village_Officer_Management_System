import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import SecretaryDashBoard from '../SecretaryDashBoard/SecretaryDashBoard';
import * as villagerApi from '../../../../../api/villager'; // Assume villager API exists
import './SecretaryPermitsOwnerView.css';

const SecretaryPermitsOwnerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [villager, setVillager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVillager = async () => {
      try {
        const data = await villagerApi.fetchVillager(id); // Fetch villager by ID
        setVillager(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching villager:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch villager');
        setLoading(false);
        toast.error(err.response?.data?.error || 'Failed to fetch villager', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchVillager();
  }, [id]);

  const handleBack = () => {
    navigate('/SecretaryPermitsOwner');
  };

  if (loading) {
    return (
      <div className="page-layout">
        <div className="sidebar">
          <SecretaryDashBoard />
        </div>
        <div className="villager-list-container">
          <div className="profile-container">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !villager) {
    return (
      <div className="page-layout">
        <div className="sidebar">
          <SecretaryDashBoard />
        </div>
        <div className="villager-list-container">
          <div className="profile-container">
            <h1>Villager Details</h1>
            <div className="error-message">{error || 'Villager not found'}</div>
            <div className="profile-actions">
              <button className="profile-back-btn" onClick={handleBack}>
                Back to Permit Owners
              </button>
            </div>
            <Toaster />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <div className="sidebar">
        <SecretaryDashBoard />
      </div>
      <div className="villager-list-container">
        <div className="profile-container">
          <h1>Villager Details</h1>
          <div className="profile-details">
            <div className="profile-field">
              <label>Villager ID:</label>
              <span>{villager.Villager_ID || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Full Name:</label>
              <span>{villager.Full_Name || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <span>{villager.Email || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Phone:</label>
              <span>{villager.Phone_No || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Address:</label>
              <span>{villager.Address || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Date of Birth:</label>
              <span>{villager.DOB ? new Date(villager.DOB).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>NIC:</label>
              <span>{villager.NIC || 'N/A'}</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="profile-back-btn" onClick={handleBack}>
              Back to Permit Owners
            </button>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default SecretaryPermitsOwnerView;