// Get all necessary packages, as well as our DB pool.
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router(); // The router creates our /register endpoint.

// Create the /register endpoint.
router.post("/register", async (req, res) => {
    // The request should contain the username, email, and password.
    const { username, email, password } = req.body;

    // If one field is missing, send a 400 error.
    if(!username || !email || !password){
        return res.status(400).json({ message: "All fields required." });
    }

    try{
        // Query the database to check for an exisitng account.
        const [existing] = await db.query(
            "SELECT id FROM UserAccounts WHERE email = ? OR username = ?",
            [email, username]
        );

        // If any are found, return a 409 error.
        if(existing.length > 0){
            return res.status(409).json({ message: "User already exists." });
        }

        // If this is indeed a new user, hash the password 10 times.
        // We do this so the password is NOT plaintext in our schema!
        const hashed_password = await bcrypt.hash(password, 10);

        // Query the database to add the new user.
        await db.query(
            "INSERT INTO UserAccounts (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashed_password]
        );

        // Report success with status code 201.
        res.status(201).json({ message: "Registered successfully!" });

    // Error handling. Simply send an internal server error (500)
    } catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error." });
    }
});

// Export the endpoint module.
module.exports = router;