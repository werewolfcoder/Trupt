import axios from 'axios';

export const acceptDonation = async (donationId) => {
    if (!donationId) {
        throw new Error('Donation ID is required');
    }

    const token = localStorage.getItem('token');
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/donations/confirm`,
            { donationId },
            {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw error;
    }
};

export const getUserDonations = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/donations/user`,
            {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
