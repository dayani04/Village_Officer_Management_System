const pool = require("../../config/database");

const getAllVillagers = async () => {
  const [rows] = await pool.query("SELECT Villager_ID, Full_Name, Email, Phone_No, NIC, DOB, Address, RegionalDivision, Status, Area_ID, Latitude, Longitude, IsParticipant, Alive_Status FROM Villager");
  return rows;
};

const getVillagerById = async (id) => {
  const [rows] = await pool.query("SELECT Villager_ID, Full_Name, Email, Phone_No, NIC, DOB, Address, RegionalDivision, Status, Area_ID, Latitude, Longitude, IsParticipant, Alive_Status FROM Villager WHERE Villager_ID = ?", [id]);
  return rows[0];
};

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query("SELECT Villager_ID, Full_Name, Email, Password, Phone_No, NIC, DOB, Address, RegionalDivision, Status, Area_ID, Latitude, Longitude, IsParticipant, Alive_Status FROM Villager WHERE Email = ?", [email]);
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
  area_id,
  latitude = null,
  longitude = null,
  is_participant = false,
  alive_status = 'Alive'
) => {
  const [result] = await pool.query(
    "INSERT INTO Villager (Villager_ID, Full_Name, Email, Password, Phone_No, NIC, DOB, Address, RegionalDivision, Status, Area_ID, Latitude, Longitude, IsParticipant, Alive_Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
      status || "Active",
      area_id,
      latitude,
      longitude,
      is_participant,
      alive_status
    ]
  );
  return villager_id;
};

const updateVillager = async (id, full_name, email, phone_no, address, regional_division, status, is_participant, alive_status) => {
  try {
    if (!full_name || !email || !phone_no) {
      throw new Error("Full_Name, Email, and Phone_No are required");
    }

    const participantValue = is_participant ? 1 : 0;
    const aliveStatusValue = alive_status || 'Alive';

    const [result] = await pool.query(
      "UPDATE Villager SET Full_Name = ?, Email = ?, Phone_No = ?, Address = ?, RegionalDivision = ?, Status = ?, IsParticipant = ?, Alive_Status = ? WHERE Villager_ID = ?",
      [
        full_name,
        email,
        phone_no,
        address !== undefined ? address : null,
        regional_division !== undefined ? regional_division : null,
        status || "Active",
        participantValue,
        aliveStatusValue,
        id,
      ]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error updating villager ${id}:`, error);
    throw error;
  }
};

const updateVillagerParticipation = async (id, is_participant) => {
  try {
    const [result] = await pool.query(
      "UPDATE Villager SET IsParticipant = ? WHERE Villager_ID = ?",
      [is_participant ? 1 : 0, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error updating villager participation for ID ${id}:`, error);
    throw error;
  }
};

const updateVillagerLocation = async (id, latitude, longitude) => {
  try {
    const [result] = await pool.query(
      "UPDATE Villager SET Latitude = ?, Longitude = ? WHERE Villager_ID = ?",
      [latitude, longitude, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error updating villager location for ID ${id}:`, error);
    throw error;
  }
};

const getVillagerLocation = async (id) => {
  const [rows] = await pool.query("SELECT Latitude, Longitude FROM Villager WHERE Villager_ID = ?", [id]);
  return rows[0];
};

const deleteVillager = async (id) => {
  const [result] = await pool.query("DELETE FROM Villager WHERE Villager_ID = ?", [id]);
  return result.affectedRows > 0;
};

const updateUserStatus = async (id, status) => {
  const [result] = await pool.query("UPDATE Villager SET Status = ? WHERE Villager_ID = ?", [status, id]);
  return result.affectedRows > 0;
};

const updatePassword = async (id, hashedPassword) => {
  const [result] = await pool.query("UPDATE Villager SET Password = ? WHERE Villager_ID = ?", [hashedPassword, id]);
  return result.affectedRows > 0;
};

const addNotification = async (villagerId, message) => {
  const [result] = await pool.query(
    "INSERT INTO Notification (Villager_ID, Message) VALUES (?, ?)",
    [villagerId, message]
  );
  return result.insertId;
};

const getNotificationsByVillagerId = async (villagerId) => {
  const [rows] = await pool.query(
    "SELECT Notification_ID, Villager_ID, Message, Created_At, Is_Read FROM Notification WHERE Villager_ID = ? ORDER BY Created_At DESC",
    [villagerId]
  );
  return rows;
};

const getNotificationById = async (notificationId) => {
  const [rows] = await pool.query(
    "SELECT Notification_ID, Villager_ID, Message, Created_At, Is_Read FROM Notification WHERE Notification_ID = ?",
    [notificationId]
  );
  return rows[0];
};

const markNotificationAsRead = async (notificationId) => {
  const [result] = await pool.query(
    "UPDATE Notification SET Is_Read = TRUE WHERE Notification_ID = ?",
    [notificationId]
  );
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
  updateVillagerLocation,
  getVillagerLocation,
  updateVillagerParticipation,
  addNotification,
  getNotificationsByVillagerId,
  getNotificationById,
  markNotificationAsRead,
};