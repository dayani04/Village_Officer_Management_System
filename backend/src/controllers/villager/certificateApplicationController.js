const CertificateApplication = require("../../models/villager/certificateApplicationModel");
const path = require("path");
const fs = require("fs");

const createCertificateApplication = async (req, res) => {
  try {
    const { email } = req.body;
    const file = req.file; // Uploaded file from multer

    // Validate required fields
    if (!email || !file) {
      return res.status(400).json({ error: "Email and document are required" });
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    // Get villager by email
    const villager = await CertificateApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    // Generate file name
    const fileName = `${villager.Villager_ID}_certificate_${Date.now()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads");
    const documentPath = `${fileName}`; // Store only the file name in the database

    // Ensure Uploads directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Save file to Uploads directory
    fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);

    // Save application to database
    const applyDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD
    await CertificateApplication.addCertificateApplication(
      villager.Villager_ID,
      applyDate,
      documentPath
    );

    res.status(201).json({ message: "Certificate application submitted successfully" });
  } catch (error) {
    console.error("Error in createCertificateApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createCertificateApplication,
};