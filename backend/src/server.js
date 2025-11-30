// This file will setup the Express.js backend server.

// Get all necessary packages, as well as the environment.
// .env is included in this!! It will be needed!
require('dotenv').config({ path: "../.env" })
const express = require('express');
const cors = require('cors');

// Correct paths because server.js is inside backend/src
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Mount API endpoints
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

