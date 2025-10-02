
import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import Sidebar from './SidebarS'; // Your custom sidebar
import { Pie, Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js';
import DashboardCards from './DashboardCards';
import {
  fetchReligionCount,
  fetchRaceCount,
  fetchMonthlyRegistrationCount,
  fetchMonthlyVillagerGrowth,
} from '../../../../../api/villager'; // Adjust path if needed


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

const SecretaryDashBoard = () => {
  const [pieChartData, setPieChartData] = useState({
    labels: ['Buddhism', 'Hinduism', 'Islam', 'Christianity', 'Others'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#9C284F', '#B13E62', '#7A1F3D', '#D26E88', '#E5A0B3'],
      hoverOffset: 4,
    }],
  });
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [{
      label: 'New Registrations',
      data: [],
      backgroundColor: '#B13E62',
      borderColor: '#388E3C',
      borderWidth: 1,
    }],
  });
  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: ['Sinhalese', 'Sri Lankan Tamils', 'Sri Lankan Moors', 'Indian Tamils'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#B13E62', '#9C284F', '#D26E88', '#E5A0B3'],
      cutout: '70%',
    }],
  });
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Villager Growth',
      data: [],
      fill: true,
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx } = chart;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, '#9C284F');
        gradient.addColorStop(1, '#E5A0B3');
        return gradient;
      },
      borderColor: '#7A1F3D',
      tension: 0.4,
    }],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [religion, race, monthlyRegistration, monthlyGrowth] = await Promise.all([
          fetchReligionCount(),
          fetchRaceCount(),
          fetchMonthlyRegistrationCount(),
          fetchMonthlyVillagerGrowth(),
        ]);

        // Religion Pie Chart Data
        setPieChartData({
          labels: ['Buddhism', 'Hinduism', 'Islam', 'Christianity', 'Others'],
          datasets: [{
            data: [
              religion.find((item) => item.Religion === 'Buddhism')?.villager_count || 0,
              religion.find((item) => item.Religion === 'Hinduism')?.villager_count || 0,
              religion.find((item) => item.Religion === 'Islam')?.villager_count || 0,
              religion.find((item) => item.Religion === 'Christianity')?.villager_count || 0,
              religion.find((item) => item.Religion === 'Others')?.villager_count || 0,
            ],
            backgroundColor: ['#9C284F', '#B13E62', '#7A1F3D', '#a95a70ff','#D26E88'],
            hoverOffset: 4,
          }],
        });

        // Race Doughnut Chart Data
        setDoughnutChartData({
          labels: ['Sinhalese', 'Sri Lankan Tamils', 'Sri Lankan Moors', 'Indian Tamils'],
          datasets: [{
            data: [
              race.find((item) => item.Race === 'Sinhalese')?.villager_count || 0,
              race.find((item) => item.Race === 'Sri Lankan Tamils')?.villager_count || 0,
              race.find((item) => item.Race === 'Sri Lankan Moors')?.villager_count || 0,
              race.find((item) => item.Race === 'Indian Tamils')?.villager_count || 0,
            ],
            backgroundColor: ['#B13E62', '#9C284F', '#D26E88', '#E5A0B3'],
            cutout: '70%',
          }],
        });

        // Monthly Registration Bar Chart Data
        setBarChartData({
          labels: monthlyRegistration.map((item) => `${item.year}-${item.month.toString().padStart(2, '0')}`),
          datasets: [{
            label: 'New Registrations',
            data: monthlyRegistration.map((item) => item.registration_count),
            backgroundColor: '#B13E62',
            borderColor: '#388E3C',
            borderWidth: 1,
          }],
        });

        // Villager Growth Line Chart Data
        setLineChartData({
          labels: monthlyGrowth.map((item) => `${item.year}-${item.month.toString().padStart(2, '0')}`),
          datasets: [{
            label: 'Villager Growth',
            data: monthlyGrowth.map((item) => item.registration_count),
            fill: true,
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx } = chart;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, '#9C284F');
              gradient.addColorStop(1, '#E5A0B3');
              return gradient;
            },
            borderColor: '#7A1F3D',
            tension: 0.4,
          }],
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#F4F6F8', minHeight: '100vh' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Secretary Dashboard</Typography>

        <DashboardCards />

        {/* Charts Row 1 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper className="card-style-1 animate-slide-up" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Religion Distribution</Typography>
              <div style={{ height: 500, width: '700px', padding: '70px' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <Pie data={pieChartData} options={chartOptions} />
                )}
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className="card-style-2 animate-slide-up" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Monthly Registrations</Typography>
              <div style={{ height: 500, width: '700px', padding: '70px' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <Bar data={barChartData} options={chartOptions} />
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts Row 2 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper className="card-style-3 animate-slide-up" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Villager Growth</Typography>
              <div style={{ height: 500, width: '700px', padding: '70px' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <Line data={lineChartData} options={chartOptions} />
                )}
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className="card-style-4 animate-slide-up" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Race Distribution</Typography>
              <div style={{ height: 500, width: '700px', padding: '70px' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography color="error">{error}</Typography>
                ) : (
                  <Doughnut data={doughnutChartData} options={chartOptions} />
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SecretaryDashBoard;
