import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
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
          border: '1px solid #fff',
          fontSize: '12px',
        },
      });
    }
  };

  const handleBack = () => {
    navigate('/user_certificates_download');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  const columns = [
    {
      name: 'Permit Type',
      selector: row => row.Permits_Type || 'N/A',
      sortable: true,
    },
    {
      name: 'Application Date',
      selector: row => formatDate(row.required_date),
      sortable: true,
    },
    {
      name: 'Certificate',
      cell: row => (
        row.certificate_path ? (
          <button
            className="allowance-receipts-download-btn"
            onClick={() => handleDownload(row.certificate_path)}
            title="Download Certificate"
          >
            Download Certificate
          </button>
        ) : (
          <span className="not-available">Not Available</span>
        )
      ),
    },
  ];

  if (loading) {
    return (
      <section>
        <NavBar />
        <br/>
        <div className="profile-hero">
          <button className="back-button" onClick={handleBack} title="Back to Certificate Downloads">
            <FaArrowLeft />
          </button>
          
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="village-title">My Permit Certificates</h1>
            </div>
          </div>
        </div>
        <br/>
        <div className="allowance-receipts-container">
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
        <br/>
        <div className="profile-hero">
          <button className="back-button" onClick={handleBack} title="Back to Certificate Downloads">
            <FaArrowLeft />
          </button>
          
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="village-title">My Permit Certificates</h1>
            </div>
          </div>
        </div>
        <br/>
        <div className="allowance-receipts-container">
          <p className="error-message">{error}</p>
          <Toaster />
        </div>
        <Footer />
      </section>
    );
  }

  return (
    <section>
      <NavBar />
      <br/>
      <div className="profile-hero">
        <button className="back-button" onClick={handleBack} title="Back to Certificate Downloads">
          <FaArrowLeft />
        </button>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="village-title">My Permit Certificates</h1>
          </div>
        </div>
      </div>
      <br/>
      <div className="allowance-receipts-container">
          <DataTable
            columns={columns}
            data={certificates}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50]}
            highlightOnHover
            striped
            noDataComponent={<div className="allowance-receipts-no-data">No certificates available for you</div>}
            customStyles={{
              table: {
                style: {
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                },
              },
              headCells: {
                style: {
                  backgroundColor: '#9ca3af',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '12px',
                },
              },
              cells: {
                style: {
                  padding: '12px',
                  borderBottom: '1px solid #ddd',
                },
              },
              rows: {
                style: {
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                },
              },
            }}
          />
          <Toaster />
      </div>
      <Footer />
    </section>
  );
};

export default UserPermitCertificates;