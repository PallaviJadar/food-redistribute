const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

router.post('/', auth, messageController.sendMessage);
router.get('/:requestId', auth, messageController.getMessages);
router.put('/:requestId/read', auth, messageController.markAsRead);

module.exports = router;
