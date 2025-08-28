
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerApi from '../../../../../api/villager';
import './RequestsForNewVillagers.css';

const RequestsForNewVillagers = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await villagerApi.fetchNewFamilyMemberRequests();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch new villager requests');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDownload = async (filename) => {
    try {
      const blob = await villagerApi.downloadDocument(filename);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.error || 'Failed to download document', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/VillageOfficerDashBoard');
  };

  if (loading) {
    return <div className="new-villagers-container">Loading...</div>;
  }

  if (error) {
    return <div className="new-villagers-container">Error: {error}</div>;
  }

  return (
    <div className="new-villagers-container">
      <h1>New Villager Requests</h1>
      <table className="new-villagers-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Address</th>
            <th>Villager ID</th>
            <th>Relationship</th>
            <th>Document</th>
            <th>Residence Certificate</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.Request_ID}>
              <td>{req.Email}</td>
              <td>{req.Address}</td>
              <td>{req.Villager_ID}</td>
              <td>{req.Relationship}</td>
              <td>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(req.DocumentPath);
                  }}
                  className="download-link"
                >
                  Download
                </a>
              </td>
              <td>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(req.ResidenceCertificatePath);
                  }}
                  className="download-link"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="new-villagers-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default RequestsForNewVillagers;
