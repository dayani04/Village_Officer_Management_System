const pool = require("../../config/database");

const addElectionApplication = async (villager_id, electionrecodeID, apply_date, document_path) => {
  const [result] = await pool.query(
    `INSERT INTO villager_hase_election_recode (Villager_ID, electionrecodeID, apply_date, status, document_path) 
     VALUES (?, ?, ?, 'Pending', ?)`,
    [villager_id, electionrecodeID, apply_date, document_path]
  );
  return result.insertId;
};

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query("SELECT Villager_ID FROM Villager WHERE Email = ?", [email]);
  return rows[0];
};

const getElectionByType = async (type) => {
  const [rows] = await pool.query("SELECT ID FROM Election_recode WHERE type = ?", [type]);
  return rows[0];
};

module.exports = {
  addElectionApplication,
  getVillagerByEmail,
  getElectionByType,
};