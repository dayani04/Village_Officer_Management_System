const express = require("express");
const allowanceController = require("../../controllers/villager/allowanceController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Protected routes
router.get("/", authenticate, allowanceController.getAllowances);
router.get("/:id", authenticate, allowanceController.getAllowance);
router.get("/:allowanceId", async (req, res) => {
  try {
    const { allowanceId } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM Allowances_recode WHERE Allowances_ID = ?",
      [allowanceId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Allowance not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching allowance:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;