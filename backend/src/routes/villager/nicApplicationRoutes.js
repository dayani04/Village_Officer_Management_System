const express = require("express");
const multer = require("multer");
const nicApplicationController = require("../../controllers/villager/nicApplicationController");
const authenticate = require("../../middleware/authMiddleware");
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post(
  "/",
  authenticate,
  upload.single("document"),
  nicApplicationController.createNICApplication
);

router.get("/", authenticate, nicApplicationController.getAllNICApplications);
router.put(
  "/:villagerId/:nicId/status",
  authenticate,
  nicApplicationController.updateNICApplicationStatus
);
router.get("/download/:filename", authenticate, nicApplicationController.downloadDocument);

module.exports = router;