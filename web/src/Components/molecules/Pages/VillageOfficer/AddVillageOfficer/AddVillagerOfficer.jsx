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

  const handleCancel = () => {
    navigate('/villager-officers');
  };

  return (
    <section className="w-full h-full flex flex-col p-4">
      <div className="add-villager-officer-container">
        <h1>Add Villager Officer</h1>
        <form onSubmit={handleSubmit}>
          <div className="add-villager-officer-form-group">
            <label>Officer ID</label>
            <input
              type="text"
              name="villager_officer_id"
              value={officer.villager_officer_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="add-villager-officer-form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={officer.full_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="add-villager-officer-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={officer.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="add-villager-officer-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={officer.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="add-villager-officer-form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone_no"
              value={officer.phone_no}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="add-villager-officer-form-group">
            <label>NIC</label>
            <input
              type="text"
              name="nic"
              value={officer.nic}
              onChange={handleInputChange}
            />
          </div>
          <div className="add-villager-officer-form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={officer.dob}
              onChange={handleInputChange}
            />
          </div>
          <div className="add-villager-officer-form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={officer.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="add-villager-officer-form-group">
            <label>Regional Division</label>
            <input
              type="text"
              name="regional_division"
              value={officer.regional_division}
              onChange={handleInputChange}
            />
          </div>
          <div className="add-villager-officer-form-group">
            <label>Status</label>
            <select
              name="status"
              value={officer.status}
              onChange={handleInputChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="add-villager-officer-form-group">
            <label>Area ID</label>
            <input
              type="text"
              name="area_id"
              value={officer.area_id}
              onChange={handleInputChange}
            />
          </div>
          <div className="add-villager-officer-actions">
            <button type="submit" className="add-villager-officer-save-btn">
              Add Officer
            </button>
            <button
              type="button"
              className="add-villager-officer-cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
        <Toaster />
      </div>
    </section>
  );
};

export default AddVillagerOfficer;