const NICApplication = require("../../models/villager/nicApplicationModel");
const path = require("path");
const fs = require("fs");

const createNICApplication = async (req, res) => {
  try {
    const { email, nicType } = req.body;
    const file = req.file; // Uploaded file from multer

    // Validate required fields
    if (!email || !nicType || !file) {
      return res.status(400).json({ error: "Email, NIC type, and document are required" });
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    // Get villager by email
    const villager = await NICApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    // Get NIC by type
    const nic = await NICApplication.getNICByType(nicType);
    if (!nic) {
      return res.status(404).json({ error: "NIC type not found" });
    }

    // Generate file name
    const fileName = `${villager.Villager_ID}_${nic.NIC_ID}_${Date.now()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads");
    const documentPath = `${fileName}`; // Store only the file name in the database

    // Ensure Uploads directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Save file to Uploads directory
    fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);

    // Save application to database
    const applyDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD
    await NICApplication.addNICApplication(
      villager.Villager_ID,
      nic.NIC_ID,
      applyDate,
      documentPath
    );

    res.status(201).json({ message: "NIC application submitted successfully" });
  } catch (error) {
    console.error("Error in createNICApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createNICApplication,
};