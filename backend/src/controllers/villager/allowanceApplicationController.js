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
    const applicationId = await AllowanceApplication.addAllowanceApplication(
      villager.Villager_ID,
      allowance.Allowances_ID,
      applyDate,
      documentPath
    );

    res.status(201).json({ message: "Allowance application submitted successfully", applicationId });
  } catch (error) {
    console.error("Error in createAllowanceApplication:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getAllowanceApplications = async (req, res) => {
  try {
    const applications = await AllowanceApplication.getAllowanceApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getAllowanceApplications:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getAllowanceApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await AllowanceApplication.getAllowanceApplicationById(applicationId);
    if (!application) {
      return res.status(404).json({ error: `Application ID ${applicationId} not found` });
    }
    res.json(application);
  } catch (error) {
    console.error("Error in getAllowanceApplicationById:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const updateAllowanceApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await AllowanceApplication.getAllowanceApplicationById(applicationId);
    if (!application) {
      return res.status(404).json({ error: `Application ID ${applicationId} not found` });
    }

    await AllowanceApplication.updateAllowanceApplicationStatus(applicationId, status);
    res.json({ message: `Application ${status} successfully` });
  } catch (error) {
    console.error("Error in updateAllowanceApplicationStatus:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createAllowanceApplication,
  getAllowanceApplications,
  getAllowanceApplicationById,
  updateAllowanceApplicationStatus,
};