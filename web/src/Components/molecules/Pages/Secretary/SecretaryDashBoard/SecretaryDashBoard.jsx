import React from "react";
import './SecretaryDashBoard.css';

const SecretaryDashBoard = () => {
  return (
    <div className="dashboard-containerS">
      <div className="sidebar">
        <h2>Secretary Dashboard</h2>
        <ul>
          <li>My Profile</li>
          <li>Add Village Officer</li>
          <li>Remove Village Officer</li>
          <li>Village Officers</li>
          <li>Permit Owners</li>
          <li>Allowance Owners</li>
          <li>Requests For Election List</li>
          <li>Requests For ID Cards</li>
          <li>Requests For Allowance</li>
          <li>Requests For Certificate</li>
          <li>Logout</li>
        </ul>
      </div>

      <div className="content1">
       
        <div className="cards1">
          <div className="card1">
            <h3>Villagers</h3>
            <p>1,234</p>
          </div>
          <div className="card1">
            <h3>Houses</h3>
            <p>567</p>
          </div>
          <div className="card1">
            <h3>Permit Owners</h3>
            <p>89</p>
          </div>
          <div className="card1">
            <h3>Allowance Owners</h3>
            <p>42</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashBoard;
