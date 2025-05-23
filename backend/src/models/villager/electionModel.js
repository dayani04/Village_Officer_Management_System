// models/villager/electionModel.js
const pool = require("../../config/database");

const getAllElections = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM Election_recode");
    console.log("Fetched elections from DB:", rows);
    return rows;
  } catch (error) {
    console.error("Error in getAllElections:", error);
    throw error;
  }
};

const getElectionById = async (id) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Election_recode WHERE ID = ?", [id]);
    console.log(`Fetched election ID ${id} from DB:`, rows[0]);
    return rows[0];
  } catch (error) {
    console.error("Error in getElectionById:", error);
    throw error;
  }
};

module.exports = {
  getAllElections,
  getElectionById,
};