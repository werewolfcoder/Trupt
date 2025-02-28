import { useState } from "react";
import { User, LogOut, Edit, Heart, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from '../components/BottomNavigation';

const userInfo = {
    name: "Alex Parker",
    avatar: "https://i.pravatar.cc/150?img=5",
    email: "alex.parker@example.com",
    joined: "March 2024",
    donations: 12,
    likesReceived: 45,
};

const ProfilePage = () => {
    const [user, setUser] = useState(userInfo);
    const navigate = useNavigate();

    return (
        <div className="pb-20"> {/* Add padding-bottom to prevent overlap */}
            <div className="p-5">
                <h2 className="text-2xl font-semibold text-emerald-600 mb-4 flex items-center">
                    <User className="w-6 h-6 mr-2" /> Profile
                </h2>
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 hover:bg-gray-50">
                    <div className="flex flex-col items-center space-y-3">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-24 h-24 rounded-full object-cover shadow-md"
                        />
                        <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-400">Joined: {user.joined}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-center flex-col bg-emerald-100 rounded-xl p-4">
                            <Gift className="w-6 h-6 text-emerald-600" />
                            <p className="font-medium text-gray-700 mt-2">Donations</p>
                            <span className="text-lg font-bold text-emerald-700">{user.donations}</span>
                        </div>
                        <div className="flex items-center justify-center flex-col bg-pink-100 rounded-xl p-4">
                            <Heart className="w-6 h-6 text-pink-500" />
                            <p className="font-medium text-gray-700 mt-2">Likes Received</p>
                            <span className="text-lg font-bold text-pink-600">{user.likesReceived}</span>
                        </div>
                    </div>

                    <div className="flex justify-between space-x-4">
                        <button 
                            className="flex items-center justify-center w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600"
                            onClick={() => navigate('/edit-profile')}
                        >
                            <Edit className="w-5 h-5 mr-2" /> Edit Profile
                        </button>
                        <button className="flex items-center justify-center w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600">
                            <LogOut className="w-5 h-5 mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Fix BottomNavigation position */}
            <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
                <BottomNavigation />
            </div>
        </div>
    );
};

export default ProfilePage;