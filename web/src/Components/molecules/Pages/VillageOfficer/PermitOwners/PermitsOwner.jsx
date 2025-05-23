import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as permitApplicationApi from '../../../../../api/permitApplication';
import './PermitsOwner.css';

const PermitOwner = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConfirmedApplications = async () => {
      try {
        const data = await permitApplicationApi.fetchConfirmedPermitApplications();
        console.log('Fetched confirmed applications:', data);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch confirmed permit applications');
        setLoading(false);
      }
    };

    fetchConfirmedApplications();
  }, []);

  const handleViewDetails = (villagerId) => {
    console.log('Navigating to villager:', villagerId);
    navigate(`/permit-villager-details/${villagerId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="owners-container">Loading...</div>;
  }

  if (error) {
    return <div className="owners-container">Error: {error}</div>;
  }

  return (
    <div className="owners-container">
      <h1>Confirmed Permit Owners</h1>

      <table className="owners-table">
        <thead>
          <tr>
            <th>Villager Name</th>
            <th>Villager ID</th>
            <th>Permit Type</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.Villager_ID}>
              <td>{app.Full_Name}</td>
              <td>{app.Villager_ID}</td>
              <td>{app.Permits_Type}</td>
              <td>{app.Phone_No}</td>
              <td>{app.Address}</td>
              <td>
                <button
                  className="view-button"
                  onClick={() => handleViewDetails(app.Villager_ID)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="owners-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PermitOwner;