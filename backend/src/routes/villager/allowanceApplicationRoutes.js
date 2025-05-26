const express = require("express");
const multer = require("multer");
const allowanceApplicationController = require("../../controllers/villager/allowanceApplicationController");
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
  allowanceApplicationController.createAllowanceApplication
);

router.get(
  "/",
  authenticate,
  allowanceApplicationController.getAllowanceApplications
);

router.get(
  "/:applicationId",
  authenticate,
  allowanceApplicationController.getAllowanceApplicationById
);

router.put(
  "/:applicationId/status",
  authenticate,
  allowanceApplicationController.updateAllowanceApplicationStatus
);

module.exports = router;