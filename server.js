require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const apiKey = process.env.API_KEY;
const PORT = process.env.PORT;

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create pool using async/await
const pool = mysql.createPool(dbConfig);

// Middleware for API key validation
const restrictAccess = (req, res, next) => {
    const providedKey = req.headers['authorization'];
    if (!providedKey || providedKey !== `Bearer ${apiKey}`) {
        return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }
    next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
};

// Apply middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API routes with async/await
app.use('/api', restrictAccess);

app.get('/api/personal-info', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM personal_info LIMIT 1');
        res.json(rows[0] || { error: 'No data found' });
    } catch (err) {
        next(err);
    }
});

app.get('/api/projects', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projects');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

app.get('/api/skills', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM skills');
        res.json(rows);
    } catch (err) {
        next(err);
    }
});

// Default route handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware should be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
