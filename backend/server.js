
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

// Temporary debug endpoint to generate a permit certificate (no auth)
const PDFDocument = require('pdfkit');
const { registerFonts } = require('./src/utills/registerFonts');
app.get('/api/debug/generate-permit', async (req, res) => {
  try {
    const villager = { Villager_ID: 'VDBG', Full_Name: 'දේමෝ පරිශීලක', Address: 'Test Address' };
    const permit = { Permits_ID: 'DBG', Permits_Type: 'Debug Permit' };
    const applyDate = new Date().toISOString().split('T')[0];

    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const timestamp = Date.now();
    const filename = `${villager.Villager_ID}_${permit.Permits_ID}_certificate_${timestamp}.pdf`;
    const outDir = path.join(__dirname, 'Uploads');
    const outPath = path.join(outDir, filename);
    fs.mkdirSync(outDir, { recursive: true });

    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);

    const { sinhalaAvailable, sinhalaFontAvailable, robotoPath, notoSinhalaPath } = registerFonts(doc);
    console.log('DEBUG /api/debug/generate-permit registerFonts:', { sinhalaAvailable, sinhalaFontAvailable, robotoPath, notoSinhalaPath });

    doc.font('Roboto').fontSize(24).fillColor('#921940').text('Permit Certificate', 0, 120, { align: 'center' });
    if (sinhalaAvailable) doc.font('NotoSansSinhala').fontSize(22).text('බලපත්‍ර සහතිකය', 0, 150, { align: 'center' });
    else doc.font('Roboto').fontSize(12).fillColor('#f43f3f').text('Sinhala font unavailable', 0, 150, { align: 'center' });

    doc.end();

    stream.on('finish', () => {
      console.log('DEBUG generated:', outPath);
      res.json({ ok: true, path: `/Uploads/${filename}`, sinhalaAvailable, sinhalaFontAvailable, robotoPath, notoSinhalaPath });
    });
    stream.on('error', (err) => {
      console.error('DEBUG write error:', err);
      res.status(500).json({ ok: false, error: err.message });
    });
  } catch (error) {
    console.error('DEBUG generation error:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});