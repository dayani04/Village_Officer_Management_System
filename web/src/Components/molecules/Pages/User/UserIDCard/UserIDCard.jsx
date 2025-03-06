import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './UserIDCard.css';

const UserIDCard = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();

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
  
    const handleUploadClick = (e) => {
      e.preventDefault();
  
      // Validation
      if (!formData.email || !formData.type) {
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
   {
        navigate('/UserIDCardBC'); // Navigate after success
      }
    };
  
    const handleLanguageChange = (lang) => {
      changeLanguage(lang);  // Change language through the context
    };

  return (
    <div>
      <br />
      <br />
      <h1 className="form-idcard-title">{t('idcardFormTitle')}</h1>
      <br />
      <div className="user-idcard-container">
        <div className="language-idcard-switch">
          <button onClick={() => handleLanguageChange('en')}>English</button>
          <button onClick={() => handleLanguageChange('si')}>සිංහල</button>
        </div>

        <form className="election-idcard-form">
          {/* Email Input */}
          <div className="form-idcard-group">
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
          <div className="form-idcard-group">
            <label htmlFor="type">{t('typeIDcardLabel')}</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                {t('selectIDCardType')}
              </option>
              <option value="postal">{t('postalIdCard')}</option>
              <option value="temporary">{t('NationalIdCard')}</option>
            </select>
          </div>

          {/* Upload Button with Validation */}
          <div className="form-idcard-group">
           
            <button
              type="button"
              className="upload-idcard-button"
              onClick={handleUploadClick}
            >
              {t('next')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserIDCard;
