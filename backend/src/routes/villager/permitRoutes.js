const express = require("express");
const permitController = require("../../controllers/villager/permitController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Protected routes
router.get("/", authenticate, permitController.getPermits);
router.get("/:id", authenticate, permitController.getPermit);

module.exports = router;