// Creates a MySQL connection pool to service queries
const mysql = require('mysql2/promise');

// Logs into the DB
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Exports the pool module.
module.exports = pool;