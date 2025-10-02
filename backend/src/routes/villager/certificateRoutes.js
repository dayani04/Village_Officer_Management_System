const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../../config/database"); // Your DB connection

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../Uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Or use a unique name
  },
});
const upload = multer({ storage });

router.post(
  "/save-certificate/:applicationId",
  upload.single("certificate"),
  async (req, res) => {
    const { applicationId } = req.params;
    const filePath = `/backend/Uploads/${req.file.filename}`;

    try {
      // Update certificate_path in DB
      await db.query(
        "UPDATE villager_has_certificate_recode SET certificate_path = ? WHERE application_id = ?",
        [filePath, applicationId]
      );
      res.json({ success: true, path: filePath });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;