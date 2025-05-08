import React from "react";
import './VillageOfficerDashBoard.css';
import { motion } from 'framer-motion';

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

  // Define animation variants for the sidebar container
  const sidebarVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  // Define animation variants for the list items (staggered effect)
  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    // Wrap the main container with motion.div
    <motion.div
      className="dashboard-containerV"
      initial="hidden" // Start with the 'hidden' state
      animate="visible" // Animate to the 'visible' state when the component mounts
      variants={sidebarVariants} // Apply the defined variants
    >
      {/* Wrap the sidebar with motion.div */}
      <motion.div
        className="sidebarV"
        // Use 'visible' from the parent's transition, but add staggering
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.08, // Delay between each child animation
            },
          },
        }}
      >

        {/* Wrap the ul with motion.ul */}
        <motion.ul>
          {/* Wrap each li with motion.li */}
          <motion.li
            className={isActive("MyProfile") ? "active" : ""}
            variants={listItemVariants} // Apply list item variants
          >
            <button onClick={() => navigateTo("MyProfile")}>My Profile</button>
          </motion.li>
          <motion.li
            className={isActive("AddVillagers") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("AddVillagers")}>Add Villager</button>
          </motion.li>
          <motion.li
            className={isActive("AddVillageOfficer") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("AddVillageOfficer")}>Add Village Officer</button>
          </motion.li>
          <motion.li
            className={isActive("RemoveVillager") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("RemoveVillager")}>Remove Villager</button>
          </motion.li>
          <motion.li
            className={isActive("Houses") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("Houses")}>Houses</button>
          </motion.li>

          <motion.li
            className={isActive("PermitOwners") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("PermitOwners")}>Permit Owners</button>
          </motion.li>
          <motion.li
            className={isActive("AllowanceOwners") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("AllowanceOwners")}>Allowance Owners</button>
          </motion.li>
          <motion.li
            className={isActive("RequestsForElectionList") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("RequestsForElectionList")}>Requests For Election List</button>
          </motion.li>
          <motion.li
            className={isActive("RequestsForIDCards") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("RequestsForIDCards")}>Requests For ID Cards</button>
          </motion.li>
          <motion.li
            className={isActive("RequestsForAllowance") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("RequestsForAllowance")}>Requests For Allowance</button>
          </motion.li>
          <motion.li
            className={isActive("RequestsForCertificate") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("RequestsForCertificate")}>Requests For Certificate</button>
          </motion.li>
          <motion.li
            className={isActive("/") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("/")}>Counts</button>
          </motion.li>
          <motion.li
            className={isActive("Logout") ? "active" : ""}
            variants={listItemVariants}
          >
            <button onClick={() => navigateTo("Logout")}>Logout</button>
          </motion.li>
        </motion.ul>
      </motion.div>
      {/* Your main content area */}
    </motion.div>
  );
};

export default VillageOfficerDashBoard;