import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState({
        _id: null,
        email: '',
        fullname: {
            firstName: '',
            lastName: ''
        },
        userType: '',
        socketId: null
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/profile`,
                    {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                if (response.data) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                localStorage.removeItem('token'); // Clear invalid token
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (isLoading) {
        return <div>Loading user data...</div>;
    }

    return (
        <UserDataContext.Provider value={[user, setUser]}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;