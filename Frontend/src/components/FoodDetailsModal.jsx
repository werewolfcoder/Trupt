import React, { useState } from "react";
import { acceptDonation } from "../services/donationService";

const FoodDetailsModal = ({ isOpen, onClose, food, onStatusUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const displayData = {
        name: food?.foodName || donation?.foodName || 'N/A',
        image: food?.imageUrl || food?.image || 'placeholder-image.jpg',
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
                <img 
                    src={displayData.image} 
                    alt={displayData.name} 
                    className="w-full h-40 object-cover rounded-md mb-3" 
                />
                <p><strong>Freshness:</strong> {displayData.freshness}</p>
                <p><strong>Emergency:</strong> {displayData.emergency}</p>
                <p><strong>Location:</strong> {displayData.location}</p>
                {displayData.distance && (
                    <p><strong>Distance:</strong> {displayData.distance}</p>
                )}
                <p><strong>Status:</strong> <span className={`${
                    isAccepted ? 'text-emerald-500' : 'text-gray-500'
                }`}>
                    {displayData.status === 'accepted' ? 'Accepted' : 'Pending'}
                </span></p>
                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                <div className="mt-4 flex justify-between">
                    {!isAccepted && (
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