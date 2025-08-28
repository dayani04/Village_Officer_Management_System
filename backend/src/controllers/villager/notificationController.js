const Notification = require("../../models/villager/notificationModel");

const saveNotification = async (req, res) => {
  try {
    const { villagerId, message } = req.body;

    console.log("Received notification data:", { villagerId, message });

    if (!villagerId || !message) {
      console.log("Validation failed: Missing required fields");
      return res.status(400).json({ error: "Villager ID and message are required" });
    }

    const villager = await Notification.getVillagerById(villagerId);
    if (!villager) {
      console.log("Validation failed: Villager not found for ID", villagerId);
      return res.status(404).json({ error: "Villager not found" });
    }

    const notificationId = await Notification.addNotification(villagerId, message);

    res.status(201).json({ message: "Notification saved successfully", notificationId });
  } catch (error) {
    console.error("Error in saveNotification:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const saveNotificationToAll = async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Received notification data for all villagers:", { message });

    if (!message) {
      console.log("Validation failed: Message is required");
      return res.status(400).json({ error: "Message is required" });
    }

    const affectedRows = await Notification.addNotificationToAllVillagers(message);

    res.status(201).json({
      message: `Notification sent to ${affectedRows} villagers successfully`,
    });
  } catch (error) {
    console.error("Error in saveNotificationToAll:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getVillagerNotifications = async (req, res) => {
  try {
    const villagerId = req.user.Villager_ID;
    const notifications = await Notification.getNotificationsByVillagerId(villagerId);
    res.json(notifications);
  } catch (error) {
    console.error("Error in getVillagerNotifications:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getAllNotifications();
    res.json(notifications);
  } catch (error) {
    console.error("Error in getAllNotifications:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const affectedRows = await Notification.markNotificationAsRead(notificationId);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  saveNotification,
  saveNotificationToAll,
  getVillagerNotifications,
  getAllNotifications,
  markNotificationAsRead,
};