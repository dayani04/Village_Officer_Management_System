import React from "react";
import './VillageOfficerDashBoard.css';

const VillageOfficerDashBoard = () => {
  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="dashboard-containerV">
      <div className="sidebarV">
        <p>Village Officer Dashboard</p>
        <ul>
          <li>
            <button onClick={() => navigateTo("MyProfile")}>My Profile</button>
          </li>
          <li>
            <button onClick={() => navigateTo("AddVillagers")}>Add Villager</button>
          </li>
          <li>
            <button onClick={() => navigateTo("AddVillageOfficer")}>Add Village Officer</button>
          </li>
          <li>
            <button onClick={() => navigateTo("RemoveVillager")}>Remove Villager</button>
          </li>
          <li>
            <button onClick={() => navigateTo("Houses")}>Houses</button>
          </li>
          
          <li>
            <button onClick={() => navigateTo("PermitOwners")}>Permit Owners</button>
          </li>
          <li>
            <button onClick={() => navigateTo("AllowanceOwners")}>Allowance Owners</button>
          </li>
          <li>
            <button onClick={() => navigateTo("RequestsForElectionList")}>Requests For Election List</button>
          </li>
          <li>
            <button onClick={() => navigateTo("RequestsForIDCards")}>Requests For ID Cards</button>
          </li>
          <li>
            <button onClick={() => navigateTo("RequestsForAllowance")}>Requests For Allowance</button>
          </li>
          <li>
            <button onClick={() => navigateTo("RequestsForCertificate")}>Requests For Certificate</button>
          </li>
          <li>
            <button onClick={() => navigateTo("/")}>Counts</button>
          </li>
          <li>
            <button onClick={() => navigateTo("Logout")}>Logout</button>
          </li>
        </ul>
      </div>

      </div>
    
  );
};

export default VillageOfficerDashBoard;
