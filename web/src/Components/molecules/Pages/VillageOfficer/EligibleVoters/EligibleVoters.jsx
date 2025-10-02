import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import * as villagerApi from '../../../../../api/villager';
import { TbMail } from 'react-icons/tb';
import './EligibleVoters.css';

const EligibleVoters = () => {
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sentNotifications, setSentNotifications] = useState(new Set());

  useEffect(() => {
    const fetchVotersData = async () => {
      try {
        const data = await villagerApi.fetchVillagers();
        const eligibleVoters = data.filter((villager) => {
          if (!villager.DOB || typeof villager.DOB !== 'string') return false;
          const dob = new Date(villager.DOB);
          if (isNaN(dob.getTime())) return false;
          const today = new Date('2025-05-25');
          const age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          const dayDiff = today.getDate() - dob.getDate();
          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            return age - 1 === 18;
          }
          return age === 18;
        });
        setVoters(eligibleVoters);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching voters:', err);
        setError(err.error || 'Failed to fetch voter data');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch voter data', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchVotersData();
  }, []);

  const handleSendNotification = async (villagerId, fullName) => {
    try {
      const message = 'Congratulations on turning 18! You are now eligible to vote.';
      await villagerApi.sendNotification(villagerId, message);
      setSentNotifications((prev) => new Set(prev).add(villagerId));
      toast.success(`Notification sent to ${fullName}`, {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error sending notification:', err);
      toast.error(err.error || 'Failed to send notification', {
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

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  const calculateAge = (dob) => {
    if (!dob || typeof dob !== 'string') return 'N/A';
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) return 'N/A';
    const today = new Date('2025-05-25');
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  const columns = [
    {
      name: 'User ID',
      selector: row => row.Villager_ID || 'N/A',
      sortable: true,
    },
    {
      name: 'Full Name',
      selector: row => row.Full_Name || 'N/A',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.Address || 'N/A',
      sortable: true,
    },
    {
      name: 'DOB',
      selector: row => formatDate(row.DOB),
      sortable: true,
    },
    {
      name: 'Age',
      selector: row => calculateAge(row.DOB),
      sortable: true,
    },
    {
      name: 'Regional Division',
      selector: row => row.RegionalDivision || 'N/A',
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.Status || 'N/A',
      sortable: true,
    },
    {
      name: 'Area ID',
      selector: row => row.Area_ID || 'N/A',
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="eligible-voters-action-buttons">
          <button
            className={`eligible-voters-send-btn ${sentNotifications.has(row.Villager_ID) ? 'sent' : ''}`}
            onClick={() => handleSendNotification(row.Villager_ID, row.Full_Name)}
            title="Send Notification"
          >
            <TbMail />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="eligible-voters-container">
        <h1>Voters (Age 18)</h1>
        <div>Loading...</div>
        <div className="eligible-voters-actions">
          <button className="eligible-voters-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  if (error) {
    return (
      <div className="eligible-voters-container">
        <h1>Voters (Age 18)</h1>
        <p>Error: {error}</p>
        <div className="eligible-voters-actions">
          <button className="eligible-voters-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="eligible-voters-container">
      <h1>Voters (Age 18)</h1>
      <DataTable
        columns={columns}
        data={voters}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={<div className="eligible-voters-no-data">No voters aged 18 found</div>}
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
                backgroundColor: '#f1f1f1',
              },
            },
          },
        }}
      />
    
      <Toaster />
    </div>
  );
};

export default EligibleVoters;