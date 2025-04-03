const pool = require("../../config/database");

const getAllVillagers = async () => {
  const [rows] = await pool.query("SELECT * FROM Villager");
  return rows;
};

const getVillagerById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM Villager WHERE Villager_ID = ?", [id]);
  return rows[0];
};

const addVillager = async (villager_id, full_name, email, password, phone_no, nic, dob, address, reginal_division, status, area_id) => {
  console.log('Adding villager with data:', { villager_id, full_name, email, password, phone_no, nic, dob, address, reginal_division, status, area_id });

  const [result] = await pool.query(
    "INSERT INTO Villager (Villager_ID, Full_Name, Email, Password, Phone_No, NIC, DOB, Address, ReginalDivision, Status, Area_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [villager_id, full_name, email, password, phone_no, nic, dob, address, reginal_division, status, area_id]
  );
  console.log('Insert result:', result);
  return result.insertId;
};


const updateVillager = async (id, full_name, email, phone_no, status) => {
  await pool.query(
    "UPDATE Villager SET Full_Name = ?, Email = ?, Phone_No = ?, Status = ? WHERE Villager_ID = ?",
    [full_name, email, phone_no, status, id]
  );
};

const deleteVillager = async (id) => {
  await pool.query("DELETE FROM Villager WHERE Villager_ID = ?", [id]);
};

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM Villager WHERE Email = ?", [email]);
  return rows[0];
};

const updateUserStatus = async (id, status) => {
  await pool.query("UPDATE Villager SET Status = ? WHERE Villager_ID = ?", [status, id]);
};

const updatePassword = async (id, hashedPassword) => {
  await pool.query("UPDATE Villager SET Password = ? WHERE Villager_ID = ?", [hashedPassword, id]);
};

module.exports = {
  getAllVillagers,
  getVillagerById,
  addVillager,
  updateVillager,
  deleteVillager,
  getVillagerByEmail,
  updateUserStatus,
  updatePassword,
};