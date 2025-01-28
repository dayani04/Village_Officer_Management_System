import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Swal from 'sweetalert2'; // Import SweetAlert2
import './UserPermit.css';

const UserPermits = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate(); // Initialize useNavigate

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUploadClick = () => {
    if (!formData.email) {
      Swal.fire({
        icon: 'error',
        title: t('formValidationTitle'),
        text: t('formValidationMessage'),
        confirmButtonText: t('ok'),
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: t('formValidationTitle'),
        text: t('formValidationMessage'),
        confirmButtonText: t('ok'),
      });
      return;
    }
{ navigate('/UserPermitsPR'); // Navigate to the next page}
       
     
}
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang); // Change language through the context
  };

  return (
    <div>
      <br /> <br />
      <h1 className="form-permits-title">{t('permitsFormTitle')}</h1> <br />
      <div className="user-permits-container">
        <div className="language-permits-switch">
          <button onClick={() => handleLanguageChange('en')}>English</button>
          <button onClick={() => handleLanguageChange('si')}>සිංහල</button>
        </div>

        <form className="permits-form">
          {/* Email Input */}
          <div className="form-permits-group">
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
          <div className="form-permits-group">
            <label htmlFor="type">{t('permittypeLabel')}</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                {t('selectPermitType')}
              </option>
              <option value="SandPermit">{t('SandPermit')}</option>
              <option value="TreeCuttingPermit">{t('TreeCuttingPermit')}</option>
              <option value="LandUsePermit">{t('LandUsePermit')}</option>
              <option value="VehicleTravelPermit">{t('VehicleTravelPermit')}</option>
            </select>
          </div>

          {/* Upload Button */}
          <div className="form-permit-group">
            
            <button
              type="button"
              className="upload-permit-button"
              onClick={handleUploadClick} // On button click, validate and navigate
            >
              {t('next')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPermits;
