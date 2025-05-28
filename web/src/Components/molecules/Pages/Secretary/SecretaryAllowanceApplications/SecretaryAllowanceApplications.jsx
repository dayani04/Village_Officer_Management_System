import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { TbMail } from 'react-icons/tb';
import {
  fetchAllowanceApplications,
  updateAllowanceApplicationStatus,
  downloadDocument,
  saveNotification,
} from '../../../../../api/allowanceApi';
import SecretaryDashBoard from '../SecretaryDashBoard/SecretaryDashBoard';
import './SecretaryAllowanceApplications.css';

const SecretaryAllowanceApplications = () => {
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
        const data = await fetchAllowanceApplications();
        const sendApplications = data.filter((app) => app.status === 'Send');
        setApplications(sendApplications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err.error || 'Failed to fetch allowance applications');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch allowance applications', {
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

  const handleStatusChange = (villagerId, allowancesId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [`${villagerId}-${allowancesId}`]: newStatus,
    }));
  };

  const handleSend = async (villagerId, allowancesId, allowanceType, fullName) => {
    const newStatus = statusUpdates[`${villagerId}-${allowancesId}`];
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
      await updateAllowanceApplicationStatus(villagerId, allowancesId, newStatus);
      const message = `Your allowance application for ${allowanceType} has been updated to ${newStatus}.`;
      await saveNotification(villagerId, message);

      setApplications((prev) =>
        prev.filter((app) =>
          !(app.Villager_ID === villagerId && app.Allowances_ID === allowancesId && newStatus !== 'Send')
        )
      );

      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${allowancesId}`];
        return updated;
      });
      setSentNotifications((prev) => new Set(prev).add(`${villagerId}-${allowancesId}`));

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
          <div className="allowance-applications-container">Loading...</div>
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
          <div className="allowance-applications-container">
            <h1>Allowance Applications (Status: Send)</h1>
            <p className="error-message">{error}</p>
            <div className="allowance-applications-actions">
              <button className="allowance-applications-back-btn" onClick={handleBack}>
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
        <div className="allowance-applications-container">
          <h1>Allowance Applications (Status: Send)</h1>
          <div className="allowance-applications-table-wrapper">
            <table className="allowance-applications-table">
              <thead>
                <tr>
                  <th>Villager Name</th>
                  <th>Villager ID</th>
                  <th>Allowance Type</th>
                  <th>Apply Date</th>
                  <th>Document</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={`${app.Villager_ID}-${app.Allowances_ID}`}>
                      <td>{app.Full_Name || 'N/A'}</td>
                      <td>{app.Villager_ID || 'N/A'}</td>
                      <td>{app.Allowances_Type || 'N/A'}</td>
                      <td>{app.apply_date ? new Date(app.apply_date).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <a
                          href="#"
                          onClick={() => handleDownload(app.document_path)}
                          className="allowance-applications-download-link"
                        >
                          Download
                        </a>
                      </td>
                      <td>
                        <select
                          className="allowance-applications-select"
                          value={statusUpdates[`${app.Villager_ID}-${app.Allowances_ID}`] || app.status}
                          onChange={(e) => handleStatusChange(app.Villager_ID, app.Allowances_ID, e.target.value)}
                        >
                          {['Pending', 'Send', 'Rejected', 'Confirm'].map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div className="allowance-applications-action-buttons">
                          <button
                            className={`allowance-applications-send-btn ${sentNotifications.has(`${app.Villager_ID}-${app.Allowances_ID}`) ? 'sent' : ''}`}
                            onClick={() => handleSend(app.Villager_ID, app.Allowances_ID, app.Allowances_Type, app.Full_Name)}
                            title="Send Notification"
                            disabled={sentNotifications.has(`${app.Villager_ID}-${app.Allowances_ID}`)}
                          >
                            <TbMail />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="allowance-applications-no-data">
                      No applications with status "Send"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="allowance-applications-actions">
            <button className="allowance-applications-back-btn" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default SecretaryAllowanceApplications;