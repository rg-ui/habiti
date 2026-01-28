const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Get weekly progress (Last 7 days) - Pro only
router.get('/weekly', authenticateToken, async (req, res) => {
    try {
        if (!req.user.is_pro) return res.status(403).json({ error: "Upgrade to Pro" });

        const weeklyStats = await pool.query(`
            SELECT 
                to_char(date_trunc('day', d)::date, 'Dy') as day_name,
                COUNT(hl.id) as completed_count
            FROM generate_series(
                CURRENT_DATE - INTERVAL '6 days',
                CURRENT_DATE,
                '1 day'::interval
            ) d
            LEFT JOIN habit_logs hl ON hl.log_date = d::date 
            LEFT JOIN habits h ON hl.habit_id = h.id AND h.user_id = $1
            GROUP BY d
            ORDER BY d ASC
        `, [req.user.id]);

        res.json(weeklyStats.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get weekly progress for all users (Last 7 days)
router.get('/weekly-progress', authenticateToken, async (req, res) => {
    try {
        const weeklyStats = await pool.query(`
            SELECT 
                to_char(d::date, 'MM/DD') as date,
                d::date as full_date,
                COALESCE(COUNT(hl.id), 0)::integer as value
            FROM generate_series(
                CURRENT_DATE - INTERVAL '6 days',
                CURRENT_DATE,
                '1 day'::interval
            ) d
            LEFT JOIN habit_logs hl ON hl.log_date = d::date 
            LEFT JOIN habits h ON hl.habit_id = h.id AND h.user_id = $1
            GROUP BY d
            ORDER BY d ASC
        `, [req.user.id]);

        res.json(weeklyStats.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get mood correlations
router.get('/correlations', authenticateToken, async (req, res) => {
    try {
        if (!req.user.is_pro) return res.status(403).json({ error: "Upgrade to Pro" });

        // Average habits completed on days with specific moods
        const correlations = await pool.query(`
            SELECT 
                je.mood,
                ROUND(AVG(daily_counts.completed_count), 1) as avg_completion
            FROM journal_entries je
            JOIN (
                SELECT log_date, COUNT(*) as completed_count
                FROM habit_logs hl
                JOIN habits h ON hl.habit_id = h.id
                WHERE h.user_id = $1
                GROUP BY log_date
            ) daily_counts ON je.entry_date = daily_counts.log_date
            WHERE je.user_id = $1
            GROUP BY je.mood
            ORDER BY avg_completion DESC
        `, [req.user.id]);

        res.json(correlations.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/progress', authenticateToken, async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT 
                h.id, 
                h.title, 
                COUNT(hl.id) as completion_count
            FROM habits h
            LEFT JOIN habit_logs hl ON h.id = hl.habit_id
            WHERE h.user_id = $1
            GROUP BY h.id, h.title
        `, [req.user.id]);

        res.json(stats.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
