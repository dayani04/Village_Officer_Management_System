const pool = require("../../config/database");

const NewBornRequest = {
  addNewBornRequest: async (villager_id, relationship, birthCertificatePath, motherNicPath, fatherNicPath, marriageCertificatePath, createdAt) => {
    const [result] = await pool.query(
      `INSERT INTO NewBornRequest (Villager_ID, Relationship, BirthCertificatePath, MotherNicPath, FatherNicPath, MarriageCertificatePath, Created_At, Status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [villager_id, relationship, birthCertificatePath, motherNicPath, fatherNicPath, marriageCertificatePath, createdAt]
    );
    return { insertId: result.insertId };
  },

  getVillagerByEmail: async (email) => {
    const [rows] = await pool.query("SELECT Villager_ID, Full_Name, Address FROM Villager WHERE Email = ?", [email]);
    return rows[0];
  },

  getVillagerById: async (villagerId) => {
    const query = `
      SELECT 
        Villager_ID,
        Full_Name,
        Email,
        Phone_No,
        NIC,
        DOB,
        Address,
        RegionalDivision,
        Status AS Villager_Status,
        Area_ID,
        Latitude,
        Longitude,
        IsParticipant,
        Alive_Status
      FROM Villager
      WHERE Villager_ID = ?
    `;
    const [rows] = await pool.query(query, [villagerId]);
    return rows[0];
  },

  getNewBornRequestById: async (requestId) => {
    const query = `
      SELECT * 
      FROM NewBornRequest 
      WHERE Request_ID = ?
    `;
    const [rows] = await pool.query(query, [requestId]);
    return rows[0];
  },

  getAllNewBornRequests: async () => {
    const query = `
      SELECT 
        nbr.Request_ID,
        nbr.Villager_ID,
        v.Full_Name,
        nbr.Relationship,
        nbr.BirthCertificatePath,
        nbr.MotherNicPath,
        nbr.FatherNicPath,
        nbr.MarriageCertificatePath,
        nbr.Created_At,
        nbr.Status,
        nbr.ReceiptPath
      FROM NewBornRequest nbr
      JOIN Villager v ON v.Villager_ID = nbr.Villager_ID
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  getApprovedNewBornRequests: async () => {
    const query = `
      SELECT 
        nbr.Request_ID,
        v.Full_Name,
        v.Villager_ID,
        nbr.Relationship,
        v.Phone_No,
        v.Address,
        nbr.Created_At,
        nbr.ReceiptPath
      FROM NewBornRequest nbr
      JOIN Villager v ON v.Villager_ID = nbr.Villager_ID
      WHERE nbr.Status = 'Approved'
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  getNewBornRequestsByVillagerId: async (villagerId) => {
    const query = `
      SELECT 
        nbr.Request_ID,
        nbr.Villager_ID,
        v.Full_Name,
        v.Email,
        v.Phone_No,
        v.NIC,
        v.DOB,
        v.Address,
        v.RegionalDivision,
        v.Status AS Villager_Status,
        v.Area_ID,
        v.Latitude,
        v.Longitude,
        v.IsParticipant,
        v.Alive_Status,
        nbr.Relationship,
        nbr.BirthCertificatePath,
        nbr.MotherNicPath,
        nbr.FatherNicPath,
        nbr.MarriageCertificatePath,
        nbr.Created_At,
        nbr.Status AS Request_Status,
        nbr.ReceiptPath
      FROM NewBornRequest nbr
      JOIN Villager v ON v.Villager_ID = nbr.Villager_ID
      WHERE nbr.Villager_ID = ?
    `;
    const [rows] = await pool.query(query, [villagerId]);
    return rows;
  },

  updateNewBornRequestStatus: async (requestId, status) => {
    const query = `
      UPDATE NewBornRequest 
      SET Status = ?
      WHERE Request_ID = ?
    `;
    const [result] = await pool.query(query, [status, requestId]);
    return result.affectedRows > 0;
  },

  updateReceiptPath: async (requestId, receiptPath) => {
    const query = `
      UPDATE NewBornRequest 
      SET ReceiptPath = ?
      WHERE Request_ID = ?
    `;
    const [result] = await pool.query(query, [receiptPath, requestId]);
    return result.affectedRows > 0;
  },

  getFilePath: async (filename) => {
    const query = `
      SELECT BirthCertificatePath, MotherNicPath, FatherNicPath, MarriageCertificatePath, ReceiptPath 
      FROM NewBornRequest 
      WHERE BirthCertificatePath = ? OR MotherNicPath = ? OR FatherNicPath = ? OR MarriageCertificatePath = ? OR ReceiptPath = ?
    `;
    const [rows] = await pool.query(query, [filename, filename, filename, filename, filename]);
    if (rows.length === 0) return null;
    return rows[0].BirthCertificatePath === filename ? rows[0].BirthCertificatePath :
           rows[0].MotherNicPath === filename ? rows[0].MotherNicPath :
           rows[0].FatherNicPath === filename ? rows[0].FatherNicPath :
           rows[0].MarriageCertificatePath === filename ? rows[0].MarriageCertificatePath :
           rows[0].ReceiptPath;
  },
};

module.exports = NewBornRequest;