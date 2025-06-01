const express = require("express");
const allowanceController = require("../../controllers/villager/allowanceController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Protected routes
router.get("/", authenticate, allowanceController.getAllowances);
router.get("/:id", authenticate, allowanceController.getAllowance);

module.exports = router;