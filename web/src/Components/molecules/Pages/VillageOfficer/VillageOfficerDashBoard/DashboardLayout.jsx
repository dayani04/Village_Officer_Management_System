// src/layouts/DashboardLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/login']; // Add routes here if you want to hide sidebar
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen">
      {showSidebar && <Sidebar/>}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;