import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerApi from '../../../../../api/villager';
import './AddVillagers.css';

const AddVillager = () => {
  const navigate = useNavigate();
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
    job: '',
    gender: 'Other',
    marital_status: 'Unmarried'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.villager_id) newErrors.villager_id = 'Villager ID is required';
    if (!formData.full_name) newErrors.full_name = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.phone_no) newErrors.phone_no = 'Phone Number is required';
    if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = 'Latitude must be a number between -90 and 90';
    }
    if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = 'Longitude must be a number between -180 and 180';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors in the form', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    try {
      await villagerApi.addVillager(formData);
      toast.success('Villager added successfully', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      setTimeout(() => navigate('/VillageOfficerDashBoard'), 1500);
    } catch (error) {
      toast.error(error.error || 'Failed to add villager', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleCancel = () => {
    setFormData({
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
      job: '',
      gender: 'Other',
      marital_status: 'Unmarried'
    });
    setErrors({});
  };

  const handleBack = () => {
    navigate('/VillageOfficerDashBoard');
  };

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="add-villager-container">
        <h1>Add New Villager</h1>
        <form className="add-villager-form" onSubmit={handleSubmit}>
          <div className="add-villager-field">
            <label htmlFor="villager_id">Villager ID:</label>
            <input
              type="text"
              id="villager_id"
              name="villager_id"
              value={formData.villager_id}
              onChange={handleChange}
              placeholder="Enter Villager ID"
            />
            {errors.villager_id && <span className="add-villager-error">{errors.villager_id}</span>}
          </div>
          <div className="add-villager-field">
            <label htmlFor="full_name">Full Name:</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter Full Name"
            />
            {errors.full_name && <span className="add-villager-error">{errors.full_name}</span>}
          </div>
          <div className="add-villager-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
            />
            {errors.email && <span className="add-villager-error">{errors.email}</span>}
          </div>
          <div className="add-villager-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
            />
            {errors.password && <span className="add-villager-error">{errors.password}</span>}
          </div>
          <div className="add-villager-field">
            <label htmlFor="phone_no">Phone Number:</label>
            <input
              type="text"
              id="phone_no"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              placeholder="Enter Phone Number"
            />
            {errors.phone_no && <span className="add-villager-error">{errors.phone_no}</span>}
          </div>
          <div className="add-villager-field">
            <label htmlFor="nic">NIC:</label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
              placeholder="Enter NIC (optional)"
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Address (optional)"
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="regional_division">Regional Division:</label>
            <input
              type="text"
              id="regional_division"
              name="regional_division"
              value={formData.regional_division}
              onChange={handleChange}
              placeholder="Enter Regional Division (optional)"
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="job">Job:</label>
            <input
              type="text"
              id="job"
              name="job"
              value={formData.job}
              onChange={handleChange}
              placeholder="Enter Job (optional)"
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="add-villager-field">
            <label htmlFor="marital_status">Marital Status:</label>
            <select id="marital_status" name="marital_status" value={formData.marital_status} onChange={handleChange}>
              <option value="Married">Married</option>
              <option value="Unmarried">Unmarried</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>
          <div className="add-villager-field">
            <label htmlFor="status">Status:</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="add-villager-field">
            <label htmlFor="area_id">Area ID:</label>
            <input
              type="text"
              id="area_id"
              name="area_id"
              value={formData.area_id}
              onChange={handleChange}
              placeholder="Enter Area ID (optional)"
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="latitude">Latitude:</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Enter Latitude (optional)"
              step="any"
            />
            {errors.latitude && <span className="add-villager-error">{errors.latitude}</span>}
          </div>
          <div className="add-villager-field">
            <label htmlFor="longitude">Longitude:</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Enter Longitude (optional)"
              step="any"
            />
            {errors.longitude && <span className="add-villager-error">{errors.longitude}</span>}
          </div>
          <div className="add-villager-field">
            <label htmlFor="is_participant">Election Participant:</label>
            <input
              type="checkbox"
              id="is_participant"
              name="is_participant"
              checked={formData.is_participant}
              onChange={handleChange}
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="alive_status">Alive Status:</label>
            <select id="alive_status" name="alive_status" value={formData.alive_status} onChange={handleChange}>
              <option value="Alive">Alive</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
          <div className="add-villager-actions">
            <button type="submit" className="add-villager-submit-btn">Add Villager</button>
            <button type="button" className="add-villager-cancel-btn" onClick={handleCancel}>Cancel</button>
            <button type="button" className="add-villager-back-btn" onClick={handleBack}>Back</button>
          </div>
        </form>
        <Toaster />
      </div>
    </section>
  );
};

export default AddVillager;