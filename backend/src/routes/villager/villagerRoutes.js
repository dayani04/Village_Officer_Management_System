const express = require('express');
const villagerController = require('../../controllers/villager/villagerController');
const authenticate = require('../../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post("/", villagerController.createVillager);
router.post("/login", villagerController.loginVillager);

// Protected routes
router.get("/", authenticate, villagerController.getVillagers);
router.get("/:id", authenticate, villagerController.getVillager);
router.put("/:id", authenticate, villagerController.updateVillager);
router.delete("/:id", authenticate, villagerController.deleteVillager);
router.put("/:id/status", authenticate, villagerController.updateUserStatus);
router.put("/:id/password", authenticate, villagerController.updateUserPassword);
router.get("/profile", authenticate, villagerController.getProfile);

module.exports = router;
