const express = require("express");
const notificationController = require("../../controllers/villager/notificationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticate, notificationController.saveNotification);

module.exports = router;