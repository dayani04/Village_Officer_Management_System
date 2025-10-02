const CertificateApplication = require("../../models/villager/certificateApplicationModel");
const Villager = require("../../models/villager/villagerModel");
const path = require("path");
const fs = require("fs").promises; // Promise-based fs
const pool = require("../../config/database");

// Define the base upload directory as an absolute path
const UPLOADS_DIR = path.join(__dirname, "..", "..", "Uploads", "certificates");

const createCertificateApplication = async (req, res) => {
  try {
    const { email, reason } = req.body;
    const file = req.file; // Optional now

    console.log("Incoming request data:", {
      email: email || "undefined",
      reason: reason || "undefined",
      file: file ? file.originalname : "undefined",
    });

    if (!email || !reason) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!reason) missingFields.push("reason");
      console.error(`Missing required fields: ${missingFields.join(", ")}`);
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
    }

    const villager = await CertificateApplication.getVillagerByEmail(email);
    if (!villager) {
      console.error(`Villager not found for email: ${email}`);
      return res.status(404).json({ error: "Villager not found" });
    }

    // Proceed without file validation if file is optional
    const documentPath = file ? `${villager.Villager_ID}_certificate_${Date.now()}${path.extname(file.originalname)}` : null;

    if (file) {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(file.mimetype)) {
        console.error(`Invalid file type: ${file.mimetype}`);
        return res.status(400).json({ error: "Invalid file type. Only PDF, PNG, or JPG files are allowed." });
      }
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      const fullPath = path.join(UPLOADS_DIR, documentPath);
      await fs.writeFile(fullPath, file.buffer);
      console.log(`File saved to: ${fullPath}`);
    }

    const applyDate = new Date().toISOString().split("T")[0];
    const applicationId = await CertificateApplication.addCertificateApplication(
      villager.Villager_ID,
      applyDate,
      documentPath || null, // Allow null if no file
      reason
    );

    console.log(`Certificate application created with ID: ${applicationId}`);
    res.status(201).json({ message: "Certificate application submitted successfully", applicationId });
  } catch (error) {
    console.error("Error in createCertificateApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
const getAllCertificateApplications = async (req, res) => {
  try {
    console.log("Fetching all certificate applications");
    const applications = await CertificateApplication.getAllCertificateApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getAllCertificateApplications:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const updateCertificateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    console.log(`Received request to update status for application ID: ${applicationId} to ${status}`);

    if (!["Pending", "Send", "Rejected", "Confirm"].includes(status)) {
      console.warn(`Invalid status received: ${status}`);
      return res.status(400).json({ error: "Invalid status. Must be 'Pending', 'Send', 'Rejected', or 'Confirm'" });
    }

    const updated = await CertificateApplication.updateCertificateApplicationStatus(applicationId, status);
    if (!updated) {
      console.error(`Failed to update application ID: ${applicationId}`);
      return res.status(404).json({ error: "Application not found" });
    }

    console.log(`Successfully updated status for application ID: ${applicationId}`);
    res.json({ 
      message: "Certificate application status updated successfully",
      warning: (status === 'Confirm' || status === 'Send') ? "Notification may not have been sent due to database issue" : undefined
    });
  } catch (error) {
    console.error("Error in updateCertificateApplicationStatus:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(UPLOADS_DIR, filename);

    console.log(`Attempting to download file: ${filePath}`);
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Error downloading file", details: err.message });
      } else {
        console.log(`File downloaded successfully: ${filename}`);
      }
    });
  } catch (error) {
    console.error("Error in downloadDocument:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getVillagerDetails = async (req, res) => {
  try {
    const { villagerId } = req.params;
    console.log(`Fetching villager details for ID: ${villagerId}`);
    const villager = await Villager.getVillagerById(villagerId);
    if (!villager) {
      console.error(`Villager not found for ID: ${villagerId}`);
      return res.status(404).json({ error: "Villager not found" });
    }
    const applications = await CertificateApplication.getVillagerCertificateApplications(villagerId);
    res.json({ ...villager, certificateApplications: applications });
  } catch (error) {
    console.error("Error in getVillagerDetails:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getApplicationDetails = async (req, res) => {
  try {
    const { applicationId } = req.params;
    console.log(`Fetching application details for ID: ${applicationId}`);
    const details = await CertificateApplication.getApplicationDetails(applicationId);
    if (!details) {
      console.error(`No details found for application ID: ${applicationId}`);
      return res.status(404).json({ error: `Application ID ${applicationId} not found` });
    }
    res.json(details);
  } catch (error) {
    console.error("Error in getApplicationDetails:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const saveCertificate = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const certificateFile = req.file;

    console.log(`Received request to save certificate for applicationId: ${applicationId}`);
    console.log(`File received:`, certificateFile ? certificateFile.originalname : "No file");

    if (!certificateFile) {
      return res.status(400).json({ error: "Certificate file is required" });
    }

    const timestamp = new Date().toISOString().replace(/[:.-]/g, "");
    const certificatePath = `certificate_${applicationId}_${timestamp}${path.extname(certificateFile.originalname)}`;

    // Ensure the uploads directory exists
    console.log(`Creating directory: ${UPLOADS_DIR}`);
    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    const fullPath = path.join(UPLOADS_DIR, certificatePath);
    console.log(`Writing file to: ${fullPath}`);
    await fs.writeFile(fullPath, certificateFile.buffer);

    console.log(`Updating database with certificate path: ${certificatePath}`);
    const [result] = await pool.query(
      `UPDATE villager_has_certificate_recode 
       SET certificate_path = ? 
       WHERE application_id = ?`,
      [certificatePath, applicationId]
    );

    if (result.affectedRows === 0) {
      console.error(`No record found for applicationId: ${applicationId}`);
      return res.status(404).json({ error: `Application ID ${applicationId} not found` });
    }

    console.log(`Database updated, affected rows: ${result.affectedRows}`);

    // Add notification
    const [app] = await pool.query(
      `SELECT Villager_ID FROM villager_has_certificate_recode WHERE application_id = ?`,
      [applicationId]
    );
    if (app[0]) {
      console.log(`Inserting notification for Villager_ID: ${app[0].Villager_ID}`);
      await pool.query(
        `INSERT INTO notifications (Villager_ID, message, created_at, is_read) 
         VALUES (?, ?, CURRENT_TIMESTAMP, FALSE)`,
        [app[0].Villager_ID, `Certificate for application ID ${applicationId} has been saved.`]
      ).catch((err) => {
        console.error(`Failed to insert notification:`, err);
        // Continue execution despite notification failure
      });
    }

    res.json({ message: "Certificate saved successfully", certificatePath });
  } catch (error) {
    console.error("Error in saveCertificate:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};
const getUserCertificateApplication = async (req, res) => {
  try {
    const { email } = req.user;
    console.log(`Fetching certificate application for user email: ${email || "undefined"}`);

    if (!email) {
      console.error("No email found in JWT token");
      return res.status(401).json({ error: "No email provided in token" });
    }

    // Fetch Villager_ID by email
    const villager = await Villager.getVillagerByEmail(email);
    if (!villager) {
      console.error(`Villager not found for email: ${email}`);
      return res.status(404).json({ error: "Villager not found" });
    }

    // Fetch the most recent certificate application for the villager
    const [applications] = await pool.query(
      `SELECT application_id 
       FROM villager_has_certificate_recode 
       WHERE Villager_ID = ? 
       AND status = 'Confirm' 
       ORDER BY apply_date DESC 
       LIMIT 1`,
      [villager.Villager_ID]
    );
    console.log(`Query result for Villager_ID ${villager.Villager_ID}:`, applications);

    if (!applications.length) {
      console.error(`No confirmed certificate application found for Villager_ID: ${villager.Villager_ID}`);
      return res.status(404).json({ error: "No confirmed certificate application found" });
    }

    const applicationId = applications[0].application_id;
    console.log(`Found application ID: ${applicationId} for Villager_ID: ${villager.Villager_ID}`);
    res.json({ applicationId });
  } catch (error) {
    console.error("Error in getUserCertificateApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
module.exports = {
  createCertificateApplication,
  getAllCertificateApplications,
  updateCertificateApplicationStatus,
  downloadDocument,
  getVillagerDetails,
  getApplicationDetails,
  saveCertificate,
 getUserCertificateApplication,
};