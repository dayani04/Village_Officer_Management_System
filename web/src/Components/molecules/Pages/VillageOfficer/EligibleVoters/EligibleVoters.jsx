import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import * as villagerApi from '../../../../../api/villager';
import { TbMail } from 'react-icons/tb';
import './EligibleVoters.css';

const EligibleVoters = () => {
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sentNotifications, setSentNotifications] = useState(new Set());

  useEffect(() => {
    const fetchVotersData = async () => {
      try {
        const data = await villagerApi.fetchVillagers();
        const eligibleVoters = data.filter((villager) => {
          if (!villager.DOB || typeof villager.DOB !== 'string') return false;
          const dob = new Date(villager.DOB);
          if (isNaN(dob.getTime())) return false; // Skip invalid dates
          const today = new Date('2025-05-25');
          const age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();
          const dayDiff = today.getDate() - dob.getDate();
          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            return age - 1 === 18;
          }
          return age === 18;
        });
        setVoters(eligibleVoters);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching voters:', err);
        setError(err.error || 'Failed to fetch voter data');
        setLoading(false);
        toast.error(err.error || 'Failed to fetch voter data', {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };

    fetchVotersData();
  }, []);

  const handleSendNotification = async (villagerId, fullName) => {
    try {
      const message = 'Congratulations on turning 18! You are now eligible to vote.';
      await villagerApi.sendNotification(villagerId, message);
      setSentNotifications((prev) => new Set(prev).add(villagerId));
      toast.success(`Notification sent to ${fullName}`, {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error sending notification:', err);
      toast.error(err.error || 'Failed to send notification', {
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

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== 'string') return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  const calculateAge = (dob) => {
    if (!dob || typeof dob !== 'string') return 'N/A';
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) return 'N/A';
    const today = new Date('2025-05-25');
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="eligible-voters-container">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full h-full flex items-center justify-center">
        <div className="eligible-voters-container">
          <h1>Voters (Age 18)</h1>
          <p>Error: {error}</p>
          <div className="eligible-voters-actions">
            <button className="eligible-voters-back-btn" onClick={handleBack}>
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
      <div className="eligible-voters-container">
        <h1>Voters (Age 18)</h1>
        <div className="eligible-voters-table-wrapper">
          <table className="eligible-voters-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Address</th>
                <th>DOB</th>
                <th>Age</th>
                <th>Regional Division</th>
                <th>Status</th>
                <th>Area ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {voters.length > 0 ? (
                voters.map((voter) => (
                  <tr key={voter.Villager_ID}>
                    <td>{voter.Villager_ID || 'N/A'}</td>
                    <td>{voter.Full_Name || 'N/A'}</td>
                    <td>{voter.Address || 'N/A'}</td>
                    <td>{formatDate(voter.DOB)}</td>
                    <td>{calculateAge(voter.DOB)}</td>
                    <td>{voter.RegionalDivision || 'N/A'}</td>
                    <td>{voter.Status || 'N/A'}</td>
                    <td>{voter.Area_ID || 'N/A'}</td>
                    <td>
                      <div className="eligible-voters-action-buttons">
                        <button
                          className={`eligible-voters-send-btn ${sentNotifications.has(voter.Villager_ID) ? 'sent' : ''}`}
                          onClick={() => handleSendNotification(voter.Villager_ID, voter.Full_Name)}
                          title="Send Notification"
                        >
                          <TbMail />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="eligible-voters-no-data">
                    No voters aged 18 found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="eligible-voters-actions">
          <button className="eligible-voters-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
    </section>
  );
};

export default EligibleVoters;