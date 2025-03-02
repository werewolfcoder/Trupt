import axios from 'axios';

export const getDistance = async (origin, destination) => {
    const token = localStorage.getItem('token');
 
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/maps/get-distance`,
            {
                params: {
                    origin: origin.eloc,
                    destination: `${destination.lng},${destination.lat}`
                },
                headers: { 
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data?.distance;  // Return just the distance value
    } catch (error) {
        console.error('Error getting distance:', error.response?.data || error.message);
        return null;
    }
};
