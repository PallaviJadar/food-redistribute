const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    food_type: {
        type: String,
        required: true
    },
    preferred_time: {
        type: String, // Keeping as string to match 'time' input
        required: true
    },
    urgency: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    donation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    },
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    document: {
        type: String // Path to uploaded file
    },
    status: {
        type: String,
        default: 'Pending'
    },
    people_served: {
        type: Number
    },
    request_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Request', RequestSchema);
