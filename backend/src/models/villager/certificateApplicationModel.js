const pool = require("../../config/database");

const addCertificateApplication = async (villager_id, apply_date, document_path, reason) => {
  try {
    console.log(`Adding certificate application for Villager_ID: ${villager_id}`);
    const [result] = await pool.query(
      `INSERT INTO villager_has_certificate_recode (Villager_ID, apply_date, status, document_path, reason) 
       VALUES (?, ?, 'Pending', ?, ?)`,
      [villager_id, apply_date, document_path, reason]
    );
    console.log(`Certificate application added with ID: ${result.insertId}`);
    return result.insertId;
  } catch (error) {
    console.error(`Error in addCertificateApplication for Villager_ID ${villager_id}:`, error);
    throw error;
  }
};

const getVillagerByEmail = async (email) => {
  try {
    console.log(`Fetching villager by email: ${email}`);
    const [rows] = await pool.query("SELECT Villager_ID FROM Villager WHERE Email = ?", [email]);
    console.log(`Villager found:`, rows[0]);
    return rows[0];
  } catch (error) {
    console.error(`Error in getVillagerByEmail for email ${email}:`, error);
    throw error;
  }
};

const getAllCertificateApplications = async () => {
  try {
    console.log("Fetching all certificate applications");
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
    console.log(`Fetched ${rows.length} certificate applications`);
    return rows;
  } catch (error) {
    console.error("Database error in getAllCertificateApplications:", error);
    throw error;
  }
};

const updateCertificateApplicationStatus = async (application_id, status) => {
  try {
    if (!["Pending", "Send", "Rejected", "Confirm"].includes(status)) {
      throw new Error("Invalid status. Must be 'Pending', 'Send', 'Rejected', or 'Confirm'");
    }

    console.log(`Updating status for application ID: ${application_id} to ${status}`);

    const [currentApp] = await pool.query(
      `SELECT vhc.Villager_ID, vhc.apply_date 
       FROM villager_has_certificate_recode vhc 
       WHERE vhc.application_id = ?`,
      [application_id]
    );

    if (!currentApp[0]) {
      console.error(`Application not found for ID: ${application_id}`);
      throw new Error('Application not found');
    }

    console.log(`Found application:`, currentApp[0]);

    if (status === 'Confirm') {
      const [lastConfirmed] = await pool.query(
        `SELECT apply_date 
         FROM villager_has_certificate_recode 
         WHERE Villager_ID = ? 
         AND status = 'Confirm' 
         AND application_id != ?
         ORDER BY apply_date DESC 
         LIMIT 1`,
        [currentApp[0].Villager_ID, application_id]
      );

      if (lastConfirmed[0]) {
        const lastConfirmedDate = new Date(lastConfirmed[0].apply_date);
        const currentApplyDate = new Date(currentApp[0].apply_date);
        const oneYearAfterLastConfirmed = new Date(lastConfirmedDate);
        oneYearAfterLastConfirmed.setFullYear(lastConfirmedDate.getFullYear() + 1);

        if (currentApplyDate < oneYearAfterLastConfirmed) {
          console.error(`Cannot confirm: Previous certificate confirmed on ${lastConfirmedDate.toISOString()}`);
          throw new Error('Cannot confirm: Previous certificate was confirmed less than a year ago.');
        }
      }
    }

    const [result] = await pool.query(
      `UPDATE villager_has_certificate_recode 
       SET status = ? 
       WHERE application_id = ?`,
      [status, application_id]
    );

    console.log(`Database update result for application ID ${application_id}:`, result);

    if (result.affectedRows > 0 && (status === 'Confirm' || status === 'Send')) {
      try {
        const message = `Your certificate application (ID: ${application_id}) has been updated to ${status.toLowerCase()}.`;
        console.log(`Attempting to send notification to Villager_ID: ${currentApp[0].Villager_ID}, Message: ${message}`);
        const [notificationResult] = await pool.query(
          `INSERT INTO notifications (Villager_ID, message, created_at, is_read) 
           VALUES (?, ?, CURRENT_TIMESTAMP, FALSE)`,
          [currentApp[0].Villager_ID, message]
        );
        console.log(`Notification created with ID: ${notificationResult.insertId}`);
      } catch (notificationError) {
        console.error(`Failed to send notification for application ID ${application_id}:`, notificationError);
        // Continue execution to allow status update to succeed
      }
    }

    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error in updateCertificateApplicationStatus for application ID ${application_id}:`, error);
    throw error;
  }
};

const getVillagerCertificateApplications = async (villager_id) => {
  try {
    console.log(`Fetching certificate applications for Villager_ID: ${villager_id}`);
    const [rows] = await pool.query(
      `SELECT 
        application_id,
        apply_date,
        status,
        reason,
        document_path,
        certificate_path
      FROM villager_has_certificate_recode
      WHERE Villager_ID = ?`,
      [villager_id]
    );
    console.log(`Fetched ${rows.length} applications for Villager_ID: ${villager_id}`);
    return rows;
  } catch (error) {
    console.error(`Error in getVillagerCertificateApplications for Villager_ID ${villager_id}:`, error);
    throw error;
  }
};

const getNotificationsByVillager = async (villager_id) => {
  try {
    console.log(`Fetching notifications for Villager_ID: ${villager_id}`);
    const [rows] = await pool.query(
      `SELECT id, message, created_at, is_read 
       FROM notifications 
       WHERE Villager_ID = ? 
       ORDER BY created_at DESC`,
      [villager_id]
    );
    console.log(`Fetched ${rows.length} notifications for Villager_ID: ${villager_id}`);
    return rows;
  } catch (error) {
    console.error(`Error in getNotificationsByVillager for Villager_ID ${villager_id}:`, error);
    throw error;
  }
};

const getApplicationDetails = async (application_id) => {
  try {
    console.log(`Fetching application details for ID: ${application_id}`);
    const [rows] = await pool.query(
      `SELECT 
        vhc.Villager_ID,
        v.Full_Name,
        v.Address,
        v.NIC,
        v.DOB,
       v.RegionalDivision,
       
        v.Gender,
        v.Job,
        v.Marital_Status,
        vhc.status,
        vhc.reason,
        vhc.document_path,
        vhc.certificate_path,
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

    if (!rows[0]) {
      console.error(`No application found for ID: ${application_id}`);
      throw new Error(`Application ID ${application_id} not found in villager_has_certificate_recode`);
    }

    // Verify Villager exists
    const [villager] = await pool.query(
      `SELECT Full_Name, Address, NIC, DOB, Area_ID FROM Villager WHERE Villager_ID = ?`,
      [rows[0].Villager_ID]
    );
    if (!villager[0]) {
      console.error(`Villager not found for ID: ${rows[0].Villager_ID}`);
      throw new Error(`Villager ID ${rows[0].Villager_ID} not found in Villager table`);
    }

    console.log('Application details from DB:', rows[0]);
    return rows[0];
  } catch (error) {
    console.error(`Error in getApplicationDetails for application ID ${application_id}:`, error);
    throw error;
  }
};

