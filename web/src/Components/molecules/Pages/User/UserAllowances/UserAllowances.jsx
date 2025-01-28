import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Swal from 'sweetalert2'; // Import SweetAlert2
import './UserAllowances.css';

const UserAllowances = () => {
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
      navigate('/UserAllowancesBC'); // Navigate after success
    }
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);  // Change language through the context
  };

  return (
    <div>
      <br /> <br /> <h1 className="form-allowances-title">{t('allowancesFormTitle')}</h1> <br />
      <div className="user-allowances-container">
        <div className="language-allowances-switch">
          <button onClick={() => handleLanguageChange('en')}>English</button>
          <button onClick={() => handleLanguageChange('si')}>සිංහල</button>
        </div>

        <form className="allowances-form">
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

          {/* Allowance Type Selection */}
          <div className="form-allowances-group">
            <label htmlFor="type">{t('allowancesLabel')}</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                {t('selectAllowancesType')}
              </option>
              <option value="Adult">{t('adultAllowances')}</option>
              <option value="Disabled">{t('disabledAllowances')}</option>
              <option value="Widow">{t('WidowAllowances')}</option>
              <option value="NutritionalAndFood">{t('NutritionalAndFoodAllowance')}</option>
              <option value="AgricultureandFarmingSubsidies">{t('AgricultureandFarmingSubsidiesAllowances')}</option>
            </select>
          </div>

          {/* Next Button */}
          <div className="form-allowances-group">
            <button
              type="button"
              className="upload-allowances-button"
              onClick={handleUploadClick}  // On button click, validate and navigate
            >
              {t('next')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAllowances;
