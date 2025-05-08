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

module.exports = router;