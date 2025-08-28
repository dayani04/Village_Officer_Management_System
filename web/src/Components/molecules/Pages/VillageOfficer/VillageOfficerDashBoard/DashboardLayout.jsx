import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminNavbar from './AdminNavbar';

const DashboardLayout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/login']; // Add routes here if you want to hide sidebar
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <AdminNavbar />
      <div className="d-flex flex-grow-1">
        {showSidebar && <Sidebar />}
        <div
          className="flex-grow-1 p-4"
          style={{
            marginLeft: showSidebar ? '250px' : '0',
            marginTop: '60px', // Offset for navbar height
            background: '#F4F6F8',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;