const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const { createRequest, getMyRequests, getAllRequests, updateRequestStatus, getIncomingRequests, deleteRequest } = require('../controllers/requestController');

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|pdf|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images, PDFs, and Docs Only!');
        }
    }
});

router.post('/', [auth, upload.single('document')], createRequest);
router.get('/my', auth, getMyRequests);
router.get('/incoming', auth, getIncomingRequests);
router.get('/', auth, getAllRequests); // Admin check inside controller or add admin middleware
router.put('/:id/status', auth, updateRequestStatus);
router.delete('/:id', auth, deleteRequest);

module.exports = router;
