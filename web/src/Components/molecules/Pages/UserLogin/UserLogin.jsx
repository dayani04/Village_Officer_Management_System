import React, { useState } from 'react';
import './UserLogin.css'
const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
   
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
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
          <button type="submit" className="login-button">
            Login
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
