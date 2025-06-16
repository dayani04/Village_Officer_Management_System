import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as villagerApi from '../../../../../api/villager';
import './FamilyDetails.css';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const FamilyDetails = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        // Fetch logged-in villager's profile
        const profile = await villagerApi.getProfile();
        const { Address, Latitude, Longitude } = profile;

        // Fetch all villagers
        const allVillagers = await villagerApi.fetchVillagers();

        // Filter villagers with the same Address, Latitude, and Longitude
        const family = allVillagers.filter(
          villager =>
            villager.Address === Address &&
            villager.Latitude === Latitude &&
            villager.Longitude === Longitude &&
            villager.Villager_ID !== profile.Villager_ID // Exclude the logged-in villager
        );

        setFamilyMembers(family);
        setLoading(false);
      } catch (err) {
        setError(err.error || 'Failed to fetch family members');
        setLoading(false);
      }
    };

    fetchFamilyMembers();
  }, []);

  const handleBack = () => {
    navigate('/user_dashboard');
  };

  if (loading) {
    return <div className="family-details-container">Loading...</div>;
  }

  if (error) {
    return <div className="family-details-container">Error: {error}</div>;
  }

  return (
    <section>
      <NavBar/>
    <div className="family-details-container">
      <h2>Family Members</h2>
      {familyMembers.length === 0 ? (
        <p>No family members found at your address.</p>
      ) : (
        <div className="family-members-list">
          {familyMembers.map(villager => (
            <div key={villager.Villager_ID} className="family-member">
              <h4>{villager.Full_Name}</h4>
              <p><strong>Address:</strong> {villager.Address || 'N/A'}</p>
              <p><strong>Email:</strong> {villager.Email}</p>
              <p><strong>Phone:</strong> {villager.Phone_No}</p>
              <p><strong>Coordinates:</strong> Lat: {villager.Latitude}, Lng: {villager.Longitude}</p>
              <p><strong>Election Participate:</strong> {villager.IsParticipant === 1 ? 'Yes' : 'No'}</p>
              <hr />
            </div>
          ))}
        </div>
      )}
      <div className="family-details-actions">
        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
    <Footer/>
    </section>
  );
};

export default FamilyDetails;