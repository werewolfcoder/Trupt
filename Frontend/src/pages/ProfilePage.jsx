import { useState, useEffect, useContext } from "react";
import { User, LogOut, Edit, Heart, Gift, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from '../components/BottomNavigation';
import { getProfile } from '../services/userService';
import {getUserDonations} from '../services/donationService'
import { UserDataContext } from '../context/UserContext';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useContext(UserDataContext);
    const [donationCount,setDonationCount] = useState(0);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                const data = await getProfile();
                setUserData(data);
                const donations = await getUserDonations();
                setDonationCount(donations);
            } catch (err) {
                setError('Failed to load profile');
                console.error('Profile fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserData(null);
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="pb-20">
            <div className="p-5">
                <h2 className="text-2xl font-semibold text-emerald-600 mb-4 flex items-center">
                    <User className="w-6 h-6 mr-2" /> Profile
                </h2>
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 hover:bg-gray-50">
                    <div className="flex flex-col items-center space-y-3">
                        {userData?.avatar ? (
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}/${userData.avatar}`}
                                alt={userData.fullname?.firstname}
                                className="w-24 h-24 rounded-full object-cover shadow-md"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/default-avatar.png';
                                }}
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
                                <User className="w-12 h-12 text-emerald-500" />
                            </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-800">
                            {userData?.fullname?.firstname} {userData?.fullname?.lastname}
                        </h3>
                        <p className="text-gray-500">{userData?.email}</p>
                        <p className="text-sm text-gray-400">
                            Joined: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-center flex-col bg-emerald-100 rounded-xl p-4">
                            <Gift className="w-6 h-6 text-emerald-600" />
                            <p className="font-medium text-gray-700 mt-2">Donations</p>
                            <span className="text-lg font-bold text-emerald-700">
                                {donationCount.length || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-center flex-col bg-pink-100 rounded-xl p-4">
                            <Heart className="w-6 h-6 text-pink-500" />
                            <p className="font-medium text-gray-700 mt-2">Volunteering</p>
                            <span className="text-lg font-bold text-pink-600">
                                {userData?.volunteering?.length || 0}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between space-x-4">
                        <button 
                            className="flex items-center justify-center w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
                            onClick={() => navigate('/edit-profile')}
                        >
                            <Edit className="w-5 h-5 mr-2" /> Edit Profile
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600 transition"
                        >
                            <LogOut className="w-5 h-5 mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
                <BottomNavigation />
            </div>
        </div>
    );
};

export default ProfilePage;