const pool = require("../../config/database");

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query("SELECT Villager_ID FROM Villager WHERE Email = ?", [email]);
  return rows[0];
};

const getNICByType = async (type) => {
  const [rows] = await pool.query("SELECT NIC_ID FROM nic_recode WHERE NIC_Type = ?", [type]);
  return rows[0];
};

const addNICApplication = async (villager_id, nic_id, apply_date, document_path) => {
  const [result] = await pool.query(
    `INSERT INTO villager_has_nic_recode (Villager_ID, NIC_ID, apply_date, status, document_path) 
     VALUES (?, ?, ?, 'Pending', ?)`,
    [villager_id, nic_id, apply_date, document_path]
  );
  return result.insertId;
};

const getAllNICApplications = async () => {
  const [rows] = await pool.query(`
    SELECT 
      v.Full_Name,
      vhn.Villager_ID,
      vhn.NIC_ID,
      nr.NIC_Type,
      vhn.apply_date,
      vhn.status,
      vhn.document_path
    FROM villager_has_nic_recode vhn
    JOIN Villager v ON vhn.Villager_ID = v.Villager_ID
    JOIN nic_recode nr ON vhn.NIC_ID = nr.NIC_ID
  `);
  return rows;
};

const updateNICApplicationStatus = async (villager_id, nic_id, status) => {
  const [result] = await pool.query(
    `UPDATE villager_has_nic_recode 
     SET status = ? 
     WHERE Villager_ID = ? AND NIC_ID = ?`,
    [status, villager_id, nic_id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  getVillagerByEmail,
  getNICByType,
  addNICApplication,
  getAllNICApplications,
  updateNICApplicationStatus,
};