import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
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
        const pendingApplications = data.filter(app => app.status === 'Pending');
        setApplications(pendingApplications);
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid status selected.',
        confirmButtonColor: '#f43f3f'
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'NIC ID is missing. Please check the application data.',
        confirmButtonColor: '#f43f3f'
      });
      return;
    }

    const newStatus = pendingStatuses[`${villagerId}-${nicId}`];
    if (!newStatus) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No status change selected.',
        confirmButtonColor: '#f43f3f'
      });
      return;
    }

    console.log('Confirming status change:', { villagerId, nicId, newStatus });

    try {
      await nicApplicationApi.updateNICApplicationStatus(villagerId, nicId, newStatus);
      setApplications(applications.filter(app =>
        !(app.Villager_ID === villagerId && app.NIC_ID === nicId)
      ));
      setPendingStatuses(prev => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${nicId}`];
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
    navigate(`/id-villager-details/${villagerId}`);
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
      name: 'NIC Type',
      selector: row => row.NIC_Type,
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
          value={pendingStatuses[`${row.Villager_ID}-${row.NIC_ID}`] || row.status || 'Pending'}
          onChange={(e) => handleStatusSelect(row.Villager_ID, row.NIC_ID, e.target.value)}
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
          onClick={() => handleStatusConfirm(row.Villager_ID, row.NIC_ID)}
        >
          Confirm
        </button>
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <button
          className="view-button-requests"
          onClick={() => handleViewDetails(row.Villager_ID)}
        >
          View
        </button>
      ),
    },
  ];

  if (loading) {
    return <div className="requests-container">Loading...</div>;
  }

  if (error) {
    return <div className="requests-container">Error: {error}</div>;
  }

  return (
    <div className="requests-container">
      <h1>NIC Applications</h1>
      <DataTable
        columns={columns}
        data={applications}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={<div className="requests-no-data">No pending applications found.</div>}
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

export default RequestsForIDCards;