import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../../../../api/villager';
import './AddVillagers.css'; // Assuming a separate CSS file or reuse UserProfile.css

const AddVillager = () => {
  const [formData, setFormData] = useState({
    villager_id: '',
    full_name: '',
    email: '',
    password: '',
    phone_no: '',
    nic: '',
    dob: '',
    address: '',
    regional_division: '',
    status: 'Active',
    area_id: '',
    latitude: '',
    longitude: '',
    is_participant: false,
    alive_status: 'Alive',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.villager_id || !formData.full_name || !formData.email || !formData.password || !formData.phone_no) {
        setError('Villager ID, Full Name, Email, Password, and Phone Number are required');
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(formData.email)) {
        setError('Invalid email format');
        setLoading(false);
        return;
      }

      // Validate latitude and longitude if provided
      if (formData.latitude || formData.longitude) {
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          setError('Invalid Latitude or Longitude values');
          setLoading(false);
          return;
        }
      }

      // Prepare payload
      const payload = {
        villager_id: formData.villager_id,
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone_no: formData.phone_no,
        nic: formData.nic || null,
        dob: formData.dob || null,
        address: formData.address || null,
        regional_division: formData.regional_division || null,
        status: formData.status,
        area_id: formData.area_id || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        is_participant: formData.is_participant,
        alive_status: formData.alive_status,
      };

      await api.addVillager(payload);
      setError('');
      navigate('/UserDashboard'); // Redirect to dashboard or another page after success
    } catch (err) {
      setError(err.error || 'Failed to add villager: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/UserDashboard');
  };

  return (
    <div className="profile-container">
      <h1>Add New Villager</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-field">
          <label>Villager ID:</label>
          <input
            type="text"
            name="villager_id"
            value={formData.villager_id}
            onChange={handleInputChange}
            required
          />
        </div>
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
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
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
        <div className="profile-field">
          <label>NIC:</label>
          <input
            type="text"
            name="nic"
            value={formData.nic}
            onChange={handleInputChange}
          />
        </div>
        <div className="profile-field">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
          />
        </div>
        <div className="profile-field">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
        <div className="profile-field">
          <label>Regional Division:</label>
          <input
            type="text"
            name="regional_division"
            value={formData.regional_division}
            onChange={handleInputChange}
          />
        </div>
        <div className="profile-field">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="profile-field">
          <label>Area ID:</label>
          <input
            type="text"
            name="area_id"
            value={formData.area_id}
            onChange={handleInputChange}
          />
        </div>
        <div className="profile-field">
          <label>Latitude:</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            placeholder="e.g., 6.9271"
          />
        </div>
        <div className="profile-field">
          <label>Longitude:</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            placeholder="e.g., 79.8612"
          />
        </div>
        <div className="profile-field">
          <label>Alive Status:</label>
          <select
            name="alive_status"
            value={formData.alive_status}
            onChange={handleInputChange}
          >
            <option value="Alive">Alive</option>
            <option value="Deceased">Deceased</option>
          </select>
        </div>
        <div className="profile-field">
          <label>Upcoming Election Participant:</label>
          <input
            type="checkbox"
            name="is_participant"
            checked={formData.is_participant}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add Villager'}
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVillager;