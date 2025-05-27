import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerApi from '../../../../../api/villager';
import './ViewVillager.css';

const ViewVillager = () => {
  const { villagerId } = useParams();
  const navigate = useNavigate();
  const [villager, setVillager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVillagerDetails = async () => {
      if (!villagerId) {
        const errorMessage = 'Invalid villager ID';
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage, {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
        return;
      }

      try {
        const data = await villagerApi.fetchVillager(villagerId);
        if (!data) {
          throw new Error('No villager data returned');
        }
        setVillager(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        const errorMessage = err.error || err.message || 'Failed to fetch villager details';
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

    fetchVillagerDetails();
  }, [villagerId]);

  const handleBack = () => {
    navigate('/Villagers');
  };

  if (loading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="view-villager-container">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="view-villager-container">
          <h1>Villager Details</h1>
          <p>Error: {error}</p>
          <div className="view-villager-actions">
            <button className="view-villager-back-btn" onClick={handleBack}>
              Back to Villagers
            </button>
          </div>
          <Toaster />
        </div>
      </section>
    );
  }

  if (!villager) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="view-villager-container">
          <h1>Villager Details</h1>
          <p>Villager not found</p>
          <div className="view-villager-actions">
            <button className="view-villager-back-btn" onClick={handleBack}>
              Back to Villagers
            </button>
          </div>
          <Toaster />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="view-villager-container">
        <h1>Villager Details</h1>
        <div className="view-villager-info">
          <p><strong>Villager ID:</strong> {villager.Villager_ID || 'N/A'}</p>
          <p><strong>Full Name:</strong> {villager.Full_Name || 'N/A'}</p>
          <p><strong>Email:</strong> {villager.Email || 'N/A'}</p>
          <p><strong>Phone Number:</strong> {villager.Phone_No || 'N/A'}</p>
          <p><strong>NIC:</strong> {villager.NIC || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> {villager.DOB ? new Date(villager.DOB).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Address:</strong> {villager.Address || 'N/A'}</p>
          <p><strong>Regional Division:</strong> {villager.RegionalDivision || 'N/A'}</p>
          <p><strong>Status:</strong> {villager.Status || 'N/A'}</p>
          <p><strong>Area ID:</strong> {villager.Area_ID || 'N/A'}</p>
          <p><strong>Latitude:</strong> {villager.Latitude ?? 'N/A'}</p>
          <p><strong>Longitude:</strong> {villager.Longitude ?? 'N/A'}</p>
          <p><strong>Election Participant:</strong> {villager.IsParticipant ? 'Yes' : 'No'}</p>
          <p><strong>Alive Status:</strong> {villager.Alive_Status || 'N/A'}</p>
        </div>
        <div className="view-villager-actions">
          <button className="view-villager-back-btn" onClick={handleBack}>
            Back to Villagers
          </button>
        </div>
        <Toaster />
      </div>
    </section>
  );
};

export default ViewVillager;