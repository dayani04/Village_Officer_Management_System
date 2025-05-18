import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Houses.css";

const Houses = () => {
  const [villagers, setVillagers] = useState([]);

  // Fetch villagers from backend
  useEffect(() => {
    axios.get("http://localhost:5000/villagers")
      .then((response) => {
        setVillagers(response.data);
      })
      .catch((error) => console.error("Error fetching villagers:", error));
  }, []);


  return (
    <div className="villagers-container">
      <h2>Houses List</h2>
      <table className="villagers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Address</th>
            <th>Members</th>
            
          </tr>
        </thead>
        <tbody>
          {villagers.map((villager) => (
            <tr key={villager.id}>
              <td>{villager.id}</td>
              <td>{villager.Address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Houses;
