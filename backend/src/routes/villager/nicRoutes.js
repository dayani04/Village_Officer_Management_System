const express = require("express");
const nicController = require("../../controllers/villager/nicController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Protected routes
router.get("/", authenticate, nicController.getNICs);
router.get("/:id", authenticate, nicController.getNIC);

module.exports = router;