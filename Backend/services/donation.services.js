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

module.exports.confirmDonation = async ({ donationId, volunteer }) => {
    const donation = await donationModel.findById(donationId);
    
    if (!donation) {
        throw new Error('Donation not found');
    }

    if (donation.status === 'accepted') {
        throw new Error('Donation already accepted');
    }

    donation.status = 'accepted';
    donation.volunteer = volunteer._id;
    donation.acceptedAt = new Date();

    await donation.save();
    
    return donation.populate(['user', 'volunteer']);
};

