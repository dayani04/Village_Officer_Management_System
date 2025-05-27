import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { TbMail } from 'react-icons/tb';
import {
  fetchPermitApplications,
  updatePermitApplicationStatus,
  downloadDocument,
  saveNotification,
} from '../../../../../api/permitApplication';
import SecretaryDashBoard from '../SecretaryDashBoard/SecretaryDashBoard';
import './SecretaryPermitApplications.css';

const SecretaryPermitApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [sentNotifications, setSentNotifications] = useState(new Set());

  // Fetch permit applications on mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const data = await fetchPermitApplications();
        const sendApplications = data.filter((app) => app.status === 'Send');
        setApplications(sendApplications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', {
          message: err.message,
          response: err.response ? err.response.data : null,
        });
        setError(err.error || 'Failed to fetch permit applications');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch permit applications', {
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

  // Handle status change selection
  const handleStatusChange = (villagerId, permitsId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [`${villagerId}-${permitsId}`]: newStatus,
    }));
  };

  // Handle send button click (update status and save notification)
  const handleSend = async (villagerId, permitsId, permitType, fullName) => {
    const newStatus = statusUpdates[`${villagerId}-${permitsId}`];
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
      // Update the permit application status
      await updatePermitApplicationStatus(villagerId, permitsId, newStatus);

      // Save a notification
      const message = `Your permit application for ${permitType} has been updated to ${newStatus}.`;
      await saveNotification(villagerId, message);

      // Update local state: remove application if status is no longer "Send"
      setApplications((prev) =>
        prev.filter((app) =>
          !(app.Villager_ID === villagerId && app.Permits_ID === permitsId && newStatus !== 'Send')
        )
      );

      // Clear the status update and mark notification as sent
      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${permitsId}`];
        return updated;
      });
      setSentNotifications((prev) => new Set(prev).add(`${villagerId}-${permitsId}`));

      toast.success(`Status updated and notification sent to ${fullName}`, {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error in handleSend:', {
        message: err.message,
        response: err.response ? err.response.data : null,
        status: err.response ? err.response.status : null,
      });
      toast.error(err.response?.data?.error || err.message || 'Failed to update status or send notification', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  // Handle document download
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
      console.error('Error downloading document:', {
        message: err.message,
        response: err.response ? err.response.data : null,
      });
      toast.error(err.response?.data?.error || err.message || 'Failed to download document', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  // Handle back to dashboard navigation
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
          <div className="permit-applications-container">Loading...</div>
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
          <div className="permit-applications-container">
            <h1>Permit Applications (Status: Send)</h1>
            <p className="error-message">{error}</p>
            <div className="permit-applications-actions">
              <button className="permit-applications-back-btn" onClick={handleBack}>
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
        <div className="permit-applications-container">
          <h1>Permit Applications (Status: Send)</h1>
          <div className="permit-applications-table-wrapper">
            <table className="permit-applications-table">
              <thead>
                <tr>
                  <th>Villager Name</th>
                  <th>Villager ID</th>
                  <th>Permit Type</th>
                  <th>Apply Date</th>
                  <th>Document</th>
                  <th>Police Report</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={`${app.Villager_ID}-${app.Permits_ID}`}>
                      <td>{app.Full_Name || 'N/A'}</td>
                      <td>{app.Villager_ID || 'N/A'}</td>
                      <td>{app.Permits_Type || 'N/A'}</td>
                      <td>{app.apply_date || 'N/A'}</td>
                      <td>
                        <a
                          href="#"
                          onClick={() => handleDownload(app.document_path)}
                          className="permit-applications-download-link"
                        >
                          Download
                        </a>
                      </td>
                      <td>
                        <a
                          href="#"
                          onClick={() => handleDownload(app.police_report_path)}
                          className="permit-applications-download-link"
                        >
                          Download
                        </a>
                      </td>
                      <td>
                        <select
                          className="permit-applications-select"
                          value={statusUpdates[`${app.Villager_ID}-${app.Permits_ID}`] || app.status}
                          onChange={(e) => handleStatusChange(app.Villager_ID, app.Permits_ID, e.target.value)}
                        >
                          {['Pending', 'Send', 'Rejected', 'Confirm'].map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="permit-applications-action-buttons">
                          <button
                            className={`permit-applications-send-btn ${sentNotifications.has(`${app.Villager_ID}-${app.Permits_ID}`) ? 'sent' : ''}`}
                            onClick={() => handleSend(app.Villager_ID, app.Permits_ID, app.Permits_Type, app.Full_Name)}
                            title="Send Notification"
                            disabled={sentNotifications.has(`${app.Villager_ID}-${app.Permits_ID}`)}
                          >
                            <TbMail />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="permit-applications-no-data">
                      No applications with status "Send"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="permit-applications-actions">
            <button className="permit-applications-back-btn" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default SecretaryPermitApplications;