const pool = require("../../config/database");

const ElectionNotification = {
  addElectionNotification: async (electionrecodeID, message) => {
    const [result] = await pool.query(
      `INSERT INTO Election_Notification (electionrecodeID, message) VALUES (?, ?)`,
      [electionrecodeID, message]
    );
    return result.insertId;
  },

  getAllElectionNotifications: async () => {
    const [rows] = await pool.query(`
      SELECT en.notification_id, en.electionrecodeID, en.message, en.created_at, er.Type
      FROM Election_Notification en
      JOIN Election_recode er ON en.electionrecodeID = er.ID
      ORDER BY en.created_at DESC
    `);
    return rows;
  },

  deleteElectionNotification: async (notificationId) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Get the electionrecodeID for the notification
      const [notificationRows] = await connection.query(
        `SELECT electionrecodeID FROM Election_Notification WHERE notification_id = ?`,
        [notificationId]
      );
      if (!notificationRows[0]) {
        await connection.rollback();
        return false;
      }
      const electionrecodeID = notificationRows[0].electionrecodeID;

      // Delete related applications from villager_hase_election_recode
      await connection.query(
        `DELETE FROM villager_hase_election_recode WHERE electionrecodeID = ?`,
        [electionrecodeID]
      );

      // Delete the notification
      const [result] = await connection.query(
        `DELETE FROM Election_Notification WHERE notification_id = ?`,
        [notificationId]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getNotificationByElectionId: async (electionrecodeID) => {
    const [rows] = await pool.query(
      `SELECT notification_id, electionrecodeID, message, created_at
       FROM Election_Notification WHERE electionrecodeID = ?`,
      [electionrecodeID]
    );
    return rows[0];
  },
};

module.exports = ElectionNotification;