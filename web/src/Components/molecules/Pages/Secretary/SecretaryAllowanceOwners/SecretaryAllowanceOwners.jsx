import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as allowanceApi from '../../../../../api/allowanceApi';
import SecretaryDashBoard from '../SecretaryDashBoard/SecretaryDashBoard';
import './SecretaryAllowanceOwners.css';

const SecretaryAllowanceOwners = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConfirmedApplications = async () => {
      try {
        const data = await allowanceApi.fetchConfirmedAllowanceApplications();
        console.log('Fetched confirmed applications:', data);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch confirmed allowance applications');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch confirmed allowance applications', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchConfirmedApplications();
  }, []);

  const handleViewDetails = (villagerId) => {
    console.log('Navigating to villager:', villagerId);
    navigate(`/SecretaryAllowanceOwnersView/${villagerId}`);
  };

  const handleBack = () => {
    navigate('/SecretaryDashBoard');
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
            <h1>Confirmed Allowance Recipients</h1>
            <p className="error-message">{error}</p>
            <div className="owners-actions">
              <button className="owners-back-btn" onClick={handleBack}>
                Back to Dashboard
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
        <div className="owners-container">
          <h1>Confirmed Allowance Recipients</h1>
          <div className="owners-table-wrapper">
            <table className="owners-table">
              <thead>
                <tr>
                  <th>Villager Name</th>
                  <th>Villager ID</th>
                  <th>Allowance Type</th>
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
                      <td>{app.Allowances_Type || 'N/A'}</td>
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
                      No confirmed allowance recipients
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
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default SecretaryAllowanceOwners;