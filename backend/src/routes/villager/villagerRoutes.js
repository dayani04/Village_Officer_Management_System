const express = require('express');
const villagerController = require('../../controllers/villager/villagerController');
const authenticate = require('../../middleware/authMiddleware');
const router = express.Router();

router.post("/", villagerController.createVillager);
router.post("/login", villagerController.loginVillager);
router.post("/request-otp", villagerController.requestPasswordOtp); // New route for email-based OTP request

router.use(authenticate);

router.get("/", villagerController.getVillagers);
router.get("/profile", villagerController.getProfile);
router.get("/:id", villagerController.getVillager);
router.put("/:id", villagerController.updateVillager);
router.delete("/:id", villagerController.deleteVillager);
router.put("/:id/status", villagerController.updateUserStatus);
router.put("/:id/location", villagerController.updateVillagerLocation);
router.get("/:id/location", villagerController.getVillagerLocation);
router.post("/:id/verify-otp", villagerController.verifyPasswordOtp);


router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Villager");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching villagers:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

router.get("/:villagerId", async (req, res) => {
  try {
    const { villagerId } = req.params;
    const [rows] = await pool.query("SELECT * FROM Villager WHERE Villager_ID = ?", [villagerId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Villager not found" });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching villager:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;