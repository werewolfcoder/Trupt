import React, { useState, useEffect } from "react";
import { acceptDonation } from "../services/donationService";
import { fetchImage } from '../utils/imageUtils';
import { getDistance } from '../services/mapService';
const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const FoodDetailsModal = ({ isOpen, onClose, currentUserId, food, onStatusUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [distance, setDistance] = useState(null);

    useEffect(() => {
        const loadImage = async () => {
            if (food?.imageUrl) {
                const url = await fetchImage(food.imageUrl);
                setImageUrl(url);
            }
        };
        loadImage();
        
        return () => {
            // Cleanup object URL on unmount
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [food?.imageUrl]);

    // Add useEffect for distance calculation
    useEffect(() => {
        const calculateDistance = async () => {
            if (!food?.locationELoc) return;

            try {
                // Get user's current location
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    const calculatedDistance = await getDistance(
                        { eloc: food.locationELoc },
                        userLocation
                    );

                    setDistance(calculatedDistance);
                });
            } catch (error) {
                console.error('Error calculating distance:', error);
            }
        };

        calculateDistance();
    }, [food?.locationELoc]);

    // Format distance for display
    const formatDistance = (dist) => {
        if (!dist) return 'N/A';
        if (dist < 1) return `${Math.round(dist * 1000)}m away`;
        return `${dist}away`;
    };

    if (!isOpen) return null;
    const currentUser = currentUserId
    const displayData = {
        user:food?.user || donation?.user,
        name: food?.foodName || donation?.foodName || 'N/A',
        image: food?.imageUrl ? `${BACKEND_URL}/${food.imageUrl}` : '/default-food-image.png',
        freshness: food?.freshness || donation?.freshness || 'N/A',
        emergency: food?.emergency || donation?.emergency || 'N/A',
        location: food?.location || donation?.location || 'N/A',
        distance: food?.distance || 'N/A',
        status: food?.status || donation?.status || 'pending'
    };

    const isAccepted = displayData.status === 'accepted';

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
                <div className="w-40 h-40 mx-auto mb-4"> {/* Added container div */}
                    <img 
                        src={imageUrl || '/default-food-image.png'} 
                        alt={displayData.name} 
                        className="w-full h-full rounded-full object-cover border-4 border-gray-200 shadow-md" // Updated classes
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-food-image.png';
                        }}
                    />
                </div>
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
                    {!displayData.status=='accepted'&&displayData.user._id!=currentUser&&(
                        <button 
                            className={`px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed`}
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
                        {isAccepted ? 'Close' : 'Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodDetailsModal;