const pool = require("../../config/database");

const getAllVillagers = async () => {
  const [rows] = await pool.query("SELECT * FROM Villager");
  return rows;
};

const getVillagerById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM Villager WHERE Villager_ID = ?", [id]);
  return rows[0];
};

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM Villager WHERE Email = ?", [email]);
  return rows[0];
};

const addVillager = async (
  villager_id,
  full_name,
  email,
  password,
  phone_no,
  nic,
  dob,
  address,
  regional_division,
  status,
  area_id
) => {
  const [result] = await pool.query(
    "INSERT INTO Villager (Villager_ID, Full_Name, Email, Password, Phone_No, NIC, DOB, Address, RegionalDivision, Status, Area_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      villager_id,
      full_name,
      email,
      password,
      phone_no,
      nic,
      dob,
      address,
      regional_division,
      status,
      area_id,
    ]
  );
  return villager_id; // Return Villager_ID instead of insertId
};

const updateVillager = async (id, full_name, email, phone_no, status) => {
  const [result] = await pool.query(
    "UPDATE Villager SET Full_Name = ?, Email = ?, Phone_No = ?, Status = ? WHERE Villager_ID = ?",
    [full_name, email, phone_no, status, id]
  );
  return result.affectedRows > 0;
};

const deleteVillager = async (id) => {
  const [result] = await pool.query("DELETE FROM Villager WHERE Villager_ID = ?", [id]);
  return result.affectedRows > 0;
};

const updateUserStatus = async (id, status) => {
  const [result] = await pool.query("UPDATE Villager SET Status = ? WHERE Villager_ID = ?", [
    status,
    id,
  ]);
  return result.affectedRows > 0;
};

const updatePassword = async (id, hashedPassword) => {
  const [result] = await pool.query("UPDATE Villager SET Password = ? WHERE Villager_ID = ?", [
    hashedPassword,
    id,
  ]);
  return result.affectedRows > 0;
};

module.exports = {
  getAllVillagers,
  getVillagerById,
  getVillagerByEmail,
  addVillager,
  updateVillager,
  deleteVillager,
  updateUserStatus,
  updatePassword,
};