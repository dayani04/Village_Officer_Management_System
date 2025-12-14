import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import * as villagerApi from '../../../../../api/villager';
import { TbEdit, TbEye, TbTrash, TbPlus } from 'react-icons/tb';
import './Villagers.css';

const Villagers = () => {
  const navigate = useNavigate();
  const [villagers, setVillagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        Swal.fire({
          icon: 'error',
          title: 'Fetch Error',
          text: err.error || 'Failed to fetch villager data',
          confirmButtonColor: '#f43f3f',
        });
      }
    };

    fetchVillagersData();
  }, []);

  const handleDelete = async (villagerId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      await villagerApi.deleteVillager(villagerId);
      setVillagers(villagers.filter((villager) => villager.Villager_ID !== villagerId));
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Villager deleted successfully',
        confirmButtonColor: '#4caf50',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error deleting villager:', err);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: err.error || 'Failed to delete villager',
        confirmButtonColor: '#f43f3f',
      });
    }
  };

  const handleBack = () => {
    navigate('/VillageOfficerDashBoard');
  };

  const handleAddVillager = () => {
    navigate('/add_villagers');
  };

  const handleAction = (action, villagerId) => {
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
            className="villagers-action-btn villagers-view-btn"
            onClick={() => handleAction('view', row.Villager_ID)}
            title="View"
          >
            <TbEye />
          </button>
          <button
            className="villagers-action-btn villagers-edit-btn"
            onClick={() => handleAction('edit', row.Villager_ID)}
            title="Edit"
          >
            <TbEdit />
          </button>
          <button
            className="villagers-action-btn villagers-delete-btn"
            onClick={() => handleAction('delete', row.Villager_ID)}
            title="Delete"
          >
            <TbTrash />
          </button>
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
      </div>
    );
  }

  return (
    <div className="villagerss-container">
      <h1>All Villagers</h1>
      <div className="villagers-actions">
        <button className="villagers-add-btn" onClick={handleAddVillager}>
          <TbPlus /> Add Villager
        </button>
      </div>
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
                 marginBottom: '10px',
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
    </div>
  );
};

export default Villagers;