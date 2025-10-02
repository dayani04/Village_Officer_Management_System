import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DataTable from "react-data-table-component";
import { TbEdit, TbEye, TbTrash, TbDotsVertical } from "react-icons/tb";
import { FaPlus } from "react-icons/fa";
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
        toast.error(
          err.response?.data?.error || "Failed to fetch village officers",
          {
            style: {
              background: "#f43f3f",
              color: "#fff",
              borderRadius: "4px",
            },
          }
        );
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
          background: "#4caf50",
          color: "#fff",
          borderRadius: "4px",
        },
      });
    } catch (err) {
      console.error("Error deleting village officer:", err);
      toast.error(err.response?.data?.error || "Failed to delete officer", {
        style: {
          background: "#f43f3f",
          color: "#fff",
          borderRadius: "4px",
        },
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

  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAction = (action, id, fullName) => {
    setDropdownOpen((prev) => ({ ...prev, [id]: false }));
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
          <button
            className="villager-officer-action-btn"
            onClick={() => toggleDropdown(row.Villager_Officer_ID)}
          >
            Action <TbDotsVertical />
          </button>
          <div
            className={`villager-officer-dropdown ${
              dropdownOpen[row.Villager_Officer_ID] ? "active" : ""
            }`}
          >
            <button
              className="villager-officer-dropdown-item villager-officer-edit-item"
              onClick={() => handleAction("edit", row.Villager_Officer_ID)}
            >
              <TbEdit style={{ marginRight: "8px" }} /> Edit
            </button>
            <button
              className="villager-officer-dropdown-item villager-officer-view-item"
              onClick={() => handleAction("view", row.Villager_Officer_ID)}
            >
              <TbEye style={{ marginRight: "8px" }} /> View
            </button>
            <button
              className="villager-officer-dropdown-item villager-officer-delete-item"
              onClick={() =>
                handleAction("delete", row.Villager_Officer_ID, row.Full_Name)
              }
            >
              <TbTrash style={{ marginRight: "8px" }} /> Delete
            </button>
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="page-layout">
        <div className="villager-list-container">
          <div className="villagerss-container">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-layout">
        <div className="villager-list-container">
          <div className="villagerss-container">
            <h1>Villager Officers</h1>
            <p className="error-message">{error}</p>
            <Toaster />
          </div>
        </div>
      </div>
    );
  }

  return (
  
        <div className="villagerss-container">
          <h1>Villager Officers</h1>
          <div className="villagers-actions">
            <button className="villagers-add-btn" onClick={handleAddOfficer}>
              <FaPlus /> Add Officer
            </button>
          </div>
          <div className="villager-officer-table-wrapper">
            <DataTable
              columns={columns}
              data={officers}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 25, 50]}
              highlightOnHover
              striped
              noDataComponent={
                <div className="villagers-no-data">No villager officers found</div>
              }
              customStyles={{
                table: {
                  style: {
                    marginBottom: "90px",
                    borderCollapse: "collapse",
                    backgroundColor: "#fff",
                  },
                },
                headCells: {
                  style: {
                    backgroundColor: "#9ca3af",
                    color: "white",
                    padding: "0.75rem",
                  },
                },
                cells: {
                  style: {
                    padding: "0.75rem",
                    borderBottom: "1px solid #ddd",
                  },
                },
                rows: {
                  style: {
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  },
                },
              }}
            />
          </div>
          <Toaster />
        </div>
   
  );
};

export default SecretaryVillagerOfficer;