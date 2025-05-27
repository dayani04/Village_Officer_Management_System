const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
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
const secretaryRoutes = require("./src/routes/Secretary/SecretaryRoutes");
const certificateRoutes = require("./src/routes/villager/certificateRoutes");

dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Mount routes
app.use("/api/villagers", villagerRoutes);
app.use("/api/villager-officers", villagerOfficerRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/election-applications", electionApplicationRoutes);
app.use("/api/allowances", allowanceRoutes);
app.use("/api/allowance-applications", allowanceApplicationRoutes);
app.use("/api/permits", permitRoutes);
app.use("/api/permit-applications", permitApplicationRoutes);
app.use("/api/certificate-applications", certificateApplicationRoutes);
app.use("/api/nics", nicRoutes);
app.use("/api/nic-applications", nicApplicationRoutes);
app.use("/api/secretaries", secretaryRoutes);
app.use("/api/certificate-applications", certificateRoutes);
app.use("/api/allowance-applications", allowanceRoutes);




// Serve static files from Uploads directory
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));

// Debug: List all routes
app.get("/api/debug/routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods),
      });
    } else if (middleware.name === "router" && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: `/api${handler.route.path}`, // Adjust for base path
            methods: Object.keys(handler.route.methods),
          });
        }
      });
    }
  });
  res.json(routes);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});