const ElectionNotification = require("../../models/villager/electionNotificationModel");
const Election = require("../../models/villager/electionModel");
const User = require("../../models/villager/villagerModel");

const createElectionNotification = async (req, res) => {
  try {
    const { electionType, message } = req.body;

    if (!electionType || !message) {
      return res.status(400).json({ error: "Election type and message are required" });
    }

    const election = await Election.getElectionByType(electionType);
    if (!election) {
      return res.status(404).json({ error: "Election type not found" });
    }

    const existingNotification = await ElectionNotification.getNotificationByElectionId(election.ID);
    if (existingNotification) {
      return res.status(400).json({ error: "Notification for this election type already exists" });
    }

    const notificationId = await ElectionNotification.addElectionNotification(election.ID, message);

    // Send notification to all villagers
    const villagers = await User.getAllVillagers();
    for (const villager of villagers) {
      await User.addNotification(villager.Villager_ID, message);
    }

    res.status(201).json({ message: "Election notification sent successfully", notificationId });
  } catch (error) {
    console.error("Error in createElectionNotification:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getElectionNotifications = async (req, res) => {
  try {
    const notifications = await ElectionNotification.getAllElectionNotifications();
    res.json(notifications);
  } catch (error) {
    console.error("Error in getElectionNotifications:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const deleteElectionNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const deleted = await ElectionNotification.deleteElectionNotification(notificationId);
    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json({ message: "Election notification and associated applications deleted successfully" });
  } catch (error) {
    console.error("Error in deleteElectionNotification:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

module.exports = {
  createElectionNotification,
  getElectionNotifications,
  deleteElectionNotification,
};