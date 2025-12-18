const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAllUsers, deleteUser } = require('../controllers/adminController');

// All routes are protected and should ideally check for 'admin' role
router.get('/users', auth, getAllUsers);
router.delete('/users/:id', auth, deleteUser);

module.exports = router;
