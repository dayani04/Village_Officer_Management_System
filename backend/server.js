//server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const villagerRoutes = require("./src/routes/villager/villagerRoutes");
const villagerOfficerRoutes = require("./src/routes/villagerOfficer/villagerOfficerRoute");
const electionRoutes = require("./src/routes/villager/electionRoutes");
const electionApplicationRoutes = require("./src/routes/villager/electionApplicationRoutes");
const path = require("path");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/villagers", villagerRoutes);
app.use("/api/villager-officer", villagerOfficerRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/election-applications", electionApplicationRoutes);

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
