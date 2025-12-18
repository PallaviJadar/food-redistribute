const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'donor', 'requester'], // Added 'requester' based on analysis, though PHP used 'donor'/'admin' check. Logic suggests 'requester' accounts existed or roles were fluid. 
        // Re-reading PHP: role was POSTed in register. Let's keep it flexible or enum.
        default: 'donor'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
