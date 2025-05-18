import React from "react";

import './SecretaryDashBoard.css';
import { FaUser, FaPlus, FaMinus, FaUsers, FaFileAlt, FaWallet, FaIdBadge, FaSignOutAlt } from 'react-icons/fa';


const SecretaryDashBoard = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(`/${path}`);
  };

  return (
    <div className="dashboard-containerS">
      <div className="sidebarS">
        <p>Secretary Dashboard</p>
        <ul>
          <li>

            <button onClick={() => navigateTo("MyProfile")}>
              <FaUser style={{ marginRight: '8px' }} />
              My Profile
            </button>

          </li>
          <li>
            <button onClick={() => navigateTo("AddVillageOfficerS")}>
              <FaPlus style={{ marginRight: '8px' }} />
              Add Village Officer
            </button>
          </li>
          <li>
            <button onClick={() => navigateTo("RemoveVillageOfficerS")}>
              <FaMinus style={{ marginRight: '8px' }} />
              Remove Village Officer
            </button>
          </li>
          <li>
            <button onClick={() => navigateTo("VillageOfficers")}>
              <FaUsers style={{ marginRight: '8px' }} />
              Village Officers
            </button>
          </li>
          <li>
            <button onClick={() => navigateTo("PermitOwners")}>
              <FaFileAlt style={{ marginRight: '8px' }} />
              Permit Owners
            </button>
          </li>
          <li>
            <button onClick={() => navigateTo("AllowanceOwners")}>
              <FaWallet style={{ marginRight: '8px' }} />
              Allowance Owners
            </button>
          </li>
          <li>
            <button onClick={() => navigateTo("RequestsForElectionListS")}>
              <FaFileAlt style={{ marginRight: '8px' }} />
               Election List Requests
            </button>
          </li>
          <li>
            <button onClick={() => navigateTo("RequestsForIDCardsS")}>
              <FaIdBadge style={{ marginRight: '8px' }} />
              Requests For ID Cards
            </button>
          </li>
          <li>
            <button onClick={() => navigateTo("RequestsForAllowanceS")}>
              <FaWallet style={{ marginRight: '8px' }} />
              Allowance Requests
            </button>
          </li>
          <li>
            <button onClick={() => navigateTo("Logout")}>
              <FaSignOutAlt style={{ marginRight: '8px' }} />
              Logout
            </button>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default SecretaryDashBoard;