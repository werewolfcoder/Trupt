import React from "react";

const FoodDetailsModal = ({ isOpen, onClose, food }) => {
    if (!isOpen || !food) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-2">{food.name}</h2>
                <img src={food.image} alt={food.name} className="w-full h-40 object-cover rounded-md mb-3" />
                <p><strong>Freshness:</strong> {food.freshness}/5</p>
                <p><strong>Emergency:</strong> {food.emergency}</p>
                <p><strong>Location:</strong> {food.location}</p>
                <p><strong>Location:</strong> {food.distance}</p>
                <div className="mt-4 flex justify-between">
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg" onClick={() => alert("Accepted!")}>
                        Accept
                    </button>
                    <button className="px-4 py-2 bg-gray-400 text-white rounded-lg" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FoodDetailsModal;