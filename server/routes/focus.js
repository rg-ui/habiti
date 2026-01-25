const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Get focus stats for user
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        // Today's focus time
        const todayResult = await pool.query(
            `SELECT COALESCE(SUM(duration_minutes), 0) as today_minutes
             FROM focus_sessions 
             WHERE user_id = $1 AND session_date = CURRENT_DATE AND session_type = 'focus'`,
            [req.user.id]
        );

        // This week's focus time
        const weekResult = await pool.query(
            `SELECT COALESCE(SUM(duration_minutes), 0) as week_minutes
             FROM focus_sessions 
             WHERE user_id = $1 
             AND session_date >= CURRENT_DATE - INTERVAL '7 days'
             AND session_type = 'focus'`,
            [req.user.id]
        );

        // Total focus time
        const totalResult = await pool.query(
            `SELECT COALESCE(SUM(duration_minutes), 0) as total_minutes,
                    COUNT(*) as total_sessions
             FROM focus_sessions 
             WHERE user_id = $1 AND session_type = 'focus'`,
            [req.user.id]
        );

        // Streak (consecutive days with focus sessions)
        const streakResult = await pool.query(`
            WITH dates AS (
                SELECT DISTINCT session_date FROM focus_sessions 
                WHERE user_id = $1 AND session_type = 'focus'
                ORDER BY session_date DESC
            )
            SELECT COUNT(*) as streak FROM (
                SELECT session_date, ROW_NUMBER() OVER (ORDER BY session_date DESC) as rn
                FROM dates
            ) sub
            WHERE session_date = CURRENT_DATE - (rn - 1)::integer
        `, [req.user.id]);

        res.json({
            today_minutes: parseInt(todayResult.rows[0].today_minutes),
            week_minutes: parseInt(weekResult.rows[0].week_minutes),
            total_minutes: parseInt(totalResult.rows[0].total_minutes),
            total_sessions: parseInt(totalResult.rows[0].total_sessions),
            focus_streak: parseInt(streakResult.rows[0]?.streak || 0)
        });
    } catch (err) {
        console.error('Error fetching focus stats:', err);
        res.status(500).json({ error: 'Failed to fetch focus stats' });
    }
});

// Log a focus session
router.post('/session', authenticateToken, async (req, res) => {
    try {
        const { duration_minutes, habit_id, session_type = 'focus' } = req.body;

        if (!duration_minutes || duration_minutes < 1) {
            return res.status(400).json({ error: 'Duration must be at least 1 minute' });
        }

        const result = await pool.query(
            `INSERT INTO focus_sessions (user_id, habit_id, duration_minutes, session_type)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [req.user.id, habit_id || null, duration_minutes, session_type]
        );

        // Check for achievements
        await checkFocusAchievements(req.user.id);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error logging focus session:', err);
        res.status(500).json({ error: 'Failed to log focus session' });
    }
});

// Get recent sessions
router.get('/sessions', authenticateToken, async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const result = await pool.query(
            `SELECT fs.*, h.title as habit_title
             FROM focus_sessions fs
             LEFT JOIN habits h ON fs.habit_id = h.id
             WHERE fs.user_id = $1
             ORDER BY fs.created_at DESC
             LIMIT $2`,
            [req.user.id, parseInt(limit)]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching sessions:', err);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

// Get daily focus data for heatmap (last 365 days)
router.get('/heatmap', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT session_date, SUM(duration_minutes) as minutes
            FROM focus_sessions
            WHERE user_id = $1 
            AND session_date >= CURRENT_DATE - INTERVAL '365 days'
            AND session_type = 'focus'
            GROUP BY session_date
            ORDER BY session_date
        `, [req.user.id]);

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching heatmap data:', err);
        res.status(500).json({ error: 'Failed to fetch heatmap data' });
    }
});

// Helper function to check focus achievements
async function checkFocusAchievements(userId) {
    try {
        // Get total focus time
        const totalResult = await pool.query(
            'SELECT COALESCE(SUM(duration_minutes), 0) as total FROM focus_sessions WHERE user_id = $1',
            [userId]
        );
        const totalMinutes = parseInt(totalResult.rows[0].total);

        const achievements = [
            { type: 'focus_1hr', threshold: 60, name: 'First Focus Hour', desc: 'Completed your first hour of focused work' },
            { type: 'focus_10hr', threshold: 600, name: 'Deep Work Apprentice', desc: 'Achieved 10 hours of focused work' },
            { type: 'focus_50hr', threshold: 3000, name: 'Focus Master', desc: 'Achieved 50 hours of focused work' },
            { type: 'focus_100hr', threshold: 6000, name: 'Deep Work Elite', desc: 'Achieved 100 hours of focused work' },
        ];

        for (const ach of achievements) {
            if (totalMinutes >= ach.threshold) {
                await pool.query(`
                    INSERT INTO achievements (user_id, badge_type, badge_name, badge_description)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (user_id, badge_type) DO NOTHING
                `, [userId, ach.type, ach.name, ach.desc]);
            }
        }
    } catch (err) {
        console.error('Error checking achievements:', err);
    }
}

module.exports = router;
