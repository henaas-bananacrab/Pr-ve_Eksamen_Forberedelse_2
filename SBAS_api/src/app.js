const dotenv = require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const authRoutes = require('./v1.0.0/routes/authRoutes');
const employeeRoutes = require('./v1.0.0/routes/employeeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', employeeRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = app;