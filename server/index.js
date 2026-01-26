const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
// CORS Configuration
app.use(cors({
    origin: [
        "https://habiti-app-seven.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware

app.use(express.json());
app.set('trust proxy', 1);

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0' });
});

// Core Routes
app.use('/auth', require('./routes/auth'));
app.use('/habits', require('./routes/habits'));
app.use('/journal', require('./routes/journal'));
app.use('/analytics', require('./routes/analytics'));
app.use('/admin', require('./routes/admin'));
app.use('/chat', require('./routes/chat'));

// Premium Feature Routes
app.use('/templates', require('./routes/templates'));
app.use('/focus', require('./routes/focus'));
app.use('/achievements', require('./routes/achievements'));
app.use('/pro', require('./routes/pro'));

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Habiti API v2.0',
        features: [
            'Habit Tracking',
            'Focus Timer (Pomodoro)',
            'Habit Templates',
            'Achievements & Badges',
            'Analytics',
            'AI Coaching'
        ]
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, '0.0.0.0', async () => {
    console.log(`🚀 Habiti API v2.0 running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✨ Features: Templates, Focus Timer, Achievements`);

    // Auto-create tables on start (Production-ready)
    try {
        const fs = require('fs');
        const path = require('path');
        const pool = require('./db');

        const sqlPath = path.join(__dirname, 'db', 'init.sql');
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf8');
            await pool.query(sql);
            console.log("✅ Database initialized (Tables auto-created if needed)");
        } else {
            console.warn("⚠️ init.sql not found at:", sqlPath);
        }
    } catch (err) {
        console.error("❌ Database initialization failed:", err.message);
        // We don't exit process here so server stays up even if DB init fails (e.g. transient connection issue)
    }
});
