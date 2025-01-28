import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './UserAllowancesBC.css';

const UserAllowancesBC = () => {
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
    navigate('/UserAllowances');
  };

  // Handle submission
  const handleSubmit = () => {
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: t('uploadRequiredTitleBC'), // Add translation key
        text: t('uploadRequiredMessageBC'), // Add translation key
        confirmButtonText: t('ok'),
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: t('submissionSuccessTitle'), // Add translation key
        text: t('submissionSuccessMessage'), // Add translation key
        confirmButtonText: t('ok'),
      }).then(() => {
        
      });
    }
  };

  return (
    <div className="user-allowances-bc-page">
      <h1 className="allowances-bc-form-title">{t('FormTitleBC')}</h1>

      {/* Language Selector */}
      <div className="language-allowances-bc-selector">
        <button onClick={() => changeLanguage('en')} className="language-allowances-bc-btn">
          English
        </button>
        <button onClick={() => changeLanguage('si')} className="language-allowances-bc-btn">
          සිංහල
        </button>
      </div>

      {/* Form Section */}
      <form className="allowances-bc-form-content">
        {/* File Upload Section */}
        <div className="file-allowances-bc-upload-section">
          <input
            type="file"
            id="file-upload"
            accept=".pdf, .jpg, .png"
            onChange={handleFileChange}
            className="file-allowances-bc-input-field"
            style={{ display: 'none' }}
          />
          {file && (
            <div className="file-allowances-bc-info">
              <span className="file-allowances-bc-name">{file.name}</span>
              <a
                href={URL.createObjectURL(file)}
                download={file.name}
                className="file-allowances-bc-download-link"
              ><br></br>
                {t('downloadLink')}
              </a>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <div className="form-allowances-bc-buttons-section">
          <button
            type="button"
            className="upload-allowances-bc-btn"
            onClick={handleFileClick}
          >
            📎 {t('uploadBCButton')}
          </button>

          {file && (
            <button
              type="button"
              className="delete-allowances-bc-btn"
              onClick={handleDelete}
            >
              {t('delete')}
            </button>
          )}

          <div className="navigation-allowances-bc-buttons">
            <button
              type="button"
              className="back-allowances-bc-btn"
              onClick={handleBack}
            >
              {t('back')}
            </button>

            <button
              type="button"
              className="submit-allowances-bc-btn"
              onClick={handleSubmit}
            >
              {t('submit')} {/* Changed button text */}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserAllowancesBC;
