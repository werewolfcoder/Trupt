import { useState } from "react";

const mockLocations = [
    "Central Park, New York",
    "Times Square, New York",
    "Golden Gate Bridge, San Francisco",
    "Eiffel Tower, Paris",
    "Colosseum, Rome",
    "Sydney Opera House, Sydney",
    "Tower Bridge, London",
    "Burj Khalifa, Dubai",
    "Tokyo Tower, Tokyo",
    "Marina Bay Sands, Singapore",
];

const LocationSuggestion = ({ value, onSelect }) => {
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        const filtered = mockLocations.filter((location) =>
            location.toLowerCase().includes(inputValue.toLowerCase())
        );
        setSuggestions(inputValue ? filtered : []);
        onSelect(inputValue);
    };

    return (
        <div className="relative w-full">
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
                                onSelect(location);
                                setSuggestions([]);
                            }}
                            className="p-2 hover:bg-emerald-100 cursor-pointer rounded-xl"
                        >
                            {location}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationSuggestion;
