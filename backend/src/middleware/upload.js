const multer = require('multer');

// Configure Multer storage to use memory storage
const storage = multer.memoryStorage();

// Set up Multer middleware with file filter and limits
const upload = multer({
  storage: storage,
  limits: {
    // fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
}).single('certificate'); // Handle single file upload with field name 'certificate'

module.exports = upload;