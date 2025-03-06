import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Swal from 'sweetalert2'; // Import SweetAlert2
import './UserCertificates.css';

const UserCertificates = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    email: '',
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

  const handleUploadClick = (e) => {
    e.preventDefault();

    // Validation
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
        title: t('validationErrorTitle'),
        text: t('invalidEmail'),
        confirmButtonText: t('ok'),
      });
      return;
    }

    // Show SweetAlert and navigate to next page after confirmation
    {
      navigate('/UserCertificatesBC'); // Navigate after success
    }
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang); // Change language through the context
  };

  return (
    <div>
      <br /> <br />
      <h1 className="form-title">{t('certificatesFormTitle')}</h1> <br />
      <div className="user-certificates-container">
        <div className="language-certificates-switch">
          <button onClick={() => handleLanguageChange('en')}>English</button>
          <button onClick={() => handleLanguageChange('si')}>සිංහල</button>
        </div>

        <form className="certificates-form">
          {/* Email Input */}
          <div className="form-certificates-group">
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

          {/* Upload Button */}
          <div className="form-certificates-group">
            <button
              type="button"
              className="upload-certificates-button"
              onClick={handleUploadClick} // Call handleUploadClick on button click
            >
              {t('next')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserCertificates;

