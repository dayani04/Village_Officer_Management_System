import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import * as villagerApi from '../../../../../api/villager';
import { TbEdit, TbEye, TbTrash, TbDotsVertical } from 'react-icons/tb';
import './Villagers.css';

const Villagers = () => {
  const navigate = useNavigate();
  const [villagers, setVillagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    const fetchVillagersData = async () => {
      try {
        const data = await villagerApi.fetchVillagers();
        setVillagers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching villagers:', err);
        setError(err.error || 'Failed to fetch villager data');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch villager data', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchVillagersData();
  }, []);

  const handleDelete = async (villagerId) => {
    if (!window.confirm('Are you sure you want to delete this villager?')) return;

    try {
      await villagerApi.deleteVillager(villagerId);
      setVillagers(villagers.filter((villager) => villager.Villager_ID !== villagerId));
      toast.success('Villager deleted successfully', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error deleting villager:', err);
      toast.error(err.error || 'Failed to delete villager', {
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

  const toggleDropdown = (villagerId) => {
    setDropdownOpen(prev => ({
      ...prev,
      [villagerId]: !prev[villagerId]
    }));
  };

  const handleAction = (action, villagerId) => {
    setDropdownOpen(prev => ({ ...prev, [villagerId]: false }));
    switch (action) {
      case 'edit':
        navigate(`/Villagers/Edit/${villagerId}`);
        break;
      case 'view':
        navigate(`/Villagers/View/${villagerId}`);
        break;
      case 'delete':
        handleDelete(villagerId);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      name: 'Villager Name',
      selector: row => row.Full_Name || 'N/A',
      sortable: true,
    },
    {
      name: 'ID',
      selector: row => row.Villager_ID || 'N/A',
      sortable: true,
    },
    {
      name: 'Area ID',
      selector: row => row.Area_ID || 'N/A',
      sortable: true,
    },
    {
      name: 'Address',
      selector: row => row.Address || 'N/A',
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.Email || 'N/A',
      sortable: true,
    },
    {
      name: 'Phone Number',
      selector: row => row.Phone_No || 'N/A',
      sortable: true,
    },
    {
      name: 'Election Participant',
      selector: row => row.IsParticipant ? 'Yes' : 'No',
      sortable: true,
    },
    {
      name: 'Regional Division',
      selector: row => row.RegionalDivision || 'N/A',
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="villagers-action-buttons">
          <button
            className="villagers-action-btn"
            onClick={() => toggleDropdown(row.Villager_ID)}
          >
            Action  <TbDotsVertical />
          </button>
          <div className={`villagers-dropdown ${dropdownOpen[row.Villager_ID] ? 'active' : ''}`}>
            <button
              className="villagers-dropdown-item villagers-edit-item"
              onClick={() => handleAction('edit', row.Villager_ID)}
            >
              <TbEdit style={{ marginRight: '8px' }} /> Edit
            </button>
            <button
              className="villagers-dropdown-item villagers-view-item"
              onClick={() => handleAction('view', row.Villager_ID)}
            >
              <TbEye style={{ marginRight: '8px' }} /> View
            </button>
            <button
              className="villagers-dropdown-item villagers-delete-item"
              onClick={() => handleAction('delete', row.Villager_ID)}
            >
              <TbTrash style={{ marginRight: '8px' }} /> Delete
            </button>
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="villagerss-container">
        <h1>All Villagers</h1>
        <div>Loading...</div>
        <div className="villagers-actions">
          <button className="villagers-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  if (error) {
    return (
      <div className="villagerss-container">
        <h1>All Villagers</h1>
        <p className="error-message">Error: {error}</p>
        <div className="villagers-actions">
          <button className="villagers-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="villagerss-container">
      <h1>All Villagers</h1>
      <DataTable
        columns={columns}
        data={villagers}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={<div className="villagers-no-data">No villagers found</div>}
        customStyles={{
          table: {
            style: {
                 marginBottom: '60px',
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

export default Villagers;