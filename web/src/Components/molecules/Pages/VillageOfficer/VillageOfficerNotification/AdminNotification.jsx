import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  fetchElections,
  fetchElectionNotifications,
  deleteElectionNotification,
  sendElectionNotification,
} from "../../../../../api/election";
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
      setLoading(true);
      const [elections, fetchedNotifications] = await Promise.all([
        fetchElections(),
        fetchElectionNotifications(),
      ]);

      setElectionTypes(elections || []);
      setNotifications(fetchedNotifications || []);
      setError(null);
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || "Unknown error occurred";
      setError("Failed to load data: " + msg);
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "electionType" && value) {
      setFormData((prev) => ({
        ...prev,
        message: `Apply now for the ${value} election! Registration is open.`,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.electionType || !formData.message.trim()) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please select an election and enter a message.",
        icon: "warning",
      });
      return;
    }

    try {
      await sendElectionNotification(formData.electionType, formData.message);
      await loadData();
      Swal.fire({
        title: "Success!",
        text: "Notification sent successfully",
        icon: "success",
        timer: 2000,
      });
      setFormData({ electionType: "", message: "" });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message || "Failed to send notification",
        icon: "error",
      });
    }
  };

  const handleDeleteNotification = (notificationId, electionType) => {
    Swal.fire({
      title: "Delete Notification?",
      text: `This will remove the notification for "${electionType}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteElectionNotification(notificationId);
          await loadData();
          Swal.fire("Deleted!", "Notification removed.", "success");
        } catch (err) {
          Swal.fire("Error", "Could not delete notification.", "error");
        }
      }
    });
  };

  return (
    <>
   
      <section className="admin-notification-page">
        <div className="container">
          <h1 className="page-title">Manage Election Notifications</h1>

          {loading && <div className="loader">Loading data...</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="admin-notification-container">
            {/* Send New Notification Form */}
            <div className="notification-form-card">
              <h2>Send New Notification</h2>
              <form onSubmit={handleSubmit} className="notification-form">
                <div className="form-group">
                  <label htmlFor="electionType">Election Type *</label>
                  <select
                    id="electionType"
                    name="electionType"
                    value={formData.electionType}
                    onChange={handleInputChange}
                    required
                    disabled={loading || !!error}
                  >
                    <option value="">-- Select Election --</option>
                    {!loading &&
                      !error &&
                      electionTypes
                        .filter(
                          (election) =>
                            !notifications.some(
                              (n) => n.Type === election.Type
                            )
                        )
                        .map((election) => (
                          <option key={election.ID} value={election.Type}>
                            {election.Type}
                          </option>
                        ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your notification message..."
                    required
                    disabled={loading || !!error}
                  />
                </div>

                <button
                  type="submit"
                  className="send-btn"
                  disabled={loading || !!error}
                >
                  {loading ? "Sending..." : "Send Notification"}
                </button>
              </form>
            </div>

            {/* List of Sent Notifications */}
            <div className="notifications-list-card">
              <h2>
                Sent Notifications ({notifications.length})
              </h2>

              {notifications.length === 0 ? (
                <p className="empty-state">
                  No notifications have been sent yet.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="notifications-table">
                    <thead>
                      <tr>
                        <th>Election Type</th>
                        <th>Message</th>
                        <th>Sent At</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map((notif) => (
                        <tr key={notif.notification_id}>
                          <td><strong>{notif.Type}</strong></td>
                          <td>{notif.message}</td>
                          <td>
                            {new Date(notif.created_at).toLocaleString()}
                          </td>
                          <td>
                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDeleteNotification(
                                  notif.notification_id,
                                  notif.Type
                                )
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    
    </>
  );
};

export default AdminNotification;