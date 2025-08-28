const pool = require("../../config/database");

const getAllAllowances = async () => {
  const [rows] = await pool.query("SELECT * FROM Allowances_recode");
  console.log("Fetched allowances from DB:", rows);
  return rows;
};

const getAllowanceById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM Allowances_recode WHERE Allowances_ID = ?", [id]);
  console.log(`Fetched allowance ID ${id} from DB:`, rows[0]);
  return rows[0];
};

const checkVillagerAllowanceApplication = async (villagerId) => {
  try {
    const [rows] = await pool.query(
      `SELECT vha.Allowances_ID, ar.Allowances_Type
       FROM villager_has_allowances_recode vha
       JOIN Allowances_recode ar ON vha.Allowances_ID = ar.Allowances_ID
       WHERE vha.Villager_ID = ?`,
      [villagerId]
    );
    console.log(`Fetched allowance applications for villager ${villagerId}:`, rows);
    return rows;
  } catch (error) {
    console.error(`Error in checkVillagerAllowanceApplication for villager ${villagerId}:`, error);
    throw error;
  }
};

module.exports = {
  getAllAllowances,
  getAllowanceById,
  checkVillagerAllowanceApplication,
};