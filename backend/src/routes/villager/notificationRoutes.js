const express = require("express");
const notificationController = require("../../controllers/villager/notificationController");
const authenticateToken = require("../../middleware/authMiddleware");
const router = express.Router();

// Send notification to a single villager
router.post("/single", authenticateToken, notificationController.saveNotification);

// Send notification to all villagers (admin only)
router.post("/all", authenticateToken, notificationController.saveNotificationToAll);

// Get notifications for a specific villager
router.get("/villagers/notifications", authenticateToken, notificationController.getVillagerNotifications);

// Get all notifications (admin only)
router.get("/", authenticateToken, notificationController.getAllNotifications);

// Mark a notification as read
router.put("/:notificationId/read", authenticateToken, notificationController.markNotificationAsRead);

module.exports = router;