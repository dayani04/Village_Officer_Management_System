import React from "react";
import './VillageOfficerDashBoard.css';
import { motion } from 'framer-motion';
import { FaUser, FaPlus, FaUserTie, FaTrash, FaHome, FaFileAlt, FaWallet, FaList, FaIdBadge, FaCheckCircle, FaUsers, FaSignOutAlt } from 'react-icons/fa';

const VillageOfficerDashBoard = () => {
  const navigateTo = (path) => {
    const fullPath = path.startsWith('/') ? path : '/' + path;
    window.location.href = fullPath;
  };

  const currentPath = window.location.pathname;

  const isActive = (path) => {
    const fullPath = path.startsWith('/') ? path : '/' + path;
    return currentPath === fullPath;
  };

  const sidebarVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="dashboard-containerV"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <motion.div
        className="sidebarV"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
      >
        <ul>
          <motion.li className={isActive("MyProfile") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("MyProfile")}>
              <FaUser style={{ marginRight: '8px' }} />
              My Profile
            </button>
          </motion.li>
          <motion.li className={isActive("AddVillagers") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("AddVillagers")}>
              <FaPlus style={{ marginRight: '8px' }} />
              Add Villager
            </button>
          </motion.li>
          <motion.li className={isActive("AddVillagerOfficer") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("AddVillagerOfficer")}>
              <FaUserTie style={{ marginRight: '8px' }} />
              Add Village Officer
            </button>
          </motion.li>
          <motion.li className={isActive("RemoveVillager") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("RemoveVillager")}>
              <FaTrash style={{ marginRight: '8px' }} />
              Remove Villager
            </button>
          </motion.li>
          <motion.li className={isActive("Houses") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("Houses")}>
              <FaHome style={{ marginRight: '8px' }} />
              Houses
            </button>
          </motion.li>
          {/* Continue similarly for other categories */}
          <motion.li className={isActive("PermitOwners") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("PermitOwners")}>
              <FaFileAlt style={{ marginRight: '8px' }} />
              Permit Owners
            </button>
          </motion.li>
          <motion.li className={isActive("AllowanceOwners") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("AllowanceOwners")}>
              <FaWallet style={{ marginRight: '8px' }} />
              Allowance Owners
            </button>
          </motion.li>
          <motion.li className={isActive("RequestsForElectionList") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("RequestsForElectionList")}>
              <FaList style={{ marginRight: '8px' }} />
              Requests For Election List
            </button>
          </motion.li>
          <motion.li className={isActive("RequestsForIDCards") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("RequestsForIDCards")}>
              <FaIdBadge style={{ marginRight: '8px' }} />
              Requests For ID Cards
            </button>
          </motion.li>
          <motion.li className={isActive("RequestsForAllowance") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("RequestsForAllowance")}>
              <FaCheckCircle style={{ marginRight: '8px' }} />
              Requests For Allowance
            </button>
          </motion.li>
          <motion.li className={isActive("RequestsForCertificate") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("RequestsForCertificate")}>
              <FaFileAlt style={{ marginRight: '8px' }} />
              Requests For Certificate
            </button>
          </motion.li>
          <motion.li className={isActive("/") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("/")}>
              <FaHome style={{ marginRight: '8px' }} />
              Counts
            </button>
          </motion.li>
          <motion.li className={isActive("/") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("/")}>
              <FaUsers style={{ marginRight: '8px' }} />
              View Members
            </button>
          </motion.li>
          <motion.li className={isActive("Logout") ? "active" : ""} variants={listItemVariants}>
            <button onClick={() => navigateTo("Logout")}>
              <FaSignOutAlt style={{ marginRight: '8px' }} />
              Logout
            </button>
          </motion.li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default VillageOfficerDashBoard;