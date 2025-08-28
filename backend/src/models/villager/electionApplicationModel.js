// backend/models/villager/electionApplicationModel.js
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
    const [rows] = await pool.query(
      "SELECT Villager_ID, Full_Name, Address FROM Villager WHERE Email = ?",
      [email]
    );
    return rows[0];
  },

  getVillagerById: async (villagerId) => {
    const [rows] = await pool.query(
      "SELECT Villager_ID, Full_Name, Address FROM Villager WHERE Villager_ID = ?",
      [villagerId]
    );
    return rows[0];
  },

  getElectionByType: async (type) => {
    const [rows] = await pool.query("SELECT ID, Type FROM Election_recode WHERE Type = ?", [type]);
    return rows[0];
  },

  getElectionById: async (electionrecodeID) => {
    const [rows] = await pool.query("SELECT ID, Type FROM Election_recode WHERE ID = ?", [electionrecodeID]);
    return rows[0];
  },

  getAllElectionApplications: async () => {
    const query = `
      SELECT 
        v.Full_Name,
        v.Villager_ID,
        e.Type AS Election_Type,
        ve.application_id,
        ve.electionrecodeID,
        ve.apply_date,
        ve.status,
        ve.document_path,
        ve.receipt_path
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
        e.Type AS Election_Type,
        v.Phone_No,
        v.Address,
        ve.application_id,
        ve.electionrecodeID,
        ve.receipt_path,
        ve.voting_place AS votingPlace,
        ve.election_date AS electionDate
      FROM villager_hase_election_recode ve
      JOIN Villager v ON v.Villager_ID = ve.Villager_ID
      JOIN Election_recode e ON e.ID = ve.electionrecodeID
      WHERE ve.status = 'Confirm'
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  getElectionApplicationByIds: async (villagerId, electionrecodeID) => {
    const query = `
      SELECT * 
      FROM villager_hase_election_recode 
      WHERE Villager_ID = ? AND electionrecodeID = ?
    `;
    const [rows] = await pool.query(query, [villagerId, electionrecodeID]);
    return rows.length > 0 ? rows[0] : null;
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

  updateReceiptPath: async (villagerId, electionrecodeID, receiptPath, votingPlace, electionDate) => {
    const query = `
      UPDATE villager_hase_election_recode 
      SET receipt_path = ?, voting_place = ?, election_date = ?
      WHERE Villager_ID = ? AND electionrecodeID = ?
    `;
    const [result] = await pool.query(query, [receiptPath, votingPlace, electionDate, villagerId, electionrecodeID]);
    return result.affectedRows > 0;
  },

  getFilePath: async (filename) => {
    const query = `
      SELECT document_path, receipt_path 
      FROM villager_hase_election_recode 
      WHERE document_path = ? OR receipt_path = ?
    `;
    const [rows] = await pool.query(query, [filename, filename]);
    if (rows.length === 0) return null;
    return rows[0].document_path === filename ? rows[0].document_path : rows[0].receipt_path;
  },
};

module.exports = ElectionApplication;