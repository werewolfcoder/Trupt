import { useState, useEffect } from "react";
import { MessageCircle, Heart, Users } from "lucide-react";
import BottomNavigation from "../components/BottomNavigation"
const mockPosts = [
    {
        id: 1,
        user: "Alice Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
        content: "Just donated extra food from my party! Let's reduce food waste together!",
        time: "2 hours ago",
        likes: 12,
        comments: 4,
    },
    {
        id: 2,
        user: "Brian Lee",
        avatar: "https://i.pravatar.cc/150?img=2",
        content: "Volunteered at the food drive today. Amazing experience!",
        time: "5 hours ago",
        likes: 8,
        comments: 2,
    },
    {
        id: 3,
        user: "Chloe Kim",
        avatar: "https://i.pravatar.cc/150?img=3",
        content: "Received fresh food through the community program. Grateful! ❤️",
        time: "1 day ago",
        likes: 15,
        comments: 5,
    },
];

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        setPosts(mockPosts); // Replace with API call when backend is ready
    }, []);

    return (
        <div className="p-5">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2" /> Community
            </h2>
            <div className="space-y-6">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white p-5 rounded-2xl shadow-lg space-y-4 hover:bg-gray-50"
                    >
                        <div className="flex items-center space-x-3">
                            <img
                                src={post.avatar}
                                alt={post.user}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">{post.user}</p>
                                <p className="text-sm text-gray-500">{post.time}</p>
                            </div>
                        </div>
                        <p className="text-gray-700">{post.content}</p>
                        <div className="flex justify-between text-gray-500">
                            <div className="flex items-center space-x-2">
                                <Heart className="w-5 h-5 text-red-400" />
                                <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="w-5 h-5 text-blue-400" />
                                <span>{post.comments}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <BottomNavigation></BottomNavigation>
        </div>
    );
};

export default CommunityPage;
