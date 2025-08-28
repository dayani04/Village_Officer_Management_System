
import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/Groups';
import CheckIcon from '@mui/icons-material/TaskAlt';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { fetchVillageTotal, fetchVillageParticipantTotal, fetchHouseCount } from '../../../../../api/villager'; // Import API functions

const DashboardCards = () => {
  const [cardData, setCardData] = useState([
    { title: 'Total Villagers', value: 'Loading...', icon: <PeopleIcon />, color: '#4caf50' },
    { title: 'Active Participants', value: 'Loading...', icon: <CheckIcon />, color: '#2196f3' },
    { title: 'Total House', value: 'Loading...', icon: <NotificationsIcon />, color: '#ff9800' },
    { title: 'Pending Requests', value: '23', icon: <HourglassEmptyIcon />, color: '#f44336' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [totalVillagers, participantTotal, houseCount] = await Promise.all([
          fetchVillageTotal(),
          fetchVillageParticipantTotal(),
          fetchHouseCount(),
        ]);

        setCardData([
          { title: 'Total Villagers', value: totalVillagers.toString(), icon: <PeopleIcon />, color: '#4caf50' },
          { title: 'Active Participants', value: participantTotal.toString(), icon: <CheckIcon />, color: '#2196f3' },
          { title: 'Total House', value: houseCount.toString(), icon: <NotificationsIcon />, color: '#ff9800' },
          { title: 'Pending Requests', value: '23', icon: <HourglassEmptyIcon />, color: '#f44336' },
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load data');
        setCardData([
          { title: 'Total Villagers', value: 'N/A', icon: <PeopleIcon />, color: '#4caf50' },
          { title: 'Active Participants', value: 'N/A', icon: <CheckIcon />, color: '#2196f3' },
          { title: 'Total House', value: 'N/A', icon: <NotificationsIcon />, color: '#ff9800' },
          { title: 'Pending Requests', value: '23', icon: <HourglassEmptyIcon />, color: '#f44336' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardData.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              height: 150,
              width: '100%',
              minWidth: 350,
              boxSizing: 'border-box',
            }}
          >
            <Box sx={{ fontSize: 40, color: card.color }}>{card.icon}</Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                {card.title}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {loading ? <CircularProgress size={20} /> : card.value}
                {error && card.title !== 'Pending Requests' && (
                  <Typography variant="caption" color="error">
                    {error}
                  </Typography>
                )}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
