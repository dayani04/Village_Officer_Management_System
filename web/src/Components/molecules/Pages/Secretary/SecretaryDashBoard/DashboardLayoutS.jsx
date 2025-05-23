// src/layouts/DashboardLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import SidebarS from "./SidebarS";

const DashboardLayoutS = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/login']; // Add routes here if you want to hide sidebar
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen">
      {showSidebar }
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayoutS;