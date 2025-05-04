const pool = require("../../config/database");

const getAllAllowances = async () => {
  const [rows] = await pool.query("SELECT * FROM Allowances_recode");
  return rows;
};

const getAllowanceById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM Allowances_recode WHERE Allowances_ID = ?", [id]);
  return rows[0];
};

module.exports = {
  getAllAllowances,
  getAllowanceById,
};