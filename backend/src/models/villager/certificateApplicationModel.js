const pool = require("../../config/database");

const addCertificateApplication = async (villager_id, apply_date, document_path, reason) => {
  const [result] = await pool.query(
    `INSERT INTO villager_has_certificate_recode (Villager_ID, apply_date, status, document_path, reason) 
     VALUES (?, ?, 'Pending', ?, ?)`,
    [villager_id, apply_date, document_path, reason]
  );
  return result.insertId;
};

const getVillagerByEmail = async (email) => {
  const [rows] = await pool.query("SELECT Villager_ID FROM Villager WHERE Email = ?", [email]);
  return rows[0];
};

const getAllCertificateApplications = async () => {
  const [rows] = await pool.query(
    `SELECT 
      vhc.Villager_ID,
      v.Full_Name,
      vhc.application_id,
      vhc.apply_date,
      vhc.status,
      vhc.reason,
      vhc.document_path,
      vhc.certificate_path
    FROM villager_has_certificate_recode vhc
    JOIN Villager v ON vhc.Villager_ID = v.Villager_ID`
  );
  return rows;
};

const updateCertificateApplicationStatus = async (application_id, status) => {
  if (status === 'Approved') {
    // Get the current application details
    const [currentApp] = await pool.query(
      `SELECT vhc.Villager_ID, vhc.apply_date 
       FROM villager_has_certificate_recode vhc 
       WHERE vhc.application_id = ?`,
      [application_id]
    );

    if (!currentApp[0]) {
      throw new Error('Application not found');
    }

    // Check for last approved application
    const [lastApproved] = await pool.query(
      `SELECT apply_date 
       FROM villager_has_certificate_recode 
       WHERE Villager_ID = ? 
       AND status = 'Approved' 
       AND application_id != ?
       ORDER BY apply_date DESC 
       LIMIT 1`,
      [currentApp[0].Villager_ID, application_id]
    );

    if (lastApproved[0]) {
      const lastApprovedDate = new Date(lastApproved[0].apply_date);
      const currentApplyDate = new Date(currentApp[0].apply_date);
      const oneYearAfterLastApproved = new Date(lastApprovedDate);
      oneYearAfterLastApproved.setFullYear(lastApprovedDate.getFullYear() + 1);

      if (currentApplyDate < oneYearAfterLastApproved) {
        throw new Error('Cannot approve: Previous certificate was approved less than a year ago. Must wait until one year has passed since the last approval.');
      }
    }
  }

  // Update the status if validation passes
  const [result] = await pool.query(
    `UPDATE villager_has_certificate_recode 
     SET status = ? 
     WHERE application_id = ?`,
    [status, application_id]
  );
  return result.affectedRows > 0;
};

const getVillagerCertificateApplications = async (villager_id) => {
  const [rows] = await pool.query(
    `SELECT 
      application_id,
      apply_date,
      status,
      reason,
      document_path
    FROM villager_has_certificate_recode
    WHERE Villager_ID = ?`,
    [villager_id]
  );
  return rows;
};

const addNotification = async (villager_id, message) => {
  const [result] = await pool.query(
    `INSERT INTO notifications (Villager_ID, message) 
     VALUES (?, ?)`,
    [villager_id, message]
  );
  return result.insertId;
};

const getNotificationsByVillager = async (villager_id) => {
  const [rows] = await pool.query(
    `SELECT id, message, created_at 
     FROM notifications 
     WHERE Villager_ID = ? 
     ORDER BY created_at DESC`,
    [villager_id]
  );
  return rows;
};

const getApplicationDetails = async (application_id) => {
  const [rows] = await pool.query(
    `SELECT 
      vhc.Villager_ID,
      v.Full_Name,
      v.Address,
      v.NIC,
      v.DOB,
      a.ZipCode,
      COALESCE(
        (SELECT electionrecodeID 
         FROM villager_hase_election_recode vhe 
         WHERE vhe.Villager_ID = vhc.Villager_ID 
         AND vhe.status = 'Approved' 
         ORDER BY vhe.apply_date DESC 
         LIMIT 1),
        'No Voter ID'
      ) AS electionrecodeID
    FROM villager_has_certificate_recode vhc
    JOIN Villager v ON vhc.Villager_ID = v.Villager_ID
    LEFT JOIN area a ON v.Area_ID = a.Area_ID
    WHERE vhc.application_id = ?`,
    [application_id]
  );

  // Debug log
  console.log('Application details from DB:', rows[0]);
  return rows[0];
};

const updateCertificatePath = async (application_id, certificate_path) => {
  const [result] = await pool.query(
    `UPDATE villager_has_certificate_recode 
     SET certificate_path = ? 
     WHERE application_id = ?`,
    [certificate_path, application_id]
  );
  return result.affectedRows > 0;
};

const getLastApplicationDate = async (villager_id) => {
    const [rows] = await pool.query(
        `SELECT apply_date 
         FROM villager_has_certificate_recode 
         WHERE Villager_ID = ? 
         ORDER BY apply_date DESC 
         LIMIT 1`,
        [villager_id]
    );
    return rows[0];
};

const getLastApprovedApplication = async (villager_id) => {
    const [rows] = await pool.query(
        `SELECT apply_date 
         FROM villager_has_certificate_recode 
         WHERE Villager_ID = ? AND status = 'Approved' 
         ORDER BY apply_date DESC 
         LIMIT 1`,
        [villager_id]
    );
    return rows[0];
};

module.exports = {
  addCertificateApplication,
  getVillagerByEmail,
  getAllCertificateApplications,
  updateCertificateApplicationStatus,
  getVillagerCertificateApplications,
  addNotification,
  getNotificationsByVillager,
  getApplicationDetails,
  updateCertificatePath,
  getLastApplicationDate,
  getLastApprovedApplication,
};