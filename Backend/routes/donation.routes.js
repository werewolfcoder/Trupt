const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const donationController = require('../controllers/donation.cotrollers');
const authMiddleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/create',
    authMiddleware.authUser,
    upload.single('image'),
   body('foodName').isString().withMessage('Invalid food name'),
    body('freshness').isNumeric().withMessage('Invalid freshness'),
    body('emergency').isString().withMessage('Invalid emergency'),
    body('location').isString().isLength({ min: 3 }).withMessage('Invalid location'),
    body('locationELoc').isString().isLength({min: 6}).withMessage('invalid eLoc'),
    donationController.createDonation

)
router.post('/confirm',
    authMiddleware.authUser,
    body('donationId').isMongoId().withMessage('Invalid donation ID'),
    donationController.confirmDonation
)

router.get('/user',
    authMiddleware.authUser,
    donationController.getUserDonations
);

module.exports = router;