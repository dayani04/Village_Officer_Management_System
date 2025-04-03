const User = require("../../models/villager/villagerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // Importing JWT
const sendConfirmationEmail = require("../../utills/mailer");
const pool = require("../../config/database");

// Get all users
const getVillagers = async (req, res) => {
  try {
    const users = await User.getAllVillagers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Get a single user
const getVillager = async (req, res) => {
  try {
    console.log("Fetching user with ID:", req.params.id); // Log the ID
    const user = await User.getVillagerById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

// Add a new user
// Create a new villager
const createVillager = async (req, res) => {
  try {
    const { 
      villager_id, full_name, email, password, phone_no, 
      nic, dob, address, reginal_division, status, area_id 
    } = req.body;
    
    if (!villager_id || !full_name || !email || !password || !phone_no) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // Check if email already exists
    const existingUser = await User.getVillagerByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userId = await User.addVillager(
      villager_id, full_name, email, hashedPassword, phone_no, 
      nic, dob, address, reginal_division, status || "Active", area_id
    );
    res.status(201).json({ id: userId, message: "Villager added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

const updateVillager = async (req, res) => {
  try {
    const { full_name, email, phone_no, status } = req.body;

    // Update user in the database
    await User.updateVillager(req.params.id, full_name, email, phone_no, status);

    res.json({ message: "Villager updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error", details: error.message });
  }
};


const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(email);
};

// Delete user
const deleteVillager = async (req, res) => {
  try {
    await User.deleteVillager (req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
};

const loginVillager = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login attempt for:", email); // Add logging for email

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password." });
    }

    // Fetch user by email
    const user = await User. getVillagerByEmail(email);
    console.log("User fetched from DB:", user); // Log user from DB

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.idUser }, "your-secret-key", {
      expiresIn: "1h",
    });

    // Send the response with the token
    res.json({
      message: "Login successful",
      userId: user.idUser,
      fullName: user.Full_Name,
      email: user.Email,
      phoneNo: user.Phone_No,
      status: user.Status,
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error); // Log any unexpected errors
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProfile = async (req, res) => {
  try {
    console.log("User info from JWT:", req.user); // This should print user info like { userId: 2 }
    const user = await User.getVillagerById(req.user.userId); // Fetch user based on decoded userId
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error); // Log the error
    res.status(500).json({ error: "Database error" });
  }
};


const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const query = "UPDATE User SET status = ? WHERE idUser = ?";
    const values = [status, userId];
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating status" });
  }
};
// Update user password
const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "New password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
    await pool.query(
      "UPDATE User SET Password = ? WHERE idUser = ?",
      [hashedPassword, id]
    );
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Error updating password" });
  }
};

module.exports = {
  getVillagers,
  getVillager,
  createVillager,
  updateVillager,
  loginVillager,
  deleteVillager,
  getProfile,
  updateUserStatus, 
  validateEmail,
  updateUserPassword

};