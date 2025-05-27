const pool = require("../../config/database");

const getApplicationDetailsToCertificate = async (application_id) => {
  const [rows] = await pool.query(
    `SELECT 
      v.Villager_ID,
      v.Full_Name,
      v.Address,
      v.NIC,
      v.DOB,
      vhc.status,
      a.ZipCode,
      (SELECT electionrecodeID 
       FROM villager_hase_election_recode ver 
       WHERE ver.Villager_ID = v.Villager_ID 
       AND ver.status = 'Approved' 
       ORDER BY ver.apply_date DESC 
       LIMIT 1) AS electionrecodeID
    FROM villager_has_certificate_recode vhc
    JOIN villager v ON vhc.Villager_ID = v.Villager_ID
    LEFT JOIN area a ON v.Area_ID = a.Area_ID
    WHERE vhc.application_id = ?`,
    [application_id]
  );
  return rows[0];
};

module.exports = {
  getApplicationDetailsToCertificate,
};