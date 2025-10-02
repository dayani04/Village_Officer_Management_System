import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import * as villagerOfficerApi from '../../../../../api/villageOfficer';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from 'react-icons/fa'; // Font Awesome icons
import { TbDotsVertical } from 'react-icons/tb'; // Tabler Icon for dropdown
import './VillagerOfficer.css';

const VillagerOfficer = () => {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const data = await villagerOfficerApi.fetchVillageOfficers();
        setOfficers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching village officers:', err);
        setError(err.error || 'Failed to fetch village officers');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch village officers', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchOfficers();
  }, []);

  const handleDeleteOfficer = async (id, fullName) => {
    if (!window.confirm(`Are you sure you want to delete ${fullName}?`)) return;
    try {
      await villagerOfficerApi.deleteVillageOfficer(id);
      setOfficers(officers.filter((officer) => officer.Villager_Officer_ID !== id));
      toast.success(`Officer ${fullName} deleted successfully`, {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error deleting village officer:', err);
      toast.error(err.error || 'Failed to delete officer', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleToggleStatus = async (id, currentStatus, fullName) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await villagerOfficerApi.updateVillageOfficerStatus(id, newStatus);
      setOfficers(
        officers.map((officer) =>
          officer.Villager_Officer_ID === id ? { ...officer, Status: newStatus } : officer
        )
      );
      toast.success(`Status updated for ${fullName}`, {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error updating officer status:', err);
      toast.error(err.error || 'Failed to update status', {
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

  const handleAddOfficer = () => {
    navigate('/villager-officers/add');
  };

  const handleEditOfficer = (id) => {
    navigate(`/villager-officers/edit/${id}`);
  };

  const toggleDropdown = (officerId) => {
    setDropdownOpen(prev => ({
      ...prev,
      [officerId]: !prev[officerId]
    }));
  };

  const handleAction = (action, officerId, fullName) => {
    setDropdownOpen(prev => ({ ...prev, [officerId]: false }));
    switch (action) {
      case 'edit':
        handleEditOfficer(officerId);
        break;
      case 'delete':
        handleDeleteOfficer(officerId, fullName);
        break;
      case 'toggleStatus':
        handleToggleStatus(officerId, officers.find(o => o.Villager_Officer_ID === officerId).Status, fullName);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      name: 'Officer ID',
      selector: row => row.Villager_Officer_ID || 'N/A',
      sortable: true,
    },
    {
      name: 'Full Name',
      selector: row => row.Full_Name || 'N/A',
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.Email || 'N/A',
      sortable: true,
    },
    {
      name: 'Phone No',
      selector: row => row.Phone_No || 'N/A',
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.Status || 'N/A',
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="villager-officer-action-buttons">
          <button
            className="villager-officer-action-btn"
            onClick={() => toggleDropdown(row.Villager_Officer_ID)}
          >
             Action <TbDotsVertical />
          </button>
          <div className={`villager-officer-dropdown ${dropdownOpen[row.Villager_Officer_ID] ? 'active' : ''}`}>
            <button
              className="villager-officer-dropdown-item villager-officer-edit-item"
              onClick={() => handleAction('edit', row.Villager_Officer_ID, row.Full_Name)}
            >
              <FaEdit style={{ marginRight: '8px' }} /> Edit
            </button>
            <button
              className="villager-officer-dropdown-item villager-officer-delete-item"
              onClick={() => handleAction('delete', row.Villager_Officer_ID, row.Full_Name)}
            >
              <FaTrash style={{ marginRight: '8px' }} /> Delete
            </button>
            <button
              className="villager-officer-dropdown-item villager-officer-status-item"
              onClick={() => handleAction('toggleStatus', row.Villager_Officer_ID, row.Full_Name)}
            >
              {row.Status === 'Active' ? <FaToggleOff style={{ marginRight: '8px' }} /> : <FaToggleOn style={{ marginRight: '8px' }} />} 
              {row.Status === 'Active' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
        
      ),
    },
  ];

  if (loading) {
    return (
      <div className="villager-officers-container">
        <h1>Villager Officers</h1>
        <div>Loading...</div>
        <div className="villager-officer-actions">
          <button className="villager-officer-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div> 
    );
  }

  if (error) {
    return (
      <div className="villager-officers-container">
        <h1>Villager Officers</h1>
        <p className="error-message">Error: {error}</p>
       
        <Toaster />
      </div>
    );
  }

  return (
    <div className="villager-officers-container">
      <h1>Villager Officers</h1>
      <div className="villager-officer-actions">
        <button className="villager-officers-add-btn" onClick={handleAddOfficer}>
          <FaPlus /> Add Officer
        </button>
      </div> 

      <DataTable 
        
        columns={columns}
        data={officers}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={<div className="villager-officer-no-data">No villager officers found</div>}
        customStyles={{
          table: {
            style: {
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white',
                 marginBottom: '60px',
              
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

export default VillagerOfficer;