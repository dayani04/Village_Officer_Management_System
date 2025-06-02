const Secretary = require("../../models/Secretary/SecretaryModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendConfirmationEmail = require("../../utills/mailer");
const crypto = require("crypto");

const otps = new Map();

const getSecretaries = async (req, res) => {
  try {
    const secretaries = await Secretary.getAllSecretaries();
    res.json(secretaries);
  } catch (error) {
    console.error("Error in getSecretaries:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getSecretary = async (req, res) => {
  try {
    const secretary = await Secretary.getSecretaryById(req.params.id);
    if (!secretary) return res.status(404).json({ error: " reconstruction not found" });
    res.json(secretary);
  } catch (error) {
    console.error("Error in getSecretary:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const createSecretary = async (req, res) => {
  try {
    const {
      secretary_id,
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

    if (!secretary_id || !full_name || !email || !password || !phone_no) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Remove the email uniqueness check here since triggers handle it
    const hashedPassword = await bcrypt.hash(password, 10);
    await Secretary.addSecretary(
      secretary_id,
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
      "Your Secretary account has been created successfully."
    );
    res.status(201).json({ id: secretary_id, message: "Secretary added successfully" });
  } catch (error) {
    console.error("Error in createSecretary:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};
const updateSecretary = async (req, res) => {
  try {
    const { full_name, email, phone_no, status } = req.body;
    if (!full_name || !email || !phone_no) {
      return res.status(400).json({ error: "Full Name, Email, and Phone Number are required" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const updated = await Secretary.updateSecretary(req.params.id, full_name, email, phone_no, status);
    if (!updated) return res.status(404).json({ error: "Secretary not found" });
    res.json({ message: "Secretary updated successfully" });
  } catch (error) {
    console.error("Error in updateSecretary:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const deleteSecretary = async (req, res) => {
  try {
    const deleted = await Secretary.deleteSecretary(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Secretary not found" });
    res.json({ message: "Secretary deleted successfully" });
  } catch (error) {
    console.error("Error in deleteSecretary:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const loginSecretary = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const secretary = await Secretary.getSecretaryByEmail(email);
    if (!secretary) {
      return res.status(404).json({ error: "Secretary not found" });
    }

    const isMatch = await bcrypt.compare(password, secretary.Password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: secretary.Secretary_ID }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      secretaryId: secretary.Secretary_ID,
      fullName: secretary.Full_Name,
      email: secretary.Email,
      phoneNo: secretary.Phone_No,
      status: secretary.Status,
      token,
    });
  } catch (error) {
    console.error("Error in loginSecretary:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const secretary = await Secretary.getSecretaryById(req.user.userId);
    if (!secretary) return res.status(404).json({ error: "Secretary not found" });
    res.json(secretary);
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateSecretaryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await Secretary.updateSecretaryStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: "Secretary not found" });
    res.json({ message: "Secretary status updated successfully" });
  } catch (error) {
    console.error("Error in updateSecretaryStatus:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateSecretaryPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await Secretary.updatePassword(req.params.id, hashedPassword);
    if (!updated) return res.status(404).json({ error: "Secretary not found" });
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updateSecretaryPassword:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const requestPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const secretary = await Secretary.getSecretaryByEmail(email);
    if (!secretary) {
      return res.status(404).json({ error: "Secretary not found" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    otps.set(secretary.Secretary_ID, { otp, expires: Date.now() + 10 * 60 * 1000 });

    await sendConfirmationEmail(
      secretary.Email,
      "Password Reset OTP",
      `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`
    );

    res.json({ message: "OTP sent to your email", secretaryId: secretary.Secretary_ID });
  } catch (error) {
    console.error("Error in requestPasswordOtp:", error);
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
};

const verifyPasswordOtp = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const secretaryId = req.params.id;

    const storedOtp = otps.get(secretaryId);
    if (!storedOtp || storedOtp.expires < Date.now()) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updated = await Secretary.updatePassword(secretaryId, hashedPassword);
    if (!updated) return res.status(404).json({ error: "Secretary not found" });

    otps.delete(secretaryId);
    await sendConfirmationEmail(
      (await Secretary.getSecretaryById(secretaryId)).Email,
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
  getSecretaries,
  getSecretary,
  createSecretary,
  updateSecretary,
  deleteSecretary,
  loginSecretary,
  getProfile,
  updateSecretaryStatus,
  updateSecretaryPassword,
  requestPasswordOtp,
  verifyPasswordOtp,
  validateEmail,
};