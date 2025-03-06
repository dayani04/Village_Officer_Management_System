import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UserIDCardBC.css';

const UserIDCardBC = () => {
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

  // Handle form submission with validation
  const handleSubmit = () => {
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: t('uploadRequiredTitleBC'), // Translation key for "Validation Error"
        text: t('uploadRequiredMessageBC'), // Translation key for "Please upload a file before submitting."
        confirmButtonText: t('ok'), // Translation key for "OK"
      });
      return;
    }

    // If validation passes, show success alert
    Swal.fire({
      title: t('submissionSuccessTitle'), // Translation key for "Success"
      text: t('submissionSuccessMessage'), // Translation key for "Your file has been successfully submitted."
      icon: 'success',
      confirmButtonText: t('ok'), // Translation key for "OK"
    });
  };

  return (
    <div className="user-idcard-bc-page">
      <h1 className="idcard-bc-form-title">{t('FormTitleBC')}</h1>

      <div className="language-idcard-bc-selector">
        <button onClick={() => changeLanguage('en')} className="language-election-id-btn">English</button>
        <button onClick={() => changeLanguage('si')} className="language-election-id-btn">සිංහල</button>
      </div>

      <form className="idcard-bc-form-content">
        {/* File Upload Section */}
        <div className="file-idcard-bc-upload-section">
          <input
            type="file"
            id="file-upload"
            accept=".pdf, .jpg, .png"
            onChange={handleFileChange}
            className="file-idcard-bc-input-field"
          />
          {file && (
            <div className="file-idcard-bc-info">
              <span className="file-idcard-bc-name">{file.name}</span>
              <a
                href={URL.createObjectURL(file)}
                download={file.name}
                className="file-idcard-bc-download-link"
              >
                <br />
                {t('downloadLink')}
              </a>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="form-idcard-bc-buttons-section">
          <button
            type="button"
            className="upload-idcard-bc-btn"
            onClick={handleFileClick}
          >
            📎 {t('uploadBCButton')}
          </button>

          {file && (
            <button
              type="button"
              className="delete-idcard-bc-btn"
              onClick={handleDelete}
            >
              {t('delete')}
            </button>
          )}

          <div className="navigation-idcard-bc-buttons">
            <button
              type="button"
              className="back-idcard-bc-btn"
              onClick={handleBack}
            >
              {t('back')}
            </button>
            <button
              type="button"
              className="submit-idcard-bc-btn"
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

export default UserIDCardBC;
