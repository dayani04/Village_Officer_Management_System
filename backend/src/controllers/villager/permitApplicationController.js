const PermitApplication = require("../../models/villager/permitApplicationModel");
const path = require("path");
const fs = require("fs");

const createPermitApplication = async (req, res) => {
  try {
    const { email, permitType } = req.body;
    const files = req.files || {};

    console.log("Raw req.files:", files);
    console.log("Raw req.body:", req.body);

    const document = files.document && files.document.length > 0 ? files.document[0] : null;
    const policeReport = files.policeReport && files.policeReport.length > 0 ? files.policeReport[0] : null;

    console.log("Received data:", {
      email,
      permitType,
      document: document ? document.originalname : "undefined",
      policeReport: policeReport ? policeReport.originalname : "undefined",
    });

    if (!email || !permitType || !document || !policeReport) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ error: "Email, permit type, ID document, and police report are required" });
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(document.mimetype) || !allowedTypes.includes(policeReport.mimetype)) {
      console.log("Validation failed: Invalid file type");
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    const villager = await PermitApplication.getVillagerByEmail(email);
    if (!villager) {
      console.log("Validation failed: Villager not found for email", email);
      return res.status(404).json({ error: "Villager not found" });
    }

    const permit = await PermitApplication.getPermitByType(permitType);
    if (!permit) {
      console.log("Validation failed: Permit type not found", permitType);
      return res.status(400).json({ error: `Permit type '${permitType}' not found` });
    }

    const timestamp = Date.now();
    const documentFileName = `${villager.Villager_ID}_${permit.Permits_ID}_doc_${timestamp}${path.extname(document.originalname)}`;
    const policeReportFileName = `${villager.Villager_ID}_${permit.Permits_ID}_police_${timestamp}${path.extname(policeReport.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads");
    const documentPath = `${documentFileName}`;
    const policeReportPath = `${policeReportFileName}`;

    fs.mkdirSync(uploadDir, { recursive: true });

    fs.writeFileSync(path.join(uploadDir, documentFileName), document.buffer);
    fs.writeFileSync(path.join(uploadDir, policeReportFileName), policeReport.buffer);

    const applyDate = new Date().toISOString().split("T")[0];
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

const getPermitApplications = async (req, res) => {
  try {
    const applications = await PermitApplication.getAllPermitApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getPermitApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getConfirmedPermitApplications = async (req, res) => {
  try {
    const applications = await PermitApplication.getConfirmedPermitApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getConfirmedPermitApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updatePermitApplicationStatus = async (req, res) => {
  try {
    const { villagerId, permitsId } = req.params;
    const { status } = req.body;

    console.log("Received update request:", {
      villagerId,
      permitsId,
      rawBody: req.body,
      status,
    });

    if (!status) {
      console.log("Validation failed: Status is missing");
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["Pending", "Send", "Rejected", "Confirm"];
    if (!validStatuses.includes(status)) {
      console.log("Validation failed: Invalid status", status);
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updated = await PermitApplication.updatePermitApplicationStatus(villagerId, permitsId, status);
    if (!updated) {
      return res.status(404).json({ error: "Permit application not found" });
    }

    res.json({ message: "Permit application status updated successfully" });
  } catch (error) {
    console.error("Error in updatePermitApplicationStatus:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = await PermitApplication.getFilePath(filename);
    if (!filePath) {
      return res.status(404).json({ error: "File not found" });
    }

    const fullPath = path.join(__dirname, "../../../Uploads", filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.download(fullPath, filename);
  } catch (error) {
    console.error("Error in downloadDocument:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createPermitApplication,
  getPermitApplications,
  getConfirmedPermitApplications,
  updatePermitApplicationStatus,
  downloadDocument,
};