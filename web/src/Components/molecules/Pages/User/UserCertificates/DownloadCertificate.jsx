import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../../../../api/villager';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const DocumentUpload = () => {
  const [birthCertificate, setBirthCertificate] = useState(null);
  const [nicCopy, setNicCopy] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
    <section>
      <NavBar />
      <div className="document-upload-container">
        <h1>Upload Birth Certificate and NIC Copy</h1>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit} className="document-form">
          <div className="document-field">
            <label>Birth Certificate (PDF/PNG/JPG):</label>
            <input
              type="file"
              name="birthCertificate"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
            {documents.birthCertificate && (
              <div>
                <p>Current Birth Certificate: {documents.birthCertificate}</p>
                <button
                  type="button"
                  onClick={() => handleDownload(documents.birthCertificate, 'birthCertificate')}
                >
                  Download Birth Certificate
                </button>
              </div>
            )}
          </div>
          <div className="document-field">
            <label>NIC Copy (PDF/PNG/JPG):</label>
            <input
              type="file"
              name="nicCopy"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
            {documents.nicCopy && (
              <div>
                <p>Current NIC Copy: {documents.nicCopy}</p>
                <button
                  type="button"
                  onClick={() => handleDownload(documents.nicCopy, 'nicCopy')}
                >
                  Download NIC Copy
                </button>
              </div>
            )}
          </div>
          <div className="form-buttons">
            <button type="submit" className="upload-button">
              Upload Documents
            </button>
            <button type="button" className="back-button" onClick={handleBack}>
              Back to Profile
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </section>
  );
};

export default DocumentUpload;