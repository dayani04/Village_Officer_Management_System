const User = require("../../models/villager/villagerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Importing JWT
const sendConfirmationEmail = require("../../utills/mailer");
const pool = require("../../config/database");

const getVillagers = async (req, res) => {
  try {
    const users = await User.getAllVillagers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getVillager = async (req, res) => {
  try {
    const user = await User.getVillagerById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
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
      area_id
    );

    await sendConfirmationEmail(email);
    res.status(201).json({ id: villager_id, message: "Villager added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateVillager = async (req, res) => {
  try {
    const { full_name, email, phone_no, status } = req.body;
    const updated = await User.updateVillager(req.params.id, full_name, email, phone_no, status);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Villager updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const deleteVillager = async (req, res) => {
  try {
    const deleted = await User.deleteVillager(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Villager deleted successfully" });
  } catch (error) {
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
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};
const getProfile = async (req, res) => {
  try {
    const user = await User.getVillagerById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
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
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await User.updatePassword(req.params.id, hashedPassword);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
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
  updateUserPassword,
  validateEmail,
};