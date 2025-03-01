const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: String, required: true },
    content: { type: String, required: true },
    time: { type: Date, default: Date.now }
});

// In your Post model
const PostSchema = new mongoose.Schema({
    content: String,
    user: String,
    avatar: String,
    time: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    likedBy: [String], // Array of user IDs/emails who liked the post
    comments: [
        {
            user: String,
            content: String,
            time: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Post', PostSchema);