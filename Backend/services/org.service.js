const orgModel = require('../models/org.model');

module.exports.createOrg = async ({ organizationName, organizationType, address, contactPerson, contactNumber, email, password }) => {
    if (!organizationName || !organizationType || !address || !contactPerson || !contactNumber || !email || !password) {
        throw new Error('All fields are required');
    }
    const org = await orgModel.create({
        organizationName,
        organizationType,
        address,
        contactPerson,
        contactNumber,
        email,
        password
    });
    return org;
};