import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as villagerApi from '../../../../../api/villager';
import './AllowanceOwnersDetails.css';

const AllowanceOwnersDetails = () => {
  const { villagerId } = useParams();
  const navigate = useNavigate();
  const [villager, setVillager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVillagerDetails = async () => {
      if (!villagerId) {
        const errorMessage = 'Invalid villager ID';
        console.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#f43f3f'
        });
        return;
      }

      try {
        console.log('Fetching villager with ID:', villagerId);
        const data = await villagerApi.fetchVillager(villagerId);
        console.log('Villager data:', data);
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#f43f3f'
        });
      }
    };

    fetchVillagerDetails();
  }, [villagerId]);

  const handleBack = () => {
    navigate('/allowances_owners');
  };

  if (loading) {
    return (
      <section className="view-villager-page">
        <div className="view-villager-container">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="view-villager-page">
        <button className="view-villager-back-btn" onClick={handleBack}>
          ←
        </button>
        <div className="view-villager-container">
          <h1>Allowance Owner Details</h1>
          <p>Error: {error}</p>
        </div>
      </section>
    );
  }

  if (!villager) {
    return (
      <section className="view-villager-page">
        <button className="view-villager-back-btn" onClick={handleBack}>
          ←
        </button>
        <div className="view-villager-container">
          <h1>Allowance Owner Details</h1>
          <p>Villager not found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="view-villager-page">
      <button className="view-villager-back-btn" onClick={handleBack}>
        ←
      </button>

      <h1>Allowance Owner Details</h1>

      <div className="view-villager-info">
        <p><strong>Villager ID:</strong> {villager.Villager_ID || 'N/A'}</p>
        <p><strong>Full Name:</strong> {villager.Full_Name || 'N/A'}</p>
        <p><strong>Email:</strong> {villager.Email || 'N/A'}</p>
        <p><strong>Phone Number:</strong> {villager.Phone_No || 'N/A'}</p>
        <p><strong>NIC:</strong> {villager.NIC || 'N/A'}</p>
        <p>
          <strong>Date of Birth:</strong>{' '}
          {villager.DOB ? new Date(villager.DOB).toLocaleDateString('en-GB') : 'N/A'}
        </p>
        <p><strong>Address:</strong> {villager.Address || 'N/A'}</p>
        <p><strong>Regional Division:</strong> {villager.RegionalDivision || 'N/A'}</p>
        <p><strong>Status:</strong> {villager.Status || 'N/A'}</p>
        <p><strong>Area ID:</strong> {villager.Area_ID || 'N/A'}</p>
        <p><strong>Latitude:</strong> {villager.Latitude ?? 'N/A'}</p>
        <p><strong>Longitude:</strong> {villager.Longitude ?? 'N/A'}</p>
        <p><strong>Election Participant:</strong> {villager.IsElectionParticipant ? 'Yes' : 'No'}</p>
        <p><strong>Alive Status:</strong> {villager.AliveStatus || 'N/A'}</p>
      </div>

      <div className="view-villager-actions">
      </div>

    </section>
  );
};

export default AllowanceOwnersDetails;