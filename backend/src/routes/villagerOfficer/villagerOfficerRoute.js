const express = require('express');
const villagerOfficerController = require('../../controllers/villagerOfficer/villagerOfficerControll');
const authenticate = require('../../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post("/", villagerOfficerController.createVillagerOfficer);
router.post("/login", villagerOfficerController.loginVillagerOfficer);

// Protected routes
router.get("/", authenticate, villagerOfficerController.getVillagerOfficers);
router.get("/:id", authenticate, villagerOfficerController.getVillagerOfficer);
router.put("/:id", authenticate, villagerOfficerController.updateVillagerOfficer);
router.delete("/:id", authenticate, villagerOfficerController.deleteVillagerOfficer);
router.put("/:id/status", authenticate, villagerOfficerController.updateOfficerStatus);
router.put("/:id/password", authenticate, villagerOfficerController.updateOfficerPassword);
router.get("/profile", authenticate, villagerOfficerController.getProfile);

module.exports = router;