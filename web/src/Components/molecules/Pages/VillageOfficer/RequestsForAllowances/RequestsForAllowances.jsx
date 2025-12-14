import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid status selected.',
        confirmButtonColor: '#f43f3f'
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Allowance ID is missing.',
        confirmButtonColor: '#f43f3f'
      });
      return;
    }

    const newStatus = pendingStatuses[`${villagerId}-${allowancesId}`];
    if (!newStatus) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No status change selected.',
        confirmButtonColor: '#f43f3f'
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
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Status updated successfully',
        confirmButtonColor: '#6ac476'
      });
    } catch (err) {
      console.error('Status update error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error || 'Failed to update status',
        confirmButtonColor: '#f43f3f'
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.error || 'Failed to download document',
        confirmButtonColor: '#f43f3f'
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
     
    </div>
  );
};

export default RequestsForAllowances;