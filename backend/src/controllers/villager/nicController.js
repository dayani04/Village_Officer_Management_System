const NIC = require("../../models/villager/nicModel");

const getNICs = async (req, res) => {
  try {
    const nics = await NIC.getAllNICs();
    res.json(nics);
  } catch (error) {
    console.error("Error in getNICs:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getNIC = async (req, res) => {
  try {
    const nic = await NIC.getNICById(req.params.id);
    if (!nic) return res.status(404).json({ error: "NIC not found" });
    res.json(nic);
  } catch (error) {
    console.error("Error in getNIC:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  getNICs,
  getNIC,
};