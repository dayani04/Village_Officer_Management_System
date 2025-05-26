import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AllowanceVillagerDetails.css";
import { getToken } from "../../../../../utils/auth";

const AllowanceVillagerDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`http://localhost:5000/api/allowance-applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplication(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError(err.response?.data?.error || "Failed to fetch application details");
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) return "-";
    const today = new Date("2025-05-26T15:04:00+05:30");
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleDownload = () => {
    if (application?.document_path) {
      const url = `http://localhost:5000/Uploads/${application.document_path}`;
      const link = document.createElement("a");
      link.href = url;
      link.download = application.document_path;
      link.click();
    }
  };

  const updateStatus = async (status) => {
    try {
      const token = getToken();
      await axios.put(
        `http://localhost:5000/api/allowance-applications/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(`Application ${status} successfully`);
      setError("");
      setApplication((prev) => ({ ...prev, status }));
    } catch (err) {
      console.error(`Error updating status to ${status}:`, err);
      setError(err.response?.data?.error || `Failed to update status to ${status}`);
      setSuccess("");
    }
  };

  if (loading) {
    return <div className="villager-details-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="villager-details-container">
        <p><strong>Error:</strong> {error}</p>
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
      <p>Villager Details</p>
      <p><strong>Application ID:</strong> {application?.application_id}</p>
      <p><strong>Villager ID:</strong> {application?.Villager_ID}</p>
      <p><strong>Name:</strong> {application?.Full_Name}</p>
      <p><strong>Age:</strong> {calculateAge(application?.DOB)}</p>
      <p><strong>Address:</strong> {application?.Address}</p>
      <p><strong>Allowance Type:</strong> {application?.Allowances_Type}</p>
      <p><strong>Apply Date:</strong> {application?.apply_date}</p>
      <p><strong>Status:</strong> {application?.status}</p>
      <p><strong>Document:</strong> {application?.document_path ? (
        <button className="download-btn" onClick={handleDownload}>
          Download Document
        </button>
      ) : "-"}</p>

      <div className="action-buttons">
        <button
          className="send-btn"
          onClick={() => updateStatus("Approved")}
          disabled={application?.status !== "Pending"}
        >
          Approve
        </button>
        <button
          className="reject-btn"
          onClick={() => updateStatus("Rejected")}
          disabled={application?.status !== "Pending"}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default AllowanceVillagerDetails;