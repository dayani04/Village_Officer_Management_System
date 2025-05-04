const PermitApplication = require("../../models/villager/permitApplicationModel");
const path = require("path");
const fs = require("fs");

const createPermitApplication = async (req, res) => {
  try {
    const { email, permitType } = req.body;
    const files = req.files || {};

    // Log raw req.files and req.body
    console.log("Raw req.files:", files);
    console.log("Raw req.body:", req.body);

    // Extract files from arrays
    const document = files.document && files.document.length > 0 ? files.document[0] : null;
    const policeReport = files.policeReport && files.policeReport.length > 0 ? files.policeReport[0] : null;

    // Log received data
    console.log("Received data:", {
      email,
      permitType,
      document: document ? document.originalname : "undefined",
      policeReport: policeReport ? policeReport.originalname : "undefined",
    });

    // Validate required fields
    if (!email || !permitType || !document || !policeReport) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ error: "Email, permit type, ID document, and police report are required" });
    }

    // Validate file types
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(document.mimetype) || !allowedTypes.includes(policeReport.mimetype)) {
      console.log("Validation failed: Invalid file type");
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    // Get villager by email
    const villager = await PermitApplication.getVillagerByEmail(email);
    if (!villager) {
      console.log("Validation failed: Villager not found for email", email);
      return res.status(404).json({ error: "Villager not found" });
    }

    // Get permit by type
    const permit = await PermitApplication.getPermitByType(permitType);
    if (!permit) {
      console.log("Validation failed: Permit type not found", permitType);
      return res.status(400).json({ error: `Permit type '${permitType}' not found` });
    }

    // Generate file names
    const timestamp = Date.now();
    const documentFileName = `${villager.Villager_ID}_${permit.Permits_ID}_doc_${timestamp}${path.extname(document.originalname)}`;
    const policeReportFileName = `${villager.Villager_ID}_${permit.Permits_ID}_police_${timestamp}${path.extname(policeReport.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads");
    const documentPath = `${documentFileName}`;
    const policeReportPath = `${policeReportFileName}`;

    // Ensure Uploads directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Save files to Uploads directory
    fs.writeFileSync(path.join(uploadDir, documentFileName), document.buffer);
    fs.writeFileSync(path.join(uploadDir, policeReportFileName), policeReport.buffer);

    // Save application to database
    const applyDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD
    await PermitApplication.addPermitApplication(
      villager.Villager_ID,
      permit.Permits_ID,
      applyDate,
      documentPath,
      policeReportPath
    );

    res.status(201).json({ message: "Permit application submitted successfully" });
  } catch (error) {
    console.error("Error in createPermitApplication:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createPermitApplication,
};