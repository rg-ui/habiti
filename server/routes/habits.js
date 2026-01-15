const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Get all habits for user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const habits = await pool.query(
            'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at ASC',
            [req.user.id]
        );
        // Fetch logs for these habits (last 30 days usually?) or all? 
        // For simplicity, let's fetch logs separately or join.
        // Let's just return habits here.
        res.json(habits.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create habit
router.post('/', authenticateToken, async (req, res) => {
    console.log("POST /habits request received");
    console.log("User:", req.user);
    console.log("Body:", req.body);

    try {
        const { title, description, color, goal_frequency, identity_goal } = req.body;

        // Check habit limit for non-pro users
        if (!req.user.is_pro) {
            console.log("Checking limit for non-pro user");
            const countResult = await pool.query('SELECT COUNT(*) FROM habits WHERE user_id = $1', [req.user.id]);
            const count = parseInt(countResult.rows[0].count);
            console.log("Current habit count:", count);

            if (count >= 5) {
                console.log("Limit reached");
                return res.status(403).json({ error: 'Free plan limit reached (5 habits). Upgrade to Premium for unlimited habits.' });
            }
        }

        const newHabit = await pool.query(
            'INSERT INTO habits (user_id, title, description, color, goal_frequency, identity_goal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.user.id, title, description, color, goal_frequency, identity_goal]
        );
        console.log("Habit created successfully:", newHabit.rows[0]);
        res.json(newHabit.rows[0]);
    } catch (err) {
        console.error("Error creating habit:", err);
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// Update habit
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, color, goal_frequency } = req.body;

        // Ensure user owns habit
        const check = await pool.query('SELECT * FROM habits WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Habit not found' });

        const updated = await pool.query(
            'UPDATE habits SET title = $1, description = $2, color = $3, goal_frequency = $4 WHERE id = $5 RETURNING *',
            [title, description, color, goal_frequency, id]
        );
        res.json(updated.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete habit
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Habit not found' });
        res.json({ message: 'Habit deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get logs for all habits (or specific)
// Easier to fetch all logs for the current user to display dashboard
router.get('/logs', authenticateToken, async (req, res) => {
    try {
        // Return logs for habits belonging to user
        const logs = await pool.query(
            `SELECT hl.* FROM habit_logs hl
             JOIN habits h ON hl.habit_id = h.id
             WHERE h.user_id = $1`,
            [req.user.id]
        );
        res.json(logs.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Check/Uncheck habit for a date
router.post('/:id/check', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { date, completed } = req.body; // date string YYYY-MM-DD

        // Ownership check
        const check = await pool.query('SELECT * FROM habits WHERE id = $1 AND user_id = $2', [id, req.user.id]);
        if (check.rows.length === 0) return res.status(404).json({ error: 'Habit not found' });

        if (completed === false) {
            // Remove log
            await pool.query('DELETE FROM habit_logs WHERE habit_id = $1 AND log_date = $2', [id, date]);
            res.json({ message: 'Unchecked', completed: false });
        } else {
            // Upsert log
            // Postgres UPSERT
            await pool.query(
                `INSERT INTO habit_logs (habit_id, log_date, completed) 
                 VALUES ($1, $2, TRUE)
                 ON CONFLICT (habit_id, log_date) 
                 DO UPDATE SET completed = TRUE`,
                [id, date]
            );
            res.json({ message: 'Checked', completed: true });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
