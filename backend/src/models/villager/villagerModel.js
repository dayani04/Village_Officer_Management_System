const pool = require("../../config/database");
const path = require('path'); // Added import
const fs = require('fs'); // Added import

const getAllVillagers = async () => {
  const [rows] = await pool.query(`
    SELECT Villager_ID, Full_Name, Email, Phone_No, NIC, DOB, Address, RegionalDivision, 
           Status, Area_ID, Latitude, Longitude, IsParticipant, Alive_Status, Job, Gender, 
           Marital_Status, Religion, Race, Created_At, BirthCertificate, NICCopy 
    FROM Villager
  `);
  return rows;
};

const getVillagerById = async (id) => {
  const [rows] = await pool.query(`
    SELECT 
      v.Villager_ID, v.Full_Name, v.Email, v.Phone_No, v.NIC, v.DOB, v.Address, 
      v.RegionalDivision, v.Status, v.Area_ID, v.Latitude, v.Longitude, v.IsParticipant, 
      v.Alive_Status, v.Job, v.Gender, v.Marital_Status, v.Religion, v.Race, v.Created_At,
      vd.BirthCertificatePath AS BirthCertificate, vd.NICCopyPath AS NICCopy
    FROM Villager v
    LEFT JOIN VillagerDocuments vd ON v.Villager_ID = vd.Villager_ID
    WHERE v.Villager_ID = ?
  `, [id]);
  return rows[0];
};

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query(`
    SELECT Villager_ID, Full_Name, Email, Password, Phone_No, NIC, DOB, Address, RegionalDivision, 
           Status, Area_ID, Latitude, Longitude, IsParticipant, Alive_Status, Job, Gender, 
           Marital_Status, Religion, Race, Created_At, BirthCertificate, NICCopy 
    FROM Villager WHERE Email = ?
  `, [email]);
  return rows[0];
};

const addVillager = async (
  villager_id, full_name, email, password, phone_no, nic, dob, address, 
  regional_division, status, area_id, latitude, longitude, is_participant, 
  alive_status, job, gender, marital_status, religion, race, birthCertificate, nicCopy
) => {
  const [result] = await pool.query(
    `INSERT INTO Villager (
      Villager_ID, Full_Name, Email, Password, Phone_No, NIC, DOB, Address, 
      RegionalDivision, Status, Area_ID, Latitude, Longitude, IsParticipant, 
      Alive_Status, Job, Gender, Marital_Status, Religion, Race, BirthCertificate, NICCopy, Created_At
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      villager_id, full_name, email, password, phone_no, nic, dob, address,
      regional_division, status || "Active", area_id, latitude, longitude,
      is_participant, alive_status || "Alive", job, gender || "Other", 
      marital_status || "Unmarried", religion || "Others", race || "Sinhalese",
      birthCertificate, nicCopy
    ]
  );
  return villager_id;
};

const updateVillager = async (
  id, full_name, email, phone_no, address, regional_division, status, 
  is_participant, alive_status, job, gender, marital_status, dob, religion, race,
  birthCertificate, nicCopy
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
        Marital_Status = ?, DOB = ?, Religion = ?, Race = ?, BirthCertificate = ?, NICCopy = ?
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
        birthCertificate, nicCopy,
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

// New model function for updating documents
const updateVillagerDocuments = async (villagerId, birthCertificate, nicCopy) => {
  try {
    const [existing] = await pool.query(
      'SELECT BirthCertificatePath, NICCopyPath FROM VillagerDocuments WHERE Villager_ID = ?',
      [villagerId]
    );

    const uploadDir = path.join(__dirname, '..', '..', 'Uploads');

    if (existing.length > 0) {
      // Delete old files if they exist and new files are provided
      if (existing[0].BirthCertificatePath && birthCertificate) {
        const oldPath = path.join(uploadDir, path.basename(existing[0].BirthCertificatePath));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      if (existing[0].NICCopyPath && nicCopy) {
        const oldPath = path.join(uploadDir, path.basename(existing[0].NICCopyPath));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Update existing record
      const [result] = await pool.query(
        `UPDATE VillagerDocuments 
         SET BirthCertificatePath = ?, NICCopyPath = ? 
         WHERE Villager_ID = ?`,
        [birthCertificate || existing[0].BirthCertificatePath, nicCopy || existing[0].NICCopyPath, villagerId]
      );
      return result.affectedRows > 0;
    } else {
      // Insert new record
      const [result] = await pool.query(
        `INSERT INTO VillagerDocuments (Villager_ID, BirthCertificatePath, NICCopyPath) 
         VALUES (?, ?, ?)`,
        [villagerId, birthCertificate, nicCopy]
      );
      return result.insertId;
    }
  } catch (error) {
    console.error(`Error updating documents for villager ${villagerId}:`, error);
    throw error;
  }
};
const addVillagerDocuments = async (villagerId, birthCertificate, nicCopy) => {
  const [result] = await pool.query(
    `INSERT INTO VillagerDocuments (Villager_ID, BirthCertificatePath, NICCopyPath) VALUES (?, ?, ?)`,
    [villagerId, birthCertificate, nicCopy]
  );
  return result.insertId;
};
const upsertVillagerDocuments = async (villagerId, birthCertificatePath, nicCopyPath) => {
  const [rows] = await pool.query(
    "SELECT * FROM VillagerDocuments WHERE Villager_ID = ?",
    [villagerId]
  );
  if (rows.length > 0) {
    // Update existing row
    await pool.query(
      "UPDATE VillagerDocuments SET BirthCertificatePath = ?, NICCopyPath = ? WHERE Villager_ID = ?",
      [birthCertificatePath, nicCopyPath, villagerId]
    );
  } else {
    // Insert new row
    await pool.query(
      "INSERT INTO VillagerDocuments (Villager_ID, BirthCertificatePath, NICCopyPath) VALUES (?, ?, ?)",
      [villagerId, birthCertificatePath, nicCopyPath]
    );
  }
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
  updateVillagerDocuments, 
  addVillagerDocuments,
  upsertVillagerDocuments,
  
};