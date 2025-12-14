import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import * as villagerApi from '../../../../../api/villager';
import { getToken } from '../../../../../utils/auth';
import './RequestsForNewBorn.css';

const RequestsForNewBorn = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await villagerApi.fetchNewBornRequests();
        setRequests(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.error || 'Failed to fetch new born requests');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleDownload = async (filename) => {
    try {
      const response = await fetch(`http://localhost:5000/api/villagers/new-born-request/download/${filename}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download document');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
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

  const handleBack = () => {
    navigate('/VillageOfficerDashBoard');
  };

  const columns = [
    {
      name: 'Email',
      selector: row => row.Email || 'N/A',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.Address || 'N/A',
      sortable: true,
    },
    {
      name: 'Villager ID',
      selector: row => row.Villager_ID || 'N/A',
      sortable: true,
    },
    {
      name: 'Relationship',
      selector: row => row.Relationship || 'N/A', // Fixed: Added dot between row and Relationship
      sortable: true,
    },
    {
      name: 'Birth Certificate',
      cell: row => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDownload(row.BirthCertificatePath);
          }}
          className="download-link"
        >
          Download
        </a>
      ),
    },
    {
      name: 'Mother NIC',
      cell: row => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDownload(row.MotherNicPath);
          }}
          className="download-link"
        >
          Download
        </a>
      ),
    },
    {
      name: 'Father NIC',
      cell: row => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDownload(row.FatherNicPath);
          }}
          className="download-link"
        >
          Download
        </a>
      ),
    },
    {
      name: 'Marriage Certificate',
      cell: row => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDownload(row.MarriageCertificatePath);
          }}
          className="download-link"
        >
          Download
        </a>
      ),
    },
    {
      name: 'Residence Certificate',
      cell: row => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleDownload(row.ResidenceCertificatePath);
          }}
          className="download-link"
        >
          Download
        </a>
      ),
    },
  ];

  if (loading) {
    return <div className="new-born-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="new-born-container">
        <h1>New Born Requests</h1>
        <p>Error: {error}</p>
        <div className="new-born-actions">
          <button className="back-button" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="new-born-container">
      <h1>New Born Requests</h1>
      <DataTable
        columns={columns}
        data={requests}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={<div className="new-born-no-data">No new born requests found</div>}
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

export default RequestsForNewBorn;