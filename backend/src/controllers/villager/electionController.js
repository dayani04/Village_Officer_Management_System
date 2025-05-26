// controllers/villager/electionController.js
const Election = require("../../models/villager/electionModel");

const getElections = async (req, res) => {
  try {
    const elections = await Election.getAllElections();
    if (!elections || elections.length === 0) {
      console.warn("No elections found in database");
      return res.status(404).json({ error: "No elections found" });
    }
    res.json(elections);
  } catch (error) {
    console.error("Error in getElections:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getElection = async (req, res) => {
  try {
    const election = await Election.getElectionById(req.params.id);
    if (!election) {
      console.warn(`Election ID ${req.params.id} not found`);
      return res.status(404).json({ error: "Election not found" });
    }
    res.json(election);
  } catch (error) {
    console.error("Error in getElection:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  getElections,
  getElection,
};