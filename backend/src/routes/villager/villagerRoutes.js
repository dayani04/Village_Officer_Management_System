const express = require('express');
const villagerController = require('../../controllers/villager/villagerController');
const authenticate = require('../../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post("/", villagerController.createVillager);
router.post("/login", villagerController.loginVillager);

// Protected routes
router.get("/", authenticate, villagerController.getVillagers);
router.get("/profile", authenticate, villagerController.getProfile);
router.get("/:id", authenticate, villagerController.getVillager);
router.put("/:id", authenticate, villagerController.updateVillager);
router.delete("/:id", authenticate, villagerController.deleteVillager);
router.put("/:id/status", authenticate, villagerController.updateUserStatus);
router.post("/:id/request-otp", authenticate, villagerController.requestPasswordOtp);
router.post("/:id/verify-otp", authenticate, villagerController.verifyPasswordOtp);

module.exports = router;
