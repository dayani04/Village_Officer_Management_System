const express = require("express");
const multer = require("multer");
const permitApplicationController = require("../../controllers/villager/permitApplicationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "document", maxCount: 1 },
  { name: "policeReport", maxCount: 1 },
]);

router.post("/", authenticate, upload, permitApplicationController.createPermitApplication);
router.get("/", authenticate, permitApplicationController.getPermitApplications);
router.get("/confirmed", authenticate, permitApplicationController.getConfirmedPermitApplications);
router.put("/:villagerId/:permitsId/status", authenticate, permitApplicationController.updatePermitApplicationStatus);
router.get("/download/:filename", authenticate, permitApplicationController.downloadDocument);

module.exports = router;