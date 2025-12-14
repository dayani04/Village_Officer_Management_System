import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
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
        const pendingApplications = data.filter(app => app.status === 'Pending');
        setApplications(pendingApplications);
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid status selected.',
        confirmButtonColor: '#f43f3f'
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Permit ID is missing. Please check the application data.',
        confirmButtonColor: '#f43f3f'
      });
      return;
    }

    const newStatus = pendingStatuses[`${villagerId}-${permitsId}`];
    if (!newStatus) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No status change selected.',
        confirmButtonColor: '#f43f3f'
      });
      return;
    }

    console.log('Confirming status change:', { villagerId, permitsId, newStatus });

    try {
      await permitApplicationApi.updatePermitApplicationStatus(villagerId, permitsId, newStatus);
      setApplications(applications.filter(app =>
        !(app.Villager_ID === villagerId && app.Permits_ID === permitsId)
      ));
      setPendingStatuses(prev => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${permitsId}`];
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


  const handleViewDetails = (villagerId) => {
    console.log('Navigating to villager:', villagerId);
    navigate(`/permit-villager-details/${villagerId}`);
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
      name: 'Permit Type',
      selector: row => row.Permits_Type,
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
          value={pendingStatuses[`${row.Villager_ID}-${row.Permits_ID}`] || row.status || 'Pending'}
          onChange={(e) => handleStatusSelect(row.Villager_ID, row.Permits_ID, e.target.value)}
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
          onClick={() => handleStatusConfirm(row.Villager_ID, row.Permits_ID)}
        >
          Confirm
        </button>
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <button
          className="view-button-confirm"
          onClick={() => handleViewDetails(row.Villager_ID)}
        >
          View
        </button>
      ),
    },
  ];

  if (loading) {
    return <div className="permits-container">Loading...</div>;
  }

  if (error) {
    return <div className="permits-container">Error: {error}</div>;
  }

  return (
    <div className="permits-container">
      <h1>Permit Applications</h1>
      <DataTable
        columns={columns}
        data={applications}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={<div className="permits-no-data">No pending applications found.</div>}
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
              backgroundColor: '#9ca3af', // Lighter gray as requested
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

export default RequestsForPermits;