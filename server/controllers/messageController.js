const Message = require('../models/Message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, requestId, content } = req.body;
        console.log("Send Message Payload:", { sender: req.user.id, receiverId, requestId, content });

        if (!receiverId || !requestId || !content) {
            console.error("Missing fields in sendMessage");
            return res.status(400).json({ msg: "Missing fields" });
        }

        const newMessage = new Message({
            sender: req.user.id,
            receiver: receiverId,
            request: requestId,
            content
        });

        const message = await newMessage.save();
        console.log("Message saved:", message);
        res.json(message);
    } catch (err) {
        console.error("Error in sendMessage:", err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get messages for a request
// @route   GET /api/messages/:requestId
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ request: req.params.requestId })
            .sort({ timestamp: 1 })
            .populate('sender', 'name'); // Optional: populate sender name
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/:requestId/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;

        await Message.updateMany(
            { request: requestId, receiver: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ msg: 'Messages marked as read' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
