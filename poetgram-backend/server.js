// server.js
const express = require('express');
const bodyParser = require('body-parser');
const DatabaseOperations = require('./dbOperations');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication Routes
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const isAuthenticated = await DatabaseOperations.authenticateUser(username, password);
        
        if (isAuthenticated) {
            res.status(200).json({ message: 'Login successful', username });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    
    // Input validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Password strength check (basic example)
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        // Check if username already exists
        const usernameExists = await DatabaseOperations.checkUsernameExists(username);
        
        if (usernameExists) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Create user
        await DatabaseOperations.createUser(username, password);
        
        res.status(201).json({ message: 'User created successfully', username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Add this route in server.js
app.post('/post', async (req, res) => {
    const { genre, content, likes, username } = req.body;
    
    try {
        const postId = await DatabaseOperations.createPost(genre, content, likes, username);
        
        res.status(201).json({ 
            message: 'Post created successfully', 
            postId: postId  // This will be the new post's ID
        });
    } catch (error) {
        console.error('Post creation error:', error);
        res.status(500).json({ message: 'Error creating post', details: error.message });
    }
});

// Add this route in server.js
app.get('/posts', async (req, res) => {
    try {
        const posts = await DatabaseOperations.getPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error retrieving posts' });
    }
});
// Route to add a comment
app.post('/comment', async (req, res) => {
    const { postId, username, comment } = req.body;
    
    if (!postId || !username || !comment) {
        return res.status(400).json({ message: 'Post ID, username, and comment are required' });
    }
    console.log(postId, username, comment);

    try {
        const result = await DatabaseOperations.addComment(postId, username, comment);
    
        console.log('Comment added:', result);
        res.status(201).json({ 
            message: 'Comment added successfully', 
            commentId: result
        });
    } catch (error) {
        console.error('Comment creation error:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// Route to get comments for a post
app.get('/comments/:postId', async (req, res) => {
    const { postId } = req.params;
    console.log('postId:', postId);

    try {
        const comments = await DatabaseOperations.getCommentsByPostId(postId);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error retrieving comments' });
    }
});

// Route to like a post
app.post('/like', async (req, res) => {
    const { postId } = req.body;
    
    if (!postId) {
        return res.status(400).json({ message: 'Post ID is required' });
    }

    try {
        const result = await DatabaseOperations.likePost(postId);
        res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ message: 'Error liking post' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;