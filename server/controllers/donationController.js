const Donation = require('../models/Donation');
const User = require('../models/User');

// @desc    Create a donation
// @route   POST /api/donations
// @access  Private (Donor)
exports.createDonation = async (req, res) => {
    try {
        const { food_name, quantity, location, expiry_date } = req.body;

        const newDonation = new Donation({
            food_name,
            quantity,
            location,
            expiry_date,
            donor: req.user.id
        });

        const donation = await newDonation.save();
        res.json(donation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all donations
// @route   GET /api/donations
// @access  Public (or Private?) - PHP dashboard showed all donations.
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ status: 'Available' }).sort({ expiry_date: 1 }).populate('donor', 'name email phone');
        res.json(donations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get donor's history
// @route   GET /api/donations/my
// @access  Private
exports.getMyDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user.id }).sort({ createdAt: -1 });
        res.json(donations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a donation
// @route   DELETE /api/donations/:id
// @access  Private
exports.deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ msg: 'Donation not found' });
        }

        // Check user (only donor or admin can delete)
        if (donation.donor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await donation.deleteOne();

        res.json({ msg: 'Donation removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Donation not found' });
        }
        res.status(500).send('Server Error');
    }
};
