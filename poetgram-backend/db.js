// db.js - Database Connection Configuration
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',     // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'Poem',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;