import { useRef, useState } from "react";
import { UploadCloud, MapPin, Clock, Star, ImagePlus, ArrowLeft } from "lucide-react";
import LocationSuggestion from "../components/LocationSuggestion";
import VolunteerSearchPanel from "../components/ConfirmationPage";
import BottomNavigation from "../components/BottomNavigation";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AddItemPage = () => {
    const [foodName, setFoodName] = useState("");
    const [freshness, setFreshness] = useState("");
    const [emergency, setEmergency] = useState("");
    const [locationText, setLocationText] = useState("");
    const [locationELoc, setLocationELoc] = useState("");
    const [panelOpen, setPanel] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const panelRef = useRef(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createDonation();
            setIsPanelOpen(true);  // Only call once
        } catch (error) {
            console.error("Error creating donation:", error);
        }
    };

    const handleLocationSelect = (data) => {
        setLocationText(data.displayText);
        setLocationELoc(data.eLoc);
    };

    async function createDonation() {
        const formData = new FormData();
        formData.append('foodName', foodName);
        formData.append('freshness', freshness);
        formData.append('emergency', emergency);
        formData.append('location', locationText);
        formData.append('locationELoc', locationELoc);
        if (image) {
            formData.append('image', image);
        }

        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/donations/create`,
            formData,
            {
                headers: {
                    Authorization: Bearer `${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        if (response.data.success) {
            alert("Donation created successfully!");
        }
    }

    return (
        <div className="p-5">
            <div className="flex items-center mb-4">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center text-gray-600 hover:text-emerald-600"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back
                </button>
                <h2 className="text-2xl font-semibold text-emerald-600 ml-4">Donate Food</h2>
            </div>
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
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Food Photo:</label>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                            <UploadCloud className="w-5 h-5 text-emerald-500" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full border rounded-lg px-4 py-2"
                            />
                        </div>
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>
                </div>
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
                    <label className="block text-gray-700 font-medium mb-2">Emergency (time under which this food can be eaten):</label>
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
                        <LocationSuggestion
                            value={locationText}
                            eLoc={locationELoc}
                            onSelect={handleLocationSelect}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="p-4">
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 text-white font-semibold py-3 rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow-md"
                    >
                        Create Donation
                    </button>
                </div>
            </form>

            {/* Volunteer Search Panel */}
            {isPanelOpen && (
                <VolunteerSearchPanel
                    isOpen={isPanelOpen}
                    onClose={() => setIsPanelOpen(false)}
                    foodName={foodName}
                    freshness={freshness}
                    emergency={emergency}
                    location={locationText}  // Changed from location to locationText
                    imagePreview={imagePreview}  // Add this line
                />
            )}
            <BottomNavigation />
        </div>
    );
};

export default AddItemPage;