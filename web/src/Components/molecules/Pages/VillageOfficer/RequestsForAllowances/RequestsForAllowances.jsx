import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import * as allowanceApi from '../../../../../api/allowanceApplication';
import './RequestsForAllowances.css';

const RequestsForAllowances = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [pendingStatuses, setPendingStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await allowanceApi.fetchAllowanceApplications();
        console.log('Fetched allowance applications:', data);
        const pendingApplications = data.filter(app => app.status === 'Pending');
        setApplications(pendingApplications);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch allowance applications');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusSelect = (villagerId, allowancesId, newStatus) => {
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
      [`${villagerId}-${allowancesId}`]: newStatus,
    });
  };

  const handleStatusConfirm = async (villagerId, allowancesId) => {
    if (!allowancesId) {
      toast.error('Allowance ID is missing.', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    const newStatus = pendingStatuses[`${villagerId}-${allowancesId}`];
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
      await allowanceApi.updateAllowanceApplicationStatus(villagerId, allowancesId, newStatus);
      setApplications(applications.filter(app =>
        !(app.Villager_ID === villagerId && app.Allowances_ID === allowancesId)
      ));
      setPendingStatuses(prev => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${allowancesId}`];
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
      const blob = await allowanceApi.downloadDocument(filename);
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
    navigate(`/requests_for_allowances_villager_details/${villagerId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

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
      name: 'Allowance Type',
      selector: row => row.Allowances_Type,
      sortable: true,
    },
    {
      name: 'Apply Date',
      selector: row => new Date(row.apply_date).toLocaleDateString(),
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
          value={pendingStatuses[`${row.Villager_ID}-${row.Allowances_ID}`] || row.status || 'Pending'}
          onChange={(e) => handleStatusSelect(row.Villager_ID, row.Allowances_ID, e.target.value)}
          className="status-select"
        >
          <option value="Pending">Pending</option>
          <option value="Send">Send</option>
         
        </select>
      ),
    },
    {
      name: 'Status Action',
      cell: row => (
        <button
          className="confirm-button"
          onClick={() => handleStatusConfirm(row.Villager_ID, row.Allowances_ID)}
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
  ];

  if (loading) {
    return <div className="allowances-container">Loading...</div>;
  }

  if (error) {
    return <div className="allowances-container">Error: {error}</div>;
  }

  return (
    <div className="allowances-container">
      <h1>Allowance Applications</h1>
      <DataTable
        columns={columns}
        data={applications}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={<div className="allowances-no-data">No pending applications found.</div>}
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
              backgroundColor: '#9ca3af', // Lighter gray
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
     
      <Toaster />
    </div>
  );
};

export default RequestsForAllowances;