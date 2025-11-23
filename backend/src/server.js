// This file will setup the Express.js backend server.

// Get all necessary packages, as well as the environment.
// .env is included in this!! It will be needed!
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth') // This is our registration API endpoint

// Create an express app.
const app = express();

// Use our frontend server and use JSON for request handling.
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Mount Registration API endpoint.
app.use("/api/auth", authRoutes);

// Use port in .env or 5000 by default and listen on this port.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('erver running on ${PORT}'));