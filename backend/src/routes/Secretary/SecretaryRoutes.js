const express = require("express");
const secretaryController = require("../../controllers/Secretary/SecretaryContrall"); // Fixed typo
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Public routes
router.post("/", secretaryController.createSecretary);
router.post("/login", secretaryController.loginSecretary);
router.post("/request-otp", secretaryController.requestPasswordOtp);

// Protected routes
router.get("/", authenticate, secretaryController.getSecretaries);
router.get("/profile", authenticate, secretaryController.getProfile);
router.get("/:id", authenticate, secretaryController.getSecretary);
router.put("/:id", authenticate, secretaryController.updateSecretary);
router.delete("/:id", authenticate, secretaryController.deleteSecretary);
router.put("/:id/status", authenticate, secretaryController.updateSecretaryStatus);
router.put("/:id/password", authenticate, secretaryController.updateSecretaryPassword);
router.post("/:id/verify-otp", authenticate, secretaryController.verifyPasswordOtp);

module.exports = router;