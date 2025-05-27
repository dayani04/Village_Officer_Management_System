import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as certificateApi from '../../../../../api/certificateApplicationAPI.js';

const fieldsData = [
  { key: 'fullName', labels: ['නම:', 'முழு பெயர்:', 'Full Name:'] },
  { key: 'address', labels: ['ලිපිනය:', 'முகவரி:', 'Address:'] },
  { key: 'areaId', labels: ['කොට්ඨාස අංකය:', 'பிரிவு எண்:', 'Area ID:'] },
  { key: 'gender', labels: ['ස්ත්‍රී පුරුෂබාවය:', 'பாலை:', 'Gender:'] },
  { key: 'age', labels: ['වයස:', 'வய:', 'Age:'] },
  { key: 'nic', labels: ['ජාතික හැඳුනුම්පත් අංකය:', 'தேசிய அடையாள அட்டை எண்:', 'National Identity Card Number:'] },
  { key: 'civilStatus', labels: ['විවාහක/අවිවාහක:', 'திருமண நிலை:', 'Civil Status:'] },
  { key: 'occupation', labels: ['රැකියාව:', 'தொழில்:', 'Occupation:'] },
  { key: 'character', labels: ['චරිතය:', 'குணம்:', 'Character:'] },
  { key: 'voterId', labels: ['ඡන්ද ලේඛන අංකය:', 'வாக்காளர் பட்டியல் எண்:', 'Voter Roll Number:'] },
  { key: 'date', labels: ['දිනය:', 'தேதி:', 'Date:'] },
  { key: 'signature', labels: ['ග්‍රාම නිලධාරීගේ අත්සන:', 'கிராம உத்தியோகத்தரின் கையொப்பம்:', 'Signature of Grama Niladhari:'] },
];

