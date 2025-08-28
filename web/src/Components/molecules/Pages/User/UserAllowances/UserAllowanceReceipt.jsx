import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
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
    navigate('/user_dashboard');
  };

  if (loading) {
    return (
      <section>
        <NavBar />
        <div className="allowance-receipts-container">
          <h1>My Allowance Receipts</h1>
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
        <div className="allowance-receipts-container">
          <h1>My Allowance Receipts</h1>
          <p className="error-message">{error}</p>
          <button className="allowance-receipts-back-btn" onClick={handleBack}>
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
      <div className="allowance-receipts-container">
        <h1>My Allowance Receipts</h1>
        <div className="allowance-receipts-table-wrapper">
          <table className="allowance-receipts-table">
            <thead>
              <tr>
                <th>Allowance Type</th>
                <th>Application Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length > 0 ? (
                receipts.map((receipt) => (
                  <tr key={`${receipt.Villager_ID}-${receipt.Allowances_ID}`}>
                    <td>{receipt.Allowances_Type || 'N/A'}</td>
                    <td>{receipt.apply_date ? new Date(receipt.apply_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {receipt.receipt_path ? (
                        <a
                          href="#"
                          onClick={() => handleDownload(receipt.receipt_path)}
                          className="allowance-receipts-download-link"
                        >
                          Download Receipt
                        </a>
                      ) : (
                        'Not Available'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="allowance-receipts-no-data">
                    No allowance receipts available for you
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="allowance-receipts-actions">
          <button className="allowance-receipts-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
      <Footer />
    </section>
  );
};

export default UserAllowanceReceipt;