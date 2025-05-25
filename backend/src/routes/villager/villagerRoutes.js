const express = require('express');
const villagerController = require('../../controllers/villager/villagerController');
const authenticate = require('../../middleware/authMiddleware');
const router = express.Router();

router.post("/", villagerController.createVillager);
router.post("/login", villagerController.loginVillager);
router.post("/request-otp", villagerController.requestPasswordOtp);

router.use(authenticate);

router.get("/", villagerController.getVillagers);
router.get("/profile", villagerController.getProfile);
router.get("/notifications", villagerController.getNotifications);
router.get("/:id", villagerController.getVillager);
router.put("/:id", villagerController.updateVillager);
router.delete("/:id", villagerController.deleteVillager);
router.put("/:id/status", villagerController.updateUserStatus);
router.put("/:id/location", villagerController.updateVillagerLocation);
router.get("/:id/location", villagerController.getVillagerLocation);
router.post("/:id/verify-otp", villagerController.verifyPasswordOtp);
router.post("/:id/notification", villagerController.sendNotification);
router.put("/notifications/:id/read", villagerController.markNotificationAsRead);

module.exports = router;