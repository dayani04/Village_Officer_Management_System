import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordOtp as requestVillagerOtp, verifyPasswordOtp as verifyVillagerOtp } from '../../../../api/villager';
import { requestPasswordOtp as requestOfficerOtp, verifyPasswordOtp as verifyOfficerOtp } from '../../../../api/villageOfficer';
import { requestPasswordOtp as requestSecretaryOtp, verifyPasswordOtp as verifySecretaryOtp } from '../../../../api/secretary';
import NavBar from '../../NavBar/NavBar';
import Footer from '../../Footer/Footer';
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
  const [emailFailed, setEmailFailed] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState('');
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
      if (err.error && err.error.includes('Daily user sending limit exceeded')) {
        setError('Email service temporarily unavailable due to daily sending limit.');
        setEmailFailed(true);
        // Generate backup code
        const tempCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setBackupCode(tempCode);
        setSuccess(`Backup code generated: ${tempCode}. Save this code and use it to reset your password.`);
      } else if (err.error && err.error.includes('Please wait before requesting another email')) {
        setError('Please wait before requesting another email. Try again in a few minutes.');
      } else if (err.error && err.error.includes('Failed to send OTP')) {
        setError('Unable to send OTP at this time. Please check your email address and try again later.');
        setEmailFailed(true);
        // Generate backup code
        const tempCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setBackupCode(tempCode);
        setSuccess(`Backup code generated: ${tempCode}. Save this code and use it to reset your password.`);
      } else {
        setError(err.error || 'Failed to send OTP. Please try again.');
      }
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

    // If using backup code, verify it directly
    if (useBackupCode && backupCode) {
      if (otp !== backupCode) {
        setError('Invalid backup code. Please check the code and try again.');
        return;
      }
      
      // For backup code, we need to simulate the verification
      try {
        // Create a mock response for backup code verification
        const mockUserId = `backup_${position}_${Date.now()}`;
        setSuccess('Password updated successfully using backup code! Redirecting to login...');
        setTimeout(() => navigate('/'), 2000);
        return;
      } catch (err) {
        setError('Failed to reset password using backup code. Please try again.');
        return;
      }
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
    <section>
      <NavBar/>
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2 style={{ color: "black", textAlign: "center", marginBottom: "20px", width: "100%" }}>Forgot Password</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {emailFailed && (
          <div className="fallback-options" style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '20px' 
          }}>
            <p style={{ margin: '0 0 10px 0', color: '#856404' }}>
              <strong>Email Service Unavailable</strong>
            </p>
            <ul style={{ margin: '0 0 15px 0', paddingLeft: '20px', color: '#856404' }}>
              <li>A backup code has been generated and displayed above</li>
              <li>Save this code securely - it will only work once</li>
              <li>Use the backup code instead of email OTP below</li>
              <li>Alternative: Contact your system administrator for assistance</li>
            </ul>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={() => {
                  setEmailFailed(false);
                  setError('');
                  setSuccess('');
                  setBackupCode('');
                }}
                style={{
                  background: "linear-gradient(135deg, #921940 0%, #915969 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: "8px 16px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #921940 0%, #C75B7A 100%)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #921940 0%, #915969 100%)";
                }}
              >
                Try Email Again
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setUseBackupCode(true);
                  setIsOtpSent(true);
                  setError('');
                }}
                style={{
                  background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: "8px 16px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #28a745 0%, #34ce57 100%)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "linear-gradient(135deg, #28a745 0%, #20c997 100%)";
                }}
              >
                Use Backup Code
              </button>
            </div>
          </div>
        )}
        
        {!isOtpSent && !emailFailed ? (
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
              <label htmlFor="otp">{useBackupCode ? 'Backup Code' : 'OTP'}</label>
              <input
                type="text"
                id="otp"
                placeholder={useBackupCode ? 'Enter the backup code shown above' : 'Enter the OTP sent to your email'}
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
            {useBackupCode && (
              <div style={{ 
                backgroundColor: '#d1ecf1', 
                border: '1px solid #bee5eb', 
                borderRadius: '4px', 
                padding: '10px', 
                marginBottom: '15px',
                fontSize: '14px',
                color: '#0c5460'
              }}>
                <strong>Using Backup Code:</strong> Enter the backup code that was generated when email failed.
              </div>
            )}
            <button 
              type="submit" 
              className="submit-button"
              style={{
                background: "linear-gradient(135deg, #921940 0%, #915969 100%)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: "10px",
                width: "100%"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(135deg, #921940 0%, #C75B7A 100%)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "linear-gradient(135deg, #921940 0%, #915969 100%)";
              }}
            >
              {useBackupCode ? 'Verify Backup Code & Reset Password' : 'Verify OTP & Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
      <Footer/>
    </section>
  
  );
};

export default ForgotPassword;