import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import SecretaryDashBoard from '../SecretaryDashBoard/SecretaryDashBoard';
import * as villagerApi from '../../../../../api/villager';
import './SecretaryNICApplicationsVillagerView.css';

const SecretaryNICApplicationsVillagerView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [villager, setVillager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVillager = async () => {
      try {
        const data = await villagerApi.fetchVillager(id);
        setVillager(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching villager:', err);
        setError(err.error || 'Failed to fetch villager');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch villager', {
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
    navigate('/secretary_nic_applications');
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
                Back to Allowance Recipients
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
            <p className="profile-field">
              <strong>Villager ID:</strong> <span>{villager.Villager_ID || 'N/A'}</span>
            </p>
            <p className="profile-field">
              <strong>Full Name:</strong> <span>{villager.Full_Name || 'N/A'}</span>
            </p>
            <p className="profile-field">
              <strong>Email:</strong> <span>{villager.Email || 'N/A'}</span>
            </p>
            <p className="profile-field">
              <strong>Phone:</strong> <span>{villager.Phone_No || 'N/A'}</span>
            </p>
            <p className="profile-field">
              <strong>Address:</strong> <span>{villager.Address || 'N/A'}</span>
            </p>
            <p className="profile-field">
              <strong>Date of Birth:</strong> <span>{villager.DOB ? new Date(villager.DOB).toLocaleDateString() : 'N/A'}</span>
            </p>
            <p className="profile-field">
              <strong>NIC:</strong> <span>{villager.NIC || 'N/A'}</span>
            </p>
            <p className="profile-field">
              <strong>Regional Division:</strong> <span>{villager.RegionalDivision || 'N/A'}</span>
            </p>
            <p className="profile-field">
              <strong>Status:</strong> <span>{villager.Status || 'N/A'}</span>
            </p>
            <p className="profile-field">
              <strong>Area ID:</strong> <span>{villager.Area_ID || 'N/A'}</span>
            </p>
          </div>
          <div className="profile-actions">
            <button className="profile-back-btn" onClick={handleBack}>
              Back to Allowance Recipients
            </button>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default SecretaryNICApplicationsVillagerView;