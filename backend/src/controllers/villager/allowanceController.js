const Allowance = require("../../models/villager/allowanceModel");

const getAllowances = async (req, res) => {
  try {
    const allowances = await Allowance.getAllAllowances();
    if (!allowances || allowances.length === 0) {
      console.warn("No allowances found in database");
      return res.status(404).json({ error: "No allowances found" });
    }
    res.json(allowances);
  } catch (error) {
    console.error("Error in getAllowances:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getAllowance = async (req, res) => {
  try {
    const allowance = await Allowance.getAllowanceById(req.params.id);
    if (!allowance) {
      console.warn(`Allowance ID ${req.params.id} not found`);
      return res.status(404).json({ error: "Allowance not found" });
    }
    res.json(allowance);
  } catch (error) {
    console.error("Error in getAllowance:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const checkVillagerAllowanceApplication = async (req, res) => {
  try {
    const { villagerId } = req.body;
    if (!villagerId) {
      return res.status(400).json({ error: "Villager ID is required" });
    }
    const applications = await Allowance.checkVillagerAllowanceApplication(villagerId);
    res.json(applications);
  } catch (error) {
    console.error("Error in checkVillagerAllowanceApplication:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  getAllowances,
  getAllowance,
  checkVillagerAllowanceApplication,
};