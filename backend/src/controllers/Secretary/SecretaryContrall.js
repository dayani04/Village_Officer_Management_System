const Secretary = require("../../models/Secretary/SecretaryModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendConfirmationEmail = require("../../utills/mailer");

const getSecretaries = async (req, res) => {
  try {
    const secretaries = await Secretary.getAllSecretaries();
    res.json(secretaries);
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const getSecretary = async (req, res) => {
  try {
    const secretary = await Secretary.getSecretaryById(req.params.id);
    if (!secretary) return res.status(404).json({ error: "Secretary not found" });
    res.json(secretary);
  } catch (error) {
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

    const existingSecretary = await Secretary.getSecretaryByEmail(email);
    if (existingSecretary) {
      return res.status(400).json({ error: "Email already in use" });
    }

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

    await sendConfirmationEmail(email);
    res.status(201).json({ id: secretary_id, message: "Secretary added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateSecretary = async (req, res) => {
  try {
    const { full_name, email, phone_no, status } = req.body;
    const updated = await Secretary.updateSecretary(req.params.id, full_name, email, phone_no, status);
    if (!updated) return res.status(404).json({ error: "Secretary not found" });
    res.json({ message: "Secretary updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const deleteSecretary = async (req, res) => {
  try {
    const deleted = await Secretary.deleteSecretary(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Secretary not found" });
    res.json({ message: "Secretary deleted successfully" });
  } catch (error) {
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
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const secretary = await Secretary.getSecretaryById(req.user.userId);
    if (!secretary) return res.status(404).json({ error: "Secretary not found" });
    res.json(secretary);
  } catch (error) {
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
  validateEmail,
};