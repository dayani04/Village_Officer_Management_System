const NICApplication = require("../../models/villager/nicApplicationModel");
const path = require("path");
const fs = require("fs");

const createNICApplication = async (req, res) => {
  try {
    const { email, nicType } = req.body;
    const file = req.file;

    if (!email || !nicType || !file) {
      return res.status(400).json({ error: "Email, NIC type, and document are required" });
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Only PDF, PNG, or JPG files are allowed" });
    }

    const villager = await NICApplication.getVillagerByEmail(email);
    if (!villager) {
      return res.status(404).json({ error: "Villager not found" });
    }

    const nic = await NICApplication.getNICByType(nicType);
    if (!nic) {
      return res.status(404).json({ error: "NIC type not found" });
    }

    const fileName = `${villager.Villager_ID}_${nic.NIC_ID}_${Date.now()}${path.extname(file.originalname)}`;
    const uploadDir = path.join(__dirname, "../../../Uploads");
    const documentPath = `${fileName}`;

    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, fileName), file.buffer);

    const applyDate = new Date().toISOString().split("T")[0];
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

const getAllNICApplications = async (req, res) => {
  try {
    const applications = await NICApplication.getAllNICApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error in getAllNICApplications:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const updateNICApplicationStatus = async (req, res) => {
  try {
    const { villagerId, nicId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Send", "Rejected","Confirm"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await NICApplication.updateNICApplicationStatus(villagerId, nicId, status);
    if (!updated) {
      return res.status(404).json({ error: "NIC application not found" });
    }

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error in updateNICApplicationStatus:", error);
    res.status(500).json({ error: "Server error", details: error.message });
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
        res.status(500).json({ error: "Failed to download file" });
      }
    });
  } catch (error) {
    console.error("Error in downloadDocument:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createNICApplication,
  getAllNICApplications,
  updateNICApplicationStatus,
  downloadDocument,
};