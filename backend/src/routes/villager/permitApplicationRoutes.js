const express = require("express");
const multer = require("multer");
const permitApplicationController = require("../../controllers/villager/permitApplicationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Configure multer for multiple file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
}).fields([
  { name: "document", maxCount: 1 },
  { name: "policeReport", maxCount: 1 },
]);

// Protected route for submitting permit application
router.post(
  "/",
  authenticate,
  upload,
  permitApplicationController.createPermitApplication
);

module.exports = router;