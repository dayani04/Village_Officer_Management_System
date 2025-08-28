import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { fetchConfirmedElectionApplications, downloadDocument } from '../../../../../api/electionApplication';
import './UserElectionReceipt.css';
import NavBar from "../../../NavBar/NavBar";
import Footer from "../../../Footer/Footer";

const UserElectionReceipt = () => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReceipts = async () => {
      try {
        setLoading(true);
        const data = await fetchConfirmedElectionApplications();
        console.log("Received election receipts:", data); // Debug log
        setReceipts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching election receipts:', {
          message: err.message,
          response: err.response ? err.response.data : null,
        });
        const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch your election receipts';
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
      toast.success('Election receipt downloaded successfully', {
        style: {
          background: '#4caf50',
          color: '#fff',
          borderRadius: '4px',
        },
      });
    } catch (err) {
      console.error('Error downloading election receipt:', {
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
        <div className="election-receipts-container">
          <h1>My Election Receipts</h1>
          <p>Loading your election receipts...</p>
        </div>
        <Footer />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <NavBar />
        <div className="election-receipts-container">
          <h1>My Election Receipts</h1>
          <p className="error-message">{error}</p>
          <button className="election-receipts-back-btn" onClick={handleBack}>
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
      <div className="election-receipts-container">
        <h1>My Election Receipts</h1>
        <div className="election-receipts-table-wrapper">
          <table className="election-receipts-table">
            <thead>
              <tr>
                <th>Election Type</th>
                <th>Election Date</th>
                <th>Voting Place</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {receipts.length > 0 ? (
                receipts.map((receipt) => (
                  <tr key={`${receipt.Villager_ID}-${receipt.electionrecodeID}`}>
                    <td>{receipt.Election_Type || 'N/A'}</td>
                    <td>{receipt.electionDate || 'N/A'}</td>
                    <td>{receipt.votingPlace || 'Not Assigned'}</td>
                    <td>
                      {receipt.receipt_path ? (
                        <a
                          href="#"
                          onClick={() => handleDownload(receipt.receipt_path)}
                          className="election-receipts-download-link"
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
                  <td colSpan="4" className="election-receipts-no-data">
                    No election receipts available for you
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="election-receipts-actions">
          <button className="election-receipts-back-btn" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
        <Toaster />
      </div>
      <Footer />
    </section>
  );
};

export default UserElectionReceipt;