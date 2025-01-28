import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UserPremitsPR.css';

const UserPermitsPR = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  // Trigger file input click
  const handleFileClick = () => {
    document.getElementById('file-upload').click();
  };

  // Handle file deletion
  const handleDelete = () => {
    setFile(null);
  };

  // Navigate to the previous page
  const handleBack = () => {
    navigate('/UserPermits');
  };

  // Navigate to the next page with validation
  const handleNext = () => {
    if (!file) {
      Swal.fire({
        title: t('uploadRequiredTitlePR'), // Translation key for validation error
        text: t('uploadRequiredMessagePR'), // Translation key for file required message
        icon: 'error',
        confirmButtonText: t('ok'),
      });
      return;
    }

    // Navigate to the next page if validation passes
    navigate('/UserPermitsID');
  };

  return (
    <div className="user-permit-pr-page">
      <h1 className="permit-pr-form-title">{t('permitFormTitlePR')}</h1>

      {/* Language Selector */}
      <div className="language-permit-pr-selector">
        <button onClick={() => changeLanguage('en')} className="language-permit-pr-btn">
          English
        </button>
        <button onClick={() => changeLanguage('si')} className="language-permit-pr-btn">
          සිංහල
        </button>
      </div>

      {/* Form Section */}
      <form className="permit-pr-form-content">
        {/* File Upload Section */}
        <div className="file-permit-pr-upload-section">
          <input
            type="file"
            id="file-upload"
            accept=".pdf, .jpg, .png"
            onChange={handleFileChange}
            className="file-permit-pr-input-field"
            style={{ display: 'none' }} // Hide default file input
          />
          {file && (
            <div className="file-permit-pr-info">
              <span className="file-permit-pr-name">{file.name}</span>
              <a
                href={URL.createObjectURL(file)}
                download={file.name}
                className="file-permit-pr-download-link"
              >
                {t('downloadLink')}
              </a>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="form-permit-pr-buttons-section">
          <button
            type="button"
            className="upload-permit-pr-btn"
            onClick={handleFileClick}
          >
            📎 {t('permitFormTitlePR')}
          </button>

          {file && (
            <button
              type="button"
              className="delete-permit-pr-btn"
              onClick={handleDelete}
            >
              {t('delete')}
            </button>
          )}

          <div className="navigation-permit-pr-buttons">
            <button
              type="button"
              className="back-permit-pr-btn"
              onClick={handleBack}
            >
              {t('back')}
            </button>

            <button
              type="button"
              className="next-permit-pr-btn"
              onClick={handleNext}
            >
              {t('next')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserPermitsPR;
