import React, { useState, useEffect } from "react";
import { getProfile, updateVillageOfficer, requestPasswordOtp, verifyPasswordOtp } from "../../../../../api/villageOfficer";
import "./VillageOfficerProfile.css";

const VillageOfficerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_no: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  const [villageOfficerId, setVillageOfficerId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otpMode, setOtpMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setFormData({
        full_name: data.Full_Name || "",
        email: data.Email || "",
        phone_no: data.Phone_No || "",
      });
    } catch (err) {
      setError("Failed to fetch profile: " + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateVillageOfficer(profile.Villager_Officer_ID, formData);
      setMessage("Profile updated successfully");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    }
  };

  const handlePasswordChangeRequest = async () => {
    try {
      const response = await requestPasswordOtp(profile.Email);
      setVillageOfficerId(response.villageOfficerId);
      setOtpMode(true);
      setMessage("OTP sent to your email");
    } catch (err) {
      setError("Failed to request OTP: " + err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyPasswordOtp(villageOfficerId, passwordForm.otp, passwordForm.newPassword);
      setMessage("Password updated successfully");
      setOtpMode(false);
      setPasswordForm({ email: "", otp: "", newPassword: "" });
    } catch (err) {
      setError("Failed to verify OTP or update password: " + err.message);
    }
  };

  if (!profile) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Village Officer Profile</h1>
      {message && <div className="error-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {editMode ? (
        <form onSubmit={handleEditSubmit} className="profile-form">
          <div className="profile-field">
            <label>Full Name:</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="profile-field">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="save-button">
              Save Changes
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : otpMode ? (
        <form onSubmit={handlePasswordSubmit} className="otp-form">
          <div className="profile-field">
            <label>OTP (sent to {profile.Email}):</label>
            <input
              type="text"
              value={passwordForm.otp}
              onChange={(e) => setPasswordForm({ ...passwordForm, otp: e.target.value })}
              required
            />
          </div>
          <div className="profile-field">
            <label>New Password:</label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
          </div>
          <div className="form-buttons">
            <button type="submit" className="save-button">
              Verify & Update Password
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setOtpMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="profile-details">
            <div className="profile-field">
              <label>Village Officer ID:</label>
              <span>{profile.Villager_Officer_ID}</span>
            </div>
            <div className="profile-field">
              <label>Full Name:</label>
              <span>{profile.Full_Name}</span>
            </div>
            <div className="profile-field">
              <label>Email:</label>
              <span>{profile.Email}</span>
            </div>
            <div className="profile-field">
              <label>Phone Number:</label>
              <span>{profile.Phone_No}</span>
            </div>
            <div className="profile-field">
              <label>Status:</label>
              <span>{profile.Status}</span>
            </div>
          </div>
          <div className="profile-actions">
            <button className="edit-button" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
            <button className="password-button" onClick={handlePasswordChangeRequest}>
              Change Password
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VillageOfficerProfile;