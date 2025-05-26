const pool = require("../../config/database");

const getAllVillagerOfficers = async () => {
  const [rows] = await pool.query("SELECT * FROM Villager_Officer");
  return rows;
};

const getVillagerOfficerById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM Villager_Officer WHERE Villager_Officer_ID = ?", [id]);
  return rows[0];
};

const getVillagerOfficerByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM Villager_Officer WHERE Email = ?", [email]);
  return rows[0];
};

const addVillagerOfficer = async (
  villager_officer_id,
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
    "INSERT INTO Villager_Officer (Villager_Officer_ID, Full_Name, Email, Password, Phone_No, NIC, DOB, Address, RegionalDivision, Status, Area_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      villager_officer_id,
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
  return villager_officer_id;
};

const updateVillagerOfficer = async (id, full_name, email, phone_no, status) => {
  const [result] = await pool.query(
    "UPDATE Villager_Officer SET Full_Name = ?, Email = ?, Phone_No = ?, Status = ? WHERE Villager_Officer_ID = ?",
    [full_name, email, phone_no, status, id]
  );
  return result.affectedRows > 0;
};

const deleteVillagerOfficer = async (id) => {
  const [result] = await pool.query("DELETE FROM Villager_Officer WHERE Villager_Officer_ID = ?", [id]);
  return result.affectedRows > 0;
};

const updateOfficerStatus = async (id, status) => {
  const [result] = await pool.query("UPDATE Villager_Officer SET Status = ? WHERE Villager_Officer_ID = ?", [
    status,
    id,
  ]);
  return result.affectedRows > 0;
};

const updatePassword = async (id, hashedPassword) => {
  const [result] = await pool.query("UPDATE Villager_Officer SET Password = ? WHERE Villager_Officer_ID = ?", [
    hashedPassword,
    id,
  ]);
  return result.affectedRows > 0;
};

const getVillageOfficerByIdCertificate = async (Villager_Officer_ID) => {
  const [rows] = await pool.query(
    `SELECT Full_Name 
     FROM villager_officer 
     WHERE Villager_Officer_ID = ?`,
    [Villager_Officer_ID]
  );
  return rows[0];
};

module.exports = {
  getAllVillagerOfficers,
  getVillagerOfficerById,
  getVillagerOfficerByEmail,
  addVillagerOfficer,
  updateVillagerOfficer,
  deleteVillagerOfficer,
  updateOfficerStatus,
  updatePassword,
  getVillageOfficerByIdCertificate,
};