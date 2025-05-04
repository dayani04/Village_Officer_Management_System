const pool = require("../../config/database");

const getAllPermits = async () => {
  const [rows] = await pool.query("SELECT * FROM Permits_recode");
  return rows;
};

const getPermitById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM Permits_recode WHERE Permits_ID = ?", [id]);
  return rows[0];
};

module.exports = {
  getAllPermits,
  getPermitById,
};