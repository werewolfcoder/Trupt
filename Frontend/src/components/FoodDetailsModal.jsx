import React, { useState, useEffect } from "react";
import { acceptDonation } from "../services/donationService";
import { getDistance } from "../services/mapService";

const FoodDetailsModal = ({ isOpen, onClose, currentUserId, food, onStatusUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [distance, setDistance] = useState(null);

    // Add debug logging
    useEffect(() => {
        if (isOpen) {
            console.log({
                currentUserId,
                foodUserId: food?.user?._id,
                food,
                isMatch: food?.user?._id === currentUserId
            });
        }
    }, [isOpen, food, currentUserId]);

    // Calculate distance when modal opens
    useEffect(() => {
        const calculateDistance = async () => {
            if (!food?.locationELoc) return;

            try {
                // Get user's current location
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const calculatedDistance = await getDistance(
                        { eloc: food.locationELoc },
                        { 
                            lat: position.coords.latitude, 
                            lng: position.coords.longitude 
                        }
                    );
                    setDistance(calculatedDistance);
                });
            } catch (error) {
                console.error('Error calculating distance:', error);
            }
        };

        if (isOpen && food) {
            calculateDistance();
        }
    }, [isOpen, food]);

    const formatDistance = (dist) => {
        if (!dist) return 'N/A';
        if (dist.distance) {
            return dist.distance;
        }
        if (dist < 1) {
            return `${Math.round(dist * 1000)}m away`;
        }
        return `${dist} away`;
    };

    if (!isOpen) return null;

    const displayData = {
        user: food?.user || {},  // Ensure we have an object even if user is undefined
        name: food?.foodName || 'N/A',
        // Fix image URL construction
        image: food?.imageUrl ? `${import.meta.env.VITE_BASE_URL}${food.imageUrl}` : '/default-food-image.png',
        freshness: food?.freshness || 'N/A',
        emergency: food?.emergency || 'N/A',
        location: food?.location || 'N/A',
        distance: food?.distance || 'N/A',
        status: food?.status || 'pending'
    };

    const isAccepted = displayData.status === 'accepted';
    const isCurrentUserDonation = food?.user?._id === currentUserId;
    const showAcceptButton = food?.status !== 'accepted' && food?.user?._id !== currentUserId;

    const handleAccept = async () => {
        const donationId = food?._id;
        if (!donationId) {
            setError('Invalid donation data');
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const updatedDonation = await acceptDonation(donationId);
            onStatusUpdate?.(updatedDonation);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to accept donation. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-2">{displayData.name}</h2>
                <img 
                    src={displayData.image} 
                    alt={displayData.name} 
                    className="w-full h-40 object-cover rounded-md mb-3"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-food-image.png';
                    }}
                />
                <p><strong>Freshness:</strong> {displayData.freshness}</p>
                <p><strong>Emergency:</strong> {displayData.emergency}</p>
                <p><strong>Location:</strong> {displayData.location}</p>
                <p><strong>Distance:</strong> {formatDistance(distance)}</p>
                <p><strong>Status:</strong> <span className={`${
                    isAccepted ? 'text-emerald-500' : 'text-gray-500'
                }`}>
                    {displayData.status === 'accepted' ? 'Accepted' : 'Pending'}
                </span></p>
                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                <div className="mt-4 flex justify-between">
                    {showAcceptButton && (
                        <button 
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                            onClick={handleAccept}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Accepting...' : 'Accept'}
                        </button>
                    )}
                    <button 
                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500" 
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {displayData.status === 'accepted' ? 'Close' : 'Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodDetailsModal;
