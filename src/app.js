const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logger

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Task Management System API is running...' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    let error = { ...err };
    error.message = err.message;

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered. Please use another value (email or username already exists).';
        error = new Error(message);
        return res.status(400).json({ success: false, message: message });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({ success: false, message: message });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    });
});

module.exports = app;
