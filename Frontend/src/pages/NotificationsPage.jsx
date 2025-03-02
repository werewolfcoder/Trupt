import React, { useContext, useEffect, useState } from 'react';
import { DonationContext } from '../context/DonationContext';
import { UserDataContext } from '../context/UserContext';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle, AlertTriangle } from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { getDistance } from "../services/mapService";
import FoodDetailsModal from '../components/FoodDetailsModal'

const statusColors = {
    Delivered: "text-green-500",
    Preparing: "text-yellow-500",
    "Out for Delivery": "text-blue-500",
    Rejected: "text-red-500",
    accepted: "text-emerald-500",
    pending: "text-gray-500"
};
const statusDisplayNames = {
    accepted: "Accepted",
    pending: "Pending"
};
const NotificationsPage = () => {
    const { availableDonations,setAvailableDonations, markAllAsRead } = useContext(DonationContext);
    const [user] = useContext(UserDataContext);
    const [distances, setDistances] = useState({});
    const [userLocation, setUserLocation] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);

    useEffect(() => {
        // Mark all as read when notifications page is opened
        markAllAsRead();
    }, []);

    useEffect(() => {
        const calculateDistances = async () => {
            if (!userLocation) return;

            const newDistances = {};
            for (const donation of availableDonations) {
                if (donation.locationELoc) {
                    const distance = await getDistance(
                        { eloc: donation.locationELoc },
                        { lat: userLocation.lat, lng: userLocation.lng }
                    );
                    if (distance) {
                        newDistances[donation._id] = distance;
                    }
                }
            }
            setDistances(newDistances);
        };

        calculateDistances();
    }, [userLocation, availableDonations]);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => console.error('Error getting location:', error)
        );
    }, []);
    const formatDistance = (distance) => {
        if (!distance) return '';
        if (distance < 1) return `${Math.round(distance * 1000)}m away`;
        return `${distance} away`;
    };
    console.log(availableDonations)
    const renderDonationItem = (item) => (
        <li
            key={item._id}
            className="flex items-center justify-between bg-white p-3 rounded-xl shadow-md hover:bg-gray-100 transition cursor-pointer"
            onClick={() => setSelectedFood(item)}
        >
            <div className="flex items-center space-x-3">
                <img
                    src={`${import.meta.env.VITE_BASE_URL}${item.imageUrl}`}
                    alt={item.foodName}
                    className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                    <span className="text-md font-medium block">
                        {item.foodName}
                    </span>
                    <div className="flex items-center space-x-2">
                        <span className={`text-xs font-semibold ${statusColors[item.status] || 'text-gray-500'}`}>
                            {statusDisplayNames[item.status] || item.status || 'Pending'}
                        </span>
                    </div>
                </div>
            </div>
        </li>
    );

    const iconMap = {
        success: <CheckCircle className="w-6 h-6 text-green-500" />,
        warning: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <h1 className="text-2xl font-bold mb-6">Notifications</h1>
            <div className="space-y-4">
                {availableDonations.map(renderDonationItem)}
                {availableDonations.length === 0 && (
                    <p className="text-center text-gray-500">No new notifications</p>
                )}
            </div>
            <FoodDetailsModal 
                isOpen={!!selectedFood} 
                onClose={() => setSelectedFood(null)} 
                food={selectedFood}
                onStatusUpdate={(updatedDonation) => {
                    if (updatedDonation.user._id === user?._id) {
                        setUserDonations(prev => prev.map(d => 
                            d._id === updatedDonation._id ? updatedDonation : d
                        ));
                    } else {
                        setAvailableDonations(prev => prev.map(d => 
                            d._id === updatedDonation._id ? updatedDonation : d
                        ));
                    }
                }}
            />
            <BottomNavigation></BottomNavigation>
        </div>
    );
};

export default NotificationsPage;
