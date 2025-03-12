import React, { useEffect, useState } from "react";
import axios from "axios";
import "./VillageOfficers.css";

const VillageOfficers = () => {
  const [villagers, setVillagers] = useState([]);

  // Fetch villagers from backend
  useEffect(() => {
    axios.get("http://localhost:5000/villagers")
      .then((response) => {
        setVillagers(response.data);
      })
      .catch((error) => console.error("Error fetching villagers:", error));
  }, []);

  // Remove villager with confirmation
  const removeVillager = (id) => {
    if (window.confirm("Are you sure you want to remove this villager?")) {
      axios.delete(`http://localhost:5000/villagers/${id}`)
        .then(() => {
          setVillagers(villagers.filter(villager => villager.id !== id));
        })
        .catch((error) => console.error("Error removing villager:", error));
    }
  };

  return (
    <div className="villagers-container">
      <h2>Village Officers</h2>
      <table className="villagers-table">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VillageOfficers;
