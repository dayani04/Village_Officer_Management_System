import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  TbDashboard,
  TbUsers,
  TbReceiptRefund,
  TbUserPlus,
  TbBell,
  TbUserCircle,
  TbLogout,
} from "react-icons/tb";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { MdOutlineDiscount } from "react-icons/md";


const Sidebar = () => {
  const location = useLocation();

  const [isProductSubMenuOpen, setIsProductSubMenuOpen] = useState(false);
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = useState(false);
  const [isDiscountSubMenuOpen, setIsDiscountSubMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.includes("AddVillagers") || location.pathname.includes("Villagers") || location.pathname.includes("Houses")) {
      setIsProductSubMenuOpen(true);
    }
    if (location.pathname.includes("users")) {
      setIsUsersSubMenuOpen(true);
    }
    if (location.pathname.includes("discounts")) {
      setIsDiscountSubMenuOpen(true);
    }
  }, [location.pathname]);

  return (
   
    <div
      className="d-flex flex-column p-4"
      style={{
        width: "250px",
        height: "100vh", // Full viewport height
        position: "fixed", // Fix the sidebar to the viewport
        top: 0,
        left: 0,
        background: "#9C284F",
        color: "white",
        overflowY: "auto", // Allow scrolling if content overflows
        zIndex: 999,
      }}
    >
      <ul className="nav flex-column gap-2">
        {/* Dashboard */}
        <li className="nav-item">
          <NavLink
            to="/VillageOfficerDashBoard"
            className="nav-link d-flex align-items-center p-2 rounded hover-bg"
            style={{ textDecoration: "none", color: "white" }}
            activeStyle={{ fontWeight: "bold", backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <TbDashboard className="me-2" /> Villager Dashboard
          </NavLink>
        </li>

        {/* Villagers / Manage Villagers */}
        <li className="nav-item">
          <button
            onClick={() => setIsProductSubMenuOpen(!isProductSubMenuOpen)}
            className="btn btn-toggle d-flex align-items-center p-2 rounded justify-content-between"
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <TbUsers className="me-2" /> Villagers
            </div>
            {isProductSubMenuOpen ? (
              <IoMdArrowDropupCircle />
            ) : (
              <IoMdArrowDropdownCircle />
            )}
          </button>
          {isProductSubMenuOpen && (
            <ul className="list-unstyled ps-4 mt-1">
              <li>
                <NavLink
                  to="/AddVillagers"
                  className="nav-link p-2 rounded hover-bg"
                  style={{ color: "white" }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  Add Villager
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/villagers"
                  className="nav-link p-2 rounded hover-bg"
                  style={{ color: "white" }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  Villagers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Houses"
                  className="nav-link p-2 rounded hover-bg"
                  style={{ color: "white" }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  Houses
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Requests / Discounts */}
        <li className="nav-item">
          <button
            onClick={() => setIsDiscountSubMenuOpen(!isDiscountSubMenuOpen)}
            className="btn btn-toggle d-flex align-items-center p-2 rounded justify-content-between"
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <MdOutlineDiscount className="me-2" /> Requests
            </div>
            {isDiscountSubMenuOpen ? (
              <IoMdArrowDropupCircle />
            ) : (
              <IoMdArrowDropdownCircle />
            )}
          </button>
          {isDiscountSubMenuOpen && (
            <ul className="list-unstyled ps-4 mt-1">
              <li>
                <NavLink
                  to="/RequestsForAllowance"
                  className="nav-link p-2 rounded hover-bg"
                  style={{ color: "white" }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  Allowance
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/RequestsForCertificate"
                  className="nav-link p-2 rounded hover-bg"
                  style={{ color: "white" }}
                  activeStyle={{ fontWeight: "bold" }} 
                >
                  Certificate
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/requests-for-id-cards"
                  className="nav-link p-2 rounded hover-bg"
                  style={{ color: "white" }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  ID Cards
                </NavLink>
              </li>
               <li>
                <NavLink
                  to="/requests-for-permits"
                  className="nav-link p-2 rounded hover-bg"
                  style={{ color: "white" }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  Permits
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/RequestsForElectionList"
                  className="nav-link p-2 rounded hover-bg"
                  style={{ color: "white" }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  Voter List
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Holders / Manage Users */}
        <li className="nav-item">
          <button
            onClick={() => setIsUsersSubMenuOpen(!isUsersSubMenuOpen)}
            className="btn btn-toggle d-flex align-items-center p-2 rounded justify-content-between"
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer" }}
          >
            <div className="d-flex align-items-center">
              <TbUsers className="me-2" /> Holders
            </div>
            {isUsersSubMenuOpen ? (
              <IoMdArrowDropupCircle />
            ) : (
              <IoMdArrowDropdownCircle />
            )}
          </button>
          {isUsersSubMenuOpen && (
            <ul className="list-unstyled ps-4 mt-1">
              <li>
                <NavLink
                  to="/AllowanceOwners"
                  className="nav-link p-2 rounded hover-bg"
                  style={{ color: "white" }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  Allowance
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/PermitOwner"
                  className="nav-link p-2 rounded hover-bg"
                  style={{ color: "white" }}
                  activeStyle={{ fontWeight: "bold" }}
                >
                  Permit
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Add Village Officer */}
        <li className="nav-item">
          <NavLink
            to="/AddVillagerOfficer"
            className="nav-link d-flex align-items-center p-2 rounded hover-bg"
            style={{ color: "white" }}
          >
            <TbUserPlus className="me-2" /> Add Village Officer
          </NavLink>
        </li>

        {/* Notifications */}
        <li className="nav-item">
          <NavLink
            to="/notifications"
            className="nav-link d-flex align-items-center p-2 rounded hover-bg"
            style={{ color: "white" }}
          >
            <TbBell className="me-2" /> Notifications
          </NavLink>
        </li>

        {/* My Profile */}
        <li className="nav-item">
          <NavLink
            to="/VillageOfficerProfile"
            className="nav-link d-flex align-items-center p-2 rounded hover-bg"
            style={{ color: "white" }}
          >
            <TbUserCircle className="me-2" /> My Profile
          </NavLink>
        </li>

        {/* Logout */}
        <li className="nav-item mt-4">
          <button
            className="w-100 p-2 rounded btn btn-outline-light"
            style={{ border: "none", cursor: "pointer" }}
            onClick={() => alert("Logout clicked")}
          >
            <TbLogout className="me-2" /> Logout
          </button>
        </li>
      </ul>
    </div>
 
  );
};

export default Sidebar;