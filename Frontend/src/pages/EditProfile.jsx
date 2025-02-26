import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialProfile = {
    name: "Alex Parker",
    email: "alex.parker@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
};

const EditProfilePage = () => {
    const [profile, setProfile] = useState(initialProfile);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated Profile:", profile);
        navigate("/profile");
    };

    return (
        <div className="p-5">
            <div className="flex items-center mb-4">
                <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center text-gray-600 hover:text-emerald-600"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" /> Back
                </button>
                <h2 className="text-2xl font-semibold text-emerald-600 ml-4">Edit Profile</h2>
            </div>
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-lg p-6 space-y-5 hover:bg-gray-50"
            >
                <div className="flex flex-col items-center space-y-3">
                    <img
                        src={profile.avatar}
                        alt="Profile Avatar"
                        className="w-24 h-24 rounded-full object-cover shadow-md"
                    />
                    <label className="text-sm text-gray-500">Change Avatar URL:</label>
                    <input
                        type="text"
                        name="avatar"
                        value={profile.avatar}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                        placeholder="Avatar URL"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center w-full bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600"
                >
                    <Save className="w-5 h-5 mr-2" /> Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfilePage;