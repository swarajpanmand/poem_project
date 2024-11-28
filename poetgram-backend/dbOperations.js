// dbOperations.js - Database CRUD Operations
const pool = require('./db');

class DatabaseOperations {

    static async createUser(username, password, followers = 0, ratings = 0) {
        try {
            // Hash the password before storing
            const hashedPassword = await PasswordUtils.hashPassword(password);
            
            const [result] = await pool.execute(
                'INSERT INTO User (username, password, followers, ratings) VALUES (?, ?, ?, ?)',
                [username, hashedPassword, followers, ratings]
            );
            return result;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Authenticate User
    static async authenticateUser(username, password) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM User WHERE username = ?', 
                [username]
            );

            if (rows.length === 0) {
                return false;
            }

            // Compare provided password with stored hash
            const isMatch = await PasswordUtils.comparePassword(
                password, 
                rows[0].password
            );

            return isMatch;
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    // Check if Username Exists
    static async checkUsernameExists(username) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM User WHERE username = ?', 
                [username]
            );
            return rows.length > 0;
        } catch (error) {
            console.error('Username check error:', error);
            throw error;
        }
    }
    // User Operations
    static async createUser(username, followers = 0, ratings = 0) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO User (username, followers, ratings) VALUES (?, ?, ?)',
                [username, followers, ratings]
            );
            return result;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async getUserByUsername(username) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM User WHERE username = ?', 
                [username]
            );
            return rows[0];
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    // Post Operations
    // Update createPost method in dbOperations.js
    static async createPost(genre, content, likes, username, titleId = null) {
        try {
            // Validate inputs
            if (!genre || !content || !username) {
                throw new Error('Genre, content, and username are required');
            }
    
            // Sanitize inputs
            const sanitizedGenre = genre.trim();
            const sanitizedContent = content.trim();
            const sanitizedUsername = username.trim();
    
            // Use execute instead of query, and destructure the result
            const result = await pool.execute(
                'INSERT INTO Posts (genre, content, likes, username, title_id) VALUES (?, ?, ?, ?, ?)',
                [sanitizedGenre, sanitizedContent, likes || 0, sanitizedUsername, titleId]
            );
            console.log('Post created:', result[0].insertId);
    
            // The result is an array where the first element contains the actual result
            return result;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    static async addComment(postId, username, comment) {
        try {
            console.log('ithe: ',postId, username, comment);
            // Validate inputs
            if (!postId || !username || !comment) {
                throw new Error('Post ID, username, and comment are required');
            }
            console.log('ithe: ',postId, username, comment);
    
            const result = await pool.execute(
                'INSERT INTO Comments (post_id, username, comment) VALUES (?, ?, ?)',
                [postId, username, comment]
            );
            console.log('Commen:', result);
            console.log('Comment added:', result[0].insertId);
            return result[0].insertId;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    }
    // Add method to get comments for a post
    static async getCommentsByPostId(postId) {
        try {
            const rows = await pool.execute(
                'SELECT * FROM Comments WHERE post_id = ? ORDER BY comment_id DESC', 
                [postId]
            );
            console.log('Comments:', rows);
            return rows[0];
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    }

    // Add method to like a post
    static async likePost(postId) {
        try {
            const [result] = await pool.execute(
                'UPDATE Posts SET likes = likes + 1 WHERE post_id = ?',
                [postId]
            );
            return result;
        } catch (error) {
            console.error('Error liking post:', error);
            throw error;
        }
    }

    static async getPosts() {
        try {
            const rows = await pool.execute('SELECT * FROM Posts');
            return rows;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }

    // Comment Operations

    // Authentication Operations
    static async authenticateUser(username) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM User WHERE username = ?', 
                [username]
            );
            return rows.length > 0;
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    static async getPosts() {
        try {
            const [rows] = await pool.execute('SELECT * FROM Posts ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }
}

module.exports = DatabaseOperations;