const express = require("express");
const multer = require("multer");
const newBornRequestController = require("../../controllers/villager/newbornRequestController");
const notificationController = require("../../controllers/villager/notificationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'motherNic', maxCount: 1 },
  { name: 'fatherNic', maxCount: 1 },
  { name: 'marriageCertificate', maxCount: 1 }
]);

router.post("/", authenticate, upload, newBornRequestController.createNewBornRequest);
router.get("/", authenticate, newBornRequestController.getNewBornRequests);
router.get("/approved", authenticate, newBornRequestController.getApprovedNewBornRequests);
router.get("/villager/:villagerId", authenticate, newBornRequestController.getNewBornRequestsByVillagerId);
router.put("/:requestId/status", authenticate, newBornRequestController.updateNewBornRequestStatus);
router.get("/download/:filename", authenticate, newBornRequestController.downloadDocument);
router.post("/notifications/", authenticate, notificationController.saveNotification);

module.exports = router;