const Permit = require("../../models/villager/permitModel");

const getPermits = async (req, res) => {
  try {
    const permits = await Permit.getAllPermits();
    res.json(permits);
  } catch (error) {
    console.error("Error in getPermits:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getPermit = async (req, res) => {
  try {
    const permit = await Permit.getPermitById(req.params.id);
    if (!permit) return res.status(404).json({ error: "Permit not found" });
    res.json(permit);
  } catch (error) {
    console.error("Error in getPermit:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  getPermits,
  getPermit,
};