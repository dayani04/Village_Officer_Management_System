import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { TbMail } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import {
  fetchPermitApplications,
  updatePermitApplicationStatus,
  downloadDocument,
  saveNotification,
} from "../../../../../api/permitApplication";
import "./SecretaryPermitApplications.css";

const SecretaryPermitApplications = () => {
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
        const data = await fetchPermitApplications();
        const sendApplications = data.filter((app) => app.status === "Send");
        setApplications(sendApplications);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching permit applications:", err);
        setError(err.error || "Failed to fetch permit applications");
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Fetch Error',
          text: err.error || "Failed to fetch permit applications",
          confirmButtonColor: '#f43f3f',
        });
      }
    };
    loadApplications();
  }, []);

  const handleStatusChange = (villagerId, permitsId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [`${villagerId}-${permitsId}`]: newStatus,
    }));
  };

  const handleSend = async (villagerId, permitsId, permitType, fullName) => {
    const newStatus = statusUpdates[`${villagerId}-${permitsId}`];
    if (!newStatus) {
      Swal.fire({
        icon: 'warning',
        title: 'Status Required',
        text: 'Please select a status',
        confirmButtonColor: '#f43f3f',
      });
      return;
    }
    try {
      await updatePermitApplicationStatus(villagerId, permitsId, newStatus);
      const message = `Your permit application for ${permitType} has been updated to ${newStatus}.`;
      await saveNotification(villagerId, message);

      setApplications((prev) =>
        prev.filter(
          (app) =>
            !(app.Villager_ID === villagerId && app.Permits_ID === permitsId && newStatus !== "Send")
        )
      );

      setStatusUpdates((prev) => {
        const updated = { ...prev };
        delete updated[`${villagerId}-${permitsId}`];
        return updated;
      });
      setSentNotifications((prev) => new Set(prev).add(`${villagerId}-${permitsId}`));

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Status updated and notification sent to ${fullName}`,
        confirmButtonColor: '#4caf50',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (err) {
      console.error("Error in handleSend:", err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.error || "Failed to update status or send notification",
        confirmButtonColor: '#f43f3f',
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
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: err.error || "Failed to download document",
        confirmButtonColor: '#f43f3f',
      });
    }
  };

  const handleViewDetails = (villagerId) => {
    console.log("Navigating to villager:", villagerId);
    navigate(`/secretary_permit_applications_villager_view/${villagerId}`);
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
      name: "Permit Type",
      selector: (row) => row.Permits_Type || "N/A",
      sortable: true,
    },
    {
      name: "Apply Date",
      selector: (row) =>
        row.apply_date ? new Date(row.apply_date).toLocaleDateString() : "N/A",
      sortable: true,
    },
    // {
      //  name: "Document",
      // cell: (row) => (
        // <button
          // className="permit-applications-download-btn"
          // onClick={() => handleDownload(row.document_path)}
        // >
          // Download
        // </button>
      // ),
    // },
    // {
      // name: "Police Report",
      // cell: (row) => (
        // <button
          // className="permit-applications-download-btn"
          // onClick={() => handleDownload(row.police_report_path)}
        // >
          // Download
        // </button>
      // ),
    // },
    {
      name: "Status",
      cell: (row) => (
        <select
          className="permit-applications-select"
          value={statusUpdates[`${row.Villager_ID}-${row.Permits_ID}`] || row.status}
          onChange={(e) =>
            handleStatusChange(row.Villager_ID, row.Permits_ID, e.target.value)
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
        <div className="permit-applications-action-buttons">
          <button
            className={`eligible-voters-send-btn ${
              sentNotifications.has(`${row.Villager_ID}-${row.Permits_ID}`) ? "sent" : ""
            }`}
            onClick={() =>
              handleSend(row.Villager_ID, row.Permits_ID, row.Permits_Type, row.Full_Name)
            }
            title="Send Notification"
            disabled={sentNotifications.has(`${row.Villager_ID}-${row.Permits_ID}`)}
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
        <h1>Permit Applications (Status: Send)</h1>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="villagerss-container">
        <h1>Permit Applications (Status: Send)</h1>
        <p className="error-message">{error}</p>
        <div className="villagers-actions">
        </div>
      </div>
    );
  }

  return (
    <div className="villagerss-container">
      <h1>Permit Applications (Status: Send)</h1>
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
    </div>
  );
};

export default SecretaryPermitApplications;