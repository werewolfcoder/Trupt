const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orgController = require('../controllers/org.controllers');

router.post('/registerOrg',
    [
        body('organizationName').isLength({ min: 3 }).withMessage('Organization Name must be at least 3 characters long'),
        body('organizationType').isIn(['hotel', 'NGO', 'non-profit', 'social service']).withMessage('Invalid Organization Type'),
        body('address').isLength({ min: 3 }).withMessage('Address must be at least 3 characters long'),
        body('contactPerson').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        body('contactNumber').isLength({ min: 10 }).withMessage('Invalid contact number'),
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    orgController.registerOrg
);

router.post('/login',
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    orgController.loginOrg
);

module.exports = router;