const express = require('express');
const villagerController = require('../../controllers/villager/villagerController');
const allowanceApplicationController = require('../../controllers/villager/allowanceApplicationController');
const authenticate = require('../../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post("/", villagerController.createVillager);
router.post("/login", villagerController.loginVillager);
router.post("/request-otp", villagerController.requestPasswordOtp);

// Protected routes
router.use(authenticate);

router.get("/", villagerController.getVillagers);
router.get("/profile", villagerController.getProfile);
router.get("/notifications", villagerController.getNotifications);
router.get("/:villagerId", allowanceApplicationController.getVillagerById);
router.put("/:id", villagerController.updateVillager);
router.delete("/:id", villagerController.deleteVillager);
router.put("/:id/status", villagerController.updateUserStatus);
router.put("/:id/location", villagerController.updateVillagerLocation);
router.get("/:id/location", villagerController.getVillagerLocation);
router.post("/:id/verify-otp", villagerController.verifyPasswordOtp);
router.post("/:id/notification", villagerController.sendNotification);
router.put("/notifications/:id/read", villagerController.markNotificationAsRead);

module.exports = router;