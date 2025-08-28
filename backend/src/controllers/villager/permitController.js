const Permit = require("../../models/villager/permitModel");

const getPermits = async (req, res) => {
  try {
    const permits = await Permit.getAllPermits();
    if (!permits || permits.length === 0) {
      console.warn("No permits found in database");
      return res.status(404).json({ error: "No permits found" });
    }
    res.json(permits);
  } catch (error) {
    console.error("Error in getPermits:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getPermit = async (req, res) => {
  try {
    const permit = await Permit.getPermitById(req.params.id);
    if (!permit) {
      console.warn(`Permit ID ${req.params.id} not found`);
      return res.status(404).json({ error: "Permit not found" });
    }
    res.json(permit);
  } catch (error) {
    console.error("Error in getPermit:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const checkVillagerPermitApplication = async (req, res) => {
  try {
    const { villagerId, year, month } = req.body;
    if (!villagerId || !year || !month) {
      return res.status(400).json({ error: "Villager ID, year, and month are required" });
    }
    const applications = await Permit.checkVillagerPermitApplication(villagerId, year, month);
    res.json(applications);
  } catch (error) {
    console.error("Error in checkVillagerPermitApplication:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  getPermits,
  getPermit,
  checkVillagerPermitApplication,
};