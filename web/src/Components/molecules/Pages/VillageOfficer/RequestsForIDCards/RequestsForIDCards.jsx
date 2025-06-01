import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as nicApplicationApi from '../../../../../api/nicApplication';
import './RequestsForIDCards.css';

const RequestsForIDCards = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await nicApplicationApi.fetchNICApplications();
        console.log('Fetched NIC applications:', data);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch NIC applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusSelect = (villagerId, nicId, newStatus) => {
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

    console.log('Selected status:', { villagerId, nicId, newStatus });
    setPendingStatuses({
      ...pendingStatuses,
      [`${villagerId}-${nicId}`]: newStatus,
    });
  };

  const handleStatusConfirm = async (villagerId, nicId) => {
    if (!nicId) {
      toast.error('NIC ID is missing. Please check the application data.', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    const newStatus = pendingStatuses[`${villagerId}-${nicId}`];
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

    console.log('Confirming status change:', { villagerId, nicId, newStatus });

    try {
      await nicApplicationApi.updateNICApplicationStatus(villagerId, nicId, newStatus);
      setApplications(applications.map(app =>
        app.Villager_ID === villagerId && app.NIC_ID === nicId
          ? { ...app, status: newStatus }
          : app
      ));
      setPendingStatuses(prev => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${nicId}`];
        return updated;
      });
      toast.success('Status updated successfully', {
        style: {
          background: '#7a1632',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Status update error:', err);
      toast.error(err.error || 'Failed to update status', {
        style: {
          background: '#6ac476',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleDownload = async (filename) => {
    try {
      const blob = await nicApplicationApi.downloadDocument(filename);
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
    navigate(`/id-villager-details/${villagerId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="requests-container">Loading...</div>;
  }

  if (error) {
    return <div className="requests-container">Error: {error}</div>;
  }

  return (
    <div className="requests-container">
      <h1>NIC Applications</h1>

      <table className="requests-table">
        <thead>
          <tr>
            <th>Villager Name</th>
            <th>Villager ID</th>
            <th>NIC Type</th>
            <th>Apply Date</th>
            <th>Document</th>
            <th>Status</th>
            <th>Status Action</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={`${app.Villager_ID}-${app.NIC_ID}`}>
              <td>{app.Full_Name}</td>
              <td>{app.Villager_ID}</td>
              <td>{app.NIC_Type}</td>
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
                  value={pendingStatuses[`${app.Villager_ID}-${app.NIC_ID}`] || app.status || 'Pending'}
                  onChange={(e) => handleStatusSelect(app.Villager_ID, app.NIC_ID, e.target.value)}
                  className="status-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Send">Send</option>
                  <option value="Rejected">Rejected</option>
                
                </select>
              </td>
              <td>
                <button
                  className="confirm-button"
                  onClick={() => handleStatusConfirm(app.Villager_ID, app.NIC_ID)}
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
      <Toaster />
    </div>
  );
};

export default RequestsForIDCards;