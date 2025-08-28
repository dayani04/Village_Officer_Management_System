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
        height: '60px',
        background: '#9C284F',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000,
        boxShadow: '#9C284F',
      }}
    >
      <Typography variant="h7" sx={{ fontWeight: '' }}>
         Villager Officer Dashboard 
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
            '&:hover': { backgroundColor: '#9C284F' },
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
            '&:hover': { backgroundColor: '#9C284F' },
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