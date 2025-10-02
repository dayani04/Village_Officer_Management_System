import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import * as certificateApi from '../../../../../api/certificateApplication';
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
        console.log("Fetching certificate applications");
        const data = await certificateApi.fetchCertificateApplications();
        console.log('Fetched certificate applications:', data);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err?.response?.data?.error || err.message || 'Failed to fetch certificate applications');
        setLoading(false);
        toast.error(err?.response?.data?.error || err.message || 'Failed to fetch certificate applications', {
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

    console.log(`Selected status ${newStatus} for application ID: ${applicationId}, Villager ID: ${villagerId}`);
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

    try {
      console.log(`Confirming status update for application ID: ${applicationId} to ${newStatus}`);
      const response = await certificateApi.updateCertificateApplicationStatus(applicationId, newStatus);
      
      // Update the status in the applications state instead of filtering out the row
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.application_id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      // Clear the pending status for this application
      setPendingStatuses(prev => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${applicationId}`];
        return updated;
      });
      
      toast.success('Status updated successfully', {
        style: {
          background: '#6ac476',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      if (response.warning) {
        toast.warn(response.warning, {
          style: {
            background: '#f1c40f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    } catch (err) {
      console.error('Status update error for application ID:', applicationId, err);
      toast.error(err?.response?.data?.error || err.message || 'Failed to update status', {
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
      console.log(`Downloading document: ${filename}`);
      await certificateApi.downloadDocument(filename);
      toast.success('Document download initiated', {
        style: {
          background: '#6ac476',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Download error:', err);
      toast.error(err?.response?.data?.error || err.message || 'Failed to download document', {
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

  const handleBack = () => {
    console.log('Navigating back to dashboard');
    navigate('/VillageOfficerDashBoard');
  };

  const filteredAndSortedApplications = applications
    .filter(app => app.status === 'Pending' || app.status === 'Rejected' || app.status === 'Confirm' || app.status === 'Send')
    .sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return new Date(b.apply_date) - new Date(a.apply_date);
    });

  const columns = [
    {
      name: 'Villager Name',
      selector: row => row.Full_Name,
      sortable: true,
    },
    {
      name: 'Villager ID',
      selector: row => row.Villager_ID,
      sortable: true,
    },
    {
      name: 'Application ID',
      selector: row => row.application_id,
      sortable: true,
    },
    {
      name: 'Apply Date',
      selector: row => new Date(row.apply_date).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Reason',
      selector: row => row.reason || 'N/A',
      sortable: true,
    },
    {
      name: 'Document',
      cell: row => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDownload(row.document_path);
          }}
          className="download-link"
        >
          Download
        </a>
      ),
    },
    {
      name: 'Status',
      cell: row => (
        <select
          value={pendingStatuses[`${row.Villager_ID}-${row.application_id}`] || row.status || 'Pending'}
          onChange={(e) => handleStatusSelect(row.Villager_ID, row.application_id, e.target.value)}
          className="status-select"
        >
          <option value="Pending">Pending</option>
          <option value="Send">Send</option>
          <option value="Rejected">Rejected</option>
          <option value="Confirm">Confirm</option>
        </select>
      ),
    },
    {
      name: 'Status Action',
      cell: row => (
        <button
          className="confirm-button"
          onClick={() => handleStatusConfirm(row.Villager_ID, row.application_id)}
        >
          Confirm
        </button>
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <button
          className="view-button-allowances"
          onClick={() => handleViewDetails(row.Villager_ID)}
        >
          View
        </button>
      ),
    },
    {
      name: 'Send Certificate',
      cell: row => (
        <button
          className="confirm-button"
          onClick={() => handleSendCertificate(row.application_id)}
          disabled={row.status !== 'Confirm'}
        >
          Certificate
        </button>
      ),
    },
  ];

  if (loading) {
    return <div className="allowances-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="allowances-container">
        <div className="error-message">Error: {error}</div>
        <div className="allowances-actions">
          <button className="back-button" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="allowances-container">
      <h1>Certificate Applications</h1>
      <DataTable
        columns={columns}
        data={filteredAndSortedApplications}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={<div className="allowances-no-data">No applications found.</div>}
        customStyles={{
          table: {
            style: {
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
            },
          },
          headCells: {
            style: {
              backgroundColor: '#9ca3af',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px',
            },
          },
          cells: {
            style: {
              padding: '12px',
              borderBottom: '1px solid #ddd',
            },
          },
          rows: {
            style: {
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            },
          },
        }}
      />
      <div className="allowances-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default RequestsForCertificate;