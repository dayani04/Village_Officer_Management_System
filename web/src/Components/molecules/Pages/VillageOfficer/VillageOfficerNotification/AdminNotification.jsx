import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { fetchElections, fetchElectionNotifications, deleteElectionNotification, sendElectionNotification } from "../../../../../api/election";
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";
import "./AdminNotification.css";

const AdminNotification = () => {
  const [formData, setFormData] = useState({
    electionType: "",
    message: "",
  });
  const [electionTypes, setElectionTypes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const [elections, fetchedNotifications] = await Promise.all([
        fetchElections(),
        fetchElectionNotifications(),
      ]);
      console.log("Loaded elections:", elections);
      console.log("Loaded notifications:", fetchedNotifications);
      setElectionTypes(elections);
      setNotifications(fetchedNotifications);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err.response?.data || err.message);
      setError("Failed to fetch data: " + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect running to fetch elections and notifications");
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "electionType" && value) {
      setFormData((prevData) => ({
        ...prevData,
        message: `Apply for ${value}`,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.electionType || !formData.message) {
      Swal.fire({
        title: "Validation Error",
        text: "Please fill in all required fields",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await sendElectionNotification(formData.electionType, formData.message);
      await loadData();
      Swal.fire({
        title: "Success",
        text: "Notification sent successfully",
        icon: "success",
        confirmButtonText: "OK",
      });
      setFormData({ electionType: "", message: "" });
    } catch (err) {
      console.error("Failed to send notification:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to send notification: " + (err.error || err.message),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteNotification = async (notificationId, electionType) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: `Are you sure you want to delete the notification for ${electionType}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteElectionNotification(notificationId);
          await loadData();
          Swal.fire({
            title: "Success",
            text: "Notification deleted successfully",
            icon: "success",
            confirmButtonText: "OK",
          });
        } catch (err) {
          console.error("Failed to delete notification:", err);
          Swal.fire({
            title: "Error",
            text: "Failed to delete notification: " + (err.error || err.message),
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  return (
    <section>
    
      <div>
        <br />
        <br />
        <h1 className="form-title">Election Notifications</h1>
        <br />
        <div className="admin-notification-container">
          <form className="notification-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="electionType">Election Type</label>
              <select
                id="electionType"
                name="electionType"
                value={formData.electionType}
                onChange={handleInputChange}
                required
                disabled={loading || !!error}
              >
                <option value="" disabled>
                  Select an election type
                </option>
                {loading ? (
                  <option disabled>Loading...</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : electionTypes.length === 0 ? (
                  <option disabled>No elections available</option>
                ) : (
                  electionTypes
                    .filter((election) => !notifications.some((notif) => notif.Type === election.Type))
                    .map((election) => (
                      <option key={election.ID} value={election.Type}>
                        {election.Type}
                      </option>
                    ))
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter notification message"
                required
                disabled={loading || !!error}
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                className="send-notification-button"
                disabled={loading || !!error}
              >
                Send
              </button>
            </div>
          </form>

          <div className="notifications-list">
            <h2>Sent Notifications</h2>
            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              <table className="notifications-table">
                <thead>
                  <tr>
                    <th>Election Type</th>
                    <th>Message</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.map((notification) => (
                    <tr key={notification.notification_id}>
                      <td>{notification.Type}</td>
                      <td>{notification.message}</td>
                      <td>{new Date(notification.created_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="delete-notification-button"
                          onClick={() => handleDeleteNotification(notification.notification_id, notification.Type)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
   
    </section>
  );
};

export default AdminNotification;