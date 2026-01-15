const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const entries = await pool.query('SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY entry_date DESC', [req.user.id]);
        res.json(entries.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { date, content, mood } = req.body;
        const newEntry = await pool.query(
            `INSERT INTO journal_entries (user_id, entry_date, content, mood)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (user_id, entry_date)
             DO UPDATE SET content = $3, mood = $4
             RETURNING *`,
            [req.user.id, date, content, mood]
        );
        res.json(newEntry.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
