const pool = require("../../config/database");

const addAllowanceApplication = async (villager_id, allowances_id, apply_date, document_path) => {
  const [result] = await pool.query(
    `INSERT INTO villager_has_allowances_recode (Villager_ID, Allowances_ID, apply_date, status, document_path) 
     VALUES (?, ?, ?, 'Pending', ?)`,
    [villager_id, allowances_id, apply_date, document_path]
  );
  return result.insertId;
};

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query("SELECT Villager_ID FROM Villager WHERE Email = ?", [email]);
  return rows[0];
};

const getAllowanceByType = async (type) => {
  const [rows] = await pool.query("SELECT Allowances_ID FROM Allowances_recode WHERE Allowances_Type = ?", [type]);
  return rows[0];
};

module.exports = {
  addAllowanceApplication,
  getVillagerByEmail,
  getAllowanceByType,
};