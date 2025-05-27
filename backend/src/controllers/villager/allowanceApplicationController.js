const AllowanceApplication = require("../../models/villager/allowanceApplicationModel");
const path = require("path");
const fs = require("fs").promises;

const createAllowanceApplication = async (req, res) => {
  try {
    const { email, allowanceType } = req.body;
    const file = req.file;

    if (!email || !allowanceType || !file) {
      return res.status(400).json({ error: "Email, allowance type, and document are required" });
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    const villager = await AllowanceApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    const allowance = await AllowanceApplication.getAllowanceByType(allowanceType);
    if (!allowance) {
      return res.status(404).json({ error: "Allowance type not found" });
    }

    const fileName = `${villager.Villager_ID}_${allowance.Allowances_ID}_${Date.now()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(__dirname, "../../Uploads");
    const documentPath = `${fileName}`;

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, fileName), file.buffer);

    const applyDate = new Date().toISOString().split("T")[0];
    const result = await AllowanceApplication.addAllowanceApplication(
      villager.Villager_ID,
      allowance.Allowances_ID,
      applyDate,
      documentPath
    );

    res.status(201).json({ message: "Allowance application submitted successfully", result });
  } catch (error) {
    console.error("Error in createAllowanceApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getAllowanceApplications = async (req, res) => {
  try {
    const applications = await AllowanceApplication.getAllAllowanceApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getAllowanceApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getConfirmedAllowanceApplications = async (req, res) => {
  try {
    const applications = await AllowanceApplication.getConfirmedAllowanceApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getConfirmedAllowanceApplications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getAllowanceApplicationsByVillagerId = async (req, res) => {
  try {
    const { villagerId } = req.params;
    const applications = await AllowanceApplication.getAllowanceApplicationsByVillagerId(villagerId);
    if (!applications || applications.length === 0) {
      return res.status(404).json({ error: `No allowance applications found for Villager ID ${villagerId}` });
    }
    res.json(applications);
  } catch (error) {
    console.error("Error in getAllowanceApplicationsByVillagerId:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const updateAllowanceApplicationStatus = async (req, res) => {
  try {
    const { villagerId, allowancesId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updated = await AllowanceApplication.updateAllowanceApplicationStatus(villagerId, allowancesId, status);
    if (!updated) {
      return res.status(404).json({ error: "Allowance application not found" });
    }

    res.json({ message: "Allowance application status updated successfully" });
  } catch (error) {
    console.error("Error in updateAllowanceApplicationStatus:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const downloadDocument = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = await AllowanceApplication.getFilePath(filename);
    if (!filePath) {
      return res.status(404).json({ error: "File not found" });
    }

    const fullPath = path.join(__dirname, "../../Uploads", filePath);
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    res.download(fullPath, filename);
  } catch (error) {
    console.error("Error in downloadDocument:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getVillagerById = async (req, res) => {
  try {
    const { villagerId } = req.params;
    const villager = await AllowanceApplication.getVillagerById(villagerId);
    if (!villager) {
      return res.status(404).json({ error: `Villager ID ${villagerId} not found` });
    }
    res.json(villager);
  } catch (error) {
    console.error("Error in getVillagerById:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createAllowanceApplication,
  getAllowanceApplications,
  getConfirmedAllowanceApplications,
  getAllowanceApplicationsByVillagerId,
  updateAllowanceApplicationStatus,
  downloadDocument,
  getVillagerById,
};