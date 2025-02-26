const donationModel = require('../models/donation.model');

module.exports.createDonation = async ({
    user,
    foodName,
    freshness,
    emergency,
    location
}) => {
    if(!user || !foodName || !freshness || !emergency || !location){
        throw new Error('All fields are required');
    }

    const donation = donationModel.create({
        user,
        foodName,
        freshness,
        emergency,
        location
    })

    return donation
}