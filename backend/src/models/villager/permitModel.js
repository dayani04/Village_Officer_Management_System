const pool = require("../../config/database");

const getAllPermits = async () => {
  const [rows] = await pool.query("SELECT * FROM Permits_recode");
  console.log("Fetched permits from DB:", rows);
  return rows;
};

const getPermitById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM Permits_recode WHERE Permits_ID = ?", [id]);
  console.log(`Fetched permit ID ${id} from DB:`, rows[0]);
  return rows[0];
};

const checkVillagerPermitApplication = async (villagerId, year, month) => {
  try {
    const [rows] = await pool.query(
      `SELECT vhp.Permits_ID, pr.Permits_Type, vhp.required_date
       FROM villager_has_permits_recode vhp
       JOIN Permits_recode pr ON vhp.Permits_ID = pr.Permits_ID
       WHERE vhp.Villager_ID = ? AND YEAR(vhp.apply_date) = ? AND MONTH(vhp.apply_date) = ?`,
      [villagerId, year, month]
    );
    console.log(`Fetched permit applications for villager ${villagerId} in ${year}-${month}:`, rows);
    return rows;
  } catch (error) {
    console.error(`Error in checkVillagerPermitApplication for villager ${villagerId}:`, error);
    throw error;
  }
};

module.exports = {
  getAllPermits,
  getPermitById,
  checkVillagerPermitApplication,
};