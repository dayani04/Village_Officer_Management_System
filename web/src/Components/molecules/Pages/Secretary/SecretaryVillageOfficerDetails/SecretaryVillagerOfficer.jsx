import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaEye } from "react-icons/fa";
import * as villagerOfficerApi from "../../../../../api/villageOfficer";
import "./SecretaryVillagerOfficer.css";

const SecretaryVillagerOfficer = () => {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const data = await villagerOfficerApi.fetchVillageOfficers();
        setOfficers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching village officers:", err);
        setError(
          err.response?.data?.error || err.message || "Failed to fetch village officers"
        );
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Fetch Error',
          text: err.response?.data?.error || "Failed to fetch village officers",
          confirmButtonColor: '#f43f3f',
        });
      }
    };

    fetchOfficers();
  }, []);

  const handleDeleteOfficer = async (id, fullName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this! This will delete ${fullName}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;
    
    try {
      await villagerOfficerApi.deleteVillageOfficer(id);
      setOfficers(officers.filter((officer) => officer.Villager_Officer_ID !== id));
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `Officer ${fullName} deleted successfully`,
        confirmButtonColor: '#4caf50',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Error deleting village officer:", err);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: err.response?.data?.error || "Failed to delete officer",
        confirmButtonColor: '#f43f3f',
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
      
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Status updated for ${fullName}`,
        confirmButtonColor: '#4caf50',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error updating officer status:', err);
      Swal.fire({
        icon: 'error',
        title: 'Status Update Failed',
        text: err.response?.data?.error || 'Failed to update status',
        confirmButtonColor: '#f43f3f',
      });
    }
  };

  const handleAddOfficer = () => {
    navigate("/secretary-villager-officers/add");
  };

  const handleEditOfficer = (id) => {
    navigate(`/secretary-villager-officers/edit/${id}`);
  };

  const handleViewOfficer = (id) => {
    navigate(`/secretary-villager-officers/view/${id}`);
  };

  const handleAction = (action, id, fullName) => {
    switch (action) {
      case "edit":
        handleEditOfficer(id);
        break;
      case "delete":
        handleDeleteOfficer(id, fullName);
        break;
      case "view":
        handleViewOfficer(id);
        break;
      case "toggleStatus":
        handleToggleStatus(id, officers.find(o => o.Villager_Officer_ID === id).Status, fullName);
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      name: "Officer ID",
      selector: (row) => row.Villager_Officer_ID || "N/A",
      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) => row.Full_Name || "N/A",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.Email || "N/A",
      sortable: true,
    },
    {
      name: "Phone No",
      selector: (row) => row.Phone_No || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.Status || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="villager-officer-action-buttons">
          {/* <button
            className="villager-officer-action-btn villager-officer-view-btn"
            onClick={() => handleAction("view", row.Villager_Officer_ID)}
            title="View"
          >
            <FaEye />
          </button> */}
          <button
            className="villager-officer-action-btn villager-officer-edit-btn"
            onClick={() => handleAction("edit", row.Villager_Officer_ID)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            className="villager-officer-action-btn villager-officer-delete-btn"
            onClick={() => handleAction("delete", row.Villager_Officer_ID, row.Full_Name)}
            title="Delete"
          >
            <FaTrash />
          </button>
          <button
            className="villager-officer-action-btn villager-officer-status-btn"
            onClick={() => handleAction("toggleStatus", row.Villager_Officer_ID, row.Full_Name)}
            title={row.Status === 'Active' ? 'Deactivate' : 'Activate'}
          >
            {row.Status === 'Active' ? <FaToggleOff /> : <FaToggleOn />}
          </button>
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
          <button className="villager-officer-back-btn" onClick={() => navigate('/SecretaryDashBoard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="villager-officers-container">
        <h1>Villager Officers</h1>
        <p className="error-message">Error: {error}</p>
        <div className="villager-officer-actions">
          <button className="villager-officer-back-btn" onClick={() => navigate('/SecretaryDashBoard')}>
            Back to Dashboard
          </button>
        </div>
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
              marginBottom: '10px',
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

export default SecretaryVillagerOfficer;