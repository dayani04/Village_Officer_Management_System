import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as villagerApi from '../../../../api/villager';
import * as villageOfficerApi from '../../../../api/villageOfficer';
import * as secretaryApi from '../../../../api/secretary';
import './UserLogin.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (position === '') {
      setError('Please select a position');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (position === 'developer') {
        // Villager login
        response = await villagerApi.loginVillager(email, password);
        navigate('/UserDashboard', { state: { user: response } });
      } else if (position === 'manager') {
        // Village Officer login
        response = await villageOfficerApi.loginVillageOfficer(email, password);
        navigate('/VillageOfficerDashboard', { state: { user: response } });
      } else if (position === 'designer') {
        // Secretary login
        response = await secretaryApi.loginSecretary(email, password);
        navigate('/SecretaryDashboard', { state: { user: response } });
      } else {
        setError('Invalid position selected.');
      }
    } catch (err) {
      setError(err.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <label htmlFor="position">Position</label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            >
              <option value="">Select Position</option>
              <option value="developer">Villager</option>
              <option value="manager">Village Officer</option>
              <option value="designer">Secretary</option>
            </select>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <a href="/ForgotPassword" className="forgot-password-link">
            Forgot Password?
          </a>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;