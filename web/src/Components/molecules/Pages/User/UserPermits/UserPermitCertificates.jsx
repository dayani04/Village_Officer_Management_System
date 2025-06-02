import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { fetchConfirmedPermitApplications, downloadDocument } from '../../../../../api/permitApplication';
import './UserPermitCertificates.css';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserPermitCertificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        setLoading(true);
        const data = await fetchConfirmedPermitApplications();
        setCertificates(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching certificates:', {
          message: err.message,
          response: err.response ? err.response.data : null,
        });
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch your certificates';
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage, {
          style: {
            background: '#f43f3f',
            color: '#fff',
            borderRadius: '4px',
          },
        });
      }
    };
    loadCertificates();
  }, []);

  const handleDownload = async (filename) => {
    try {
      const blob = await downloadDocument(filename);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Certificate downloaded successfully', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error downloading certificate:', {
        message: err.message,
        response: err.response ? err.response.data : null,
      });
      const errorMessage = err.response?.data?.error || err.message || 'Failed to download certificate';
      toast.error(errorMessage, {
        style: {
          background: '#f43f3f',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/user_dashboard');
  };

  if (loading) {
    return (
      <section>
        <NavBar />
        <div className="certificates-container">
          <h1>My Permit Certificates</h1>
          <p>Loading your certificates...</p>
        </div>
        <Footer />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <NavBar />
        <div className="certificates-container">
          <h1>My Permit Certificates</h1>
          <p className="error-message">{error}</p>
          <button className="certificates-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
          <Toaster />
        </div>
        <Footer />
      </section>
    );
  }

  return (
    <section>
      <NavBar />
      <div className="certificates-container">
        <h1>My Permit Certificates</h1>
        <div className="certificates-table-wrapper">
          <table className="certificates-table">
            <thead>
              <tr>
                <th>Permit Type</th>
                <th>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {certificates.length > 0 ? (
                certificates.map((cert) => (
                  <tr key={`${cert.Villager_ID}-${cert.Permits_ID}`}>
                    <td>{cert.Permits_Type || 'N/A'}</td>
                    <td>
                      {cert.certificate_path ? (
                        <a
                          href="#"
                          onClick={() => handleDownload(cert.certificate_path)}
                          className="certificates-download-link"
                        >
                          Download Certificate
                        </a>
                      ) : (
                        'Not Available'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="certificates-no-data">
                    No certificates available for you
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="certificates-actions">
          <button className="certificates-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
      <Footer />
    </section>
  );
};

export default UserPermitCertificates;