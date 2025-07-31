// dbOperations.js - Database CRUD Operations
const pool = require('./db');
 const PasswordUtils = require('./passwordUtils');
class DatabaseOperations {


static async createUser(username, password, followers = 0, ratings = 0) {
        try {

            const [result] = await pool.execute(
                'INSERT INTO User (username, password, followers, ratings) VALUES (?, ?, ?, ?)',
                [username, password, followers, ratings]
            );

            return result;
        } catch (error) {
            console.error('Error creating user:', error.message);
            throw error;
        }
    }

    static async authenticateUser(username, inputPassword) {
    try {
        // Fetch the stored password for the given username from the database
        const password= await pool.execute(
            'SELECT password FROM User WHERE username = ?', 
            [username]
        );

        // If no user is found
        if (password ===0) {
            console.log("❌ User not found");
            return false;
        }

        const storedPassword = password;
        console.log("Stored password from DB:", storedPassword);
        console.log("Entered password:", inputPassword);
        console.log("Stored:", storedPassword);
        console.log("Input:", inputPassword);

        // Compare input password with stored password (plaintext comparison)
        const isMatch = (password === inputPassword);
        console.log("Password match status:", isMatch);

        return isMatch;
    } catch (error) {
        console.error('Authentication error:', error.message);
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
    static async createUser(username,password, followers = 0, ratings = 0) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO User (username, password, followers, ratings) VALUES (?,?, ?, ?)',
                [username,password, followers, ratings]
            );
            return result;
        } catch (error) {
        console.error('Error creating user:', error.message);
        console.error(error.stack);
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