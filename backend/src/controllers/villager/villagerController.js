const User = require("../../models/villager/villagerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendConfirmationEmail = require("../../utills/mailer");
const crypto = require("crypto");

const otps = new Map();

const getVillagers = async (req, res) => {
  try {
    const users = await User.getAllVillagers();
    res.json(users);
  } catch (error) {
    console.error("Error in getVillagers:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getVillager = async (req, res) => {
  try {
    const user = await User.getVillagerById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error in getVillager:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const createVillager = async (req, res) => {
  try {
    const {
      villager_id,
      full_name,
      email,
      password,
      phone_no,
      nic,
      dob,
      address,
      regional_division,
      status,
      area_id,
      latitude,
      longitude,
      is_participant,
      alive_status,
    } = req.body;

    if (!villager_id || !full_name || !email || !password || !phone_no) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const existingUser = await User.getVillagerByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.addVillager(
      villager_id,
      full_name,
      email,
      hashedPassword,
      phone_no,
      nic,
      dob,
      address,
      regional_division,
      status || "Active",
      area_id,
      latitude,
      longitude,
      is_participant,
      alive_status || "Alive"
    );

    await sendConfirmationEmail(email, "Welcome to Village Officer Management System", "Your account has been created successfully.");
    res.status(201).json({ id: villager_id, message: "Villager added successfully" });
  } catch (error) {
    console.error("Error in createVillager:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateVillager = async (req, res) => {
  try {
    const { full_name, email, phone_no, address, regional_division, status, is_election_participant, alive_status } = req.body;
    const villagerId = req.params.id;

    if (!full_name || !email || !phone_no) {
      return res.status(400).json({ error: "Full Name, Email, and Phone Number are required" });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const currentUser = await User.getVillagerById(villagerId);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    const parsedIsElectionParticipant = typeof is_election_participant === 'boolean' ? is_election_participant : Boolean(is_election_participant);

    const updateData = {
      full_name,
      email,
      phone_no,
      address: address !== undefined ? address : currentUser.Address,
      regional_division: regional_division !== undefined ? regional_division : currentUser.RegionalDivision,
      status: status || currentUser.Status,
      is_election_participant: parsedIsElectionParticipant,
      alive_status: alive_status !== undefined ? alive_status : currentUser.Alive_Status,
    };

    const updated = await User.updateVillager(
      villagerId,
      updateData.full_name,
      updateData.email,
      updateData.phone_no,
      updateData.address,
      updateData.regional_division,
      updateData.status,
      updateData.is_election_participant,
      updateData.alive_status
    );

    if (!updated) return res.status(404).json({ error: "User not found" });

    if (email !== currentUser.Email) {
      await sendConfirmationEmail(email, "Email Change Confirmation", "Your email address has been updated successfully.");
    }

    res.json({ message: "Villager updated successfully" });
  } catch (error) {
    console.error(`Error in updateVillager for ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const deleteVillager = async (req, res) => {
  try {
    const deleted = await User.deleteVillager(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Villager deleted successfully" });
  } catch (error) {
    console.error("Error in deleteVillager:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const loginVillager = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.getVillagerByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.Villager_ID }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      userId: user.Villager_ID,
      fullName: user.Full_Name,
      email: user.Email,
      phoneNo: user.Phone_No,
      status: user.Status,
      token,
      isParticipant: user.IsParticipant,
      aliveStatus: user.Alive_Status,
    });
  } catch (error) {
    console.error("Error in loginVillager:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.getVillagerById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await User.updateUserStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateVillagerLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const villagerId = req.params.id;

    if (latitude === undefined || !longitude) {
      return res.status(400).json({ error: "Latitude is required" });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ error: "Invalid Latitude or Longitude values" });
    }

    const updated = await User.updateVillagerLocation(villagerId, lat, lng);
    if (!updated) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Villager location updated successfully" });
  } catch (error) {
    console.error(`Error in updateVillagerLocation for ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to update location", details: error.message });
  }
};

const getVillagerLocation = async (req, res) => {
  try {
    const villagerId = req.params.id;
    const location = await User.getVillagerLocation(villagerId);
    if (!location) return res.status(404).json({ error: "User not found or location not set" });
    res.json(location);
  } catch (error) {
    console.error(`Error in getVillagerLocation for ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateVillagerParticipation = async (req, res) => {
  try {
    const { is_participant } = req.body;
    const villagerId = req.params.id;

    if (typeof is_participant !== 'boolean') {
      return res.status(400).json({ error: "is_participant must be a boolean value" });
    }

    const updated = await User.updateVillagerParticipation(villagerId, is_participant);

    if (!updated) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Villager participation status updated successfully" });
  } catch (error) {
    console.error(`Error in updateVillagerParticipation for ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const requestPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.getVillagerByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    otps.set(user.Villager_ID, { otp, expires: Date.now() + 10 * 60 * 1000 });

    await sendConfirmationEmail(
      user.Email,
      "Password Reset OTP",
      `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`
    );

    res.json({ message: "OTP sent to your email", villagerId: user.Villager_ID });
  } catch (error) {
    console.error("Error in requestPasswordOtp:", error);
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
};

const verifyPasswordOtp = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const userId = req.params.id;

    const storedOtp = otps.get(userId);
    if (!storedOtp || storedOtp.expires < Date.now()) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await User.updatePassword(userId, hashedPassword);
    if (!updated) return res.status(404).json({ error: "User not found" });

    otps.delete(userId);
    await sendConfirmationEmail(
      (await User.getVillagerById(userId)).Email,
      "Password Updated",
      "Your password has been updated successfully."
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in verifyPasswordOtp:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const villagerId = req.params.id;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const user = await User.getVillagerById(villagerId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.addNotification(villagerId, message);
    res.json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error(`Error sending notification for villager ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const villagerId = req.user.userId;
    const notifications = await User.getNotificationsByVillagerId(villagerId);
    res.json(notifications);
  } catch (error) {
    console.error(`Error fetching notifications for villager ID ${req.user.userId}:`, error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const villagerId = req.user.userId;

    const notification = await User.getNotificationById(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    if (notification.Villager_ID !== villagerId) {
      return res.status(403).json({ error: "Unauthorized access to notification" });
    }

    const updated = await User.markNotificationAsRead(notificationId);
    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error(`Error marking notification ID ${req.params.id} as read:`, error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(email);
};

module.exports = {
  getVillagers,
  getVillager,
  createVillager,
  updateVillager,
  deleteVillager,
  loginVillager,
  getProfile,
  updateUserStatus,
  requestPasswordOtp,
  verifyPasswordOtp,
  validateEmail,
  updateVillagerLocation,
  getVillagerLocation,
  updateVillagerParticipation,
  sendNotification,
  getNotifications,
  markNotificationAsRead,
};