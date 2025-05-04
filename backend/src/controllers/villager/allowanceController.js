const Allowance = require("../../models/villager/allowanceModel");

const getAllowances = async (req, res) => {
  try {
    const allowances = await Allowance.getAllAllowances();
    res.json(allowances);
  } catch (error) {
    console.error("Error in getAllowances:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getAllowance = async (req, res) => {
  try {
    const allowance = await Allowance.getAllowanceById(req.params.id);
    if (!allowance) return res.status(404).json({ error: "Allowance not found" });
    res.json(allowance);
  } catch (error) {
    console.error("Error in getAllowance:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  getAllowances,
  getAllowance,
};