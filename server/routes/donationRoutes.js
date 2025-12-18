const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createDonation, getAllDonations, getMyDonations, deleteDonation } = require('../controllers/donationController');

router.post('/', auth, createDonation);
router.get('/', auth, getAllDonations); // Protected as per dashboard access
router.get('/my', auth, getMyDonations);
router.delete('/:id', auth, deleteDonation);

module.exports = router;
