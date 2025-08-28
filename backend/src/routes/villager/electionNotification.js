const express = require("express");
const electionNotificationController = require("../../controllers/villager/electionNotificationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticate, electionNotificationController.createElectionNotification);
router.get("/", authenticate, electionNotificationController.getElectionNotifications);
router.delete("/:notificationId", authenticate, electionNotificationController.deleteElectionNotification);

module.exports = router;