const pool = require("../../config/database");

const NICApplication = {
  getVillagerByEmail: async (email) => {
    const [rows] = await pool.query("SELECT Villager_ID, Full_Name, Address FROM Villager WHERE Email = ?", [email]);
    return rows[0];
  },

  getVillagerById: async (villagerId) => {
    const [rows] = await pool.query("SELECT Villager_ID, Full_Name, Address FROM Villager WHERE Villager_ID = ?", [villagerId]);
    return rows[0];
  },

  getNICByType: async (type) => {
    const [rows] = await pool.query("SELECT NIC_ID, NIC_Type FROM nic_recode WHERE NIC_Type = ?", [type]);
    return rows[0];
  },

  getNICById: async (nicId) => {
    const [rows] = await pool.query("SELECT NIC_ID, NIC_Type FROM nic_recode WHERE NIC_ID = ?", [nicId]);
    return rows[0];
  },

  getNICApplicationByIds: async (villagerId, nicId) => {
    const [rows] = await pool.query(
      "SELECT * FROM villager_has_nic_recode WHERE Villager_ID = ? AND NIC_ID = ?",
      [villagerId, nicId]
    );
    return rows[0];
  },

  addNICApplication: async (villager_id, nic_id, apply_date, document_path) => {
    const [result] = await pool.query(
      `INSERT INTO villager_has_nic_recode (Villager_ID, NIC_ID, apply_date, status, document_path) 
       VALUES (?, ?, ?, 'Pending', ?)`,
      [villager_id, nic_id, apply_date, document_path]
    );
    return result.insertId;
  },

  getAllNICApplications: async () => {
    const [rows] = await pool.query(`
      SELECT 
        v.Full_Name,
        vhn.Villager_ID,
        vhn.NIC_ID,
        nr.NIC_Type,
        vhn.apply_date,
        vhn.status,
        vhn.document_path,
        vhn.receipt_path
      FROM villager_has_nic_recode vhn
      JOIN Villager v ON vhn.Villager_ID = v.Villager_ID
      JOIN nic_recode nr ON vhn.NIC_ID = nr.NIC_ID
    `);
    return rows;
  },

  getConfirmedNICApplications: async () => {
    const [rows] = await pool.query(`
      SELECT 
        v.Full_Name,
        vhn.Villager_ID,
        vhn.NIC_ID,
        nr.NIC_Type,
        vhn.apply_date,
        vhn.receipt_path
      FROM villager_has_nic_recode vhn
      JOIN Villager v ON vhn.Villager_ID = v.Villager_ID
      JOIN nic_recode nr ON vhn.NIC_ID = nr.NIC_ID
      WHERE vhn.status = 'Confirm'
    `);
    return rows;
  },

  updateNICApplicationStatus: async (villager_id, nic_id, status) => {
    const [result] = await pool.query(
      `UPDATE villager_has_nic_recode 
       SET status = ? 
       WHERE Villager_ID = ? AND NIC_ID = ?`,
      [status, villager_id, nic_id]
    );
    return result.affectedRows > 0;
  },

  updateReceiptPath: async (villager_id, nic_id, receipt_path) => {
    const [result] = await pool.query(
      `UPDATE villager_has_nic_recode 
       SET receipt_path = ? 
       WHERE Villager_ID = ? AND NIC_ID = ?`,
      [receipt_path, villager_id, nic_id]
    );
    return result.affectedRows > 0;
  },

  getFilePath: async (filename) => {
    const [rows] = await pool.query(
      `SELECT document_path, receipt_path 
       FROM villager_has_nic_recode 
       WHERE document_path = ? OR receipt_path = ?`,
      [filename, filename]
    );
    if (rows.length === 0) return null;
    return rows[0].document_path === filename ? rows[0].document_path : rows[0].receipt_path;
  },
};

module.exports = NICApplication;