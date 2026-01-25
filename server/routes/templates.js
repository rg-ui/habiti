const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Get all templates
router.get('/', authenticateToken, async (req, res) => {
    try {
        const templates = await pool.query(
            'SELECT * FROM habit_templates ORDER BY is_premium ASC, usage_count DESC'
        );

        // Filter premium templates for non-pro users (show but mark as locked)
        const result = templates.rows.map(t => ({
            ...t,
            habits: typeof t.habits === 'string' ? JSON.parse(t.habits) : t.habits,
            locked: t.is_premium && !req.user.is_pro
        }));

        res.json(result);
    } catch (err) {
        console.error('Error fetching templates:', err);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// Get templates by category
router.get('/category/:category', authenticateToken, async (req, res) => {
    try {
        const { category } = req.params;
        const templates = await pool.query(
            'SELECT * FROM habit_templates WHERE category = $1 ORDER BY usage_count DESC',
            [category]
        );

        const result = templates.rows.map(t => ({
            ...t,
            habits: typeof t.habits === 'string' ? JSON.parse(t.habits) : t.habits,
            locked: t.is_premium && !req.user.is_pro
        }));

        res.json(result);
    } catch (err) {
        console.error('Error fetching templates:', err);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// Use a template - create all habits from template
router.post('/:id/use', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Get template
        const templateResult = await pool.query(
            'SELECT * FROM habit_templates WHERE id = $1',
            [id]
        );

        if (templateResult.rows.length === 0) {
            return res.status(404).json({ error: 'Template not found' });
        }

        const template = templateResult.rows[0];

        // Check if user can use premium template
        if (template.is_premium && !req.user.is_pro) {
            return res.status(403).json({
                error: 'This is a premium template. Upgrade to Pro to use it.',
                requires_pro: true
            });
        }

        const habits = typeof template.habits === 'string'
            ? JSON.parse(template.habits)
            : template.habits;

        // Create all habits from template
        const createdHabits = [];
        for (const habit of habits) {
            const result = await pool.query(
                `INSERT INTO habits (user_id, title, identity_goal, color, goal_frequency, is_challenge, challenge_days, challenge_start_date)
                 VALUES ($1, $2, $3, $4, 'daily', $5, $6, $7)
                 RETURNING *`,
                [
                    req.user.id,
                    habit.title,
                    habit.identity_goal,
                    habit.color || '#14b8a6',
                    habit.is_challenge || false,
                    habit.challenge_days || 0,
                    habit.is_challenge ? new Date() : null
                ]
            );
            createdHabits.push(result.rows[0]);
        }

        // Update usage count
        await pool.query(
            'UPDATE habit_templates SET usage_count = usage_count + 1 WHERE id = $1',
            [id]
        );

        res.status(201).json({
            message: `Created ${createdHabits.length} habits from "${template.name}"`,
            habits: createdHabits
        });
    } catch (err) {
        console.error('Error using template:', err);
        res.status(500).json({ error: 'Failed to create habits from template' });
    }
});

module.exports = router;
