import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as permitApplicationApi from '../../../../../api/permitApplication';
import './RequestsForPermits.css';

const RequestsForPermits = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await permitApplicationApi.fetchPermitApplications();
        console.log('Fetched applications:', data);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch permit applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusSelect = (villagerId, permitsId, newStatus) => {
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

    console.log('Selected status:', { villagerId, permitsId, newStatus });
    setPendingStatuses({
      ...pendingStatuses,
      [`${villagerId}-${permitsId}`]: newStatus,
    });
  };

  const handleStatusConfirm = async (villagerId, permitsId) => {
    if (!permitsId) {
      toast.error('Permit ID is missing. Please check the application data.', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    const newStatus = pendingStatuses[`${villagerId}-${permitsId}`];
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

    console.log('Confirming status change:', { villagerId, permitsId, newStatus });

    try {
      await permitApplicationApi.updatePermitApplicationStatus(villagerId, permitsId, newStatus);
      setApplications(applications.map(app =>
        app.Villager_ID === villagerId && app.Permits_ID === permitsId
          ? { ...app, status: newStatus }
          : app
      ));
      setPendingStatuses(prev => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${permitsId}`];
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
      const blob = await permitApplicationApi.downloadDocument(filename);
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
    navigate(`/permit-villager-details/${villagerId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="permits-container">Loading...</div>;
  }

  if (error) {
    return <div className="permits-container">Error: {error}</div>;
  }

  return (
    <div className="permits-container">
      <h1>Permit Applications</h1>

      <table className="permits-table">
        <thead>
          <tr>
            <th>Villager Name</th>
            <th>Villager ID</th>
            <th>Permit Type</th>
            <th>Apply Date</th>
            <th>Document</th>
            <th>Police Report</th>
            <th>Status</th>
            <th>Status Action</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={`${app.Villager_ID}-${app.Permits_ID}`}>
              <td>{app.Full_Name}</td>
              <td>{app.Villager_ID}</td>
              <td>{app.Permits_Type}</td>
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
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(app.police_report_path);
                  }}
                  className="download-link"
                >
                  Download
                </a>
              </td>
              <td>
                <select
                  value={pendingStatuses[`${app.Villager_ID}-${app.Permits_ID}`] || app.status || 'Pending'}
                  onChange={(e) => handleStatusSelect(app.Villager_ID, app.Permits_ID, e.target.value)}
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
                  onClick={() => handleStatusConfirm(app.Villager_ID, app.Permits_ID)}
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

      <div className="permits-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default RequestsForPermits;