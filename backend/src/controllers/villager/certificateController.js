const Certificate = require("../../models/villager/certificateModel");
const fs = require('fs').promises;
const path = require('path');
const pool = require('../../config/database');

const getCertificateDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    console.log(`Fetching certificate details for application_id: ${applicationId}`);
    const details = await Certificate.getApplicationDetailsToCertificate(applicationId);
    if (!details) {
      return res.status(404).json({ error: `Application ID ${applicationId} not found` });
    }
    res.json(details);
  } catch (error) {
    console.error("Error in getCertificateDetails:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const saveCertificate = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const certificatePath = req.body.certificatePath;
    const certificateFile = req.file;

    if (!certificateFile || !certificatePath) {
      return res.status(400).json({ error: 'Certificate file and path required' });
    }

    // Save file
    const uploadDir = path.join(__dirname, '../../Uploads/certificates');
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, path.basename(certificatePath)), certificateFile.buffer);

    // Update database
    await pool.query(
      `UPDATE villager_has_certificate_recode 
       SET certificate_path = ? 
       WHERE application_id = ?`,
      [certificatePath, applicationId]
    );

    res.json({ message: 'Certificate saved successfully', certificatePath });
  } catch (error) {
    console.error('Error saving certificate:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

module.exports = {
  getCertificateDetails,
  saveCertificate,
};