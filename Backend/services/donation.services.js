const donationModel = require('../models/donation.model');

module.exports.createDonation = async ({
    user,
    foodName,
    imageUrl,
    freshness,
    emergency,
    location,
    locationELoc
}) => {
    console.log(user,foodName,imageUrl,freshness,emergency,location,locationELoc);
    if(!user || !foodName || !imageUrl || !freshness || !emergency || !location || !locationELoc){
        throw new Error('All fields are required');
    }

    const donation = donationModel.create({
        user,
        foodName,
        imageUrl,
        freshness,
        emergency,
        location,
        locationELoc
    })

    return donation
}