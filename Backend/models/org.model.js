const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const orgSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true
    },
    organizationType: {
        type: String,
        enum: ['hotel', 'NGO', 'non-profit', 'social service'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'email must be at least 3 characters long']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String
    }
});

orgSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
};

orgSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

orgSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const orgModel = mongoose.model('org', orgSchema);

module.exports = orgModel;