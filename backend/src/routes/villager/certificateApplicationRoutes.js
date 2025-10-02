const express = require("express");
const multer = require("multer");
const certificateApplicationController = require("../../controllers/villager/certificateApplicationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `File too large. Maximum size allowed is ${err.field}MB.` });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

router.post(
  "/",
  authenticate,
  upload.single("document"),
  handleMulterError,
  certificateApplicationController.createCertificateApplication
);

router.get(
  "/",
  authenticate,
  certificateApplicationController.getAllCertificateApplications
);

router.put(
  "/:applicationId/status",
  authenticate,
  certificateApplicationController.updateCertificateApplicationStatus
);

router.get(
  "/download/:filename",
  authenticate,
  certificateApplicationController.downloadDocument
);

router.get(
  "/villager/:villagerId",
  authenticate,
  certificateApplicationController.getVillagerDetails
);

router.get(
  "/application/:applicationId",
  authenticate,
  certificateApplicationController.getApplicationDetails
);

router.post(
  "/save-certificate/:applicationId",
  authenticate,
  upload.single("certificate"),
  handleMulterError,
  certificateApplicationController.saveCertificate
);
router.get(
  "/user-application",
  authenticate,
  certificateApplicationController.getUserCertificateApplication
);

module.exports = router;