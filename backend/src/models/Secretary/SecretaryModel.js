const pool = require("../../config/database");

const getAllSecretaries = async () => {
  const [rows] = await pool.query("SELECT * FROM Secretary");
  return rows;
};

const getSecretaryById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM Secretary WHERE Secretary_ID = ?", [id]);
  return rows[0];
};

const getSecretaryByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM Secretary WHERE Email = ?", [email]);
  return rows[0];
};

const addSecretary = async (
  secretary_id,
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
    "INSERT INTO Secretary (Secretary_ID, Full_Name, Email, Password, Phone_No, NIC, DOB, Address, RegionalDivision, Status, Area_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      secretary_id,
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
  return secretary_id;
};

const updateSecretary = async (id, full_name, email, phone_no, status) => {
  const [result] = await pool.query(
    "UPDATE Secretary SET Full_Name = ?, Email = ?, Phone_No = ?, Status = ? WHERE Secretary_ID = ?",
    [full_name, email, phone_no, status, id]
  );
  return result.affectedRows > 0;
};

const deleteSecretary = async (id) => {
  const [result] = await pool.query("DELETE FROM Secretary WHERE Secretary_ID = ?", [id]);
  return result.affectedRows > 0;
};

const updateSecretaryStatus = async (id, status) => {
  const [result] = await pool.query("UPDATE Secretary SET Status = ? WHERE Secretary_ID = ?", [
    status,
    id,
  ]);
  return result.affectedRows > 0;
};

const updatePassword = async (id, hashedPassword) => {
  const [result] = await pool.query("UPDATE Secretary SET Password = ? WHERE Secretary_ID = ?", [
    hashedPassword,
    id,
  ]);
  return result.affectedRows > 0;
};

module.exports = {
  getAllSecretaries,
  getSecretaryById,
  getSecretaryByEmail,
  addSecretary,
  updateSecretary,
  deleteSecretary,
  updateSecretaryStatus,
  updatePassword,
};