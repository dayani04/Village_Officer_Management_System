import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerApi from '../../../../../api/villager';
import './ViewVillager.css';

const DownloadCertificate = ({ filename, documentType, disabled }) => {
  const handleDownload = async () => {
    if (!filename) {
      toast.error(`${documentType} not available`);
      return;
    }

    try {
      const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
      const blob = await villagerApi.downloadDocument(cleanFilename);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentType}_${cleanFilename}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`${documentType} downloaded successfully`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to download ${documentType}`);
    }
  };

  return (
    <button
      className="view-villager-download-btn"
      onClick={handleDownload}
      disabled={disabled || !filename}
    >
      {disabled ? 'Downloading...' : 'Download'}
    </button>
  );
};

const ViewVillager = () => {
  const { villagerId } = useParams();
  const navigate = useNavigate();
  const [villager, setVillager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVillagerDetails = async () => {
      try {
        const data = await villagerApi.fetchVillager(villagerId);
        setVillager(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch villager');
      }
      setLoading(false);
    };

    fetchVillagerDetails();
  }, [villagerId]);

  const handleBack = () => navigate('/Villagers');

  if (loading) {
    return (
      <section className="view-villager-page">
        <div className="view-villager-container">Loading...</div>
        <Toaster />
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
          <h1>Villager Details</h1>
          <p>Error: {error}</p>
        </div>
        <Toaster />
      </section>
    );
  }

  return (
    <section className="view-villager-page">
      <button className="view-villager-back-btn" onClick={handleBack}>
        ←
      </button>
 
        <h1>Villager Details</h1>

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
          <p><strong>Election Participant:</strong> {villager.IsParticipant ? 'Yes' : 'No'}</p>
          <p><strong>Alive Status:</strong> {villager.Alive_Status || 'N/A'}</p>
          {/* <p>
            <strong>Birth Certificate:</strong>{' '}
            {villager.BirthCertificate ? (
              <DownloadCertificate
                filename={villager.BirthCertificate}
                documentType="Birth Certificate"
              />
            ) : 'N/A'}
          </p>
          <p>
            <strong>NIC Copy:</strong>{' '}
            {villager.NICCopy ? (
              <DownloadCertificate
                filename={villager.NICCopy}
                documentType="NIC Copy"
              />
            ) : 'N/A'}
          </p> */}
        </div>

        <div className="view-villager-actions">
        </div>

        <Toaster />

    </section>
  );
};

export default ViewVillager;
