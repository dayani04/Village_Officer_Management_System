const express = require("express");
const multer = require("multer");
const allowanceApplicationController = require("../../controllers/villager/allowanceApplicationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Protected route for submitting allowance application
router.post(
  "/",
  authenticate,
  upload.single("document"),
  allowanceApplicationController.createAllowanceApplication
);

module.exports = router;