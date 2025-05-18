import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../../../../api/villager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import './RemoveVillager.css';

const MySwal = withReactContent(Swal);

const RemoveVillager = () => {
  const [villagers, setVillagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVillagersData = async () => {
      try {
        const data = await api.fetchVillagers();
        setVillagers(data);
        setLoading(false);
      } catch (err) {
        setError(err.error || 'Failed to fetch villagers');
        setLoading(false);
      }
    };

    fetchVillagersData();
  }, []);

  const handleView = async (villager) => {
    MySwal.fire({
      title: 'Villager Details',
      html: (
        <div className="swal-villager-details">
          <p><strong>Villager ID:</strong> {villager.Villager_ID}</p>
          <p><strong>Full Name:</strong> {villager.Full_Name}</p>
          <p><strong>Email:</strong> {villager.Email}</p>
          <p><strong>Phone Number:</strong> {villager.Phone_No}</p>
          <p><strong>NIC:</strong> {villager.NIC || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> {villager.DOB ? new Date(villager.DOB).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Address:</strong> {villager.Address || 'N/A'}</p>
          <p><strong>Regional Division:</strong> {villager.RegionalDivision || 'N/A'}</p>
          <p><strong>Status:</strong> {villager.Status}</p>
          <p><strong>Area ID:</strong> {villager.Area_ID || 'N/A'}</p>
          <p><strong>Location:</strong> {villager.Latitude && villager.Longitude ? `Lat: ${villager.Latitude.toFixed(8)}, Lng: ${villager.Longitude.toFixed(8)}` : 'Not set'}</p>
          <p><strong>Election Participant:</strong> {villager.IsParticipant ? 'Yes' : 'No'}</p>
          <p><strong>Alive Status:</strong> {villager.Alive_Status || 'N/A'}</p>
        </div>
      ),
      showConfirmButton: true,
      confirmButtonText: 'Close',
      customClass: {
        popup: 'swal-popup',
        confirmButton: 'swal-confirm-button',
      },
    });
  };

  const handleEdit = async (villager) => {
    const { value: formValues } = await MySwal.fire({
      title: 'Edit Villager',
      html: (
        <div className="swal-form">
          <div className="swal-form-field">
            <label>Full Name</label>
            <input
              id="full_name"
              type="text"
              defaultValue={villager.Full_Name}
              className="swal2-input"
              required
            />
          </div>
          <div className="swal-form-field">
            <label>Email</label>
            <input
              id="email"
              type="email"
              defaultValue={villager.Email}
              className="swal2-input"
              required
            />
          </div>
          <div className="swal-form-field">
            <label>Phone Number</label>
            <input
              id="phone_no"
              type="tel"
              defaultValue={villager.Phone_No}
              className="swal2-input"
              required
            />
          </div>
          <div className="swal-form-field">
            <label>Address</label>
            <input
              id="address"
              type="text"
              defaultValue={villager.Address || ''}
              className="swal2-input"
            />
          </div>
          <div className="swal-form-field">
            <label>Regional Division</label>
            <input
              id="regional_division"
              type="text"
              defaultValue={villager.RegionalDivision || ''}
              className="swal2-input"
            />
          </div>
          <div className="swal-form-field">
            <label>Status</label>
            <select id="status" defaultValue={villager.Status} className="swal2-select">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="swal-form-field">
            <label>Alive Status</label>
            <select id="alive_status" defaultValue={villager.Alive_Status} className="swal2-select">
              <option value="Alive">Alive</option>
              <option value="Deceased">Deceased</option>
            </select>
          </div>
          <div className="swal-form-field">
            <label>Election Participant</label>
            <input
              id="is_election_participant"
              type="checkbox"
              defaultChecked={villager.IsParticipant}
              className="swal2-checkbox"
            />
          </div>
        </div>
      ),
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal-popup',
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button',
      },
      preConfirm: () => {
        const full_name = document.getElementById('full_name').value;
        const email = document.getElementById('email').value;
        const phone_no = document.getElementById('phone_no').value;
        const address = document.getElementById('address').value;
        const regional_division = document.getElementById('regional_division').value;
        const status = document.getElementById('status').value;
        const alive_status = document.getElementById('alive_status').value;
        const is_election_participant = document.getElementById('is_election_participant').checked;

        if (!full_name || !email || !phone_no) {
          Swal.showValidationMessage('Full Name, Email, and Phone Number are required');
          return false;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage('Invalid email format');
          return false;
        }

        return {
          full_name,
          email,
          phone_no,
          address: address || null,
          regional_division: regional_division || null,
          status,
          is_election_participant,
          alive_status,
        };
      },
    });

    if (formValues) {
      try {
        await api.updateVillager(villager.Villager_ID, formValues);
        setVillagers(
          villagers.map((v) =>
            v.Villager_ID === villager.Villager_ID
              ? { ...v, ...formValues, IsParticipant: formValues.is_election_participant }
              : v
          )
        );
        MySwal.fire('Success', 'Villager updated successfully', 'success');
      } catch (err) {
        MySwal.fire('Error', err.error || 'Failed to update villager', 'error');
      }
    }
  };

  const handleDelete = async (villagerId) => {
    if (!window.confirm('Are you sure you want to delete this villager?')) {
      return;
    }

    try {
      await api.deleteVillager(villagerId);
      setVillagers(villagers.filter((villager) => villager.Villager_ID !== villagerId));
      setError('');
    } catch (err) {
      setError(err.error || 'Failed to delete villager');
    }
  };

  const handleBack = () => {
    navigate('/UserDashboard');
  };

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Villager Action Page</h1>
      {error && <div className="error-message">{error}</div>}
      {villagers.length === 0 && !error ? (
        <p>No villagers found.</p>
      ) : (
        <div className="villager-table-container">
          <table className="villager-table">
            <thead>
              <tr>
                <th>Villager ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>NIC</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {villagers.map((villager) => (
                <tr key={villager.Villager_ID}>
                  <td>{villager.Villager_ID}</td>
                  <td>{villager.Full_Name}</td>
                  <td>{villager.Email}</td>
                  <td>{villager.Address || 'N/A'}</td>
                  <td>{villager.NIC || 'N/A'}</td>
                  <td className="action-column">
                    <button
                      className="action-button view-button"
                      onClick={() => handleView(villager)}
                      title="View"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEdit(villager)}
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(villager.Villager_ID)}
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="form-buttons">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default RemoveVillager;