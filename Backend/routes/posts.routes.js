const express = require('express');
const router = express.Router();
const Post = require('../models/posts.model');
const app = express();
// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new post
router.post('/', async (req, res) => {
    const post = new Post({
        user: req.body.user,
        avatar: req.body.avatar,
        content: req.body.content,
        time: req.body.time,
        likes: req.body.likes,
        comments: req.body.comments
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Like a post


// Add a comment to a post
router.post('/:id/comment', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = {
            user: req.body.user,
            content: req.body.content,
            time: new Date()
        };

        post.comments.push(comment);
        await post.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Like a post
app.post('/posts/:postId/like', async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user already liked the post
        if (!post.likedBy) {
            post.likedBy = [];
        }

        // If user hasn't liked the post yet
        if (!post.likedBy.includes(userId)) {
            post.likedBy.push(userId);
            post.likes += 1;
            await post.save();
        }

        res.json(post);
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Error liking post' });
    }
});

// Unlike a post
app.post('/posts/:postId/unlike', async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user has liked the post
        if (post.likedBy && post.likedBy.includes(userId)) {
            post.likedBy = post.likedBy.filter(id => id !== userId);
            post.likes = Math.max(0, post.likes - 1); // Ensure likes don't go negative
            await post.save();
        }

        res.json(post);
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({ message: 'Error unliking post' });
    }
});
module.exports = router;