const EditableCertificate = () => {
  const { applicationId } = useParams();
  const certRef = useRef();
  const [fields, setFields] = useState(
    fieldsData.reduce((acc, field) => ({ ...acc, [field.key]: '-' }), {})
  );
  const [signatureInput, setSignatureInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log('Fetching certificate details for ID:', applicationId);
        const data = await certificateApi.fetchCertificateDetails(applicationId);
        console.log('Raw API response:', data);

        if (!data) {
          throw new Error(`Application ID ${applicationId} not found in database`);
        }

        // Calculate age
        let age = '-';
        if (data.DOB) {
          const dob = new Date(data.DOB);
          if (isNaN(dob.getTime())) {
            console.warn('Invalid DOB:', data.DOB);
          } else {
            const today = new Date('2025-05-26T12:04:00+05:30');
            age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
              age--;
            }
            age = age.toString();
          }
        }

        // Set fields
        const newFields = {
          fullName: data.Full_Name || '-',
          address: data.Address || '-',
          areaId: data.ZipCode || '-',
          gender: '-',
          age,
          nic: data.NIC || '-',
          civilStatus: '-',
          occupation: '-',
          character: 'Good',
          voterId: data.electionrecodeID ? data.electionrecodeID.toString() : '-',
          date: new Date().toISOString().split('T')[0], // Current date
          signature: signatureInput || '-', // Use user input or default
        };
        console.log('Mapped fields:', newFields);
        setFields(newFields);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        const errorMessage = err.response?.status === 404
          ? `Application ID ${applicationId} not found. Please verify the ID exists in villager_has_certificate_recode.`
          : err.message || 'Failed to fetch certificate details';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [applicationId, signatureInput]);

  const handleSignatureChange = (e) => {
    const value = e.target.value;
    setSignatureInput(value);
    setFields((prevFields) => ({
      ...prevFields,
      signature: value || '-',
    }));
  };

  const downloadPDF = async () => {
    try {
      console.log('Generating PDF with fields:', fields);
      const canvas = await html2canvas(certRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

      const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
      const filename = `certificate_${applicationId}_${timestamp}.pdf`;

      pdf.save(filename);
      console.log('PDF downloaded:', filename);
    } catch (err) {
      console.error('PDF generation error:', err);
      const errorMessage = err.message || err.toString() || 'Unknown error during PDF generation';
      setError(`Failed to generate PDF: ${errorMessage}`);
    }
  };

  const sendPDF = async () => {
    try {
      console.log('Generating and sending PDF with fields:', fields);
      const canvas = await html2canvas(certRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

      const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
      const filename = `certificate_${applicationId}_${timestamp}.pdf`;
      const certificatePath = `Uploads/certificates/${filename}`;

      const pdfBlob = pdf.output('blob');
      const formData = new FormData();
      formData.append('certificate', pdfBlob, filename);
      formData.append('certificatePath', certificatePath);

      console.log('Sending PDF to API:', { applicationId, certificatePath });
      const response = await certificateApi.saveCertificatePath(applicationId, formData);
      console.log('API response:', response);
      setSuccess(`Certificate saved successfully: ${certificatePath}`);
      setError('');
    } catch (err) {
      console.error('PDF generation or save error:', err);
      const errorMessage = err.message || err.toString() || 'Unknown error during PDF generation or save';
      setError(`Failed to generate or save PDF: ${errorMessage}`);
      setSuccess('');
    }
  };

  if (loading) {
    return <div className="container py-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container py-4">
        <p><strong>Error:</strong> {error}</p>
        <p><strong>Debugging Steps:</strong></p>
        <ul>
          <li>Run: <code>SELECT * FROM villager_has_certificate_recode WHERE application_id = {applicationId};</code></li>
          <li>Ensure a record exists with application_id={applicationId}.</li>
          <li>Run: <code>SELECT * FROM villager WHERE Villager_ID = (SELECT Villager_ID FROM villager_has_certificate_recode WHERE application_id = {applicationId});</code></li>
          <li>Run: <code>SELECT ZipCode FROM area WHERE Area_ID = (SELECT Area_ID FROM villager WHERE Villager_ID = (SELECT Villager_ID FROM villager_has_certificate_recode WHERE application_id = {applicationId}));</code></li>
          <li>Run: <code>SELECT electionrecodeID FROM villager_hase_election_recode WHERE Villager_ID = (SELECT Villager_ID FROM villager_has_certificate_recode WHERE application_id = {applicationId}) AND status='Approved' ORDER BY apply_date DESC LIMIT 1;</code></li>
          <li>Test Fetch API: <code>curl -H "Authorization: Bearer your_jwt_token" http://localhost:5000/api/certificate-applications/certificate/{applicationId}</code></li>
          <li>Test Save API: <code>curl -X POST -H "Authorization: Bearer your_jwt_token" -F "certificate=@certificate.pdf" -F "certificatePath=Uploads/certificates/test.pdf" http://localhost:5000/api/certificate-applications/save-certificate/{applicationId}</code></li>
          <li>Check console logs for detailed API error messages.</li>
          <li>Check server logs for backend errors (e.g., Multer, database, file system).</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="signatureInput" className="form-label">
          Signature of Grama Niladhari:
        </label>
        <input
          type="text"
          className="form-control"
          id="signatureInput"
          value={signatureInput}
          onChange={handleSignatureChange}
          placeholder="Enter Grama Niladhari signature"
        />
      </div>
      <div
        ref={certRef}
        className="bg-white shadow border p-4 mx-auto"
        style={{
          width: '794px',
          minHeight: '1123px',
          backgroundImage: 'url("/certificate.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'top left',
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <p className="fw-bold mb-1" style={{ fontSize: '16px' }}>
            ග්‍රාම නිලධාරී විසින් නිකුත් කරන පදිංචිය හා චරිතය පිළිබඳ සහතිකය
          </p>
          <p className="fw-bold mb-1" style={{ fontSize: '16px' }}>
            கிராம உத்தியோகத்தர்களால் வழங்கப்படும் வதிவிட, குணநலச் சான்றிதழ்
          </p>
          <p className="fw-bold" style={{ fontSize: '16px' }}>
            Certificate on residence and character issued by the Grama Niladhari
          </p>
        </div>

        {/* Fields */}
        <div className="px-3">
          {fieldsData.map((field) => (
            <div
              key={field.key}
              className="d-flex align-items-center border-bottom mb-3 pb-2"
              style={{ fontSize: '13px' }}
            >
              {/* Labels */}
              <div style={{ flex: 2 }}>
                <label className="d-block text-muted">
                  <div>{field.labels[0]}</div>
                  <div>{field.labels[1]}</div>
                  <div>{field.labels[2]}</div>
                </label>
              </div>

              {/* Vertical Line */}
              <div
                style={{
                  width: '1px',
                  height: '100%',
                  backgroundColor: '#ccc',
                  margin: '0 10px',
                }}
              />

              {/* Display Field */}
              <div style={{ flex: 3 }}>
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '13px',
                  }}
                >
                  {fields[field.key]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center mt-4">
        <button className="btn btn-primary px-4 py-2 me-2" onClick={downloadPDF}>
          Download as PDF
        </button>
        <button className="btn btn-success px-4 py-2" onClick={sendPDF}>
          Send
        </button>
      </div>
    </div>
  );
};

export default EditableCertificate;