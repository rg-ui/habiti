const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Constants
const FREE_HABIT_LIMIT = 5;

// Get all habits for user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const habits = await pool.query(
            'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at ASC',
            [req.user.id]
        );
        res.json(habits.rows);
    } catch (err) {
        console.error('Error fetching habits:', err);
        res.status(500).json({ error: 'Failed to fetch habits' });
    }
});

// Get a single habit
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching habit:', err);
        res.status(500).json({ error: 'Failed to fetch habit' });
    }
});

// Create habit
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, color, goal_frequency, identity_goal } = req.body;

        // Validation
        if (!title || title.trim().length === 0) {
            return res.status(400).json({ error: 'Habit title is required' });
        }

        if (title.length > 100) {
            return res.status(400).json({ error: 'Habit title is too long (max 100 characters)' });
        }

        // Check habit limit for non-pro users
        if (!req.user.is_pro) {
            const countResult = await pool.query('SELECT COUNT(*) FROM habits WHERE user_id = $1', [req.user.id]);
            const count = parseInt(countResult.rows[0].count);

            if (count >= FREE_HABIT_LIMIT) {
                return res.status(403).json({
                    error: `Free plan limit reached (${FREE_HABIT_LIMIT} habits). Upgrade to Premium for unlimited habits.`,
                    limit_reached: true
                });
            }
        }

        const newHabit = await pool.query(
            `INSERT INTO habits (user_id, title, description, color, goal_frequency, identity_goal) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                req.user.id,
                title.trim(),
                description?.trim() || null,
                color || '#14b8a6',
                goal_frequency || 'daily',
                identity_goal?.trim() || null
            ]
        );

        res.status(201).json(newHabit.rows[0]);
    } catch (err) {
        console.error('Error creating habit:', err);
        res.status(500).json({ error: 'Failed to create habit' });
    }
});

// Update habit
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, color, goal_frequency, identity_goal } = req.body;

        // Validation
        if (!title || title.trim().length === 0) {
            return res.status(400).json({ error: 'Habit title is required' });
        }

        // Ensure user owns habit
        const check = await pool.query('SELECT * FROM habits WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        const updated = await pool.query(
            `UPDATE habits 
             SET title = $1, description = $2, color = $3, goal_frequency = $4, identity_goal = $5 
             WHERE id = $6 
             RETURNING *`,
            [
                title.trim(),
                description?.trim() || null,
                color || '#14b8a6',
                goal_frequency || 'daily',
                identity_goal?.trim() || null,
                id
            ]
        );

        res.json(updated.rows[0]);
    } catch (err) {
        console.error('Error updating habit:', err);
        res.status(500).json({ error: 'Failed to update habit' });
    }
});

// Delete habit
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // First check if habit exists and belongs to user
        const check = await pool.query('SELECT * FROM habits WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        // Delete the habit (cascade will handle logs)
        await pool.query('DELETE FROM habits WHERE id = $1 AND user_id = $2', [id, req.user.id]);

        res.json({ message: 'Habit deleted successfully', deleted_habit: check.rows[0] });
    } catch (err) {
        console.error('Error deleting habit:', err);
        res.status(500).json({ error: 'Failed to delete habit' });
    }
});

// Get logs for all habits
router.get('/logs', authenticateToken, async (req, res) => {
    try {
        const logs = await pool.query(
            `SELECT hl.* FROM habit_logs hl
             JOIN habits h ON hl.habit_id = h.id
             WHERE h.user_id = $1
             ORDER BY hl.log_date DESC`,
            [req.user.id]
        );
        res.json(logs.rows);
    } catch (err) {
        console.error('Error fetching logs:', err);
        res.status(500).json({ error: 'Failed to fetch habit logs' });
    }
});

// Check/Uncheck habit for a date
router.post('/:id/check', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, completed } = req.body;

        // Validate date
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
        }

        // Ownership check
        const check = await pool.query('SELECT * FROM habits WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        if (completed === false) {
            // Remove log (uncheck)
            await pool.query('DELETE FROM habit_logs WHERE habit_id = $1 AND log_date = $2', [id, date]);
            res.json({ message: 'Habit unchecked', completed: false, date });
        } else {
            // Upsert log (check)
            await pool.query(
                `INSERT INTO habit_logs (habit_id, log_date, completed) 
                 VALUES ($1, $2, TRUE)
                 ON CONFLICT (habit_id, log_date) 
                 DO UPDATE SET completed = TRUE`,
                [id, date]
            );
            res.json({ message: 'Habit checked', completed: true, date });
        }
    } catch (err) {
        console.error('Error toggling habit:', err);
        res.status(500).json({ error: 'Failed to update habit status' });
    }
});

// Get streak information for a habit
router.get('/:id/streak', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Ownership check
        const check = await pool.query('SELECT * FROM habits WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        // Get consecutive days from today going backward
        const streakResult = await pool.query(`
            WITH dates AS (
                SELECT log_date FROM habit_logs 
                WHERE habit_id = $1 AND completed = true
                ORDER BY log_date DESC
            )
            SELECT COUNT(*) as streak FROM (
                SELECT log_date, ROW_NUMBER() OVER (ORDER BY log_date DESC) as rn
                FROM dates
            ) sub
            WHERE log_date = CURRENT_DATE - (rn - 1)::integer
        `, [id]);

        const totalResult = await pool.query(
            'SELECT COUNT(*) as total FROM habit_logs WHERE habit_id = $1 AND completed = true',
            [id]
        );

        res.json({
            current_streak: parseInt(streakResult.rows[0]?.streak || 0),
            total_completions: parseInt(totalResult.rows[0]?.total || 0)
        });
    } catch (err) {
        console.error('Error getting streak:', err);
        res.status(500).json({ error: 'Failed to get streak data' });
    }
});

module.exports = router;
