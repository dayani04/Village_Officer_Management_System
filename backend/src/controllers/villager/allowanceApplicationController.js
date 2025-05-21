const AllowanceApplication = require("../../models/villager/allowanceApplicationModel");
const path = require("path");
const fs = require("fs");

const createAllowanceApplication = async (req, res) => {
  try {
    const { email, allowanceType } = req.body;
    const file = req.file; // Uploaded file from multer

    // Validate required fields
    if (!email || !allowanceType || !file) {
      return res.status(400).json({ error: "Email, allowance type, and document are required" });
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    // Get villager by email
    const villager = await AllowanceApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    // Get allowance by type
    const allowance = await AllowanceApplication.getAllowanceByType(allowanceType);
    if (!allowance) {
      return res.status(404).json({ error: "Allowance type not found" });
    }

    // Generate file name
    const fileName = `${villager.Villager_ID}_${allowance.Allowances_ID}_${Date.now()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads");
    const documentPath = `${fileName}`; // Store only the file name in the database

    // Ensure Uploads directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Save file to Uploads directory
    fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);

    // Save application to database
    const applyDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD
    await AllowanceApplication.addAllowanceApplication(
      villager.Villager_ID,
      allowance.Allowances_ID,
      applyDate,
      documentPath
    );

    res.status(201).json({ message: "Allowance application submitted successfully" });
  } catch (error) {
    console.error("Error in createAllowanceApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createAllowanceApplication,
};