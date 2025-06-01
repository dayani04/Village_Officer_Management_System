import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { TbMail } from 'react-icons/tb';
import {
  fetchElectionApplications,
  updateElectionApplicationStatus,
  downloadDocument,
  saveNotification,
} from '../../../../../api/electionApplication';
import SecretaryDashBoard from '../SecretaryDashBoard/SecretaryDashBoard';
import './SecretaryElectionApplications.css';

const SecretaryElectionApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [sentNotifications, setSentNotifications] = useState(new Set());

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const data = await fetchElectionApplications();
        const sendApplications = data.filter((app) => app.status === 'Send');
        setApplications(sendApplications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err.error || 'Failed to fetch election applications');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch election applications', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };
    loadApplications();
  }, []);

  const handleStatusChange = (villagerId, electionrecodeID, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [`${villagerId}-${electionrecodeID}`]: newStatus,
    }));
  };

  const handleSend = async (villagerId, electionrecodeID, electionType, fullName) => {
    const newStatus = statusUpdates[`${villagerId}-${electionrecodeID}`];
    if (!newStatus) {
      toast.error('Please select a status', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }
    try {
      await updateElectionApplicationStatus(villagerId, electionrecodeID, newStatus);
      const message = `Your election application for ${electionType} has been updated to ${newStatus}.`;
      await saveNotification(villagerId, message);

      setApplications((prev) =>
        prev.filter((app) =>
          !(app.Villager_ID === villagerId && app.electionrecodeID === electionrecodeID && newStatus !== 'Send')
        )
      );

      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${electionrecodeID}`];
        return updated;
      });
      setSentNotifications((prev) => new Set(prev).add(`${villagerId}-${electionrecodeID}`));

      toast.success(`Status updated and notification sent to ${fullName}`, {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error in handleSend:', err);
      toast.error(err.error || 'Failed to update status or send notification', {
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
      const blob = await downloadDocument(filename);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
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
    navigate(`/secretary_election_applications_villager_view/${villagerId}`);
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
          <div className="election-applications-container">Loading...</div>
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
          <div className="election-applications-container">
            <h1>Election Applications (Status: Send)</h1>
            <p className="error-message">{error}</p>
            <div className="election-applications-actions">
              <button className="election-applications-back-btn" onClick={handleBack}>
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
        <div className="election-applications-container">
          <h1>Election Applications (Status: Send)</h1>
          <div className="election-applications-table-wrapper">
            <table className="election-applications-table">
              <thead>
                <tr>
                  <th>Villager Name</th>
                  <th>Villager ID</th>
                  <th>Election Type</th>
                  <th>Apply Date</th>
                  <th>Document</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={`${app.Villager_ID}-${app.electionrecodeID}`}>
                      <td>{app.Full_Name || 'N/A'}</td>
                      <td>{app.Villager_ID || 'N/A'}</td>
                      <td>{app.Election_Type || 'N/A'}</td>
                      <td>{app.apply_date ? new Date(app.apply_date).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <a
                          href="#"
                          onClick={() => handleDownload(app.document_path)}
                          className="election-applications-download-link"
                        >
                          Download
                        </a>
                      </td>
                      <td>
                        <select
                          className="election-applications-select"
                          value={statusUpdates[`${app.Villager_ID}-${app.electionrecodeID}`] || app.status}
                          onChange={(e) => handleStatusChange(app.Villager_ID, app.electionrecodeID, e.target.value)}
                        >
                          {['Pending', 'Send', 'Rejected', 'Confirm'].map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="election-applications-action-buttons">
                          <button
                            className={`election-applications-send-btn ${sentNotifications.has(`${app.Villager_ID}-${app.electionrecodeID}`) ? 'sent' : ''}`}
                            onClick={() => handleSend(app.Villager_ID, app.electionrecodeID, app.Election_Type, app.Full_Name)}
                            title="Send Notification"
                            disabled={sentNotifications.has(`${app.Villager_ID}-${app.electionrecodeID}`)}
                          >
                            <TbMail />
                          </button>
                        </div>
                      </td>
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
                    <td colSpan="7" className="election-applications-no-data">
                      No applications with status "Send"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="election-applications-actions">
            <button className="election-applications-back-btn" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default SecretaryElectionApplications;