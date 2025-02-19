const orgModel = require('../models/org.model');
const orgService = require('../services/org.service');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');
module.exports.registerOrg = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { organizationName, organizationType, address, contactPerson, contactNumber, email, password } = req.body;

    const orgExists = await orgModel.findOne({ email });

    if (orgExists) {
        return res.status(400).json({ message: 'Organization already exists' });
    }

    const hashedPassword = await orgModel.hashPassword(password);

    const org = await orgService.createOrg({
        organizationName,
        organizationType,
        address,
        contactPerson,
        contactNumber,
        email,
        password: hashedPassword
    });

    const token = jwt.sign({ id: org._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ org, token });
};

module.exports.loginOrg = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const org = await orgModel.findOne({ email }).select('+password');

    if (!org) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await org.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = org.generateAuthToken();
    res.cookie('token', token, { httpOnly: true });
    res.status(200).json({ org, token });
};

module.exports.getOrgProfile = async (req, res, next) => {

    res.status(200).json(req.org);

}


module.exports.logoutOrg = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}