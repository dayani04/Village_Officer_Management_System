import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VillageOfficerDashBoard from "../VillageOfficerDashBoard/VillageOfficerDashBoard";
import "./RequestsForAllowance.css";
import { getToken } from "../../../../../utils/auth";

const RequestsForAllowance = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = getToken();
        const response = await axios.get("http://localhost:5000/api/allowance-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching allowance applications:", error);
      }
    };
    fetchApplications();
  }, []);

  const viewDetails = (applicationId) => {
    navigate(`/allowance-villager-details/${applicationId}`);
  };

  return (
    <div className="page-layout">
      <div className="sidebar">
        <VillageOfficerDashBoard />
      </div>
      <div className="villager-list-container">
        <p>Requests For Allowance</p>
        <table className="villager-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Villager ID</th>
              <th>Name</th>
              <th>Allowance Type</th>
              <th>Apply Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.application_id}>
                <td>{app.application_id}</td>
                <td>{app.Villager_ID}</td>
                <td>{app.Full_Name}</td>
                <td>{app.Allowances_Type}</td>
                <td>{app.apply_date}</td>
                <td>{app.status}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => viewDetails(app.appointment_id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsForAllowance;