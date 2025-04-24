import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../../../api/villager';
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
      if (position === 'developer') { // Villager
        const response = await api.loginVillager(email, password);
        // Token is already set in loginVillager via setToken
        navigate('/UserDashboard', { state: { user: response } });
      } else {
        // Placeholder for Village Officer and Secretary
        setError('Login for Village Officer and Secretary is not implemented yet.');
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