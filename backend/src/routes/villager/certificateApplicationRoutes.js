const express = require("express");
const multer = require("multer");
const certificateApplicationController = require("../../controllers/villager/certificateApplicationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Protected route for submitting certificate application
router.post(
  "/",
  authenticate,
  upload.single("document"),
  certificateApplicationController.createCertificateApplication
);

module.exports = router;