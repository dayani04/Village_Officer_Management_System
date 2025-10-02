const express = require('express');
const villagerController = require('../../controllers/villager/villagerController');
const allowanceApplicationController = require('../../controllers/villager/allowanceApplicationController');
const authenticate = require('../../middleware/authMiddleware');
const multer = require('multer');
const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, and JPG are allowed.'));
    }
  }
});

// Routes for creating and updating villagers with file uploads
router.post("/", upload.fields([
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'nicCopy', maxCount: 1 }
]), villagerController.createVillager);

router.post("/login", villagerController.loginVillager);
router.post("/request-otp", villagerController.requestPasswordOtp);
router.post("/new-born-request", authenticate, upload.fields([
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'motherNic', maxCount: 1 },
  { name: 'fatherNic', maxCount: 1 },
  { name: 'marriageCertificate', maxCount: 1 },
  { name: 'residenceCertificate', maxCount: 1 }
]), villagerController.requestNewBorn);
router.post("/new-family-member-request", authenticate, upload.fields([
  { name: 'document', maxCount: 1 },
  { name: 'residenceCertificate', maxCount: 1 }
]), villagerController.requestNewFamilyMember);

router.use(authenticate);

router.get("/", villagerController.getVillagers);
router.get("/profile", villagerController.getProfile);
router.get("/notifications", villagerController.getNotifications);
router.get("/new-family-member-requests", villagerController.getNewFamilyMemberRequests);
router.get("/house-count", villagerController.getHouseCount);
router.get("/participant-total", villagerController.getVillageParticipantTotal);
router.get("/monthly-registration-count", villagerController.getMonthlyRegistrationCount);
router.get("/religion-count", villagerController.getReligionCount);
router.get("/race-count", villagerController.getRaceCount);
router.get("/monthly-growth", villagerController.getMonthlyVillagerGrowth);
router.get("/new-born-requests", villagerController.getNewBornRequests);
router.get("/documents/:filename", villagerController.downloadDocument);
router.get("/total", villagerController.getVillageTotal);
router.get("/:villagerId", allowanceApplicationController.getVillagerById);
router.put("/:id", upload.fields([
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'nicCopy', maxCount: 1 }
]), villagerController.updateVillager);
router.delete("/:id", villagerController.deleteVillager);
router.put("/:id/status", villagerController.updateUserStatus);
router.put("/:id/location", villagerController.updateVillagerLocation);
router.get("/:id/location", villagerController.getVillagerLocation);
router.post("/:id/verify-otp", villagerController.verifyPasswordOtp);
router.post("/:id/notification", villagerController.sendNotification);
router.put("/notifications/:id/read", villagerController.markNotificationAsRead);

// New route for uploading documents (Changed to POST)
router.post("/documents", upload.fields([
  { name: 'birthCertificate', maxCount: 1 },
  { name: 'nicCopy', maxCount: 1 }
]), villagerController.updateVillagerDocuments);

module.exports = router;