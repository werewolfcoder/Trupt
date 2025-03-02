import React, { createContext, useState, useEffect } from 'react';

export const DonationContext = createContext();

const DonationProvider = ({ children }) => {
    const [availableDonations, setAvailableDonations] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const storedReadIds = JSON.parse(localStorage.getItem('readNotifications') || '[]');
        const unreadDonations = availableDonations.filter(
            donation => !storedReadIds.includes(donation._id)
        );
        setUnreadCount(unreadDonations.length);
    }, [availableDonations]);

    const markAllAsRead = () => {
        const notificationIds = availableDonations.map(d => d._id);
        localStorage.setItem('readNotifications', JSON.stringify(notificationIds));
        setUnreadCount(0);
    };

    const value = {
        availableDonations,
        setAvailableDonations,
        unreadCount,
        markAllAsRead
    };

    return (
        <DonationContext.Provider value={value}>
            {children}
        </DonationContext.Provider>
    );
};

export default DonationProvider;
