import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as electionApi from '../../../../../api/electionApplication';
import './RequestsForElections.css';

const RequestsForElections = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await electionApi.fetchElectionApplications();
        console.log('Fetched applications:', data);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch election applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusSelect = (villagerId, electionrecodeID, newStatus) => {
    if (!['Pending', 'Send', 'Rejected', 'Confirm'].includes(newStatus)) {
      toast.error('Invalid status selected.', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    setPendingStatuses({
      ...pendingStatuses,
      [`${villagerId}-${electionrecodeID}`]: newStatus,
    });
  };

  const handleStatusConfirm = async (villagerId, electionrecodeID) => {
    if (!electionrecodeID) {
      toast.error('Election ID is missing.', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    const newStatus = pendingStatuses[`${villagerId}-${electionrecodeID}`];
    if (!newStatus) {
      toast.error('No status change selected.', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    try {
      await electionApi.updateElectionApplicationStatus(villagerId, electionrecodeID, newStatus);
      setApplications(applications.map(app =>
        app.Villager_ID === villagerId && app.electionrecodeID === electionrecodeID
          ? { ...app, status: newStatus }
          : app
      ));
      setPendingStatuses(prev => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${electionrecodeID}`];
        return updated;
      });
      toast.success('Status updated successfully', {
        style: {
          background: '#6ac476',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Status update error:', err);
      toast.error(err.error || 'Failed to update status', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleDownload = async (filename) => {
    try {
      const blob = await electionApi.downloadDocument(filename);
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

  const handleViewDetails = (villagerId) => {
    console.log('Navigating to villager:', villagerId);
    navigate(`/election-villager-details/${villagerId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="elections-container">Loading...</div>;
  }

  if (error) {
    return <div className="elections-container">Error: {error}</div>;
  }

  return (
    <div className="elections-container">
      <h1>Election Applications</h1>
      <table className="elections-table">
        <thead>
          <tr>
            <th>Villager Name</th>
            <th>Villager ID</th>
            <th>Election Type</th>
            <th>Apply Date</th>
            <th>Document</th>
            <th>Status</th>
            <th>Status Action</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={`${app.Villager_ID}-${app.electionrecodeID}`}>
              <td>{app.Full_Name}</td>
              <td>{app.Villager_ID}</td>
              <td>{app.Election_Type}</td>
              <td>{new Date(app.apply_date).toLocaleDateString()}</td>
              <td>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(app.document_path);
                  }}
                  className="download-link"
                >
                  Download
                </a>
              </td>
              <td>
                <select
                  value={pendingStatuses[`${app.Villager_ID}-${app.electionrecodeID}`] || app.status || 'Pending'}
                  onChange={(e) => handleStatusSelect(app.Villager_ID, app.electionrecodeID, e.target.value)}
                  className="status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Send">Send</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Confirm">Confirm</option>
                </select>
              </td>
              <td>
                <button
                  className="confirm-button"
                  onClick={() => handleStatusConfirm(app.Villager_ID, app.electionrecodeID)}
                >
                  Confirm
                </button>
              </td>
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
      <div className="elections-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default RequestsForElections;