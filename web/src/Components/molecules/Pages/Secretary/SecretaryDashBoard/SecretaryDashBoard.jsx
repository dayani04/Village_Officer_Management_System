import React from "react";
import './SecretaryDashBoard.css';
import permit from './permit.png';
import house from './house.png';
import money from'./money.png';
import users from './users.png';

const SecretaryDashBoard = () => {
  const navigateTo = (path) => {
    window.location.href = path;
  };

  return (
    <div className="dashboard-containerS">
      <div className="sidebarS">
        <p>Secretary Dashboard</p>
        <ul>
          <li>
            <button onClick={() => navigateTo("MyProfile")}>My Profile</button>
          </li>
          <li>
            <button onClick={() => navigateTo("AddVillageOfficerS")}>Add Village Officer</button>
          </li>
          <li>
            <button onClick={() => navigateTo("RemoveVillageOfficerS")}>Remove Village Officer</button>
          </li>
          <li>
            <button onClick={() => navigateTo("VillageOfficers")}>Village Officers</button>
          </li>
          
          <li>
            <button onClick={() => navigateTo("PermitOwners")}>Permit Owners</button>
          </li>
          <li>
            <button onClick={() => navigateTo("AllowanceOwners")}>Allowance Owners</button>
          </li>
          <li>
            <button onClick={() => navigateTo("RequestsForElectionListS")}>Requests For Election List</button>
          </li>
          <li>
            <button onClick={() => navigateTo("RequestsForIDCardsS")}>Requests For ID Cards</button>
          </li>
          <li>
            <button onClick={() => navigateTo("RequestsForAllowanceS")}>Requests For Allowance</button>
          </li>
          <li>
            <button onClick={() => navigateTo("Logout")}>Logout</button>
          </li>
        </ul>
      </div>

      <div className="content1">
       
        <div className="cards1">
          <div className="card1">
            <h3>Villagers</h3>
            <img src={users} alt="Villagers" className="card-icon"/>
            <p>1,234</p>
          </div>
          <div className="card1">
            <h3>Houses</h3>
            <img src={house} alt="Villagers" className="card-icon"/>
            <p>567</p>
          </div>
          <div className="card1">
            <h3>Permit Owners</h3>
            <img src={permit} alt="Villagers" className="card-icon"/>
            <p>89</p>
          </div>
          <div className="card1">
            <h3>Allowance Owners</h3>
            <img src={money} alt="Villagers" className="card-icon"/>
            <p>42</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashBoard;
