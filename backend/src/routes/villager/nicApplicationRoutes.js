const express = require("express");
const multer = require("multer");
const nicApplicationController = require("../../controllers/villager/nicApplicationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Protected route for submitting NIC application
router.post(
  "/",
  authenticate,
  upload.single("document"),
  nicApplicationController.createNICApplication
);

module.exports = router;