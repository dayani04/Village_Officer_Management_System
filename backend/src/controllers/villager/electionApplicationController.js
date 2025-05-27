const ElectionApplication = require("../../models/villager/electionApplicationModel");
const path = require("path");
const fs = require("fs");

const createElectionApplication = async (req, res) => {
  try {
    const { email, electionType } = req.body;
    const file = req.file;

    if (!email || !electionType || !file) {
      return res.status(400).json({ error: "Email, election type, and ID document are required" });
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    const villager = await ElectionApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    const election = await ElectionApplication.getElectionByType(electionType);
    if (!election) {
      return res.status(404).json({ error: "Election type not found" });
    }

    const fileName = `${villager.Villager_ID}_${election.ID}_${Date.now()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads");
    const documentPath = `${fileName}`;

    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);

    const applyDate = new Date().toISOString().split("T")[0];
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

const getElectionApplications = async (req, res) => {
  try {
    const applications = await ElectionApplication.getAllElectionApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getElectionApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getConfirmedElectionApplications = async (req, res) => {
  try {
    const applications = await ElectionApplication.getConfirmedElectionApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getConfirmedElectionApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateElectionApplicationStatus = async (req, res) => {
  try {
    const { villagerId, electionrecodeID } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["Pending", "Send", "Rejected", "Confirm"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updated = await ElectionApplication.updateElectionApplicationStatus(villagerId, electionrecodeID, status);
    if (!updated) {
      return res.status(404).json({ error: "Election application not found" });
    }

    res.json({ message: "Election application status updated successfully" });
  } catch (error) {
    console.error("Error in updateElectionApplicationStatus:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = await ElectionApplication.getFilePath(filename);
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
  createElectionApplication,
  getElectionApplications,
  getConfirmedElectionApplications,
  updateElectionApplicationStatus,
  downloadDocument,
};