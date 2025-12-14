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
    if (location.pathname.includes("add_villagers") || location.pathname.includes("villagers") || location.pathname.includes("villagers_houses")) {
      setIsProductSubMenuOpen(true);
    }
    if (location.pathname.includes("users")) {
      setIsUsersSubMenuOpen(true);
    }
    if (location.pathname.includes("discounts") || location.pathname.includes("requests-for-new-villagers") || location.pathname.includes("requests-for-new-born")) {
      setIsDiscountSubMenuOpen(true);
    }
  }, [location.pathname]);

  return (
    <div
      className="d-flex flex-column p-4"
      style={{
        width: "250px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "linear-gradient(135deg, #4A2C4E, #8A2B3A, #2A4066)",
        color: "white",
        overflowY: "auto",
        zIndex: 999,
      }}
    >
      <div className="text-center mb-4">
        <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
          <img 
            src="/assets/sri-lanka-emblem.png" 
            alt="Sri Lanka Emblem" 
            style={{ 
              width: "100px", 
              height: "70px", 
              objectFit: "contain" 
            }} 
          />
          <img 
            src="/assets/sri-lanka-flag.png" 
            alt="Sri Lanka Flag" 
            style={{ 
              width: "90px", 
              height: "70px", 
              objectFit: "contain" 
            }} 
          />
        </div>
      </div>
      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <NavLink
            to="/VillageOfficerDashBoard"
            className="nav-link d-flex align-items-center p-2 rounded"
            style={{ textDecoration: "none", color: "white", transition: "all 0.3s ease" }}
            activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
            onMouseEnter={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.background = "none";
              }
            }}
          >
            <TbDashboard className="me-2" /> Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <button
            onClick={() => setIsProductSubMenuOpen(!isProductSubMenuOpen)}
            className="btn btn-toggle d-flex align-items-center p-2 rounded justify-content-between"
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer", color: "white", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
            }}
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
                  to="/villagers"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  Villagers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/villagers_houses"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  Houses
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <button
            onClick={() => setIsDiscountSubMenuOpen(!isDiscountSubMenuOpen)}
            className="btn btn-toggle d-flex align-items-center p-2 rounded justify-content-between"
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer", color: "white", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
            }}
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
                  to="/requests-for-allowances"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  Allowance
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/requests_for_certificate"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  Certificate
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/requests-for-id-cards"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  ID Cards
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/requests-for-permits"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  Permits
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/requests-for-elections"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  Election
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/eligible-voters"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  Voter List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/requests-for-new-villagers"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  New Villager
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/requests-for-new-born"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  New Born
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <button
            onClick={() => setIsUsersSubMenuOpen(!isUsersSubMenuOpen)}
            className="btn btn-toggle d-flex align-items-center p-2 rounded justify-content-between"
            style={{ width: "100%", border: "none", background: "none", cursor: "pointer", color: "white", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => {
              e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
            }}
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
                  to="/allowances_owners"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  Allowance
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/permit_owner"
                  className="nav-link p-2 rounded"
                  style={{ color: "white", transition: "all 0.3s ease" }}
                  activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
                  onMouseEnter={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.classList.contains('active')) {
                      e.target.style.background = "none";
                    }
                  }}
                >
                  Permit
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item">
          <NavLink
            to="/villager-officers"
            className="nav-link d-flex align-items-center p-2 rounded"
            style={{ color: "white", transition: "all 0.3s ease" }}
            activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
            onMouseEnter={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.background = "none";
              }
            }}
          >
            <TbUserPlus className="me-2" /> Village Officer
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/admin_notification"
            className="nav-link d-flex align-items-center p-2 rounded"
            style={{ color: "white", transition: "all 0.3s ease" }}
            activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
            onMouseEnter={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.background = "none";
              }
            }}
          >
            <TbBell className="me-2" /> Notifications
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/Village_officer_profile"
            className="nav-link d-flex align-items-center p-2 rounded"
            style={{ color: "white", transition: "all 0.3s ease" }}
            activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
            onMouseEnter={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.background = "none";
              }
            }}
          >
            <TbUserCircle className="me-2" /> My Profile
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/"
            className="nav-link d-flex align-items-center p-2 rounded"
            style={{ color: "white", transition: "all 0.3s ease" }}
            activeStyle={{ fontWeight: "bold", background: "linear-gradient(135deg, #d4a5a5 0%, #C75B7A 100%)" }}
            onMouseEnter={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.background = "linear-gradient(135deg, rgba(146, 25, 64, 0.3) 0%, rgba(145, 89, 105, 0.3) 100%)";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.background = "none";
              }
            }}
          >
            <TbLogout className="me-2" /> Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;