import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerApi from '../../../../../api/villager';
import './EditVillager.css';

const EditVillager = () => {
  const { villagerId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    address: '',
    regional_division: '',
    status: 'Active',
    is_election_participant: false,
    alive_status: 'Alive',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchVillagerData = async () => {
      try {
        const data = await villagerApi.fetchVillager(villagerId);
        setFormData({
          full_name: data.Full_Name || '',
          email: data.Email || '',
          phone_no: data.Phone_No || '',
          address: data.Address || '',
          regional_division: data.RegionalDivision || '',
          status: data.Status || 'Active',
          is_election_participant: Boolean(data.IsParticipant),
          alive_status: data.Alive_Status || 'Alive',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching villager:', err);
        setFetchError(err.error || 'Failed to fetch villager data');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch villager data', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchVillagerData();
  }, [villagerId]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone_no) newErrors.phone_no = 'Phone Number is required';
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
      await villagerApi.updateVillager(villagerId, formData);
      toast.success('Villager updated successfully', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      setTimeout(() => navigate('/Villagers'), 1500);
    } catch (err) {
      console.error('Error updating villager:', err);
      toast.error(err.error || 'Failed to update villager', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/Villagers');
  };

  if (loading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="edit-villager-container">Loading...</div>
      </section>
    );
  }

  if (fetchError) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="edit-villager-container">
          <h1>Edit Villager</h1>
          <p>Error: {fetchError}</p>
          <div className="edit-villager-actions">
            <button className="edit-villager-back-btn" onClick={handleBack}>
              Back to Villagers
            </button>
          </div>
          <Toaster />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="edit-villager-container">
        <h1>Edit Villager</h1>
        <form className="edit-villager-form" onSubmit={handleSubmit}>
          <div className="edit-villager-field">
            <label htmlFor="full_name">Full Name:</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter Full Name"
            />
            {errors.full_name && <span className="edit-villager-error">{errors.full_name}</span>}
          </div>
          <div className="edit-villager-field">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
            />
            {errors.email && <span className="edit-villager-error">{errors.email}</span>}
          </div>
          <div className="edit-villager-field">
            <label htmlFor="phone_no">Phone Number:</label>
            <input
              type="text"
              id="phone_no"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              placeholder="Enter Phone Number"
            />
            {errors.phone_no && <span className="edit-villager-error">{errors.phone_no}</span>}
          </div>
          <div className="edit-villager-field">
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
          <div className="edit-villager-field">
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
          <div className="edit-villager-field">
            <label htmlFor="status">Status:</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="edit-villager-field">
            <label htmlFor="is_election_participant">Election Participant:</label>
            <input
              type="checkbox"
              id="is_election_participant"
              name="is_election_participant"
              checked={formData.is_election_participant}
              onChange={handleChange}
            />
          </div>
          <div className="edit-villager-field">
            <label htmlFor="alive_status">Alive Status:</label>
            <select id="alive_status" name="alive_status" value={formData.alive_status} onChange={handleChange}>
              <option value="Alive">Alive</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
          <div className="edit-villager-actions">
            <button type="submit" className="edit-villager-submit-btn">Update Villager</button>
            <button type="button" className="edit-villager-back-btn" onClick={handleBack}>Back</button>
          </div>
        </form>
        <Toaster />
      </div>
    </section>
  );
};

export default EditVillager;