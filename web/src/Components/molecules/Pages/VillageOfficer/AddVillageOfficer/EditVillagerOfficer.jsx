import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerOfficerApi from '../../../../../api/villageOfficer';
import './EditVillagerOfficer.css';

const EditVillagerOfficer = () => {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError(err.error || 'Failed to fetch officer');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch officer', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchOfficer();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfficer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { full_name, email, phone_no, status } = officer;

    if (!full_name || !email || !phone_no) {
      toast.error('Full Name, Email, and Phone Number are required', {
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
      await villagerOfficerApi.updateVillageOfficer(id, { full_name, email, phone_no, status });
      toast.success('Officer updated successfully', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      navigate('/villager-officers');
    } catch (err) {
      console.error('Error updating officer:', err);
      toast.error(err.error || 'Failed to update officer', {
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

  if (loading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="edit-villager-officer-container">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="edit-villager-officer-container">
          <h1>Edit Villager Officer</h1>
          <p>Error: {error}</p>
          <div className="edit-villager-officer-actions">
            <button className="edit-villager-officer-cancel-btn" onClick={handleCancel}>
              Back to Officers
            </button>
          </div>
          <Toaster />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full flex flex-col p-4">
      <div className="edit-villager-officer-container">
        <h1>Edit Villager Officer</h1>
        <form onSubmit={handleSubmit}>
          <div className="edit-villager-officer-form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={officer.full_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="edit-villager-officer-form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={officer.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="edit-villager-officer-form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone_no"
              value={officer.phone_no}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="edit-villager-officer-form-group">
            <label>NIC</label>
            <input
              type="text"
              name="nic"
              value={officer.nic}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-villager-officer-form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={officer.dob}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-villager-officer-form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={officer.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-villager-officer-form-group">
            <label>Regional Division</label>
            <input
              type="text"
              name="regional_division"
              value={officer.regional_division}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-villager-officer-form-group">
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
          <div className="edit-villager-officer-form-group">
            <label>Area ID</label>
            <input
              type="text"
              name="area_id"
              value={officer.area_id}
              onChange={handleInputChange}
            />
          </div>
          <div className="edit-villager-officer-actions">
            <button type="submit" className="edit-villager-officer-save-btn">
              Update Officer
            </button>
            <button
              type="button"
              className="edit-villager-officer-cancel-btn"
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

export default EditVillagerOfficer;