// Get all necessary packages, as well as our DB pool.
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
console.log("Mounted auth routes at /api/auth");
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

// Create the /register endpoint.
router.post("/login", async (req, res) => {
    // The request should contain the username, email, and password.
    const { identifier, password } = req.body;

    // If one field is missing, send a 400 error.
    if(!identifier || !password){
        return res.status(400).json({ message: "All fields required." });
    }

    try{
        // Query the database to check for account by username or email
        const [rows] = await db.query(
            "SELECT id, password FROM UserAccounts WHERE email = ? OR username = ? LIMIT 1",
            [identifier, identifier]
        );

        // If no account is found, report an error.
        if(rows.length === 0){
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Get the user's account
        const user = rows[0]

        // Compare password with stored hashed password
        const valid = await bcrypt.compare(password, user.password);

        if(!valid){
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Report success with status code 201.
        res.status(201).json({ message: "Login successful!", userId: user.id });

    // Error handling. Simply send an internal server error (500)
    } catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error." });
    }
});



// Save a route
router.post("/save", (req, res) => {
  const { userId, latitude, longitude, route_name, distance_m } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  const q = `
    INSERT INTO SavedRoutes 
    (id, latitude, longitude, route_name, distance_m)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    q,
    [userId, latitude, longitude, route_name, distance_m],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      return res.json({
        message: "Route saved!",
        routeId: result.insertId
      });
    }
  );
});


// Load routes from a certain user id
router.get("/routes/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT id, route_name, distance_m, latitude, longitude FROM SavedRoutes WHERE id = ?",
      [userId]
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error." });
  }
});

// Validate the user account exists in the database (log out if database is cleared)
router.get("/validate/:userId", async (req, res) => {
  // Get the userID from the request
  const { userId } = req.params;

  try {
    // Query the database to find users.
    const [rows] = await db.query(
      "SELECT id FROM UserAccounts WHERE id = ?",
      [userId]
    );

    // If no users are found, return an error 404 code and set valid to false.
    if(rows.length == 0){
      return res.status(404).json({ valid: false });
    }

    // Implies a user was found, return valid.
    res.json({ valid: true });

    // Error handling.
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error." });
  }
});


// Export the endpoint module.
module.exports = router;