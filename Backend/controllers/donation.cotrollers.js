const donationService = require('../services/donation.services');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.services');
const donationModel = require('../models/donation.model');
const {sendMessageToSocketId} = require('../socket')
const userModel = require('../models/user.model');

const donationController = {
    createDonation: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId,foodName,freshness,emergency,location,locationELoc } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        try {
            const donation = await donationService.createDonation({ user: req.user._id,foodName,imageUrl,freshness,emergency,location,locationELoc});
            res.status(201).json(donation);

            const volunteers =await userModel.find({ _id: { $ne: req.user._id } }, 'socketId');
            const donationWithUser = await donationModel.findOne({_id:donation._id}).populate('user')
           volunteers.map(volunteer=>{
            sendMessageToSocketId(volunteer.socketId,{
                event:'new-donation',
                data:donationWithUser
            })
           })

        } catch (err) {

            console.log(err);
            return res.status(500).json({ message: err.message });
        }

    },

    confirmDonation: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { donationId } = req.body;

        try {
            const donation = await donationService.confirmDonation({ 
                donationId, 
                volunteer: req.user 
            });

            sendMessageToSocketId(donation.user.socketId, {
                event: 'donation-confirmed',
                data: donation
            });

            return res.status(200).json(donation);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    },

    getUserDonations: async (req, res) => {
        try {
            const donations = await donationModel
                .find({ user: req.user._id })
                .sort({ createdAt: -1 })
                .populate('user');
            
            return res.status(200).json(donations);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    },
    getUserVolunteering: async(req, res) => {
        try {
            const { userId } = req.body;
            const volunteeredDonations = await donationModel
                .find({ 
                    volunteer: userId,
                    status: 'accepted'
                })
                .sort({ acceptedAt: -1 })
                .populate(['user', 'volunteer']);

            return res.status(200).json(volunteeredDonations);
        } catch (err) {
            console.error('Error fetching volunteered donations:', err);
            return res.status(500).json({ message: err.message });
        }
    }
};

module.exports = donationController;