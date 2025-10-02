import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import * as allowanceApi from '../../../../../api/allowanceApplication';
import './AllowanceOwners.css';

const AllowanceOwners = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConfirmedApplications = async () => {
      try {
        const data = await allowanceApi.fetchConfirmedAllowanceApplications();
        console.log('Fetched confirmed applications:', data);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch confirmed allowance applications');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch confirmed allowance applications', {
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
    navigate(`/allowances_owners_details/${villagerId}`);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const columns = [
    {
      name: 'Villager Name',
      selector: row => row.Full_Name || 'N/A',
      sortable: true,
    },
    {
      name: 'Villager ID',
      selector: row => row.Villager_ID || 'N/A',
      sortable: true,
    },
    {
      name: 'Allowance Type',
      selector: row => row.Allowances_Type || 'N/A',
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row => row.Phone_No || 'N/A',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.Address || 'N/A',
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <button
          className="view-button-allowance-owners"
          onClick={() => handleViewDetails(row.Villager_ID)}
        >
          View
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="allowance-owners-container">
        <h1>Confirmed Allowance Recipients</h1>
        <div>Loading...</div>
        <div className="owners-actions">
          <button className="back-button" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  if (error) {
    return (
      <div className="allowance-owners-container">
        <h1>Confirmed Allowance Recipients</h1>
        <p className="error-message">{error}</p>
        <div className="owners-actions">
          <button className="back-button" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="allowance-owners-container">
      <h1>Confirmed Allowance Recipients</h1>
      <DataTable
        columns={columns}
        data={applications}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={<div className="owners-no-data">No confirmed allowance recipients</div>}
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
     
      <Toaster />
    </div>
  );
};

export default AllowanceOwners;