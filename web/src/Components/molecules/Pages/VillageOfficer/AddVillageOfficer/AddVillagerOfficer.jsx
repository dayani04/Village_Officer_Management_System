import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerOfficerApi from '../../../../../api/villageOfficer';
import './AddVillagerOfficer.css';

const AddVillagerOfficer = () => {
  const navigate = useNavigate();
  const [officer, setOfficer] = useState({
    villager_officer_id: '',
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
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfficer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { villager_officer_id, full_name, email, password, phone_no } = officer;

    if (!villager_officer_id || !full_name || !email || !password || !phone_no) {
      toast.error('Required fields are missing', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      return;
    }

    try {
      await villagerOfficerApi.addVillageOfficer(officer);
      toast.success('Officer added successfully', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      navigate('/villager-officers');
    } catch (err) {
      console.error('Error adding officer:', err);
      toast.error(err.error || 'Failed to add officer', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/villager-officers');
  };

  const handleCancel = () => {
    navigate('/villager-officers');
  };

  return (
    <section className="add-villager-page">
      <button className="add-villager-back-btn" onClick={handleBack}>
        ←
      </button>
      <h1>Add New Villager Officer</h1>
      <div className="add-villager-container">
        <form className="add-villager-form" onSubmit={handleSubmit}>
          <div className="add-villager-field">
            <label htmlFor="villager_officer_id">Officer ID:</label>
            <input
              type="text"
              id="villager_officer_id"
              name="villager_officer_id"
              value={officer.villager_officer_id}
              onChange={handleInputChange}
              placeholder="Enter Officer ID"
              required
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="full_name">Full Name:</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={officer.full_name}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              required
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={officer.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={officer.password}
              onChange={handleInputChange}
              placeholder="Enter Password"
              required
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="phone_no">Phone Number:</label>
            <input
              type="text"
              id="phone_no"
              name="phone_no"
              value={officer.phone_no}
              onChange={handleInputChange}
              placeholder="Enter Phone Number"
              required
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="nic">NIC:</label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={officer.nic}
              onChange={handleInputChange}
              placeholder="Enter NIC (optional)"
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={officer.dob}
              onChange={handleInputChange}
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={officer.address}
              onChange={handleInputChange}
              placeholder="Enter Address (optional)"
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="regional_division">Regional Division:</label>
            <input
              type="text"
              id="regional_division"
              name="regional_division"
              value={officer.regional_division}
              onChange={handleInputChange}
              placeholder="Enter Regional Division (optional)"
            />
          </div>
          <div className="add-villager-field">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={officer.status}
              onChange={handleInputChange}
              required
            >
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
              value={officer.area_id}
              onChange={handleInputChange}
              placeholder="Enter Area ID (optional)"
            />
          </div>
          <div className="add-villager-actions">
            <button type="submit" className="add-villager-submit-btn">Add Officer</button>
            <button type="button" className="add-villager-cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
        <Toaster />
      </div>
    </section>
  );
};

export default AddVillagerOfficer;