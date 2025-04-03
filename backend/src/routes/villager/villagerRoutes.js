const express = require('express');
const villagerController = require('../../controllers/villager/villagerController');
const authenticate = require('../../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/', villagerController.createVillager); // Create a new villager
router.post('/login', villagerController.loginVillager); // Login

// Protected routes (authentication required)
router.get('/', authenticate, villagerController.getVillagers); // Get all villagers
router.get('/:id', authenticate, villagerController.getVillager); // Get a single villager
router.put('/:id', authenticate, villagerController.updateVillager); // Update villager details
router.delete('/:id', authenticate, villagerController.deleteVillager); // Delete villager
router.put('/:id/status', authenticate, villagerController.updateUserStatus); // Update villager status
router.put('/:id/password', authenticate, villagerController.updateUserPassword); // Update password

// Profile route
router.get('/profile', authenticate, villagerController.getProfile); // Get user profile


module.exports = router;
