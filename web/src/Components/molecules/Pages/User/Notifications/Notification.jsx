import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import { getVillagerNotifications, markNotificationAsRead } from '../../../../../api/villager';
import { TbCheck } from 'react-icons/tb';
import { FaArrowLeft } from 'react-icons/fa';
import NavBar from '../../../NavBar/NavBar';
import Footer from '../../../Footer/Footer';
import './Notification.css';

const Notification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getVillagerNotifications();
        const unreadNotifications = data.filter(notif => !notif.Is_Read);
        console.log('Fetched unread notifications:', unreadNotifications);
        setNotifications(unreadNotifications);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.error || 'Failed to fetch notifications');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch notifications', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.filter(notif => notif.Notification_ID !== notificationId));
      toast.success('Notification marked as read', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error(err.error || 'Failed to mark notification as read', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/user_dashboard');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
  };

  const columns = [
    {
      name: 'Notification ID',
      selector: row => row.Notification_ID || 'N/A',
      sortable: true,
    },
    {
      name: 'Message',
      selector: row => row.Message || 'N/A',
      sortable: true,
    },
    {
      name: 'Created At',
      selector: row => formatDate(row.Created_At),
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => (row.Is_Read ? 'Read' : 'Unread'),
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <button
          className="notification-mark-read-btn"
          onClick={() => handleMarkAsRead(row.Notification_ID)}
          title="Mark as Read"
        >
          <TbCheck />
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="">
        <NavBar />
        <br/>
        <div className="profile-hero">
          <button className="back-button" onClick={handleBack} title="Back to Dashboard">
            <FaArrowLeft />
          </button>
          
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="profile-title">Notifications</h1>
            </div>
          </div>
        </div>
        <br/>
        <div>Loading...</div>
        <Toaster />
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-container">
        <NavBar />
        <br/>
        <div className="profile-hero">
          <button className="back-button" onClick={handleBack} title="Back to Dashboard">
            <FaArrowLeft />
          </button>
          
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="profile-title">Notifications</h1>
            </div>
          </div>
        </div>
        <br/>
        <p className="error-message">Error: {error}</p>
        <Toaster />
      </div>
    );
  }

  return (
    <section className="w-full h-full flex flex-col p-4">
      <NavBar />
      <br/>
      <div className="profile-hero">
        <button className="back-button" onClick={handleBack} title="Back to Dashboard">
          <FaArrowLeft />
        </button>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="village-title">Notifications</h1>
          </div>
        </div>
      </div>
      <br/>
      <div className="notification-container">

        <DataTable
          columns={columns}
          data={notifications}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50]}
          highlightOnHover
          striped
          noDataComponent={<div className="notification-no-data">No unread notifications found</div>}
          customStyles={{
            table: {
              style: {
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
              },
            },
            headCells: {
              style: {
                backgroundColor: '#9ca3af',
                color: 'white',
                fontWeight: 'bold',
                padding: '12px',
              },
            },
            cells: {
              style: {
                padding: '12px',
                borderBottom: '1px solid #ddd',
              },
            },
            rows: {
              style: {
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              },
            },
          }}
        />
        <Toaster />
      </div>
      <Footer />
    </section>
  );
};

export default Notification;