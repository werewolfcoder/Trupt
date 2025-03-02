import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { MessageCircle, Heart, Users, ImagePlus, Send } from "lucide-react";
import BottomNavigation from "../components/BottomNavigation";
import { UserDataContext } from "../context/UserContext";

const CommunityPage = () => {
    const [user] = useContext(UserDataContext); // Get user details from context
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ content: "", avatar: "", user: "Anonymous" });
    const [imagePreview, setImagePreview] = useState(null);
    const [comments, setComments] = useState({});



    // Add this function inside your component
    const isPostLikedByUser = (post) => {
        if (!user || !user.email) return false;
        return post.likedBy && post.likedBy.includes(user.email);
    };
    // Function to safely get user's name
    // Debug the actual structure of the user object
    const getUserName = () => {
        if (!user) return "Anonymous";

        if (user.fullname) {
            if (typeof user.fullname === 'string') {
                return user.fullname;
            }
            if (user.fullname.firstName || user.fullname.lastName) {
                return `${user.fullname.firstName || ''} ${user.fullname.lastName || ''}`.trim();
            }
        }

        return user.email ? user.email.split('@')[0] : "Anonymous";
    };

    // Fetch posts from the backend when component mounts
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`);
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Set user's name in new post when user data updates
    useEffect(() => {
        setNewPost((prev) => ({
            ...prev,
            user: getUserName(),
        }));
    }, [user]);

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewPost((prev) => ({ ...prev, avatar: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle new post submission
    const handlePostSubmit = async () => {
        if (!newPost.content.trim()) return alert("Post content cannot be empty!");

        // Debug the user object
        console.log("User when posting:", user);
        console.log("User name being used:", getUserName());

        try {
            const postData = {
                content: newPost.content,
                user: getUserName(),
                avatar: user?.avatar || newPost.avatar,
            };

            console.log("Post data being sent:", postData);

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/posts`, postData);

            setPosts([response.data, ...posts]); // Update UI immediately
            setNewPost({ content: "", avatar: "", user: getUserName() });
            setImagePreview(null);
        } catch (error) {
            console.error("Error posting:", error);
            console.log("Error details:", error.response?.data);
            alert("Error posting. Try again!");
        }
    };
    // Handle post like
    const handleLike = async (postId) => {
        try {
            const post = posts.find(p => p._id === postId);
            const isLiked = isPostLikedByUser(post);

            // Toggle like (like or unlike based on current status)
            const endpoint = isLiked ? 'unlike' : 'like';

            try {
                // Try to call the backend
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/posts/${postId}/${endpoint}`,
                    { userId: user.email }
                );

                setPosts(posts.map((p) => (p._id === postId ? response.data : p)));
            } catch (apiError) {
                console.warn(`Backend API not available for ${endpoint}. Simulating on frontend.`);

                // Simulate the like/unlike operation on the frontend
                const updatedPost = { ...post };

                if (!updatedPost.likedBy) {
                    updatedPost.likedBy = [];
                }

                if (isLiked) {
                    // Unlike: Remove user from likedBy and decrement likes
                    updatedPost.likedBy = updatedPost.likedBy.filter(id => id !== user.email);
                    updatedPost.likes = Math.max(0, (updatedPost.likes || 0) - 1);
                } else {
                    // Like: Add user to likedBy and increment likes
                    if (!updatedPost.likedBy.includes(user.email)) {
                        updatedPost.likedBy.push(user.email);
                        updatedPost.likes = (updatedPost.likes || 0) + 1;
                    }
                }

                // Update UI with the simulated change
                setPosts(posts.map((p) => (p._id === postId ? updatedPost : p)));
            }
        } catch (error) {
            console.error("Error handling like:", error);
            alert("Error processing like action");
        }
    };

    // Handle adding a comment
    const handleAddComment = async (postId) => {
        if (!comments[postId]?.trim()) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comment`,
                {
                    user: getUserName(),
                    content: comments[postId],
                }
            );

            setPosts(posts.map((post) =>
                post._id === postId ? { ...post, comments: [...post.comments, response.data] } : post
            ));

            setComments((prev) => ({ ...prev, [postId]: "" }));
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2" /> Community
            </h2>

            {/* New Post Form */}
            {/* New Post Form */}
            <div className="bg-white p-4 rounded-2xl shadow-lg space-y-4 mb-6">
                <textarea
                    className="w-full p-3 border rounded-lg focus:outline-none"
                    placeholder="Share something with the community..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 rounded-lg object-cover" />}
                <div className="flex items-center space-x-3">
                    <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-2">
                        <ImagePlus className="w-5 h-5 text-blue-500" />
                        <span>Upload Image</span>
                        <input type="file" className="hidden" onChange={handleImageUpload} />
                    </label>
                    <button
                        onClick={handlePostSubmit}
                        className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                        <Send className="w-5 h-5" />
                        <span>Post</span>
                    </button>
                </div>
            </div>

            {/* Display Posts */}
            <div className="space-y-6">
                {posts.map((post) => (
                    <div key={post._id} className="bg-white p-5 rounded-2xl shadow-lg space-y-4 hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                            <img src={post.avatar || "https://i.pravatar.cc/150"} alt={post.user} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <p className="font-semibold text-gray-800">{post.user}</p>
                                <p className="text-sm text-gray-500">{new Date(post.time).toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="text-gray-700">{post.content}</p>
                        <div className="flex justify-between text-gray-500">
                            <button onClick={() => handleLike(post._id)} className="flex items-center space-x-2">
                                {isPostLikedByUser(post) ? (
                                    <Heart className="w-5 h-5 text-red-500" fill="#EF4444" />
                                ) : (
                                    <Heart className="w-5 h-5 text-red-400" />
                                )}
                                <span>{post.likes}</span>
                            </button>
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="w-5 h-5 text-blue-400" />
                                <span>{post.comments.length}</span>
                            </div>
                        </div>
                        {/* Rest of your code remains the same */}
                        <div>
                            <input
                                type="text"
                                value={comments[post._id] || ""}
                                onChange={(e) => setComments({ ...comments, [post._id]: e.target.value })}
                                placeholder="Add a comment..."
                                className="border p-2 rounded-lg w-full mt-2"
                            />
                            <button onClick={() => handleAddComment(post._id)} className="text-blue-500">Comment</button>
                        </div>
                        {post.comments.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {post.comments.map((comment, index) => (
                                    <div key={index} className="bg-gray-100 p-2 rounded-lg">
                                        <p className="text-sm text-gray-700"><strong>{comment.user}:</strong> {comment.content}</p>
                                        <p className="text-xs text-gray-500">{new Date(comment.time).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <BottomNavigation />
        </div>
    );
};

export default CommunityPage;