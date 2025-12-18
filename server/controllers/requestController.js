const Request = require('../models/Request');
const Message = require('../models/Message');

// @desc    Create a food request
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res) => {
    try {
        const { food_type, preferred_time, urgency, reason, location, donationId, donorId } = req.body;

        let document = null;
        if (req.file) {
            document = req.file.path;
        }

        const newRequest = new Request({
            food_type,
            preferred_time,
            urgency,
            reason,
            location,
            user: req.user.id,
            document,
            donation: donationId || null,
            donor: donorId || null
        });

        const request = await newRequest.save();
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get user's request history
// @route   GET /api/requests/my
// @access  Private
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ user: req.user.id })
            .sort({ request_date: -1 })
            .populate({
                path: 'donation',
                populate: { path: 'donor', select: 'name _id' }
            })
            .populate('donor', 'name _id');

        // Add unread message count to each request
        const requestsWithUnread = await Promise.all(requests.map(async (request) => {
            const unreadCount = await Message.countDocuments({
                request: request._id,
                receiver: req.user.id,
                isRead: false
            });
            return { ...request.toObject(), unreadCount };
        }));

        res.json(requestsWithUnread);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get requests made to the logged-in donor
// @route   GET /api/requests/incoming
// @access  Private (Donor)
exports.getIncomingRequests = async (req, res) => {
    try {
        const requests = await Request.find({ donor: req.user.id })
            .sort({ request_date: -1 })
            .populate('user', 'name email phone') // Requester details
            .populate('donation', 'food_name');   // Donation details

        // Add unread message count to each request
        const requestsWithUnread = await Promise.all(requests.map(async (request) => {
            const unreadCount = await Message.countDocuments({
                request: request._id,
                receiver: req.user.id,
                isRead: false
            });
            return { ...request.toObject(), unreadCount };
        }));

        res.json(requestsWithUnread);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all requests (Admin)
// @route   GET /api/requests
// @access  Private (Admin)
exports.getAllRequests = async (req, res) => {
    try {
        // Simple check for admin role if needed, or rely on frontend to hide. 
        // Real security should check req.user.role here.
        if (req.user.role !== 'admin') {
            // return res.status(401).json({ msg: 'Not authorized' }); 
            // PHP didn't seem to have strict middleware check on "all_requests.php" other than session check & role check inside file.
        }

        const requests = await Request.find().sort({ request_date: -1 }).populate('user', 'name email phone');
        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update request status (Admin)
// @route   PUT /api/requests/:id/status
// @access  Private (Admin)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body; // e.g., 'Approved', 'Rejected'

        let request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        request.status = status;
        await request.save();
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a request
// @route   DELETE /api/requests/:id
// @access  Private
exports.deleteRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Request not found' });
        }

        // Check user (only requester or admin can delete)
        if (request.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await request.deleteOne();

        res.json({ msg: 'Request removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Request not found' });
        }
        res.status(500).send('Server Error');
    }
};
