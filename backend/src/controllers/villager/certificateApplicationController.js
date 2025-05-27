const CertificateApplication = require("../../models/villager/certificateApplicationModel");
const Villager = require("../../models/villager/villagerModel");
const path = require("path");
const fs = require("fs");

const createCertificateApplication = async (req, res) => {
  try {
    const { email, reason } = req.body;
    const file = req.file;

    if (!email || !file || !reason) {
      return res.status(400).json({ error: "Email, document, and reason are required" });
    }

    if (reason.length > 255) {
      return res.status(400).json({ error: "Reason must be 255 characters or less" });
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    const villager = await CertificateApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    const fileName = `${villager.Villager_ID}_certificate_${Date.now()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads");
    const documentPath = `${fileName}`;

    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);

    const applyDate = new Date().toISOString().split("T")[0];
    await CertificateApplication.addCertificateApplication(
      villager.Villager_ID,
      applyDate,
      documentPath,
      reason
    );

    res.status(201).json({ message: "Certificate application submitted successfully" });
  } catch (error) {
    console.error("Error in createCertificateApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getAllCertificateApplications = async (req, res) => {
  try {
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

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'Approved' or 'Rejected'" });
    }

    const updated = await CertificateApplication.updateCertificateApplicationStatus(applicationId, status);
    if (!updated) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Certificate application status updated successfully" });
  } catch (error) {
    console.error("Error in updateCertificateApplicationStatus:", error);
    res.status(400).json({ error: error.message || "Server error", details: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../../../Uploads", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ error: "Error downloading file", details: err.message });
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
    const villager = await Villager.getVillagerById(villagerId);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }
    const applications = await CertificateApplication.getVillagerCertificateApplications(villagerId);
    res.json({ ...villager, certificateApplications: applications });
  } catch (error) {
    console.error("Error in getVillagerDetails:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createCertificateApplication,
  getAllCertificateApplications,
  updateCertificateApplicationStatus,
  downloadDocument,
  getVillagerDetails,
};