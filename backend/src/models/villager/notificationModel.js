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

  getVillagerById: async (villagerId) => {
    const query = "SELECT * FROM Villager WHERE Villager_ID = ?";
    const [rows] = await db.query(query, [villagerId]);
    return rows.length > 0 ? rows[0] : null;
  },
};

module.exports = Notification;