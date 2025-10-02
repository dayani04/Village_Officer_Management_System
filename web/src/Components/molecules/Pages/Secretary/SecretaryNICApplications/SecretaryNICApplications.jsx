import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DataTable from "react-data-table-component";
import { TbMail } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import {
  fetchNICApplications,
  updateNICApplicationStatus,
  downloadDocument,
} from "../../../../../api/nicApplication";
import { saveNotification } from "../../../../../api/permitApplication";
import "./SecretaryNICApplications.css";

const SecretaryNICApplications = () => {
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
        const data = await fetchNICApplications();
        const sendApplications = data.filter((app) => app.status === "Send");
        setApplications(sendApplications);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching NIC applications:", {
          message: err.message,
          response: err.response ? err.response.data : null,
        });
        setError(err.error || "Failed to fetch NIC applications");
        setLoading(false);
        toast.error(err.error || "Failed to fetch NIC applications", {
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

  const handleStatusChange = (villagerId, nicId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [`${villagerId}-${nicId}`]: newStatus,
    }));
  };

  const handleSend = async (villagerId, nicId, nicType, fullName) => {
    const newStatus = statusUpdates[`${villagerId}-${nicId}`];
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
      await updateNICApplicationStatus(villagerId, nicId, newStatus);
      const message = `Your NIC application for ${nicType} has been updated to ${newStatus}.`;
      await saveNotification(villagerId, message);

      setApplications((prev) =>
        prev.filter(
          (app) =>
            !(app.Villager_ID === villagerId && app.NIC_ID === nicId && newStatus !== "Send")
        )
      );

      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${nicId}`];
        return updated;
      });
      setSentNotifications((prev) => new Set(prev).add(`${villagerId}-${nicId}`));

      toast.success(`Status updated and notification sent to ${fullName}`, {
        style: {
          background: "#4caf50",
          color: "#fff",
          borderRadius: "4px",
        },
      });
    } catch (err) {
      console.error("Error in handleSend:", {
        message: err.message,
        response: err.response ? err.response.data : null,
        status: err.response ? err.response.status : null,
      });
      toast.error(
        err.response?.data?.error || err.message || "Failed to update status or send notification",
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
      console.error("Error downloading document:", {
        message: err.message,
        response: err.response ? err.response.data : null,
      });
      toast.error(
        err.response?.data?.error || err.message || "Failed to download document",
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

  const handleViewDetails = (villagerId) => {
    console.log("Navigating to villager:", villagerId);
    navigate(`/secretary_nic_applications_villager_view/${villagerId}`);
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
      name: "NIC Type",
      selector: (row) => row.NIC_Type || "N/A",
      sortable: true,
    },
    {
      name: "Apply Date",
      selector: (row) => row.apply_date || "N/A",
      sortable: true,
    },
    // {
      // name: "Document",
      // cell: (row) => (
        // <button
          // className="nic-applications-download-btn"
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
          className="nic-applications-select"
          value={statusUpdates[`${row.Villager_ID}-${row.NIC_ID}`] || row.status}
          onChange={(e) =>
            handleStatusChange(row.Villager_ID, row.NIC_ID, e.target.value)
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
        <div className="nic-applications-action-buttons">
          <button
            className={`eligible-voters-send-btn ${
              sentNotifications.has(`${row.Villager_ID}-${row.NIC_ID}`) ? "sent" : ""
            }`}
            onClick={() =>
              handleSend(row.Villager_ID, row.NIC_ID, row.NIC_Type, row.Full_Name)
            }
            title="Send Notification"
            disabled={sentNotifications.has(`${row.Villager_ID}-${row.NIC_ID}`)}
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
        <h1>NIC Applications (Status: Send)</h1>
        <div>Loading...</div>
        <Toaster />
      </div>
    );
  }

  if (error) {
    return (
      <div className="villagerss-container">
        <h1>NIC Applications (Status: Send)</h1>
        <p className="error-message">{error}</p>
        <div className="villagers-actions">
       
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="villagerss-container">
      <h1>NIC Applications (Status: Send)</h1>
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
              "&:nth-child(even)": {
                backgroundColor: "#f9f9f9",
              },
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

export default SecretaryNICApplications;