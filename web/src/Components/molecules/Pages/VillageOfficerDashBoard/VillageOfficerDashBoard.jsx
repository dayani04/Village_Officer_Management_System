import React from "react";
import './VillageOfficerDashBoard.css';

const VillageOfficerDashBoard = () => {
  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="dashboard-containerV">
      <div className="sidebarV">
        <h2>Village Officer Dashboard</h2>
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
            <button onClick={() => navigateTo("AddVillagers")}>Add Villagers</button>
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
            <button onClick={() => navigateTo("Logout")}>Logout</button>
          </li>
        </ul>
      </div>

      <div className="contentV">
        <div className="cardsV">
          <div className="cardV">
            <h3>Users</h3>
            <p>1,234</p>
          </div>
          <div className="cardV">
            <h3>Houses</h3>
            <p>567</p>
          </div>
          <div className="cardV">
            <h3>Permit Owners</h3>
            <p>89</p>
          </div>
          <div className="cardV">
            <h3>Allowance Owners</h3>
            <p>42</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VillageOfficerDashBoard;
