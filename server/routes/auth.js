const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

// Token expiry time (7 days for better UX)
const TOKEN_EXPIRY = '7d';

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (username.length < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check for invalid characters
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, is_pro, is_admin',
            [username.toLowerCase(), hashedPassword]
        );

        const user = newUser.rows[0];

        // Auto-login after signup
        const token = jwt.sign(
            { id: user.id, username: user.username, is_pro: user.is_pro, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: { id: user.id, username: user.username, is_pro: user.is_pro, is_admin: user.is_admin }
        });
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'Username already exists' });
        }
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username.toLowerCase()]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, is_pro: user.is_pro, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        res.json({
            token,
            user: { id: user.id, username: user.username, is_pro: user.is_pro, is_admin: user.is_admin }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Refresh token - get a new token with fresh user data
router.get('/refresh', authenticateToken, async (req, res) => {
    try {
        // Get fresh user data from database
        const result = await pool.query(
            'SELECT id, username, is_pro, is_admin FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        // Generate new token with fresh data
        const token = jwt.sign(
            { id: user.id, username: user.username, is_pro: user.is_pro, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        res.json({
            token,
            user: { id: user.id, username: user.username, is_pro: user.is_pro, is_admin: user.is_admin }
        });
    } catch (err) {
        console.error('Token refresh error:', err);
        res.status(500).json({ error: 'Server error during token refresh' });
    }
});

// Verify token endpoint (for frontend to check if token is still valid)
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        valid: true,
        user: {
            id: req.user.id,
            username: req.user.username,
            is_pro: req.user.is_pro,
            is_admin: req.user.is_admin
        }
    });
});

module.exports = router;
