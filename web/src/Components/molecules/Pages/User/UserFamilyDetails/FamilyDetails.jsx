import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
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
        const profile = await villagerApi.getProfile();
        const { Address, Latitude, Longitude } = profile;
        const allVillagers = await villagerApi.fetchVillagers();
        const family = allVillagers.filter(
          villager =>
            villager.Address === Address &&
            villager.Latitude === Latitude &&
            villager.Longitude === Longitude &&
            villager.Villager_ID !== profile.Villager_ID
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

  const handleBack = () => navigate('/user_dashboard');

  const handleNewBornRequest = () => navigate('/family-new-born-request');
  const handleNewFamilyMemberRequest = () => navigate('/family-new-family-member-request');

  if (loading) return <div className="family-details-container">Loading...</div>;
  if (error) return <div className="family-details-container">Error: {error}</div>;

  return (
    <section>
      <NavBar />
      <br/>
      <div className="profile-hero">
        <button className="back-button" onClick={handleBack} title="Back to Dashboard">
          <FaArrowLeft />
        </button>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="village-title">Family Members</h1>
          </div>
        </div>
      </div>
      <br/>

      <div className="family-details-container">

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
                <p><strong>Election Participate:</strong> {villager.IsParticipant ? 'Yes' : 'No'}</p>
                <hr />
              </div>
            ))}
          </div>
        )}
        <div className="family-details-actions">
          <button className="back-buttonf" onClick={handleNewBornRequest}>
            Request For New Born
          </button>
          <button className="back-buttonf" onClick={handleNewFamilyMemberRequest}>
            Request For New Family Member
          </button>

        </div>
      </div>
      <Footer />
    </section>
  );
};

export default FamilyDetails;