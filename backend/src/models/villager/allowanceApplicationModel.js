const pool = require("../../config/database");

const AllowanceApplication = {
  addAllowanceApplication: async (villager_id, allowances_id, apply_date, document_path) => {
    const [result] = await pool.query(
      `INSERT INTO villager_has_allowances_recode (Villager_ID, Allowances_ID, apply_date, status, document_path) 
       VALUES (?, ?, ?, 'Pending', ?)`,
      [villager_id, allowances_id, apply_date, document_path]
    );
    return { insertId: result.insertId };
  },

  getVillagerByEmail: async (email) => {
    const [rows] = await pool.query("SELECT Villager_ID FROM Villager WHERE Email = ?", [email]);
    return rows[0];
  },

  getAllowanceByType: async (type) => {
    const [rows] = await pool.query("SELECT Allowances_ID FROM Allowances_recode WHERE Allowances_Type = ?", [type]);
    return rows[0];
  },

  getAllAllowanceApplications: async () => {
    const query = `
      SELECT 
        vha.Villager_ID,
        vha.Allowances_ID,
        v.Full_Name,
        a.Allowances_Type,
        vha.apply_date,
        vha.status,
        vha.document_path
      FROM villager_has_allowances_recode vha
      JOIN Villager v ON v.Villager_ID = vha.Villager_ID
      JOIN Allowances_recode a ON a.Allowances_ID = vha.Allowances_ID
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  getConfirmedAllowanceApplications: async () => {
    const query = `
      SELECT 
        v.Full_Name,
        v.Villager_ID,
        a.Allowances_Type,
        v.Phone_No,
        v.Address
      FROM villager_has_allowances_recode vha
      JOIN Villager v ON v.Villager_ID = vha.Villager_ID
      JOIN Allowances_recode a ON a.Allowances_ID = vha.Allowances_ID
      WHERE vha.status = 'Confirm'
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  getAllowanceApplicationsByVillagerId: async (villagerId) => {
    const query = `
      SELECT 
        vha.Villager_ID,
        vha.Allowances_ID,
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
        ar.Allowances_Type,
        vha.apply_date,
        vha.status AS Application_Status,
        vha.document_path
      FROM villager_has_allowances_recode vha
      JOIN Villager v ON v.Villager_ID = vha.Villager_ID
      JOIN Allowances_recode ar ON vha.Allowances_ID = ar.Allowances_ID
      WHERE vha.Villager_ID = ?
    `;
    const [rows] = await pool.query(query, [villagerId]);
    return rows;
  },

  updateAllowanceApplicationStatus: async (villagerId, allowancesId, status) => {
    const query = `
      UPDATE villager_has_allowances_recode 
      SET status = ?
      WHERE Villager_ID = ? AND Allowances_ID = ?
    `;
    const [result] = await pool.query(query, [status, villagerId, allowancesId]);
    return result.affectedRows > 0;
  },

  getFilePath: async (filename) => {
    const query = `
      SELECT document_path 
      FROM villager_has_allowances_recode 
      WHERE document_path = ?
    `;
    const [rows] = await pool.query(query, [filename]);
    return rows.length > 0 ? rows[0].document_path : null;
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
};

module.exports = AllowanceApplication;