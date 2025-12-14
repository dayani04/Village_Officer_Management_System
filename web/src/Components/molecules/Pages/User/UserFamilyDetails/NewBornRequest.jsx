import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import * as villagerApi from '../../../../../api/villager';
import './FamilyDetails.css';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const NewBornRequest = () => {
  const [formData, setFormData] = useState({
    relationship: '',
    birthCertificate: null,
    motherNic: null,
    fatherNic: null,
    marriageCertificate: null,
    residenceCertificate: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('relationship', formData.relationship);
    data.append('birthCertificate', formData.birthCertificate);
    data.append('motherNic', formData.motherNic);
    data.append('fatherNic', formData.fatherNic);
    data.append('marriageCertificate', formData.marriageCertificate);
    data.append('residenceCertificate', formData.residenceCertificate);

    try {
      const response = await villagerApi.requestNewBorn(data);
      setSuccess('New born request submitted successfully');
      setTimeout(() => navigate('/family_details'), 2000);
    } catch (err) {
      setError(err.error || 'Failed to submit request');
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
            <h1 className="village-title">Request for New Born</h1>
          </div>
        </div>
      </div>
      <br/>
      <div className="family-details-container">
       
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit} className="new-born-form">
          <div>
            <label>Relationship to Newborn:</label>
            <input
              type="text"
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Birth Certificate (PDF, PNG, JPG):</label>
            <input
              type="file"
              name="birthCertificate"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              required
            />
          </div>
          <div>
            <label>Mother's NIC (PDF, PNG, JPG):</label>
            <input
              type="file"
              name="motherNic"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              required
            />
          </div>
          <div>
            <label>Father's NIC (PDF, PNG, JPG):</label>
            <input
              type="file"
              name="fatherNic"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              required
            />
          </div>
          <div>
            <label>Marriage Certificate (PDF, PNG, JPG):</label>
            <input
              type="file"
              name="marriageCertificate"
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

export default NewBornRequest;