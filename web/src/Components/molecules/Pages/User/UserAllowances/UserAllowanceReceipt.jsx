import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import { fetchConfirmedAllowanceApplications, downloadDocument } from '../../../../../api/allowanceApplication';
import './UserAllowanceReceipt.css';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserAllowanceReceipt = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReceipts = async () => {
      try {
        setLoading(true);
        const data = await fetchConfirmedAllowanceApplications();
        console.log("Received allowance receipts:", data);
        setReceipts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching allowance receipts:', {
          message: err.message,
          response: err.response ? err.response.data : null,
        });
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch your allowance receipts';
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
    loadReceipts();
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
      toast.success('Allowance receipt downloaded successfully', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error downloading allowance receipt:', {
        message: err.message,
        response: err.response ? err.response.data : null,
      });
      const errorMessage = err.response?.data?.error || err.message || 'Failed to download receipt';
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
    navigate('/user_certificates_download');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
  };

  const columns = [
    {
      name: 'Allowance Type',
      selector: row => row.Allowances_Type || 'N/A',
      sortable: true,
    },
    {
      name: 'Application Date',
      selector: row => formatDate(row.apply_date),
      sortable: true,
    },
    {
      name: 'Receipt',
      cell: row => (
        row.receipt_path ? (
          <button
            className="allowance-receipts-download-btn"
            onClick={() => handleDownload(row.receipt_path)}
            title="Download Receipt"
          >
            Download Receipt
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
              <h1 className="village-title">My Allowance Receipts</h1>
            </div>
          </div>
        </div>
        <br/>
        <div className="allowance-receipts-container">
          <p>Loading your allowance receipts...</p>
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
              <h1 className="village-title">My Allowance Receipts</h1>
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
            <h1 className="village-title">My Allowance Receipts</h1>
          </div>
        </div>
      </div>
      <br/>
      <div className="allowance-receipts-container">
          <DataTable
            columns={columns}
            data={receipts}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 25, 50]}
            highlightOnHover
            striped
            noDataComponent={<div className="allowance-receipts-no-data">No allowance receipts available for you</div>}
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

export default UserAllowanceReceipt;