const updateCertificatePath = async (application_id, certificate_path) => {
  try {
    console.log(`Updating certificate path for application ID: ${application_id}`);
    const [result] = await pool.query(
      `UPDATE villager_has_certificate_recode 
       SET certificate_path = ? 
       WHERE application_id = ?`,
      [certificate_path, application_id]
    );
    console.log(`Certificate path updated, affected rows: ${result.affectedRows}`);
    return result.affectedRows > 0;
  } catch (error) {
    console.error(`Error in updateCertificatePath for application ID ${application_id}:`, error);
    throw error;
  }
};

const getLastApplicationDate = async (villager_id) => {
  try {
    console.log(`Fetching last application date for Villager_ID: ${villager_id}`);
    const [rows] = await pool.query(
      `SELECT apply_date 
       FROM villager_has_certificate_recode 
       WHERE Villager_ID = ? 
       ORDER BY apply_date DESC 
       LIMIT 1`,
      [villager_id]
    );
    console.log(`Last application date:`, rows[0]);
    return rows[0];
  } catch (error) {
    console.error(`Error in getLastApplicationDate for Villager_ID ${villager_id}:`, error);
    throw error;
  }
};

const getLastApprovedApplication = async (villager_id) => {
  try {
    console.log(`Fetching last approved application for Villager_ID: ${villager_id}`);
    const [rows] = await pool.query(
      `SELECT apply_date 
       FROM villager_has_certificate_recode 
       WHERE Villager_ID = ? AND status = 'Confirm' 
       ORDER BY apply_date DESC 
       LIMIT 1`,
      [villager_id]
    );
    console.log(`Last approved application:`, rows[0]);
    return rows[0];
  } catch (error) {
    console.error(`Error in getLastApprovedApplication for Villager_ID ${villager_id}:`, error);
    throw error;
  }
};


module.exports = {
  addCertificateApplication,
  getVillagerByEmail,
  getAllCertificateApplications,
  updateCertificateApplicationStatus,
  getVillagerCertificateApplications,
  getNotificationsByVillager,
  getApplicationDetails,
  updateCertificatePath,
  getLastApplicationDate,
  getLastApprovedApplication,
};