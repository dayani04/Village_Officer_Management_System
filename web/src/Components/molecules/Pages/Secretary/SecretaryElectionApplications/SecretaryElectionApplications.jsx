import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DataTable from "react-data-table-component";
import { TbMail } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import {
  fetchElectionApplications,
  updateElectionApplicationStatus,
  downloadDocument,
  saveNotification,
} from "../../../../../api/electionApplication";
import "./SecretaryElectionApplications.css";

const SecretaryElectionApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [sentNotifications, setSentNotifications] = useState(new Set());

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const data = await fetchElectionApplications();
        const sendApplications = data.filter((app) => app.status === "Send");
        setApplications(sendApplications);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err.error || "Failed to fetch election applications");
        setLoading(false);
        toast.error(err.error || "Failed to fetch election applications", {
          style: {
            background: "#f43f3f",
            color: "#fff",
            borderRadius: "4px",
          },
        });
      }
    };
    loadApplications();
  }, []);

  const handleStatusChange = (villagerId, electionrecodeID, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [`${villagerId}-${electionrecodeID}`]: newStatus,
    }));
  };

  const handleSend = async (villagerId, electionrecodeID, electionType, fullName) => {
    const newStatus = statusUpdates[`${villagerId}-${electionrecodeID}`];
    if (!newStatus) {
      toast.error("Please select a status", {
        style: {
          background: "#f43f3f",
          color: "#fff",
          borderRadius: "4px",
        },
      });
      return;
    }
    try {
      await updateElectionApplicationStatus(villagerId, electionrecodeID, newStatus);
      const message = `Your election application for ${electionType} has been updated to ${newStatus}.`;
      await saveNotification(villagerId, message);

      setApplications((prev) =>
        prev.filter(
          (app) =>
            !(app.Villager_ID === villagerId && app.electionrecodeID === electionrecodeID && newStatus !== "Send")
        )
      );

      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${electionrecodeID}`];
        return updated;
      });
      setSentNotifications((prev) => new Set(prev).add(`${villagerId}-${electionrecodeID}`));

      toast.success(`Status updated and notification sent to ${fullName}`, {
        style: {
          background: "#4caf50",
          color: "#fff",
          borderRadius: "4px",
        },
      });
    } catch (err) {
      console.error("Error in handleSend:", err);
      toast.error(err.error || "Failed to update status or send notification", {
        style: {
          background: "#f43f3f",
          color: "#fff",
          borderRadius: "4px",
        },
      });
    }
  };

  const handleDownload = async (filename) => {
    try {
      const blob = await downloadDocument(filename);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.error || "Failed to download document", {
        style: {
          background: "#f43f3f",
          color: "#fff",
          borderRadius: "4px",
        },
      });
    }
  };

  const handleViewDetails = (villagerId) => {
    console.log("Navigating to villager:", villagerId);
    navigate(`/secretary_election_applications_villager_view/${villagerId}`);
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
      name: "Apply Date",
      selector: (row) =>
        row.apply_date ? new Date(row.apply_date).toLocaleDateString() : "N/A",
      sortable: true,
    },
    // {
      // name: "Document",
      // cell: (row) => (
        // <button
          // className="election-applications-download-btn"
          // onClick={() => handleDownload(row.document_path)}
        // >
          // Download
        // </button>
      // ),
    // },
    {
      name: "Status",
      cell: (row) => (
        <select
          className="election-applications-select"
          value={statusUpdates[`${row.Villager_ID}-${row.electionrecodeID}`] || row.status}
          onChange={(e) =>
            handleStatusChange(row.Villager_ID, row.electionrecodeID, e.target.value)
          }
        >
          {[ "Send", "Rejected", "Confirm"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: "Send",
      cell: (row) => (
        <div className="election-applications-action-buttons">
          <button
            className={`eligible-voters-send-btn ${
              sentNotifications.has(`${row.Villager_ID}-${row.electionrecodeID}`) ? "sent" : ""
            }`}
            onClick={() =>
              handleSend(row.Villager_ID, row.electionrecodeID, row.Election_Type, row.Full_Name)
            }
            title="Send Notification"
            disabled={sentNotifications.has(`${row.Villager_ID}-${row.electionrecodeID}`)}
          >
            <TbMail />
          </button>
        </div>
      ),
    },
    {
      name: "View",
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
        <h1>Election Applications (Status: Send)</h1>
        <div>Loading...</div>
        <Toaster />
      </div>
    );
  }

  if (error) {
    return (
      <div className="villagerss-container">
        <h1>Election Applications (Status: Send)</h1>
        <p className="error-message">{error}</p>
        <div className="villagers-actions">
        
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="villagerss-container">
      <h1>Election Applications (Status: Send)</h1>
      <DataTable
        columns={columns}
        data={applications}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50]}
        highlightOnHover
        striped
        noDataComponent={
          <div className="villagers-no-data">No applications with status "Send"</div>
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

export default SecretaryElectionApplications;