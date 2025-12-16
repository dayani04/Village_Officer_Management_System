import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addSecretary } from '../../../../../api/secretary';
import './AddSecretary.css';

const AddSecretary = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    secretary_id: '',
    full_name: '',
    email: '',
    phone_no: '',
    password: '',
    nic: '',
    dob: '',
    address: '',
    regional_division: '',
    status: 'Active',
    area_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { secretary_id, full_name, email, password, phone_no } = formData;

    if (!secretary_id || !full_name || !email || !password || !phone_no) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Required fields are missing',
        confirmButtonColor: '#f43f3f',
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Invalid email format',
        confirmButtonColor: '#f43f3f',
      });
      return;
    }

    try {
      const secretaryData = {
        secretary_id: formData.secretary_id,
        full_name: formData.full_name,
        email: formData.email,
        phone_no: formData.phone_no,
        password: formData.password,
        nic: formData.nic || null,
        dob: formData.dob || null,
        address: formData.address || null,
        regional_division: formData.regional_division || null,
        area_id: formData.area_id || null,
        status: formData.status
      };
      
      await addSecretary(secretaryData);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Secretary added successfully',
        confirmButtonColor: '#4caf50',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate('/SecretaryDashBoard');
      });
    } catch (err) {
      console.error('Error adding secretary:', err);
      Swal.fire({
        icon: 'error',
        title: 'Add Failed',
        text: err.error || 'Failed to add secretary',
        confirmButtonColor: '#f43f3f',
      });
    }
  };

  const handleBack = () => {
    navigate('/SecretaryDashBoard');
  };

  const handleCancel = () => {
    navigate('/SecretaryDashBoard');
  };

  return (
    <section className="add-secretary-page">
      <button className="add-secretary-back-btn" onClick={handleBack}>
        ←
      </button>
      <h1>Add New Secretary</h1>
      <div className="add-secretary-container">
        <form className="add-secretary-form" onSubmit={handleSubmit}>
          <div className="add-secretary-field">
            <label htmlFor="secretary_id">Secretary ID:</label>
            <input
              type="text"
              id="secretary_id"
              name="secretary_id"
              value={formData.secretary_id}
              onChange={handleInputChange}
              placeholder="Enter Secretary ID"
              required
            />
          </div>
          <div className="add-secretary-field">
            <label htmlFor="full_name">Full Name:</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Enter Full Name"
              required
            />
          </div>
          <div className="add-secretary-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="add-secretary-field">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter Password"
              required
            />
          </div>
          <div className="add-secretary-field">
            <label htmlFor="phone_no">Phone Number:</label>
            <input
              type="text"
              id="phone_no"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleInputChange}
              placeholder="Enter Phone Number"
              required
            />
          </div>
          <div className="add-secretary-field">
            <label htmlFor="nic">NIC:</label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={formData.nic}
              onChange={handleInputChange}
              placeholder="Enter NIC (optional)"
            />
          </div>
          <div className="add-secretary-field">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
            />
          </div>
          <div className="add-secretary-field">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter Address (optional)"
            />
          </div>
          <div className="add-secretary-field">
            <label htmlFor="regional_division">Regional Division:</label>
            <input
              type="text"
              id="regional_division"
              name="regional_division"
              value={formData.regional_division}
              onChange={handleInputChange}
              placeholder="Enter Regional Division (optional)"
            />
          </div>
          <div className="add-secretary-field">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="add-secretary-field">
            <label htmlFor="area_id">Area ID:</label>
            <input
              type="text"
              id="area_id"
              name="area_id"
              value={formData.area_id}
              onChange={handleInputChange}
              placeholder="Enter Area ID (optional)"
            />
          </div>
          <div className="add-secretary-actions">
            <button type="submit" className="add-secretary-submit-btn">Add Secretary</button>
            <button type="button" className="add-secretary-cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddSecretary;
