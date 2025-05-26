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

const getAllowanceApplications = async () => {
  const [rows] = await pool.query(`
    SELECT 
      vha.application_id,
      vha.Villager_ID,
      v.Full_Name,
      ar.Allowances_Type,
      vha.apply_date,
      vha.status
    FROM villager_has_allowances_recode vha
    JOIN villager v ON vha.Villager_ID = v.Villager_ID
    JOIN allowances_recode ar ON vha.Allowances_ID = ar.Allowances_ID
    WHERE vha.status = 'Pending'
  `);
  return rows;
};

const getAllowanceApplicationById = async (applicationId) => {
  const [rows] = await pool.query(`
    SELECT 
      vha.application_id,
      vha.Villager_ID,
      v.Full_Name,
      v.DOB,
      v.Address,
      ar.Allowances_Type,
      vha.apply_date,
      vha.status,
      vha.document_path
    FROM villager_has_allowances_recode vha
    JOIN villager v ON vha.Villager_ID = v.Villager_ID
    JOIN allowances_recode ar ON vha.Allowances_ID = ar.Allowances_ID
    WHERE vha.application_id = ?
  `, [applicationId]);
  return rows[0];
};

const updateAllowanceApplicationStatus = async (applicationId, status) => {
  await pool.query(
    `UPDATE villager_has_allowances_recode 
     SET status = ? 
     WHERE application_id = ?`,
    [status, applicationId]
  );
};

module.exports = {
  addAllowanceApplication,
  getVillagerByEmail,
  getAllowanceByType,
  getAllowanceApplications,
  getAllowanceApplicationById,
  updateAllowanceApplicationStatus,
};