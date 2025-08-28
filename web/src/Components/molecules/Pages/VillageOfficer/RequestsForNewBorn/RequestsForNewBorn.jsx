
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerApi from '../../../../../api/villager';
import './RequestsForNewBorn.css';

const RequestsForNewBorn = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await villagerApi.fetchNewBornRequests();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch new born requests');
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
    return <div className="new-born-container">Loading...</div>;
  }

  if (error) {
    return <div className="new-born-container">Error: {error}</div>;
  }

  return (
    <div className="new-born-container">
      <h1>New Born Requests</h1>
      <table className="new-born-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Address</th>
            <th>Villager ID</th>
            <th>Relationship</th>
            <th>Birth Certificate</th>
            <th>Mother NIC</th>
            <th>Father NIC</th>
            <th>Marriage Certificate</th>
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
                    handleDownload(req.BirthCertificatePath);
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
                    handleDownload(req.MotherNicPath);
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
                    handleDownload(req.FatherNicPath);
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
                    handleDownload(req.MarriageCertificatePath);
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
      <div className="new-born-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default RequestsForNewBorn;
