import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TbUserCircle, TbLogout } from 'react-icons/tb';
import { Typography, Box } from '@mui/material';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add any logout logic here (e.g., clearing tokens)
    navigate('/');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        marginLeft: '250px',
        height: '60px',
        background: 'linear-gradient(135deg, #4A2C4E, #8A2B3A, #2A4066)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h7" sx={{ fontWeight: '' }}>
     
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <NavLink
          to="/Village_officer_profile"
          style={{
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            borderRadius: '4px',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
          }}
        >
          <TbUserCircle style={{ marginRight: '8px' }} />
          Profile
        </NavLink>
        <Box
          onClick={handleLogout}
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
          }}
        >
          <TbLogout style={{ marginRight: '8px' }} />
          Logout
        </Box>
      </Box>
    </Box>
  );
};

export default AdminNavbar;