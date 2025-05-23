import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./VillageOfficers.css";
import SecretaryDashBoard from "../SecretaryDashBoard/SecretaryDashBoard";

const VillageOfficers = () => {
  const [villagers, setVillagers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/villagers")
      .then((response) => {
        setVillagers(response.data);
      })
      .catch((error) => console.error("Error fetching villagers:", error));
  }, []);

  const ElectionVillagerDetails = (id) => {
    navigate(`/villager-details/${id}`);
  };

  return (
    <div className="page-layout">
      <div className="sidebar">
        <SecretaryDashBoard />
      </div>
      <div className="villager-list-container">
        <p>Village Officers</p>
        <table className="villager-table">
          <thead>
            <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Village</th>
            <th>Village ID</th>
            </tr>
          </thead>
          <tbody>
            {villagers.map((villager) => (
              <tr key={villager.id}>
                <td>{villager.id}</td>
                <td>{villager.name}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => ElectionVillagerDetails(villager.id)}
                  >
                    View Details
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

export default VillageOfficers;


