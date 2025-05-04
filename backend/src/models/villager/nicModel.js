const pool = require("../../config/database");

const getAllNICs = async () => {
  const [rows] = await pool.query("SELECT * FROM nic_recode");
  return rows;
};

const getNICById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM nic_recode WHERE NIC_ID = ?", [id]);
  return rows[0];
};

module.exports = {
  getAllNICs,
  getNICById,
};