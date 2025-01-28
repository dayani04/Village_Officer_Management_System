import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UserElectionID.css';

const UserElectionID = () => {
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
    navigate('/UserElection');
  };

  // Handle form submission with validation
  const handleSubmit = () => {
    if (!file) {
      Swal.fire({
        title: t('uploadRequiredTitleID'),
        text: t('uploadRequiredMessageID'),
        icon: 'error',
        confirmButtonText: t('ok'),
      });
      return;
    }

    Swal.fire({
      title: t('submissionSuccessTitle'),
      text: t('submissionSuccessMessage'),
      icon: 'success',
      confirmButtonText: t('ok'),
    });
  };

  return (
    <div className="user-election-id-page">
      <h1 className="election-id-form-title">{t('electionFormTitleID')}</h1>

      <div className="language-election-id-selector">
        <button onClick={() => changeLanguage('en')} className="language-election-id-btn">English</button>
        <button onClick={() => changeLanguage('si')} className="language-election-id-btn">සිංහල</button>
      </div>
      <p className="red-election-id-text">{t('idLicensePassportText')}</p>
      <form className="election-id-form-content">
        <div className="file-election-id-upload-section">
          <input
            type="file"
            id="file-upload"
            accept=".pdf, .jpg, .png"
            onChange={handleFileChange}
            className="file-election-id-input-field"
          />
          {file && (
            <div className="file-election-id-info">
              <span className="file-election-id-name">{file.name}</span>
              <a
                href={URL.createObjectURL(file)}
                download={file.name}
                className="file-election-id-download-link"
              >
                <br />
                {t('downloadLink')}
              </a>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="form-election-id-buttons-section">
          <button
            type="button"
            className="upload-election-id-btn"
            onClick={handleFileClick}
          >
            📎 {t('uploadIDButton')}
          </button>

          {file && (
            <button
              type="button"
              className="delete-election-id-btn"
              onClick={handleDelete}
            >
              {t('delete')}
            </button>
          )}

          <div className="navigation-election-id-buttons">
            <button
              type="button"
              className="back-election-id-btn"
              onClick={handleBack}
            >
              {t('back')}
            </button>
            <button
              type="button"
              className="submit-election-id-btn"
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

export default UserElectionID;
