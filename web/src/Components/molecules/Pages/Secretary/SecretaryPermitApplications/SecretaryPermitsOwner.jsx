import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as permitApplicationApi from '../../../../../api/permitApplication';
import SecretaryDashBoard from '../SecretaryDashBoard/SecretaryDashBoard'; // Import SecretaryDashBoard
import './SecretaryPermitsOwner.css';

const SecretaryPermitsOwner = () => {
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
    navigate(`/secretary_permits_owner_view/${villagerId}`);
  };

  const handleBack = () => {
    navigate('/SecretaryDashBoard'); // Updated to match SecretaryDashBoard route
  };

  if (loading) {
    return (
      <div className="page-layout">
        <div className="sidebar">
          <SecretaryDashBoard />
        </div>
        <div className="villager-list-container">
          <div className="owners-container">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-layout">
        <div className="sidebar">
          <SecretaryDashBoard />
        </div>
        <div className="villager-list-container">
          <div className="owners-container">
            <h1>Confirmed Permit Owners</h1>
            <p className="error-message">{error}</p>
            <div className="owners-actions">
              <button className="owners-back-btn" onClick={handleBack}>
                Back to Dashboard
              </button>
            </div>
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
        <div className="owners-container">
          <h1>Confirmed Permit Owners</h1>
          <div className="owners-table-wrapper">
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
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.Villager_ID}>
                      <td>{app.Full_Name || 'N/A'}</td>
                      <td>{app.Villager_ID || 'N/A'}</td>
                      <td>{app.Permits_Type || 'N/A'}</td>
                      <td>{app.Phone_No || 'N/A'}</td>
                      <td>{app.Address || 'N/A'}</td>
                      <td>
                        <button
                          className="owners-view-btn"
                          onClick={() => handleViewDetails(app.Villager_ID)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="owners-no-data">
                      No confirmed permit owners
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="owners-actions">
            <button className="owners-back-btn" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretaryPermitsOwner;