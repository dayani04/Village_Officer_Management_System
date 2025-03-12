import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AllowanceVillagerDetails.css";

const AllowanceVillagerDetails = () => {
    const { id } = useParams();

    return (
      <div className="villager-details-container">
        <p>Villager Details</p>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Name:</strong> John Doe</p>
        <p><strong>Age:</strong> 30</p>
        <p><strong>Address:</strong> 1234 Main St, Village A</p>
  
        <div className="action-buttons">
          <button className="send-btn">Send</button>
          <button className="reject-btn">Reject</button>
        </div>
      </div>
    );
  };
  

export default AllowanceVillagerDetails;
