const pool = require("../../config/database");

const addNICApplication = async (villager_id, nic_id, apply_date, document_path) => {
  const [result] = await pool.query(
    `INSERT INTO villager_has_nic_recode (Villager_ID, NIC_ID, apply_date, status, document_path) 
     VALUES (?, ?, ?, 'Pending', ?)`,
    [villager_id, nic_id, apply_date, document_path]
  );
  return result.insertId;
};

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query("SELECT Villager_ID FROM Villager WHERE Email = ?", [email]);
  return rows[0];
};

const getNICByType = async (type) => {
  const [rows] = await pool.query("SELECT NIC_ID FROM nic_recode WHERE NIC_Type = ?", [type]);
  return rows[0];
};

module.exports = {
  addNICApplication,
  getVillagerByEmail,
  getNICByType,
};