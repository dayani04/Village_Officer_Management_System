const express = require("express");
const certificateController = require("../../controllers/villager/certificateController");
const authenticate = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");
const router = express.Router();

router.get(
  "/certificate/:applicationId",
  authenticate,
  certificateController.getCertificateDetails
);

router.post(
  "/save-certificate/:applicationId",
  authenticate,
  upload,
  certificateController.saveCertificate
);

module.exports = router;