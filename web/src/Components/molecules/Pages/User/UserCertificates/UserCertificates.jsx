import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import toast, { Toaster } from 'react-hot-toast';
import * as certificateApi from '../../../../../api/certificateApplication';
import './UserCertificates.css';

const UserCertificates = () => {
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    email: '',
    reason: '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error(t('invalidFileType'), {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error(t('fileTooLarge'), {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.email || !formData.reason || !file) {
      toast.error(t('formValidationMessage'), {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error(t('invalidEmail'), {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      setLoading(false);
      return;
    }

    if (formData.reason.length > 255) {
      toast.error(t('reasonTooLong'), {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('reason', formData.reason);
      data.append('document', file);

      console.log('Submitting certificate application:', { email: formData.email, reason: formData.reason, file: file.name });
      await certificateApi.submitCertificateApplication(data);

      toast.success(t('submissionSuccess'), {
        style: {
          background: '#7a1632',
          color: '#fff',
          borderRadius: '4px',
        },
      });

      // Reset form
      setFormData({ email: '', reason: '' });
      setFile(null);
      document.getElementById('document').value = ''; // Clear file input
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error || t('submissionError'), {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  return (
    <div>
      <br />
      <br />
      <h1 className="form-title">{t('certificatesFormTitle')}</h1>
      <br />
      <div className="user-certificates-container">
        <div className="language-certificates-switch">
          <button onClick={() => handleLanguageChange('en')}>English</button>
          <button onClick={() => handleLanguageChange('si')}>සිංහල</button>
        </div>

        <form className="certificates-form" onSubmit={handleSubmit}>
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

          <div className="form-certificates-group">
            <label htmlFor="reason">{t('reason')}</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder={t('reasonPlaceholder')}
              required
              rows="4"
            />
          </div>

          <div className="form-certificates-group">
            <label htmlFor="document">{t('NIC')}</label>
            <input
              type="file"
              id="document"
              name="document"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="form-certificates-group">
            <button
              type="submit"
              className="upload-certificates-button"
              disabled={loading}
            >
              {loading ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
        <Toaster />
      </div>
    </div>
  );
};

export default UserCertificates;