import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import SecretaryDashBoard from '../SecretaryDashBoard/SecretaryDashBoard';
import * as villagerOfficerApi from '../../../../../api/villageOfficer';
import './ViewVillageOfficer.css'; // Use consistent styling

const ViewVillageOfficer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOfficer = async () => {
      try {
        const data = await villagerOfficerApi.fetchVillageOfficer(id);
        setOfficer(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching village officer:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch officer');
        setLoading(false);
        toast.error(err.response?.data?.error || 'Failed to fetch officer', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchOfficer();
  }, [id]);

  const handleBack = () => {
    navigate('/secretary-villager-officers');
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

  if (error || !officer) {
    return (
      <div className="page-layout">
        <div className="sidebar">
          <SecretaryDashBoard />
        </div>
        <div className="villager-list-container">
          <div className="profile-container">
            <h1>Officer Details</h1>
            <div className="error-message">{error || 'Officer not found'}</div>
            <div className="profile-actions">
              <button className="back-button" onClick={handleBack}>
                Back to Officers
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
          <h1>Officer Details</h1>
          <div className="profile-details">
            <div className="profile-field">
              <label>Officer ID:</label>
              <span>{officer.Villager_Officer_ID || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Full Name:</label>
              <span>{officer.Full_Name || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <span>{officer.Email || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Phone:</label>
              <span>{officer.Phone_No || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>NIC:</label>
              <span>{officer.NIC || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Date of Birth:</label>
              <span>{officer.DOB ? new Date(officer.DOB).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Address:</label>
              <span>{officer.Address || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Regional Division:</label>
              <span>{officer.RegionalDivision || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Status:</label>
              <span>{officer.Status || 'N/A'}</span>
            </div>
            <div className="profile-field">
              <label>Area ID:</label>
              <span>{officer.Area_ID || 'N/A'}</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="back-button" onClick={handleBack}>
              Back to Officers
            </button>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default ViewVillageOfficer;