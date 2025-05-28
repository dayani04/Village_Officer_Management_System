import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "./AllowanceVillagerDetails.css";
import { getToken } from "../../../../../utils/auth";

const AllowanceVillagerDetails = () => {
  const { id } = useParams(); // villagerId
  const navigate = useNavigate();
  const [villager, setVillager] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Fetch villager details
        const villagerResponse = await axios.get(`http://localhost:5000/api/villagers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Villager Response:', villagerResponse.data);
        if (!villagerResponse.data) {
          throw new Error('No villager data returned');
        }

        // Fetch allowance applications
        const appsResponse = await axios.get(`http://localhost:5000/api/allowance-applications/villager/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Applications Response:', appsResponse.data);

        setVillager(villagerResponse.data);
        setApplications(appsResponse.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching details:", err);
        const errorMessage = err.response?.data?.error || err.message || "Failed to fetch villager or application details";
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage, {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };
    fetchDetails();
  }, [id]);

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) return "N/A";
    const today = new Date("2025-05-27T23:17:00+05:30");
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleDownload = (documentPath) => {
    if (documentPath) {
      const url = `http://localhost:5000/Uploads/${documentPath}`;
      const link = document.createElement("a");
      link.href = url;
      link.download = documentPath;
      link.click();
    }
  };

  const updateStatus = async (villagerId, allowancesId, status) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }
      await axios.put(
        `http://localhost:5000/api/allowance-applications/${villagerId}/${allowancesId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Application ${status} successfully`);
      setError("");
      setApplications((prev) =>
        prev.map((app) =>
          app.Villager_ID === villagerId && app.Allowances_ID === allowancesId
            ? { ...app, Application_Status: status }
            : app
        )
      );
      toast.success(`Application ${status} successfully`, {
        style: {
          background: '#6ac476',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error(`Error updating status to ${status}:`, err);
      const errorMessage = err.response?.data?.error || `Failed to update status to ${status}`;
      setError(errorMessage);
      setSuccess("");
      toast.error(errorMessage, {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/requests-for-allowances');
  };

  if (loading) {
    return <div className="villager-details-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="villager-details-container">
        <h1>Villager Details</h1>
        <p><strong>Error:</strong> {error}</p>
        <div className="action-buttons">
          <button className="back-button" onClick={handleBack}>
            Back to Allowance Applications
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  if (!villager) {
    return (
      <div className="villager-details-container">
        <h1>Villager Details</h1>
        <p>Villager not found</p>
        <div className="action-buttons">
          <button className="back-button" onClick={handleBack}>
            Back to Allowance Applications
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="villager-details-container">
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      <h1>Villager Details</h1>
      <div className="villager-details">
        <p><strong>Villager ID:</strong> {villager.Villager_ID || 'N/A'}</p>
        <p><strong>Full Name:</strong> {villager.Full_Name || 'N/A'}</p>
        <p><strong>Email:</strong> {villager.Email || 'N/A'}</p>
        <p><strong>Phone Number:</strong> {villager.Phone_No || 'N/A'}</p>
        <p><strong>NIC:</strong> {villager.NIC || 'N/A'}</p>
        <p><strong>Date of Birth:</strong> {villager.DOB ? new Date(villager.DOB).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Age:</strong> {calculateAge(villager.DOB)}</p>
        <p><strong>Address:</strong> {villager.Address || 'N/A'}</p>
        <p><strong>Regional Division:</strong> {villager.RegionalDivision || 'N/A'}</p>
        <p><strong>Status:</strong> {villager.Villager_Status || 'N/A'}</p>
        <p><strong>Area ID:</strong> {villager.Area_ID || 'N/A'}</p>
        <p><strong>Latitude:</strong> {villager.Latitude ?? 'N/A'}</p>
        <p><strong>Longitude:</strong> {villager.Longitude ?? 'N/A'}</p>
        <p><strong>Election Participant:</strong> {villager.IsParticipant ? 'Yes' : 'No'}</p>
        <p><strong>Alive Status:</strong> {villager.Alive_Status || 'N/A'}</p>
      </div>

      <h2>Allowance Application Details</h2>
      {applications.length > 0 ? (
        applications.map((app, index) => (
          <div key={`${app.Villager_ID}-${app.Allowances_ID}`} className="villager-details">
            <h3>Application {index + 1}</h3>
            <p><strong>Allowance Type:</strong> {app.Allowances_Type || 'N/A'}</p>
            <p><strong>Apply Date:</strong> {app.apply_date ? new Date(app.apply_date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Status:</strong> {app.Application_Status || 'N/A'}</p>
            <p><strong>Document:</strong> {app.document_path ? (
              <button className="download-btn" onClick={() => handleDownload(app.document_path)}>
                Download Document
              </button>
            ) : "N/A"}</p>
            <div className="action-buttons">
              <button
                className="send-btn"
                onClick={() => updateStatus(app.Villager_ID, app.Allowances_ID, "Approved")}
                disabled={app.Application_Status !== "Pending"}
              >
                Approve
              </button>
              <button
                className="reject-btn"
                onClick={() => updateStatus(app.Villager_ID, app.Allowances_ID, "Rejected")}
                disabled={app.Application_Status !== "Pending"}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No allowance applications found for this villager.</p>
      )}

      <div className="action-buttons">
        <button className="back-button" onClick={handleBack}>
          Back to Allowance Applications
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default AllowanceVillagerDetails;