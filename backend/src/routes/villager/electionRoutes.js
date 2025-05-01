const express = require("express");
const electionController = require("../../controllers/villager/electionController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

// Public routes (can be protected with authentication if needed)
router.get("/",authenticate, electionController.getElections);
router.get("/:id",authenticate, electionController.getElection);

module.exports = router;