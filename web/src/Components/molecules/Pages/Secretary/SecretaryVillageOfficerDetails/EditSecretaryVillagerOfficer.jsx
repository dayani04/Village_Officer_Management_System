import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as villagerOfficerApi from '../../../../../api/villageOfficer';
import './EditSecretaryVillagerOfficer.css';

const EditSecretaryVillagerOfficer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [officer, setOfficer] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    nic: '',
    dob: '',
    address: '',
    regional_division: '',
    status: 'Active',
    area_id: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchOfficer = async () => {
      try {
        const data = await villagerOfficerApi.fetchVillageOfficer(id);
        setOfficer({
          full_name: data.Full_Name || '',
          email: data.Email || '',
          phone_no: data.Phone_No || '',
          nic: data.NIC || '',
          dob: data.DOB ? data.DOB.split('T')[0] : '',
          address: data.Address || '',
          regional_division: data.RegionalDivision || '',
          status: data.Status || 'Active',
          area_id: data.Area_ID || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching officer:', err);
        setFetchError(err.error || 'Failed to fetch officer');
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Fetch Error',
          text: err.error || 'Failed to fetch officer',
          confirmButtonColor: '#f43f3f',
        });
      }
    };

    fetchOfficer();
  }, [id]);

  const validateForm = () => {
    const newErrors = {};
    if (!officer.full_name) newErrors.full_name = 'Full Name is required';
    if (!officer.email) newErrors.email = 'Email is required';
    else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(officer.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!officer.phone_no) newErrors.phone_no = 'Phone Number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfficer({
      ...officer,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix the errors in the form',
        confirmButtonColor: '#f43f3f',
      });
      return;
    }

    try {
      await villagerOfficerApi.updateVillageOfficer(id, officer);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Officer updated successfully',
        confirmButtonColor: '#4caf50',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate('/secretary-villager-officers');
      });
    } catch (err) {
      console.error('Error updating officer:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.error || 'Failed to update officer',
        confirmButtonColor: '#f43f3f',
      });
    }
  };

  const handleBack = () => {
    navigate('/secretary-villager-officers');
  };

  if (loading) {
    return (
       <section className="edit-villager-officer-page">
        <button className="edit-villager-officer-back-btn" onClick={handleBack}>
          ←
        </button>
        <h1>Edit Village Officer</h1>
        <div className="edit-villager-officer-container">Loading...</div>
      </section>
    );
  }

  if (fetchError) {
    return (
     <section className="edit-villager-officer-page">
        <button className="edit-villager-officer-back-btn" onClick={handleBack}>
          ←
        </button>
           <h1>Edit Village Officer</h1>
        <div className="edit-villager-officer-container">
          <p>Error: {fetchError}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="edit-villager-officer-page">
      <button className="edit-villager-officer-back-btn" onClick={handleBack}>
        ←
      </button>
      <h1>Edit Village Officer</h1>
      <div className="edit-villager-officer-container">
        <form className="edit-villager-officer-form" onSubmit={handleSubmit}>
          <div className="edit-villager-officer-field">
            <label htmlFor="full_name">Full Name:</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={officer.full_name}
              onChange={handleChange}
              placeholder="Enter Full Name"
            />
            {errors.full_name && <span className="edit-villager-officer-error">{errors.full_name}</span>}
          </div>
          <div className="edit-villager-officer-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={officer.email}
              onChange={handleChange}
              placeholder="Enter Email"
            />
            {errors.email && <span className="edit-villager-officer-error">{errors.email}</span>}
          </div>
          <div className="edit-villager-officer-field">
            <label htmlFor="phone_no">Phone Number:</label>
            <input
              type="text"
              id="phone_no"
              name="phone_no"
              value={officer.phone_no}
              onChange={handleChange}
              placeholder="Enter Phone Number"
            />
            {errors.phone_no && <span className="edit-villager-officer-error">{errors.phone_no}</span>}
          </div>
          <div className="edit-villager-officer-field">
            <label htmlFor="nic">NIC:</label>
            <input
              type="text"
              id="nic"
              name="nic"
              value={officer.nic}
              onChange={handleChange}
              placeholder="Enter NIC (optional)"
            />
          </div>
          <div className="edit-villager-officer-field">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={officer.dob}
              onChange={handleChange}
            />
          </div>
          <div className="edit-villager-officer-field">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={officer.address}
              onChange={handleChange}
              placeholder="Enter Address (optional)"
            />
          </div>
          <div className="edit-villager-officer-field">
            <label htmlFor="regional_division">Regional Division:</label>
            <input
              type="text"
              id="regional_division"
              name="regional_division"
              value={officer.regional_division}
              onChange={handleChange}
              placeholder="Enter Regional Division (optional)"
            />
          </div>
          <div className="edit-villager-officer-field">
            <label htmlFor="status">Status:</label>
            <select id="status" name="status" value={officer.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="edit-villager-officer-field">
            <label htmlFor="area_id">Area ID:</label>
            <input
              type="text"
              id="area_id"
              name="area_id"
              value={officer.area_id}
              onChange={handleChange}
              placeholder="Enter Area ID (optional)"
            />
          </div>
          <div className="edit-villager-officer-actions">
            <button type="submit" className="edit-villager-officer-submit-btn">Update Officer</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditSecretaryVillagerOfficer;