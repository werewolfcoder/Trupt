const donationService = require('../services/donation.services');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.services');
const donationModel = require('../models/donation.model');


module.exports.createDonation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId,foodName,freshness,emergency,location,locationELoc } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const donation = await donationService.createDonation({ user: req.user._id,foodName,imageUrl,freshness,emergency,location,locationELoc});
        res.status(201).json(donation);

    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }

};


// module.exports.confirmRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId } = req.body;

//     try {
//         const ride = await rideService.confirmRide({ rideId, captain: req.captain });

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-confirmed',
//             data: ride
//         })

//         return res.status(200).json(ride);
//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.startRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId, otp } = req.query;

//     try {
//         const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

//         console.log(ride);

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-started',
//             data: ride
//         })

//         return res.status(200).json(ride);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// }

// module.exports.endRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { rideId } = req.body;

//     try {
//         const ride = await rideService.endRide({ rideId, captain: req.captain });

//         sendMessageToSocketId(ride.user.socketId, {
//             event: 'ride-ended',
//             data: ride
//         })



//         return res.status(200).json(ride);
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     } s
// }