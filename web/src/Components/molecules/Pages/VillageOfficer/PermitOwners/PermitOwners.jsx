import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PermitOwners.css";

const PermitOwners = () => {
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
    
      <table className="villagers-table">
        <thead>
          <tr>
            <th>Owner Name</th>
            <th>Permit Type</th>
            
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

export default PermitOwners;
