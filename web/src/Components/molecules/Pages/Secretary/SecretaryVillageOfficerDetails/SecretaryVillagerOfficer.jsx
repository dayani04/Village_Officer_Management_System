import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerOfficerApi from '../../../../../api/villageOfficer';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import SecretaryDashBoard from '../SecretaryDashBoard/SecretaryDashBoard';
import './SecretaryVillagerOfficer.css';

const SecretaryVillagerOfficer = () => {
  const navigate = useNavigate();
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const data = await villagerOfficerApi.fetchVillageOfficers();
        setOfficers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching village officers:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch village officers');
        setLoading(false);
        toast.error(err.response?.data?.error || 'Failed to fetch village officers', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchOfficers();
  }, []);

  const handleDeleteOfficer = async (id, fullName) => {
    if (!window.confirm(`Are you sure you want to delete ${fullName}?`)) return;
    try {
      await villagerOfficerApi.deleteVillageOfficer(id);
      setOfficers(officers.filter((officer) => officer.Villager_Officer_ID !== id));
      toast.success(`Officer ${fullName} deleted successfully`, {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error deleting village officer:', err);
      toast.error(err.response?.data?.error || 'Failed to delete officer', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleAddOfficer = () => {
    navigate('/secretary-villager-officers/add');
  };

  const handleEditOfficer = (id) => {
    navigate(`/secretary-villager-officers/edit/${id}`);
  };

  const handleViewOfficer = (id) => {
    navigate(`/secretary-villager-officers/view/${id}`);
  };

  const handleBack = () => {
    navigate('/SecretaryDashBoard');
  };

  if (loading) {
    return (
      <div className="page-layout">
        <div className="sidebar">
          <SecretaryDashBoard />
        </div>
        <div className="villager-list-container">
          <div className="villager-officer-container">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-layout">
        <div className="sidebar">
          <SecretaryDashBoard />
        </div>
        <div className="villager-list-container">
          <div className="villager-officer-container">
            <h1>Villager Officers</h1>
            <p className="error-message">{error}</p>
            <div className="villager-officer-actions">
              <button className="villager-officer-back-btn" onClick={handleBack}>
                Back to Dashboard
              </button>
            </div>
            <Toaster />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <div className="sidebar">
        <SecretaryDashBoard />
      </div>
      <div className="villager-list-container">
        <div className="villager-officer-container">
          <h1>Villager Officers</h1>
          <div className="villager-officer-actions">
            <button className="villager-officer-add-btn" onClick={handleAddOfficer}>
              <FaPlus /> Add Officer
            </button>
          </div>
          <div className="villager-officer-table-wrapper">
            <table className="villager-officer-table">
              <thead>
                <tr>
                  <th>Officer ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone No</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {officers.length > 0 ? (
                  officers.map((officer) => (
                    <tr key={officer.Villager_Officer_ID}>
                      <td>{officer.Villager_Officer_ID || 'N/A'}</td>
                      <td>{officer.Full_Name || 'N/A'}</td>
                      <td>{officer.Email || 'N/A'}</td>
                      <td>{officer.Phone_No || 'N/A'}</td>
                      <td>{officer.Status || 'N/A'}</td>
                      <td>
                        <div className="villager-officer-action-buttons">
                          <button
                            className="villager-officer-edit-btn"
                            onClick={() => handleEditOfficer(officer.Villager_Officer_ID)}
                            title="Edit Officer"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="villager-officer-delete-btn"
                            onClick={() => handleDeleteOfficer(officer.Villager_Officer_ID, officer.Full_Name)}
                            title="Delete Officer"
                          >
                            <FaTrash />
                          </button>
                          <button
                            className="villager-officer-view-btn"
                            onClick={() => handleViewOfficer(officer.Villager_Officer_ID)}
                            title="View Officer"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="villager-officer-no-data">
                      No villager officers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="villager-officer-actions">
            <button className="villager-officer-back-btn" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default SecretaryVillagerOfficer;