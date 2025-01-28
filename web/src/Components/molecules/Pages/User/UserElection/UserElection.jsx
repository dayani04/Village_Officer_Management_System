import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Swal from 'sweetalert2'; // Import SweetAlert for validation
import './UserElection.css';

const UserElection = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();  // Initialize useNavigate

  const [formData, setFormData] = useState({
    email: '',
    type: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUploadClick = () => {
    // Validate that email and election type are filled
    if (!formData.email || !formData.type) {
      Swal.fire({
        title: t('formValidationTitle'),
        text: t('formValidationMessage'),
        icon: 'error',
        confirmButtonText: t('ok'),
      });
    } else {
      // If validated, navigate to the next page
      navigate('/UserElectionID');
    }
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);  // Change language through the context
  };

  return (
    <div>
      <br /> <br /> <h1 className="form-title">{t('electionFormTitle')}</h1> <br />
      <div className="user-election-container">
        <div className="language-switch">
          <button onClick={() => handleLanguageChange('en')}>English</button>
          <button onClick={() => handleLanguageChange('si')}>සිංහල</button>
        </div>

        <form className="election-form">
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">{t('emailLabel')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t('emailPlaceholder')}
              required
            />
          </div>

          {/* Election Type Selection */}
          <div className="form-group">
            <label htmlFor="type">{t('typeLabel')}</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                {t('selectType')}
              </option>
              <option value="parliament">{t('parliamentElection')}</option>
              <option value="presidential">{t('presidentialElection')}</option>
              <option value="local">{t('localElection')}</option>
              <option value="division">{t('divisionElection')}</option>
            </select>
          </div>

          {/* Upload Button */}
          <div className="form-group">
        
            <button
              type="button"
              className="upload-button"
              onClick={handleUploadClick}  // On button click, navigate to UserElectionBC page
            >
              {t('next')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserElection;
