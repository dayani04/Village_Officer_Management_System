const pool = require("../../config/database");

const getAllElections = async () => {
  const [rows] = await pool.query("SELECT * FROM Election_recode");
  return rows;
};

const getElectionById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM Election_recode WHERE ID = ?", [id]);
  return rows[0];
};

module.exports = {
  getAllElections,
  getElectionById,
};