import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import { FaEye } from 'react-icons/fa';
import * as permitApplicationApi from '../../../../../api/permitApplication';
import './SecretaryPermitsOwner.css';

const SecretaryPermitsOwner = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConfirmedApplications = async () => {
      try {
        const data = await permitApplicationApi.fetchConfirmedPermitApplications();
        console.log('Fetched confirmed applications:', data);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch confirmed permit applications');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch confirmed permit applications', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchConfirmedApplications();
  }, []);

  const handleViewDetails = (villagerId) => {
    console.log('Navigating to villager:', villagerId);
    navigate(`/secretary_permits_owner_view/${villagerId}`);
  };

  const handleBack = () => {
    navigate('/SecretaryDashBoard');
  };

  const columns = [
    {
      name: 'Villager Name',
      selector: (row) => row.Full_Name || 'N/A',
      sortable: true,
    },
    {
      name: 'Villager ID',
      selector: (row) => row.Villager_ID || 'N/A',
      sortable: true,
    },
    {
      name: 'Permit Type',
      selector: (row) => row.Permits_Type || 'N/A',
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: (row) => row.Phone_No || 'N/A',
      sortable: true,
    },
    {
      name: 'Address',
      selector: (row) => row.Address || 'N/A',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <button
          className="view-button-allowances"
          onClick={() => handleViewDetails(row.Villager_ID)}
        >
          <FaEye style={{ marginRight: '6px' }} /> View
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="page-layout">
        <div className="sidebar"></div>
        <div className="villager-list-container">
          <div className="villagerss-container">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-layout">
        <div className="sidebar"></div>
        <div className="villager-list-container">
          <div className="villagerss-container">
            <h1>Confirmed Permit Owners</h1>
            <p className="error-message">{error}</p>
            <div className="villagers-actions">
            
            </div>
            <Toaster />
          </div>
        </div>
      </div>
    );
  }

  return (
  
        <div className="villagerss-container">
          <h1>Confirmed Permit Owners</h1>
          <DataTable
            columns={columns}
            data={applications}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50]}
            highlightOnHover
            striped
            noDataComponent={<div className="villagers-no-data">No confirmed permit owners</div>}
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
                  '&:nth-child(even)': {
                    backgroundColor: '#f9f9f9',
                  },
                  '&:hover': {
                    backgroundColor: '#f1f1f1',
                  },
                },
              },
            }}
          />
          <div className="villagers-actions">
          
          </div>
          <Toaster />
        </div>
   
  );
};

export default SecretaryPermitsOwner;