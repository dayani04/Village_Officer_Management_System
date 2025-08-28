const db = require("../../config/database");

const Notification = {
  addNotification: async (villagerId, message) => {
    const query = `
      INSERT INTO Notification 
      (Villager_ID, Message, Created_At, Is_Read) 
      VALUES (?, ?, CURRENT_TIMESTAMP, FALSE)
    `;
    const [result] = await db.query(query, [villagerId, message]);
    return result.insertId;
  },

  addNotificationToAllVillagers: async (message) => {
    const query = `
      INSERT INTO Notification 
      (Villager_ID, Message, Created_At, Is_Read)
      SELECT Villager_ID, ?, CURRENT_TIMESTAMP, FALSE
      FROM Villager
    `;
    const [result] = await db.query(query, [message]);
    return result.affectedRows;
  },

  getVillagerById: async (villagerId) => {
    const query = "SELECT * FROM Villager WHERE Villager_ID = ?";
    const [rows] = await db.query(query, [villagerId]);
    return rows.length > 0 ? rows[0] : null;
  },

  getAllVillagers: async () => {
    const query = "SELECT Villager_ID FROM Villager";
    const [rows] = await db.query(query);
    return rows;
  },

  getNotificationsByVillagerId: async (villagerId) => {
    const query = `
      SELECT Notification_ID, Villager_ID, Message, Created_At, Is_Read
      FROM Notification
      WHERE Villager_ID = ?
      AND Created_At >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH)
      ORDER BY Created_At DESC
    `;
    const [rows] = await db.query(query, [villagerId]);
    return rows;
  },

  getAllNotifications: async () => {
    const query = `
      SELECT Notification_ID, Villager_ID, Message, Created_At, Is_Read
      FROM Notification
      WHERE Created_At >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH)
      ORDER BY Created_At DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  markNotificationAsRead: async (notificationId) => {
    const query = `
      UPDATE Notification
      SET Is_Read = TRUE
      WHERE Notification_ID = ?
      AND Created_At >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH)
    `;
    const [result] = await db.query(query, [notificationId]);
    return result.affectedRows;
  },

  deleteOldNotifications: async () => {
    const query = `
      DELETE FROM Notification
      WHERE Created_At < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH)
    `;
    const [result] = await db.query(query);
    return result.affectedRows;
  },
};

module.exports = Notification;