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

    await sendConfirmationEmail(email, "Welcome to Village Officer Management System", "Your account has been created successfully.");
    res.status(201).json({ id: villager_id, message: "Villager added successfully" });
  } catch (error) {
    console.error("Error in createVillager:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateVillager = async (req, res) => {
  try {
    const { full_name, email, phone_no, address, regional_division, status } = req.body;
    const villagerId = req.params.id;

    // Validate required fields
    if (!full_name || !email || !phone_no) {
      return res.status(400).json({ error: "Full Name, Email, and Phone Number are required" });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const currentUser = await User.getVillagerById(villagerId);
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    // Prepare update data, preserving existing values for optional fields if not provided
    const updateData = {
      full_name,
      email,
      phone_no,
      address: address || currentUser.Address,
      regional_division: regional_division || currentUser.RegionalDivision,
      status: status || currentUser.Status,
    };

    const updated = await User.updateVillager(
      villagerId,
      updateData.full_name,
      updateData.email,
      updateData.phone_no,
      updateData.address,
      updateData.regional_division,
      updateData.status
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
    });
  } catch (error) {
    console.error("Error in loginVillager:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
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

const requestPasswordOtp = async (req, res) => {
  try {
    const user = await User.getVillagerById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    otps.set(user.Villager_ID, { otp, expires: Date.now() + 10 * 60 * 1000 });

    await sendConfirmationEmail(
      user.Email,
      "Password Reset OTP",
      `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`
    );

    res.json({ message: "OTP sent to your email" });
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
};