const db = require("../../config/database");

const PermitApplication = {
  // Get villager by email
  getVillagerByEmail: async (email) => {
    const query = "SELECT * FROM Villager WHERE email = ?";
    const [rows] = await db.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Get permit by type
  getPermitByType: async (permitType) => {
    const query = "SELECT * FROM Permits_recode WHERE Permits_Type = ?";
    const [rows] = await db.query(query, [permitType]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Add permit application
  addPermitApplication: async (villagerId, permitsId, applyDate, documentPath, policeReportPath) => {
    const query = `
      INSERT INTO villager_has_Permits_recode 
      (Villager_ID, Permits_ID, apply_date, status, document_path, police_report_path) 
      VALUES (?, ?, ?, 'Pending', ?, ?)
    `;
    await db.query(query, [villagerId, permitsId, applyDate, documentPath, policeReportPath]);
  },
};

module.exports = PermitApplication;