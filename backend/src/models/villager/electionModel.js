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

const getElectionByType = async (type) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Election_recode WHERE Type = ?", [type]);
    console.log(`Fetched election type ${type} from DB:`, rows[0]);
    return rows[0];
  } catch (error) {
    console.error("Error in getElectionByType:", error);
    throw error;
  }
};

const checkVillagerElectionApplication = async (villagerId, electionType) => {
  try {
    const [rows] = await pool.query(
      `SELECT vhe.application_id, vhe.electionrecodeID, er.Type
       FROM villager_hase_election_recode vhe
       JOIN Election_recode er ON vhe.electionrecodeID = er.ID
       WHERE vhe.Villager_ID = ? AND er.Type = ?`,
      [villagerId, electionType]
    );
    console.log(`Fetched applications for villager ${villagerId} for election type ${electionType}:`, rows);
    return rows;
  } catch (error) {
    console.error(`Error in checkVillagerElectionApplication for villager ${villagerId}:`, error);
    throw error;
  }
};

module.exports = {
  getAllElections,
  getElectionById,
  getElectionByType,
  checkVillagerElectionApplication,
};