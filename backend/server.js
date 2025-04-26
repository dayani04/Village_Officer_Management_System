//server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
const villagerRoutes = require("./src/routes/villager/villagerRoutes");

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from your frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  credentials: true, // If you need to send cookies or auth headers
}));

app.use(express.json());
app.use("/api/villagers", villagerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
