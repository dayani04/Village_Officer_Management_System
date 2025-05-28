const express = require("express");
const multer = require("multer");
const electionApplicationController = require("../../controllers/villager/electionApplicationController");
const notificationController = require("../../controllers/villager/notificationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", authenticate, upload.single("document"), electionApplicationController.createElectionApplication);
router.get("/", authenticate, electionApplicationController.getElectionApplications);
router.get("/confirmed", authenticate, electionApplicationController.getConfirmedElectionApplications);
router.put("/:villagerId/:electionrecodeID/status", authenticate, electionApplicationController.updateElectionApplicationStatus);
router.get("/download/:filename", authenticate, electionApplicationController.downloadDocument);
router.post("/notifications/", authenticate, notificationController.saveNotification);

module.exports = router;