const express = require("express");
const multer = require("multer");
const allowanceApplicationController = require("../../controllers/villager/allowanceApplicationController");
const notificationController = require("../../controllers/villager/notificationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", authenticate, upload.single("document"), allowanceApplicationController.createAllowanceApplication);
router.get("/", authenticate, allowanceApplicationController.getAllowanceApplications);
router.get("/confirmed", authenticate, allowanceApplicationController.getConfirmedAllowanceApplications);
router.put("/:villagerId/:allowancesId/status", authenticate, allowanceApplicationController.updateAllowanceApplicationStatus);
router.get("/download/:filename", authenticate, allowanceApplicationController.downloadDocument);
router.post("/notifications/", authenticate, notificationController.saveNotification);

module.exports = router;