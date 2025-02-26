import { useRef, useState } from "react";
import { UploadCloud, MapPin, Clock, Star, ImagePlus } from "lucide-react";
import LocationSuggestion from "../components/LocationSuggestion";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
const AddItemPage = () => {
    const [foodName, setFoodName] = useState("");
    const [foodPhoto, setFoodPhoto] = useState(null);
    const [freshness, setFreshness] = useState("");
    const [emergency, setEmergency] = useState("");
    const [location, setLocation] = useState("");
    const [panelOpen, setPanel] = useState(false);

    const panelRef = useRef(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ foodName, foodPhoto, freshness, emergency, location });
        alert("Food donation submitted successfully!");
        setFoodName("");
        setFoodPhoto(null);
        setFreshness("");
        setEmergency("");
        setLocation("");
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Donate Food</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-lg">
                {/* Food Name */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Food Name:</label>
                    <div className="flex items-center space-x-2">
                        <ImagePlus className="w-5 h-5 text-emerald-500" />
                        <input
                            type="text"
                            placeholder="Enter food name"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-400 focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Food Photo */}
                {/* <div>
                    <label className="block text-gray-700 font-medium mb-2">Food Photo:</label>
                    <div className="flex items-center space-x-2">
                        <UploadCloud className="w-5 h-5 text-emerald-500" />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFoodPhoto(e.target.files[0])}
                            required
                            className="w-full border rounded-lg px-4 py-2"
                        />
                    </div>
                </div> */}

                {/* Freshness Rating */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Freshness (1 to 5):</label>
                    <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={freshness}
                            onChange={(e) => setFreshness(e.target.value)}
                            required
                            className="w-20 px-3 py-2 border rounded-lg focus:ring-emerald-400 focus:border-emerald-500"
                        />
                    </div>
                </div>

                {/* Emergency Time */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Emergency (time under which this food can be eaten):
                    </label>
                    <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <select
                            value={emergency}
                            onChange={(e) => setEmergency(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-emerald-400 focus:border-emerald-500"
                        >
                            <option value="">Select Time</option>
                            <option value="1-2 hours">1-2 hours</option>
                            <option value="4-6 hours">4-6 hours</option>
                        </select>
                    </div>
                </div>

                {/* Location Input */}
                <div>
                    <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-red-500" />
                        <label className="font-medium">Location (Address):</label>
                        <LocationSuggestion value={location} onSelect={setLocation} />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow-md"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddItemPage;
