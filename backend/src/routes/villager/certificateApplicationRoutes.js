const express = require("express");
const multer = require("multer");
const certificateApplicationController = require("../../controllers/villager/certificateApplicationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/",
  authenticate,
  upload.single("document"),
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


module.exports = router;