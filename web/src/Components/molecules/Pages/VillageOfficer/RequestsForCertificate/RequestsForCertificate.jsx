import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as certificateApi from '../../../../../api/certificateApplication';
import VillageOfficerDashBoard from '../VillageOfficerDashBoard/VillageOfficerDashBoard';
import './RequestsForCertificate.css';

const RequestsForCertificate = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log('Fetching certificate applications');
        const data = await certificateApi.fetchCertificateApplications();
        console.log('Certificate applications:', data);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to fetch certificate applications');
        setLoading(false);
        toast.error(err.message || 'Failed to fetch certificate applications', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchApplications();
  }, []);

  const handleStatusSelect = (villagerId, applicationId, newStatus) => {
    if (!['Pending', 'Approved', 'Rejected'].includes(newStatus)) {
      toast.error('Invalid status selected.', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    console.log('Selected status:', { villagerId, applicationId, newStatus });
    setPendingStatuses({
      ...pendingStatuses,
      [`${villagerId}-${applicationId}`]: newStatus,
    });
  };

  const handleStatusConfirm = async (villagerId, applicationId) => {
    if (!applicationId) {
      toast.error('Application ID is missing.', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    const newStatus = pendingStatuses[`${villagerId}-${applicationId}`];
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

    console.log('Confirming status change:', { villagerId, applicationId, newStatus });

    try {
      await certificateApi.updateCertificateApplicationStatus(applicationId, newStatus);
      setApplications(applications.map(app =>
        app.application_id === applicationId
          ? { ...app, status: newStatus }
          : app
      ));
      setPendingStatuses(prev => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${applicationId}`];
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
      toast.error(err.message || 'Failed to update status', {
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
      await certificateApi.downloadDocument(filename);
      toast.success('Document download initiated', {
        style: {
          background: '#7a1632',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Download error:', err);
      toast.error(err.message || 'Failed to download document', {
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
    navigate(`/certificate-villager-details/${villagerId}`);
  };

  const handleSendCertificate = (applicationId) => {
    console.log('Navigating to send certificate for application:', applicationId);
    navigate(`/editable-certificate/${applicationId}`);
  };

  const handleDownloadCertificate = async (certificatePath) => {
    try {
      await certificateApi.downloadDocument(certificatePath);
      toast.success('Certificate download initiated', {
        style: {
          background: '#7a1632',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Certificate download error:', err);
      toast.error(err.message || 'Failed to download certificate', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="page-layout">
        <div className="sidebar">
          <VillageOfficerDashBoard />
        </div>
        <div className="villager-list-container">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-layout">
        <div className="sidebar">
          <VillageOfficerDashBoard />
        </div>
        <div className="villager-list-container">
          Error: {error}
          <div className="requests-actions">
            <button className="back-button" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
          <Toaster />
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <div className="sidebar">
        <VillageOfficerDashBoard />
      </div>
      <div className="villager-list-container">
        <h1>Certificate Applications</h1>
        <table className="villager-table">
          <thead>
            <tr>
              <th>Villager Name</th>
              <th>Villager ID</th>
              <th>Application ID</th>
              <th>Apply Date</th>
              <th>Reason</th>
              <th>Document</th>
              <th>Status</th>
              <th>Status Action</th>
              <th>Action</th>
              <th>Send Certificate</th>
              <th>Download Certificate</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={`${app.Villager_ID}-${app.application_id}`}>
                <td>{app.Full_Name}</td>
                <td>{app.Villager_ID}</td>
                <td>{app.application_id}</td>
                <td>{new Date(app.apply_date).toLocaleDateString()}</td>
                <td>{app.reason || 'N/A'}</td>
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
                    value={pendingStatuses[`${app.Villager_ID}-${app.application_id}`] || app.status || 'Pending'}
                    onChange={(e) => handleStatusSelect(app.Villager_ID, app.application_id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <button
                    className="confirm-button"
                    onClick={() => handleStatusConfirm(app.Villager_ID, app.application_id)}
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
                <td>
                  <button
                    className="send-button"
                    onClick={() => handleSendCertificate(app.application_id)}
                    disabled={app.status !== 'Approved'}
                  >
                    Send
                  </button>
                </td>
                <td>
                  {app.certificate_path ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownloadCertificate(app.certificate_path);
                      }}
                      className="download-link"
                    >
                      Download
                    </a>
                  ) : (
                    'Not Sent'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="requests-actions">
          <button className="back-button" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
    </div>
  );
};

export default RequestsForCertificate;