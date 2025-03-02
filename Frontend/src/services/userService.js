import axios from 'axios';
export const getProfile = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/users/profile`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};