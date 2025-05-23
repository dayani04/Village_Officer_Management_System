import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RequestsForIDCardsS.css";
import SecretaryDashBoard from "../SecretaryDashBoard/SecretaryDashBoard";

const RequestsForIDCardsS = () => {

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
        <p>Requests For ID Cards</p>
        <table className="villager-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
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

export default RequestsForIDCardsS;
