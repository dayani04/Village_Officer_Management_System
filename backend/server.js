
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
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
const notificationRoutes = require("./src/routes/villager/notificationRoutes");
const Notification = require("./src/models/villager/notificationModel");
const electionNotificationRoutes = require("./src/routes/villager/electionNotification");


dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Parse JSON bodies
app.use(express.json());

// Mount routes
app.use("/api/villagers", villagerRoutes);
app.use("/api/villager-officers", villagerOfficerRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/election-applications", electionApplicationRoutes);
app.use('/api/election-notifications', electionNotificationRoutes);
app.use("/api/allowances", allowanceRoutes);
app.use("/api/allowance-applications", allowanceApplicationRoutes);
app.use("/api/permits", permitRoutes);
app.use("/api/permit-applications", permitApplicationRoutes);
app.use("/api/certificate-applications", certificateApplicationRoutes);
app.use("/api/nics", nicRoutes);
app.use("/api/nic-applications", nicApplicationRoutes);
app.use("/api/secretaries", secretaryRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/notifications", notificationRoutes);


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
            path: `/api${handler.route.path}`,
            methods: Object.keys(handler.route.methods),
          });
        }
      });
    }
  });
  res.json(routes);
});

// Schedule daily deletion of old notifications
cron.schedule('0 0 * * *', async () => {
  try {
    const affectedRows = await Notification.deleteOldNotifications();
    console.log(`Deleted ${affectedRows} old notifications`);
  } catch (error) {
    console.error('Error deleting old notifications:', error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});