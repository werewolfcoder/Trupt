const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    volunteer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    foodName: {
        type: String,
        required: true
    },
    // foodPhoto: {
    //     type: String,
    //     required: true
    // },
    freshness: {
        type: Number,
        required: true
    },
    emergency: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'rejected', 'delivered'],
        default: 'pending'
    },
    signature: {
        type: String
    }
});

module.exports = mongoose.model('donation', donationSchema);