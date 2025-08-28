const pool = require("../../config/database");

const getAllVillagers = async () => {
  const [rows] = await pool.query(`
    SELECT Villager_ID, Full_Name, Email, Phone_No, NIC, DOB, Address, RegionalDivision, 
           Status, Area_ID, Latitude, Longitude, IsParticipant, Alive_Status, Job, Gender, 
           Marital_Status, Religion, Race, Created_At 
    FROM Villager
  `);
  return rows;
};

const getVillagerById = async (id) => {
  const [rows] = await pool.query(`
    SELECT Villager_ID, Full_Name, Email, Phone_No, NIC, DOB, Address, RegionalDivision, 
           Status, Area_ID, Latitude, Longitude, IsParticipant, Alive_Status, Job, Gender, 
           Marital_Status, Religion, Race, Created_At 
    FROM Villager WHERE Villager_ID = ?
  `, [id]);
  return rows[0];
};

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query(`
    SELECT Villager_ID, Full_Name, Email, Password, Phone_No, NIC, DOB, Address, RegionalDivision, 
           Status, Area_ID, Latitude, Longitude, IsParticipant, Alive_Status, Job, Gender, 
           Marital_Status, Religion, Race, Created_At 
    FROM Villager WHERE Email = ?
  `, [email]);
  return rows[0];
};

const addVillager = async (
  villager_id, full_name, email, password, phone_no, nic, dob, address, 
  regional_division, status, area_id, latitude, longitude, is_participant, 
  alive_status, job, gender, marital_status, religion, race
) => {
  const [result] = await pool.query(
    `INSERT INTO Villager (
      Villager_ID, Full_Name, Email, Password, Phone_No, NIC, DOB, Address, 
      RegionalDivision, Status, Area_ID, Latitude, Longitude, IsParticipant, 
      Alive_Status, Job, Gender, Marital_Status, Religion, Race, Created_At
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      villager_id, full_name, email, password, phone_no, nic, dob, address,
      regional_division, status || "Active", area_id, latitude, longitude,
      is_participant, alive_status || "Alive", job, gender || "Other", 
      marital_status || "Unmarried", religion || "Others", race || "Sinhalese"
    ]
  );
  return villager_id;
};

const updateVillager = async (
  id, full_name, email, phone_no, address, regional_division, status, 
  is_participant, alive_status, job, gender, marital_status, dob, religion, race
) => {
  try {
    if (!full_name || !email || !phone_no) {
      throw new Error("Full_Name, Email, and Phone_No are required");
    }

    const participantValue = is_participant ? 1 : 0;
    const [result] = await pool.query(
      `UPDATE Villager SET 
        Full_Name = ?, Email = ?, Phone_No = ?, Address = ?, RegionalDivision = ?, 
        Status = ?, IsParticipant = ?, Alive_Status = ?, Job = ?, Gender = ?, 
        Marital_Status = ?, DOB = ?, Religion = ?, Race = ?
      WHERE Villager_ID = ?`,
      [
        full_name, email, phone_no, 
        address !== undefined ? address : null,
        regional_division !== undefined ? regional_division : null,
        status || "Active", participantValue, 
        alive_status || "Alive", 
        job !== undefined ? job : null,
        gender || "Other", 
        marital_status || "Unmarried",
        dob !== undefined ? dob : null,
        religion || "Others", race || "Sinhalese",
        id
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

const addNewBornRequest = async (villagerId, relationship, filePaths) => {
  const [result] = await pool.query(
    `INSERT INTO NewBornRequest (
      Villager_ID, Relationship, BirthCertificatePath, MotherNicPath, FatherNicPath, 
      MarriageCertificatePath, ResidenceCertificatePath, Status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      villagerId,
      relationship,
      filePaths.birthCertificate,
      filePaths.motherNic,
      filePaths.fatherNic,
      filePaths.marriageCertificate,
      filePaths.residenceCertificate,
      'Pending'
    ]
  );
  return result.insertId;
};

const addNewFamilyMemberRequest = async (villagerId, relationship, filePaths) => {
  const [result] = await pool.query(
    `INSERT INTO NewFamilyMemberRequest (
      Villager_ID, Relationship, DocumentPath, ResidenceCertificatePath, Status
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      villagerId,
      relationship,
      filePaths.document,
      filePaths.residenceCertificate,
      'Pending'
    ]
  );
  return result.insertId;
};

const getNewFamilyMemberRequests = async () => {
  const [rows] = await pool.query(`
    SELECT nfr.Request_ID, nfr.Villager_ID, nfr.Relationship, nfr.DocumentPath, nfr.ResidenceCertificatePath,
           v.Email, v.Address
    FROM NewFamilyMemberRequest nfr
    JOIN Villager v ON nfr.Villager_ID = v.Villager_ID
  `);
  return rows;
};

const getNewBornRequests = async () => {
  const [rows] = await pool.query(`
    SELECT nbr.Request_ID, nbr.Villager_ID, nbr.Relationship, nbr.BirthCertificatePath,
           nbr.MotherNicPath, nbr.FatherNicPath, nbr.MarriageCertificatePath, nbr.ResidenceCertificatePath,
           v.Email, v.Address
    FROM NewBornRequest nbr
    JOIN Villager v ON nbr.Villager_ID = v.Villager_ID
  `);
  return rows;
};

const getVillageTotal = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM Villager");
  return rows[0].total;
};

const getVillageParticipantTotal = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS participant_total FROM Villager WHERE IsParticipant = 1");
  return rows[0].participant_total;
};

const getHouseCount = async () => {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS house_count
    FROM (
        SELECT Latitude, Longitude, Address
        FROM Villager
        WHERE Latitude IS NOT NULL AND Longitude IS NOT NULL AND Address IS NOT NULL
          AND Status = 'Active' AND Alive_Status = 'Alive'
        GROUP BY Latitude, Longitude, Address
        HAVING COUNT(*) > 0
    ) AS location_groups
  `);
  return rows[0].house_count;
};

const getMonthlyRegistrationCount = async () => {
  const [rows] = await pool.query(`
    SELECT 
      YEAR(Created_At) AS year,
      MONTH(Created_At) AS month,
      COUNT(*) AS registration_count
    FROM Villager
    WHERE Created_At IS NOT NULL
      AND Status = 'Active'
      AND Alive_Status = 'Alive'
    GROUP BY YEAR(Created_At), MONTH(Created_At)
    ORDER BY year, month
  `);
  return rows;
};
const getReligionCount = async () => {
  const [rows] = await pool.query(`
    SELECT 
      Religion,
      COUNT(*) AS villager_count
    FROM Villager
    WHERE Status = 'Active' AND Alive_Status = 'Alive'
    GROUP BY Religion
    ORDER BY Religion
  `);
  return rows;
};

const getRaceCount = async () => {
  const [rows] = await pool.query(`
    SELECT 
      Race,
      COUNT(*) AS villager_count
    FROM Villager
    WHERE Status = 'Active' AND Alive_Status = 'Alive'
    GROUP BY Race
    ORDER BY Race
  `);
  return rows;
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
  addNewBornRequest,
  addNewFamilyMemberRequest,
  getNewFamilyMemberRequests,
  getNewBornRequests,
  getVillageTotal,
  getVillageParticipantTotal,
  getHouseCount,
  getMonthlyRegistrationCount,
  getReligionCount,
   getRaceCount,
};