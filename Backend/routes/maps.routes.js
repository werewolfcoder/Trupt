const express = require('express');
const router = express.Router();
const authmiddleware = require('../middlewares/auth.middleware');
const {getCompleteSuggestions} = require('../services/maps.services');
const mapController = require('../controllers/maps.controllers');
const{query} = require('express-validator');


router.get('/get-suggestions',
    query('input').isString().notEmpty(),
    authmiddleware.authUser,mapController.getCompleteSuggestions
)

router.get('/get-distance',
    query('origin').isString().notEmpty(),
    query('destination').isString().notEmpty(),
    authmiddleware.authUser,mapController.getDistanceTime
)
module.exports = router;
