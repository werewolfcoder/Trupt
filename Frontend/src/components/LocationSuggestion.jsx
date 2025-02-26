import { useState } from "react";
import axios from "axios";

const LocationSuggestion = ({ value, eLoc, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = async (e) => {
        const inputValue = e.target.value;
        onSelect({ displayText: inputValue, eLoc: null });

        if (inputValue.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: inputValue },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuggestions(response.data.suggestedLocations);
        } catch (error) {
            console.error("Error fetching location suggestions:", error);
            setSuggestions([]);
        }
    };

    return (
        <div className="relative w-screen">
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Enter location..."
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {suggestions.length > 0 && (
                <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto z-10">
                    {suggestions.map((location, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                onSelect({
                                    displayText: `${location.placeName}, ${location.placeAddress}`,
                                    eLoc: location.eLoc
                                });
                                setSuggestions([]);
                            }}
                            className="p-2 hover:bg-emerald-100 cursor-pointer border-2"
                        >
                            {location.placeName} {location.placeAddress}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationSuggestion;
