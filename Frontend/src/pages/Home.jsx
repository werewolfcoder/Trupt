import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LocationSuggestion from '../components/LocationSuggestion';
import BottomNavigation from '../components/BottomNavigation';
import Header from '../components/Header'
import FoodList from '../components/FoodList';
const Home = () => {
    const [showForm, setShowForm] = useState(false);
    const [foodName, setFoodName] = useState('');
    // const [foodPhoto, setFoodPhoto] = useState(null);
    const [freshness, setFreshness] = useState(1);
    const [emergency, setEmergency] = useState('');
    const [location, setLocation] = useState(''); // Add state for location

    const handleSubmit = async (e) => {
        e.preventDefault();
        
    }


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
