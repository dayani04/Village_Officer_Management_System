import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordOtp as requestVillagerOtp, verifyPasswordOtp as verifyVillagerOtp } from '../../../../api/villager';
import { requestPasswordOtp as requestOfficerOtp, verifyPasswordOtp as verifyOfficerOtp } from '../../../../api/villageOfficer';
import { requestPasswordOtp as requestSecretaryOtp, verifyPasswordOtp as verifySecretaryOtp } from '../../../../api/secretary';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [position, setPosition] = useState('villager');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userId, setUserId] = useState(null); // Generic userId for Villager_ID, Village_Officer_ID, or Secretary_ID
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let response;
      switch (position) {
        case 'villager':
          response = await requestVillagerOtp(email);
          setUserId(response.villagerId);
          break;
        case 'village_officer':
          response = await requestOfficerOtp(email);
          setUserId(response.villageOfficerId);
          break;
        case 'secretary':
          response = await requestSecretaryOtp(email);
          setUserId(response.secretaryId);
          break;
        default:
          throw new Error('Invalid position selected');
      }
      setIsOtpSent(true);
      setSuccess('OTP sent to your email.');
    } catch (err) {
      setError(err.error || 'Failed to send OTP. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }

    try {
      switch (position) {
        case 'villager':
          await verifyVillagerOtp(userId, otp, newPassword);
          break;
        case 'village_officer':
          await verifyOfficerOtp(userId, otp, newPassword);
          break;
        case 'secretary':
          await verifySecretaryOtp(userId, otp, newPassword);
          break;
        default:
          throw new Error('Invalid position selected');
      }
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.error || 'Failed to verify OTP or update password.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {!isOtpSent ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="input-field">
              <label htmlFor="position">Position</label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              >
                <option value="villager">Villager</option>
                <option value="village_officer">Village Officer</option>
                <option value="secretary">Secretary</option>
              </select>
            </div>
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="input-field">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Verify OTP & Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;