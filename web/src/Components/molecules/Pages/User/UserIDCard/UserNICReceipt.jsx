import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { fetchConfirmedNICApplications, downloadDocument } from "../../../../../api/nicApplication";
import './UserNICReceipt.css';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserNICReceipt = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReceipts = async () => {
      try {
        setLoading(true);
        const data = await fetchConfirmedNICApplications();
        console.log("Received NIC receipts:", data);
        setReceipts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching NIC receipts:', {
          message: err.message,
          response: err.response?.data,
        });
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch your NIC receipts';
        setError(errorMessage);
        setLoading(false);
        toast.error(errorMessage, {
          style: {
            background: '#f44336',
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
      toast.success('NIC receipt downloaded successfully', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error downloading NIC receipt:', {
        message: err.message || 'Unknown error',
        response: err.response?.data,
      });
      const errorMessage = err.response?.data?.error || err.message || 'Failed to download receipt';
      toast.error(errorMessage, {
        style: {
          background: '#f44336',
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
        <div className="nic-receipts-container">
          <h1>My NIC Receipts</h1>
          <p>Loading your NIC receipts...</p>
        </div>
        <Footer />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <NavBar />
        <div className="nic-receipts-container">
          <h1>My NIC Receipts</h1>
          <p className="error-message">{error}</p>
          <button className="nic-receipts-back-btn" onClick={handleBack}>
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
      <div className="nic-receipts-container">
        <h1>My NIC Receipts</h1>
        <div className="nic-receipts-table-wrapper">
          <table className="nic-receipts-table">
            <thead>
              <tr>
                <th>NIC Type</th>
                <th>Application Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length > 0 ? (
                receipts.map((receipt, index) => (
                  <tr key={`${receipt.Villager_ID}-${receipt.NIC_ID}-${index}`}>
                    <td>{receipt.NIC_Type || 'N/A'}</td>
                    <td>{receipt.apply_date ? new Date(receipt.apply_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      {receipt.receipt_path ? (
                        <a
                          href="#"
                          onClick={() => handleDownload(receipt.receipt_path)}
                          className="nic-receipts-download-link"
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
                  <td colSpan="3" className="nic-receipts-no-data">
                    No NIC receipts available for you
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="nic-receipts-actions">
          <button className="nic-receipts-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
      <Footer />
    </section>
  );
};

export default UserNICReceipt;