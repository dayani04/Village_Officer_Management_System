

import React, { useState } from 'react';
import { FaHome, FaChartBar, FaUsers, FaCog } from 'react-icons/fa';
import './SecretaryDashBoard.css'; // Import the regular CSS file

const SecretaryDashBoard = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`container ${isDarkTheme ? 'darkTheme' : ''}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Village Officer Dashboard</h2>
        <ul>
          <li>
            <a href="#"><FaHome /> <span>Home</span></a>
          </li>
          <li>
            <a href="#"><FaChartBar /> <span>Analytics</span></a>
          </li>
          <li>
            <a href="#"><FaUsers /> <span>Users</span></a>
          </li>
          <li>
            <a href="#"><FaCog /> <span>Settings</span></a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="mainContent">
        <div className="header">
          <h1>Welcome to Village Officer Dashboard</h1>
          <button onClick={toggleTheme}>Toggle Theme</button>
        </div>

        <div className="dashboardCards">
          <div className="card">
            <h3>Total Users</h3>
            <p>1,234</p>
          </div>
          <div className="card">
            <h3>Revenue</h3>
            <p>$12,345</p>
          </div>
          <div className="card">
            <h3>Active Sessions</h3>
            <p>567</p>
          </div>
          <div className="card">
            <h3>Conversion Rate</h3>
            <p>3.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretaryDashBoard;
