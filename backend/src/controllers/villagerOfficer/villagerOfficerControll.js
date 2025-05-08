const VillagerOfficer = require("../../models/villagerOfficer/villagerOfficerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendConfirmationEmail = require("../../utills/mailer");
const crypto = require("crypto");

const otps = new Map();

const getVillagerOfficers = async (req, res) => {
  try {
    const officers = await VillagerOfficer.getAllVillagerOfficers();
    res.json(officers);
  } catch (error) {
    console.error("Error in getVillagerOfficers:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getVillagerOfficer = async (req, res) => {
  try {
    const officer = await VillagerOfficer.getVillagerOfficerById(req.params.id);
    if (!officer) return res.status(404).json({ error: "Officer not found" });
    res.json(officer);
  } catch (error) {
    console.error("Error in getVillagerOfficer:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const createVillagerOfficer = async (req, res) => {
  try {
    const {
      villager_officer_id,
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

    if (!villager_officer_id || !full_name || !email || !password || !phone_no) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const existingOfficer = await VillagerOfficer.getVillagerOfficerByEmail(email);
    if (existingOfficer) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await VillagerOfficer.addVillagerOfficer(
      villager_officer_id,
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

    await sendConfirmationEmail(
      email,
      "Welcome to Village Officer Management System",
      "Your Village Officer account has been created successfully."
    );
    res.status(201).json({ id: villager_officer_id, message: "Villager Officer added successfully" });
  } catch (error) {
    console.error("Error in createVillagerOfficer:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateVillagerOfficer = async (req, res) => {
  try {
    const { full_name, email, phone_no, status } = req.body;
    const updated = await VillagerOfficer.updateVillagerOfficer(req.params.id, full_name, email, phone_no, status);
    if (!updated) return res.status(404).json({ error: "Officer not found" });
    res.json({ message: "Villager Officer updated successfully" });
  } catch (error) {
    console.error("Error in updateVillagerOfficer:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const deleteVillagerOfficer = async (req, res) => {
  try {
    const deleted = await VillagerOfficer.deleteVillagerOfficer(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Officer not found" });
    res.json({ message: "Villager Officer deleted successfully" });
  } catch (error) {
    console.error("Error in deleteVillagerOfficer:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const loginVillagerOfficer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const officer = await VillagerOfficer.getVillagerOfficerByEmail(email);
    if (!officer) {
      return res.status(404).json({ error: "Officer not found" });
    }

    const isMatch = await bcrypt.compare(password, officer.Password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: officer.Villager_Officer_ID }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      officerId: officer.Villager_Officer_ID,
      fullName: officer.Full_Name,
      email: officer.Email,
      phoneNo: officer.Phone_No,
      status: officer.Status,
      token,
    });
  } catch (error) {
    console.error("Error in loginVillagerOfficer:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const officer = await VillagerOfficer.getVillagerOfficerById(req.user.userId);
    if (!officer) return res.status(404).json({ error: "Officer not found" });
    res.json(officer);
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateOfficerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await VillagerOfficer.updateOfficerStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: "Officer not found" });
    res.json({ message: "Officer status updated successfully" });
  } catch (error) {
    console.error("Error in updateOfficerStatus:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateOfficerPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await VillagerOfficer.updatePassword(req.params.id, hashedPassword);
    if (!updated) return res.status(404).json({ error: "Officer not found" });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updateOfficerPassword:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const requestPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const officer = await VillagerOfficer.getVillagerOfficerByEmail(email);
    if (!officer) {
      return res.status(404).json({ error: "Officer not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    otps.set(officer.Villager_Officer_ID, { otp, expires: Date.now() + 10 * 60 * 1000 });

    await sendConfirmationEmail(
      officer.Email,
      "Password Reset OTP",
      `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`
    );

    res.json({ message: "OTP sent to your email", villageOfficerId: officer.Villager_Officer_ID });
  } catch (error) {
    console.error("Error in requestPasswordOtp:", error);
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
};

const verifyPasswordOtp = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const officerId = req.params.id;

    const storedOtp = otps.get(officerId);
    if (!storedOtp || storedOtp.expires < Date.now()) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await VillagerOfficer.updatePassword(officerId, hashedPassword);
    if (!updated) return res.status(404).json({ error: "Officer not found" });

    otps.delete(officerId);
    await sendConfirmationEmail(
      (await VillagerOfficer.getVillagerOfficerById(officerId)).Email,
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
  getVillagerOfficers,
  getVillagerOfficer,
  createVillagerOfficer,
  updateVillagerOfficer,
  deleteVillagerOfficer,
  loginVillagerOfficer,
  getProfile,
  updateOfficerStatus,
  updateOfficerPassword,
  requestPasswordOtp,
  verifyPasswordOtp,
  validateEmail,
};