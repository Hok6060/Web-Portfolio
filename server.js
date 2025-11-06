require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const apiKey = process.env.API_KEY;
const PORT = process.env.PORT;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const restrictAccess = (req, res, next) => {
    const providedKey = req.headers['authorization'];
    if (!providedKey || providedKey !== `Bearer ${apiKey}`) {
        return res.status(403).json({ error: 'Unauthorized: Invalid API key' });
    }
    next();
};

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api', restrictAccess);

app.get('/api/personal-info', (req, res) => {
    pool.query('SELECT * FROM personal_info LIMIT 1', (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results[0] || { error: 'No data found' });
    });
});

app.get('/api/projects', (req, res) => {
    pool.query('SELECT * FROM projects', (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.get('/api/skills', (req, res) => {
    pool.query('SELECT * FROM skills', (err, results) => {
        if (err) {
            console.error('Query error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.get('/', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.get('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on port 127.0.0.1:${PORT}`);
});
