import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './UserPermitsID.css';

const UserPermitsID = () => {
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
    navigate('/UserPermitsPR');
  };

  // Handle form submission with validation
  const handleSubmit = () => {
    if (!file) {
      Swal.fire({
        title: t('uploadRequiredTitleID'), // Translation key for validation error title
        text: t('uploadRequiredMessageID'), // Translation key for file required message
        icon: 'error',
        confirmButtonText: t('ok'), // Translation key for 'OK' button
      });
      return;
    }

    Swal.fire({
      title: t('submissionSuccessTitle'), // Translation key for success title
      text: t('submissionSuccessMessage'), // Translation key for success message
      icon: 'success',
      confirmButtonText: t('ok'),
    });
  };

  return (
    <div className="user-permit-id-page">
      <h1 className="permit-id-form-title">{t('electionFormTitleID')}</h1>

      <div className="language-permit-id-selector">
        <button onClick={() => changeLanguage('en')} className="language-permit-id-btn">
          English
        </button>
        <button onClick={() => changeLanguage('si')} className="language-permit-id-btn">
          සිංහල
        </button>
      </div>

      <form className="permit-id-form-content">
        {/* File Upload Section */}
        <div className="file-permit-id-upload-section">
          <input
            type="file"
            id="file-upload"
            accept=".pdf, .jpg, .png"
            onChange={handleFileChange}
            className="file-permit-id-input-field"
          />
          {file && (
            <div className="file-permit-id-info">
              <span className="file-permit-id-name">{file.name}</span>
              <a
                href={URL.createObjectURL(file)}
                download={file.name}
                className="file-permit-id-download-link"
              >
                <br />
                {t('downloadLink')}
              </a>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="form-permit-id-buttons-section">
          <button
            type="button"
            className="upload-permit-id-btn"
            onClick={handleFileClick}
          >
            📎 {t('uploadIDButton')}
          </button>

          {file && (
            <button
              type="button"
              className="delete-permit-id-btn"
              onClick={handleDelete}
            >
              {t('delete')}
            </button>
          )}

          <div className="navigation-permit-id-buttons">
            <button
              type="button"
              className="back-permit-id-btn"
              onClick={handleBack}
            >
              {t('back')}
            </button>
            <button
              type="button"
              className="submit-permit-id-btn"
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

export default UserPermitsID;
