const pool = require("../../config/database");

const addCertificateApplication = async (villager_id, apply_date, document_path) => {
  const [result] = await pool.query(
    `INSERT INTO villager_has_certificate_recode (Villager_ID, apply_date, status, document_path) 
     VALUES (?, ?, 'Pending', ?)`,
    [villager_id, apply_date, document_path]
  );
  return result.insertId;
};

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query("SELECT Villager_ID FROM Villager WHERE Email = ?", [email]);
  return rows[0];
};

module.exports = {
  addCertificateApplication,
  getVillagerByEmail,
};