import React, { useContext, useState,useEffect} from 'react';
import { Heart, HandHeart } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import Header from '../components/Header';
import FoodList from '../components/FoodList';
import { SocketContext } from '../context/SocketContext';
import {UserDataContext} from '../context/UserContext'
import FoodDetailsModal from '../components/FoodDetailsModal';
const Home = () => {
const [activeTab, setActiveTab] = useState('donations'); // Track active tab
const {sendMessage,recievMessage} = useContext(SocketContext)
const {user} = useContext(UserDataContext)
// useEffect(()=>{
//     sendMessage("join",{userId:user._id})
// })

const [selectedFood, setSelectedFood] = useState(null); // State for selected food item

return (
    <div className="min-h-screen pb-20">
        <Header />
        <main className="p-4">
            {/* Selection Tabs */}
            <div className="flex justify-center space-x-6 mb-4">
                {[
                    { key: 'donations', icon: <Heart className="w-6 h-6" /> },
                    { key: 'volunteering', icon: <HandHeart className="w-6 h-6" /> },
                ].map(({ key, icon }) => (
                    <button
                        key={key}
                        className={`p-3 rounded-full transition flex items-center justify-center w-12 h-12 border-2 
            ${activeTab === key ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-gray-200 text-gray-700 border-gray-300'}`}
                        onClick={() => setActiveTab(key)}
                    >
                        {icon}
                    </button>
                ))}
            </div>

            {/* Content Section */}
            <FoodList filter={activeTab} onFoodClick={setSelectedFood} />
        </main>

        {/* Modal */}
        <FoodDetailsModal isOpen={!!selectedFood} onClose={() => setSelectedFood(null)} food={selectedFood} />

        <BottomNavigation />
    </div>
);


};

export default Home;