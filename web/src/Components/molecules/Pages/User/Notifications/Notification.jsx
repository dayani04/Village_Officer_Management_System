import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerApi from '../../../../../api/villager';
import { TbCheck } from 'react-icons/tb';
import './Notification.css';
import NavBar from '../../../NavBar/NavBar';
import Footer from '../../../Footer/Footer';

const Notification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await villagerApi.getNotifications();
        setNotifications(data);
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
      await villagerApi.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.Notification_ID === notificationId ? { ...notif, Is_Read: true } : notif
        )
      );
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
    navigate('/VillagerDashboard');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleString();
  };

  if (loading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="notification-container">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="notification-container">
          <h1>Notifications</h1>
          <p>Error: {error}</p>
          <div className="notification-actions">
            <button className="notification-back-btn" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
          <Toaster />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full flex flex-col p-4">
      <NavBar/>
      <div className="notification-container">
        <h1>Notifications</h1>
        <div className="notification-table-wrapper">
          <table className="notification-table">
            <thead>
              <tr>
                <th>Notification ID</th>
                <th>Message</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <tr key={notif.Notification_ID}>
                    <td>{notif.Notification_ID}</td>
                    <td>{notif.Message || 'N/A'}</td>
                    <td>{formatDate(notif.Created_At)}</td>
                    <td>{notif.Is_Read ? 'Read' : 'Unread'}</td>
                    <td>
                      <div className="notification-action-buttons">
                        {!notif.Is_Read && (
                          <button
                            className="notification-mark-read-btn"
                            onClick={() => handleMarkAsRead(notif.Notification_ID)}
                            title="Mark as Read"
                          >
                            <TbCheck />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="notification-no-data">
                    No notifications found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="notification-actions">
          <button className="notification-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
      <Footer/>
    </section>
  );
};

export default Notification;