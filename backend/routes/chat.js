const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
  uploadResume,
  chatWithCandidate,
  analyzeMatch,
} = require('../controllers/chatController');

// Multer config - store in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Routes
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.post('/chat', chatWithCandidate);
router.post('/analyze-match', analyzeMatch);

module.exports = router;