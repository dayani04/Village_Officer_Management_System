const db = require("../../config/database");

const PermitApplication = {
  getVillagerByEmail: async (email) => {
    const query = "SELECT * FROM Villager WHERE Email = ?";
    const [rows] = await db.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  getVillagerById: async (villagerId) => {
    const query = "SELECT * FROM Villager WHERE Villager_ID = ?";
    const [rows] = await db.query(query, [villagerId]);
    return rows.length > 0 ? rows[0] : null;
  },

  getPermitByType: async (permitType) => {
    const query = "SELECT * FROM Permits_recode WHERE Permits_Type = ?";
    const [rows] = await db.query(query, [permitType]);
    return rows.length > 0 ? rows[0] : null;
  },

  getPermitById: async (permitsId) => {
    const query = "SELECT * FROM Permits_recode WHERE Permits_ID = ?";
    const [rows] = await db.query(query, [permitsId]);
    return rows.length > 0 ? rows[0] : null;
  },

  addPermitApplication: async (villagerId, permitsId, applyDate, documentPath, policeReportPath) => {
    const query = `
      INSERT INTO villager_has_Permits_recode 
      (Villager_ID, Permits_ID, apply_date, status, document_path, police_report_path) 
      VALUES (?, ?, ?, 'Pending', ?, ?)
    `;
    await db.query(query, [villagerId, permitsId, applyDate, documentPath, policeReportPath]);
  },

  getAllPermitApplications: async () => {
    const query = `
      SELECT 
        v.Full_Name,
        v.Villager_ID,
        p.Permits_Type,
        vp.Permits_ID,
        vp.apply_date,
        vp.status,
        vp.document_path,
        vp.police_report_path,
        vp.certificate_path
      FROM villager_has_Permits_recode vp
      JOIN Villager v ON v.Villager_ID = vp.Villager_ID
      JOIN Permits_recode p ON p.Permits_ID = vp.Permits_ID
    `;
    const [rows] = await db.query(query);
    return rows;
  },

 getConfirmedPermitApplications: async () => {
    const query = `
      SELECT 
        v.Full_Name,
        v.Villager_ID,
        p.Permits_Type,
        v.Phone_No,
        v.Address,
        vp.certificate_path,
        vp.Permits_ID
      FROM villager_has_Permits_recode vp
      JOIN Villager v ON v.Villager_ID = vp.Villager_ID
      JOIN Permits_recode p ON p.Permits_ID = vp.Permits_ID
      WHERE vp.status = 'Confirm'
    `;
    const [rows] = await db.query(query);
    return rows;
  },
  getPermitApplicationByIds: async (villagerId, permitsId) => {
    const query = `
      SELECT * 
      FROM villager_has_Permits_recode 
      WHERE Villager_ID = ? AND Permits_ID = ?
    `;
    const [rows] = await db.query(query, [villagerId, permitsId]);
    return rows.length > 0 ? rows[0] : null;
  },

  updatePermitApplicationStatus: async (villagerId, permitsId, status) => {
    const query = `
      UPDATE villager_has_Permits_recode 
      SET status = ?
      WHERE Villager_ID = ? AND Permits_ID = ?
    `;
    const [result] = await db.query(query, [status, villagerId, permitsId]);
    return result.affectedRows > 0;
  },

  updateCertificatePath: async (villagerId, permitsId, certificatePath) => {
    const query = `
      UPDATE villager_has_Permits_recode 
      SET certificate_path = ?
      WHERE Villager_ID = ? AND Permits_ID = ?
    `;
    const [result] = await db.query(query, [certificatePath, villagerId, permitsId]);
    return result.affectedRows > 0;
  },

  getFilePath: async (filename) => {
    const query = `
      SELECT document_path, police_report_path, certificate_path 
      FROM villager_has_Permits_recode 
      WHERE document_path = ? OR police_report_path = ? OR certificate_path = ?
    `;
    const [rows] = await db.query(query, [filename, filename, filename]);
    if (rows.length === 0) return null;
    return rows[0].document_path === filename ? rows[0].document_path :
           rows[0].police_report_path === filename ? rows[0].police_report_path :
           rows[0].certificate_path;
  },
};

module.exports = PermitApplication;