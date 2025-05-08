const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const villagerRoutes = require("./src/routes/villager/villagerRoutes");
const villagerOfficerRoutes = require("./src/routes/villagerOfficer/villagerOfficerRoute");
const electionRoutes = require("./src/routes/villager/electionRoutes");
const electionApplicationRoutes = require("./src/routes/villager/electionApplicationRoutes");
const allowanceRoutes = require("./src/routes/villager/allowanceRoutes");
const allowanceApplicationRoutes = require("./src/routes/villager/allowanceApplicationRoutes");
const permitRoutes = require("./src/routes/villager/permitRoutes");
const permitApplicationRoutes = require("./src/routes/villager/permitApplicationRoutes");
const certificateApplicationRoutes = require("./src/routes/villager/certificateApplicationRoutes");
const nicRoutes = require("./src/routes/villager/nicRoutes");
const nicApplicationRoutes = require("./src/routes/villager/nicApplicationRoutes");
const secretaryRoutes = require("./src/routes/Secretary/SecretaryRoutes"); // Add this line

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
app.use("/api/allowances", allowanceRoutes);
app.use("/api/allowance-applications", allowanceApplicationRoutes);
app.use("/api/permits", permitRoutes);
app.use("/api/permit-applications", permitApplicationRoutes);
app.use("/api/certificate-applications", certificateApplicationRoutes);
app.use("/api/nics", nicRoutes);
app.use("/api/nic-applications", nicApplicationRoutes);
app.use("/api/secretaries", secretaryRoutes); // Add this line

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});