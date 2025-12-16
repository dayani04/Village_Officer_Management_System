import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Swal from 'sweetalert2';
import * as villagerApi from '../../../../../api/villager';
import './FamilyDetails.css';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const NewFamilyMemberRequest = () => {
  const [formData, setFormData] = useState({
    relationship: '',
    document: null,
    residenceCertificate: null,
  });
  const navigate = useNavigate();

  const handleBack = () => navigate('/family_details');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('relationship', formData.relationship);
    data.append('document', formData.document);
    data.append('residenceCertificate', formData.residenceCertificate);

    try {
      const response = await villagerApi.requestNewFamilyMember(data);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'New family member request submitted successfully',
        confirmButtonColor: '#4caf50',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        navigate('/family_details');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: err.error || 'Failed to submit request',
        confirmButtonColor: '#f43f3f',
      });
    }
  };

  return (
    <section>
      <NavBar />
      <br/>
      <div className="profile-hero">
        <button className="back-button" onClick={handleBack} title="Back to Family Details">
          <FaArrowLeft />
        </button>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="village-title">Request for New Family Member</h1>
          </div>
        </div>
      </div>
      <br/>
      <div className="family-details-container">
        <form onSubmit={handleSubmit} className="new-family-member-form">
          <div>
            <label>Relationship to Family Member:</label>
            <input
              type="text"
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Birth Certificate or NIC (PDF, PNG, JPG):</label>
            <input
              type="file"
              name="document"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              required
            />
          </div>
          <div>
            <label>Residence Confirmation Certificate (PDF, PNG, JPG):</label>
            <input
              type="file"
              name="residenceCertificate"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Submit Request</button>
            <button type="button" onClick={() => navigate('/family_details')}>Cancel</button>
          </div>
        </form>
      </div>
      <Footer/>
    </section>
  );
};

export default NewFamilyMemberRequest;