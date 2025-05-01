const ElectionApplication = require("../../models/villager/electionApplicationModel");
const path = require("path");
const fs = require("fs");


const createElectionApplication = async (req, res) => {
  try {
    const { email, electionType } = req.body;
    const file = req.file; // Uploaded file from multer

    // Validate required fields
    if (!email || !electionType || !file) {
      return res.status(400).json({ error: "Email, election type, and ID document are required" });
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    // Get villager by email
    const villager = await ElectionApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    // Get election by type
    const election = await ElectionApplication.getElectionByType(electionType);
    if (!election) {
      return res.status(404).json({ error: "Election type not found" });
    }

    // Generate file name (without /uploads/ prefix)
    const fileName = `${villager.Villager_ID}_${election.ID}_${Date.now()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads"); // Correct path to Uploads directory
    const documentPath = `${fileName}`; // Store only the file name in the database

    // Ensure Uploads directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Save file to Uploads directory
    fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);

    // Save application to database
    const applyDate = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD
    await ElectionApplication.addElectionApplication(
      villager.Villager_ID,
      election.ID,
      applyDate,
      documentPath
    );

    res.status(201).json({ message: "Election application submitted successfully" });
  } catch (error) {
    console.error("Error in createElectionApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createElectionApplication,
};