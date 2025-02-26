import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LocationSuggestion from '../components/LocationSuggestion';
import BottomNavigation from '../components/BottomNavigation';
import Header from '../components/Header'
import FoodList from '../components/FoodList';
const Home = () => {
    const [showForm, setShowForm] = useState(false);
    const [foodName, setFoodName] = useState('');
    const [foodPhoto, setFoodPhoto] = useState(null);
    const [freshness, setFreshness] = useState(1);
    const [emergency, setEmergency] = useState('');
    const [location, setLocation] = useState(''); // Add state for location

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ foodName, foodPhoto, freshness, emergency, location });
        setShowForm(false);
    };

    return (
        <div className="min-h-screen pb-20"> {/* Padding to prevent content overlap on mobile */}
            <Header />
            <main className="p-4">
                <p>Welcome to Trupt! 🚀</p>
                <FoodList/>
            </main>
            <BottomNavigation />
        </div>
        
    );
};

export default Home;
{/* //     <button onClick={() => setShowForm(true)}>Donate Food</button> */ }
    // <Header/>
    // <FoodList/>
    {/* {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Food Name:</label>
                        <input
                            type="text"
                            value={foodName}
                            onChange={(e) => setFoodName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Food Photo:</label>
                        <input
                            type="file"
                            onChange={(e) => setFoodPhoto(e.target.files[0])}
                            required
                        />
                    </div>
                    <div>
                        <label>Freshness (1 to 5):</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={freshness}
                            onChange={(e) => setFreshness(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Emergency (time under which this food can be eaten):</label>
                        <select
                            value={emergency}
                            onChange={(e) => setEmergency(e.target.value)}
                            required
                        >
                            <option value="">Select Time</option>
                            <option value="1-2 hours">1-2 hours</option>
                            <option value="4-6 hours">4-6 hours</option>
                        </select>
                    </div>
                    <div>
                        <label>Location (Address):</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                    <LocationSuggestion/>
                    <button type="submit">Submit</button>
                </form>
            )} */}
        //             <BottomNavigation/>
        // </div>}
