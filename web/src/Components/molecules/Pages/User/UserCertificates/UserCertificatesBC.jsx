import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UserCertificatesBC.css';

const UserCertificatesBC = () => {
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

  // Navigate to previous page
  const handleBack = () => {
    navigate('/UserIDCard');
  };

  // Validate file and handle form submission
  const handleSubmit = () => {
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: t('uploadRequiredTitleBC'),
        text: t('uploadRequiredMessageBC'), // Add this key to translations
        confirmButtonText: t('ok'),
      });
      return;
    }

    const validExtensions = ['pdf', 'jpg', 'png'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      Swal.fire({
        icon: 'error',
        title: t('uploadRequiredTitleBC'),
        text: t('uploadRequiredMessageBC'), // Add this key to translations
        confirmButtonText: t('ok'),
      });
      return;
    }

    // If validation passes
    Swal.fire({
      title: t('submissionSuccessTitle'),
      text: t('submissionSuccessMessage'),
      icon: 'success',
      confirmButtonText: t('ok'),
    });
  };

  return (
    <div className="user-certificates-bc-page">
      <h1 className="certificates-bc-form-title">{t('FormTitleBC')}</h1>

      <div className="language-certificates-bc-selector">
        <button onClick={() => changeLanguage('en')} className="language-certificates-bc-btn">English</button>
        <button onClick={() => changeLanguage('si')} className="language-certificates-bc-btn">සිංහල</button>
      </div>

      <form className="certificates-bc-form-content">
        {/* File Upload Section */}
        <div className="file-certificates-bc-upload-section">
          <input
            type="file"
            id="file-upload"
            accept=".pdf, .jpg, .png"
            onChange={handleFileChange}
            className="file-certificates-bc-input-field"
          />
          {file && (
            <div className="file-certificates-bc-info">
              <span className="file-certificates-bc-name">{file.name}</span>
              <a
                href={URL.createObjectURL(file)}
                download={file.name}
                className="file-certificates-bc-download-link"
              >
                <br />
                {t('downloadLink')}
              </a>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="form-certificates-bc-buttons-section">
          <button
            type="button"
            className="upload-certificates-bc-btn"
            onClick={handleFileClick}
          >
            📎 {t('uploadBCButton')}
          </button>

          {file && (
            <button
              type="button"
              className="delete-certificates-bc-btn"
              onClick={handleDelete}
            >
              {t('delete')}
            </button>
          )}

          <div className="navigation-certificates-bc-buttons">
            <button
              type="button"
              className="back-certificates-bc-btn"
              onClick={handleBack}
            >
              {t('back')}
            </button>
            <button
              type="button"
              className="submit-certificates-bc-btn"
              onClick={handleSubmit}
            >
              {t('submit')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserCertificatesBC;
