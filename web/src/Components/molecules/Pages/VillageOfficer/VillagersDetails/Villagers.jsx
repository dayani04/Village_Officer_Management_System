import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerApi from '../../../../../api/villager';
import { TbEdit, TbEye, TbTrash } from 'react-icons/tb';
import './Villagers.css';

const Villagers = () => {
  const navigate = useNavigate();
  const [villagers, setVillagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVillagersData = async () => {
      try {
        const data = await villagerApi.fetchVillagers();
        setVillagers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching villagers:', err);
        setError(err.error || 'Failed to fetch villager data');
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

    fetchVillagersData();
  }, []);

  const handleDelete = async (villagerId) => {
    if (!window.confirm('Are you sure you want to delete this villager?')) return;

    try {
      await villagerApi.deleteVillager(villagerId);
      setVillagers(villagers.filter((villager) => villager.Villager_ID !== villagerId));
      toast.success('Villager deleted successfully', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error deleting villager:', err);
      toast.error(err.error || 'Failed to delete villager', {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/VillageOfficerDashBoard');
  };

  if (loading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="villagers-container">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="villagers-container">
          <h1>All Villagers</h1>
          <p>Error: {error}</p>
          <div className="villagers-actions">
            <button className="villagers-back-btn" onClick={handleBack}>
              Back to Dashboard
            </button>
          </div>
          <Toaster />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full flex flex-col p-4">
      <div className="villagers-container">
        <h1>All Villagers</h1>
     
          <table className="villagers-table">
            <thead>
              <tr>
                <th>Villager Name</th>
                <th>ID</th>
                <th>Area ID</th>
                <th>Address</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Election Participant</th>
                <th>Regional Division</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {villagers.length > 0 ? (
                villagers.map((villager) => (
                  <tr key={villager.Villager_ID}>
                    <td>{villager.Full_Name || 'N/A'}</td>
                    <td>{villager.Villager_ID || 'N/A'}</td>
                    <td>{villager.Area_ID || 'N/A'}</td>
                    <td>{villager.Address || 'N/A'}</td>
                    <td>{villager.Email || 'N/A'}</td>
                    <td>{villager.Phone_No || 'N/A'}</td>
                    <td>{villager.IsParticipant ? 'Yes' : 'No'}</td>
                    <td>{villager.RegionalDivision || 'N/A'}</td>
                    <td>
                      <div className="villagers-action-buttons">
                        <button
                          className="villagers-edit-btn"
                          onClick={() => navigate(`/Villagers/Edit/${villager.Villager_ID}`)}
                          title="Edit"
                        >
                          <TbEdit />
                        </button>
                        <button
                          className="villagers-view-btn"
                          onClick={() => navigate(`/Villagers/View/${villager.Villager_ID}`)}
                          title="View"
                        >
                          <TbEye />
                        </button>
                        <button
                          className="villagers-delete-btn"
                          onClick={() => handleDelete(villager.Villager_ID)}
                          title="Delete"
                        >
                          <TbTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="villagers-no-data">
                    No villagers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Toaster />
   
    </section>
  );
};

export default Villagers;