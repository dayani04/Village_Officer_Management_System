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

module.exports = { saveNotification };