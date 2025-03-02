import React, { useContext, useState, useEffect } from 'react';
import { Heart, HandHeart } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import Header from '../components/Header';
import FoodList from '../components/FoodList';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';
import FoodDetailsModal from '../components/FoodDetailsModal';
import { DonationContext } from '../context/DonationContext';
import { getAllDonations } from '../services/donationService';

const Home = () => {
    const [activeTab, setActiveTab] = useState('donations');
    const { socket } = useContext(SocketContext);
    const [user] = useContext(UserDataContext);
    const [selectedFood, setSelectedFood] = useState(null);
    const [userDonations, setUserDonations] = useState([]); // User's own donations
    const { availableDonations, setAvailableDonations } = useContext(DonationContext); // Fixed destructuring

    // Add initial fetch for available donations
    useEffect(() => {
        const fetchAvailableDonations = async () => {
            try {
                const donations = await getAllDonations();
                // Filter out user's own donations
                const othersDonations = donations.filter(d => d.user._id !== user?._id);
                setAvailableDonations(othersDonations);
            } catch (error) {
                console.error('Error fetching available donations:', error);
            }
        };

        if (user?._id) {
            fetchAvailableDonations();
        }
    }, [user?._id]);

    useEffect(() => {
        if (!user?._id || !socket) return;

        socket.emit("join", { userId: user._id });

        // Handle new donation events
        socket.on('new-donation', (data) => {
            // Only add to available donations if it's not from current user
            if (data.user._id !== user._id) {
                setAvailableDonations(prev => [data, ...prev]);
                // Play notification sound if needed
                new Audio('../assets/notification.mp3').play().catch(() => {});
            }
        });

        // Handle donation confirmation events
        socket.on('donation-confirmed', (data) => {
            // Update both lists as needed
            setUserDonations(prev => prev.map(d => 
                d._id === data._id ? data : d
            ));
            setAvailableDonations(prev => prev.map(d => 
                d._id === data._id ? data : d
            ));
            
            setSelectedFood(prev => 
                prev?._id === data._id ? data : prev
            );
        });

        // Location update function
        const updateLocation = () => {
            if (!navigator.geolocation) {
                console.error('Geolocation is not supported');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => {
                 
                    socket.emit('update-location', {
                        userId: user._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    });
                },
                error => {
                    console.error('Error getting location:', error);
                }
            );
        };

        // Initial location update
        updateLocation();

        // Set up interval for location updates
        const locationInterval = setInterval(updateLocation, 10000);

        // Cleanup function
        return () => {
            socket.off('new-donation');
            socket.off('donation-confirmed');
            clearInterval(locationInterval);
            socket.emit("leave", { userId: user._id });
        };
    }, [user?._id, socket]);

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
                <FoodList 
                    filter={activeTab}
                    userDonations={userDonations}
                    setUserDonations={setUserDonations} // Add this prop
                    availableDonations={availableDonations}
                    onFoodClick={setSelectedFood}
                    currentUserId={user?._id}
                />
            </main>

            {/* Modal */}
            <FoodDetailsModal 
                isOpen={!!selectedFood} 
                currentUserId={user?._id}
                onClose={() => setSelectedFood(null)} 
                food={selectedFood}
                onStatusUpdate={(updatedDonation) => {
                    if (updatedDonation.user._id === user?._id) {
                        setUserDonations(prev => prev.map(d => 
                            d._id === updatedDonation._id ? updatedDonation : d
                        ));
                    } else {
                        setAvailableDonations(prev => prev.map(d => 
                            d._id === updatedDonation._id ? updatedDonation : d
                        ));
                    }
                }}
            />

            <BottomNavigation/>
        </div>
    );
};

export default Home;