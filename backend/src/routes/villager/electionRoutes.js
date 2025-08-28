const express = require("express");
const electionController = require("../../controllers/villager/electionController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/", authenticate, electionController.getElections);
router.get("/:id", authenticate, electionController.getElection);
router.post("/check-application", authenticate, electionController.checkVillagerElectionApplication);

module.exports = router;