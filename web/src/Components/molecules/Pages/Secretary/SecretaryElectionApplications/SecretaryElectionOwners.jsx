import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import * as electionApi from "../../../../../api/electionApplication";
import "./SecretaryElectionOwners.css";

const SecretaryElectionOwners = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConfirmedApplications = async () => {
      try {
        const data = await electionApi.fetchConfirmedElectionApplications();
        console.log("Fetched confirmed applications:", data);
        setApplications(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.error || "Failed to fetch confirmed election applications");
        setLoading(false);
        toast.error(err.error || "Failed to fetch confirmed election applications", {
          style: {
            background: "#f43f3f",
            color: "#fff",
            borderRadius: "4px",
          },
        });
      }
    };

    fetchConfirmedApplications();
  }, []);

  const handleViewDetails = (villagerId) => {
    console.log("Navigating to villager:", villagerId);
    navigate(`/secretary_election_owners_view/${villagerId}`);
  };

  const handleBack = () => {
    navigate("/SecretaryDashBoard");
  };

  const columns = [
    {
      name: "Villager Name",
      selector: (row) => row.Full_Name || "N/A",
      sortable: true,
    },
    {
      name: "Villager ID",
      selector: (row) => row.Villager_ID || "N/A",
      sortable: true,
    },
    {
      name: "Election Type",
      selector: (row) => row.Election_Type || "N/A",
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.Phone_No || "N/A",
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.Address || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="view-button-allowances"
          onClick={() => handleViewDetails(row.Villager_ID)}
        >
          View 
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="villagerss-container">
        <h1>Confirmed Election Participants</h1>
        <div>Loading...</div>
        <Toaster />
      </div>
    );
  }

  if (error) {
    return (
      <div className="villagerss-container">
        <h1>Confirmed Election Participants</h1>
        <p className="error-message">{error}</p>
        <div className="villagers-actions">
         
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="villagerss-container">
      <h1>Confirmed Election Participants</h1>
      <DataTable
        columns={columns}
        data={applications}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={
          <div className="villagers-no-data">No confirmed election participants</div>
        }
        customStyles={{
          table: {
            style: {
             
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: "white",
            },
          },
          headCells: {
            style: {
              backgroundColor: "#9ca3af",
              color: "white",
              fontWeight: "bold",
              padding: "12px",
            },
          },
          cells: {
            style: {
              padding: "12px",
              borderBottom: "1px solid #ddd",
            },
          },
          rows: {
            style: {
              "&:hover": {
                backgroundColor: "#f1f1f1",
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

export default SecretaryElectionOwners;