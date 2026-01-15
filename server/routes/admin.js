const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Middleware to check if admin
// Middleware to check if admin
// Middleware to check if admin
const isAdmin = async (req, res, next) => {
    console.log("Checking admin status for user:", req.user.username);
    // 1. Check token first for performance
    if (req.user && req.user.is_admin) {
        console.log("Admin allowed via token");
        return next();
    }

    // 2. Fallback: Check Database (handles stale tokens)
    try {
        const result = await pool.query('SELECT is_admin FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length > 0 && result.rows[0].is_admin) {
            console.log("Admin allowed via DB check");
            // Optional: You could issue a new token here, but for now just allow access
            return next();
        }
    } catch (err) {
        console.error("Admin check failed in DB", err);
    }

    console.log("Admin access denied for:", req.user.username);
    res.status(403).json({ error: 'Admin access required' });
};

// Get all users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await pool.query('SELECT id, username, is_pro, is_admin, created_at FROM users ORDER BY id ASC');
        res.json(users.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Toggle premium
router.put('/users/:id/premium', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_pro } = req.body; // Expect boolean

        const updated = await pool.query(
            'UPDATE users SET is_pro = $1 WHERE id = $2 RETURNING id, username, is_pro',
            [is_pro, id]
        );

        if (updated.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json(updated.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
