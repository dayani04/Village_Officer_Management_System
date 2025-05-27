const pool = require("../../config/database");

const ElectionApplication = {
  addElectionApplication: async (villager_id, electionrecodeID, apply_date, document_path) => {
    const [result] = await pool.query(
      `INSERT INTO villager_hase_election_recode (Villager_ID, electionrecodeID, apply_date, status, document_path) 
       VALUES (?, ?, ?, 'Pending', ?)`,
      [villager_id, electionrecodeID, apply_date, document_path]
    );
    return result.insertId;
  },

  getVillagerByEmail: async (email) => {
    const [rows] = await pool.query("SELECT Villager_ID FROM Villager WHERE Email = ?", [email]);
    return rows[0];
  },

  getElectionByType: async (type) => {
    const [rows] = await pool.query("SELECT ID FROM Election_recode WHERE type = ?", [type]);
    return rows[0];
  },

  getAllElectionApplications: async () => {
    const query = `
      SELECT 
        v.Full_Name,
        v.Villager_ID,
        e.type AS Election_Type,
        ve.electionrecodeID,
        ve.apply_date,
        ve.status,
        ve.document_path
      FROM villager_hase_election_recode ve
      JOIN Villager v ON v.Villager_ID = ve.Villager_ID
      JOIN Election_recode e ON e.ID = ve.electionrecodeID
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  getConfirmedElectionApplications: async () => {
    const query = `
      SELECT 
        v.Full_Name,
        v.Villager_ID,
        e.type AS Election_Type,
        v.Phone_No,
        v.Address
      FROM villager_hase_election_recode ve
      JOIN Villager v ON v.Villager_ID = ve.Villager_ID
      JOIN Election_recode e ON e.ID = ve.electionrecodeID
      WHERE ve.status = 'Confirm'
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  updateElectionApplicationStatus: async (villagerId, electionrecodeID, status) => {
    const query = `
      UPDATE villager_hase_election_recode 
      SET status = ?
      WHERE Villager_ID = ? AND electionrecodeID = ?
    `;
    const [result] = await pool.query(query, [status, villagerId, electionrecodeID]);
    return result.affectedRows > 0;
  },

  getFilePath: async (filename) => {
    const query = `
      SELECT document_path 
      FROM villager_hase_election_recode 
      WHERE document_path = ?
    `;
    const [rows] = await pool.query(query, [filename]);
    return rows.length > 0 ? rows[0].document_path : null;
  },
};

module.exports = ElectionApplication;