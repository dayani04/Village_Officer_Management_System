import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload, FaDownload, FaFileAlt, FaIdCard, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import * as api from '../../../../../api/villager';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";
import './DocumentUpload.css';

const DocumentUpload = () => {
  const [birthCertificate, setBirthCertificate] = useState(null);
  const [nicCopy, setNicCopy] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState({ birthCertificate: null, nicCopy: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndDocuments = async () => {
      try {
        const profileData = await api.getProfile();
        console.log('Fetched profile data:', profileData);
        if (!profileData.Full_Name || !profileData.Email || !profileData.Phone_No) {
          throw new Error('Profile missing required fields: Full_Name, Email, or Phone_No');
        }
        setProfile(profileData);
        setDocuments({
          birthCertificate: profileData.BirthCertificate,
          nicCopy: profileData.NICCopy,
        });
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.error || 'Failed to fetch profile data');
        setLoading(false);
      }
    };
    fetchProfileAndDocuments();
  }, []);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'birthCertificate') {
      setBirthCertificate(files[0]);
    } else if (name === 'nicCopy') {
      setNicCopy(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!birthCertificate && !nicCopy) {
      setError('Please select at least one document to upload.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    if (birthCertificate) formData.append('birthCertificate', birthCertificate);
    if (nicCopy) formData.append('nicCopy', nicCopy);

    try {
      await api.updateVillagerDocuments(formData);
      setSuccess('Documents uploaded successfully!');
      setError('');
      // Refresh document list
      const profileData = await api.getProfile();
      setDocuments({
        birthCertificate: profileData.BirthCertificate,
        nicCopy: profileData.NICCopy,
      });
      setTimeout(() => navigate('/user_profile'), 2000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.error || 'Failed to upload documents: ' + err.message);
      setSuccess('');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (filename, docType) => {
    try {
      const blob = await api.downloadDocument(filename);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${docType}_${filename}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError(err.error || 'Failed to download document');
    }
  };

  const handleBack = () => {
    navigate('/user_profile');
  };

  if (loading) {
    return (
      <section>
        <NavBar />
        <div className="document-upload-container">Loading...</div>
        <Footer />
      </section>
    );
  }

  return (
    <section className="document-upload-page">
      <NavBar />

      <div className="upload-container">


        {error && (
          <div className="error-message">
            <FaTimes /> {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            <FaCheck /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="documents-grid">
            <div className="document-card">
              <div className="doc-header">
                <FaFileAlt className="doc-icon" />
                <h3>Birth Certificate</h3>
              </div>

              <div className="upload-zone">
                <input
                  type="file"
                  id="birthCertificate"
                  name="birthCertificate"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="birthCertificate" className="upload-label">
                  <FaUpload className="upload-icon" />
                  <span>{birthCertificate ? birthCertificate.name : 'Choose file or drag here'}</span>
                  <small>PDF, PNG, JPG up to 10MB</small>
                </label>
              </div>

              {documents.birthCertificate && (
                <div className="file-status">
                  <div className="file-info">
                    <FaFileAlt />
                    <span>{documents.birthCertificate}</span>
                  </div>
                  <button
                    type="button"
                    className="download-btn"
                    onClick={() => handleDownload(documents.birthCertificate, 'BirthCertificate')}
                  >
                    <FaDownload /> Download
                  </button>
                </div>
              )}
            </div>

            <div className="document-card">
              <div className="doc-header">
                <FaIdCard className="doc-icon" />
                <h3>NIC Copy</h3>
              </div>

              <div className="upload-zone">
                <input
                  type="file"
                  id="nicCopy"
                  name="nicCopy"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="nicCopy" className="upload-label">
                  <FaUpload className="upload-icon" />
                  <span>{nicCopy ? nicCopy.name : 'Choose file or drag here'}</span>
                  <small>PDF, PNG, JPG up to 10MB</small>
                </label>
              </div>

              {documents.nicCopy && (
                <div className="file-status">
                  <div className="file-info">
                    <FaIdCard />
                    <span>{documents.nicCopy}</span>
                  </div>
                  <button
                    type="button"
                    className="download-btn"
                    onClick={() => handleDownload(documents.nicCopy, 'NICCopy')}
                  >
                    <FaDownload /> Download
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={uploading}>
              {uploading ? <FaSpinner className="spin" /> : <FaUpload />}
              {uploading ? ' Uploading...' : ' Upload Documents'}
            </button>

            <button type="button" className="cancel-btn" onClick={handleBack}>
              <FaArrowLeft /> Cancel
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </section>
  );
};

export default DocumentUpload;