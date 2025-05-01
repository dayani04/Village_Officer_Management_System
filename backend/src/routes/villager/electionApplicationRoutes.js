const express = require("express");
const multer = require("multer");
const electionApplicationController = require("../../controllers/villager/electionApplicationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Protected route for submitting election application
router.post(
  "/",
  authenticate,
  upload.single("document"),
  electionApplicationController.createElectionApplication
);

module.exports = router;