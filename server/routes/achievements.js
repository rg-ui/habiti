const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Badge definitions
const BADGE_DEFINITIONS = {
    // Streak badges
    streak_7: { name: 'Week Warrior', desc: '7-day streak achieved', icon: '🔥', category: 'streaks' },
    streak_30: { name: 'Monthly Master', desc: '30-day streak achieved', icon: '⚡', category: 'streaks' },
    streak_100: { name: 'Century Champion', desc: '100-day streak achieved', icon: '💯', category: 'streaks' },
    streak_365: { name: 'Legendary', desc: '365-day streak achieved', icon: '👑', category: 'streaks' },

    // Completion badges
    complete_10: { name: 'Getting Started', desc: 'Completed 10 habit check-ins', icon: '🌱', category: 'completions' },
    complete_100: { name: 'Committed', desc: 'Completed 100 habit check-ins', icon: '💪', category: 'completions' },
    complete_500: { name: 'Dedication', desc: 'Completed 500 habit check-ins', icon: '🏆', category: 'completions' },
    complete_1000: { name: 'Unstoppable', desc: 'Completed 1000 habit check-ins', icon: '⭐', category: 'completions' },

    // Focus badges
    focus_1hr: { name: 'First Focus Hour', desc: 'Completed first hour of focus', icon: '⏱️', category: 'focus' },
    focus_10hr: { name: 'Deep Work Apprentice', desc: '10 hours of focused work', icon: '🎯', category: 'focus' },
    focus_50hr: { name: 'Focus Master', desc: '50 hours of focused work', icon: '🧠', category: 'focus' },
    focus_100hr: { name: 'Deep Work Elite', desc: '100 hours of focused work', icon: '🔮', category: 'focus' },

    // Journal badges
    journal_7: { name: 'Reflective', desc: '7 journal entries written', icon: '📝', category: 'journal' },
    journal_30: { name: 'Thoughtful', desc: '30 journal entries written', icon: '📖', category: 'journal' },

    // Challenge badges
    challenge_21: { name: '21-Day Conqueror', desc: 'Completed a 21-day challenge', icon: '🎖️', category: 'challenges' },
    challenge_66: { name: 'Habit Transformer', desc: 'Completed a 66-day challenge', icon: '🏅', category: 'challenges' },

    // Special badges
    early_adopter: { name: 'Early Adopter', desc: 'Joined Habiti early', icon: '🚀', category: 'special' },
    pro_member: { name: 'Pro Member', desc: 'Upgraded to Pro', icon: '💎', category: 'special' },
};

// Get all achievements for user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM achievements WHERE user_id = $1 ORDER BY earned_at DESC',
            [req.user.id]
        );

        // Add badge details
        const achievements = result.rows.map(ach => ({
            ...ach,
            ...(BADGE_DEFINITIONS[ach.badge_type] || {})
        }));

        // Get available (not yet earned) badges
        const earnedTypes = new Set(result.rows.map(a => a.badge_type));
        const available = Object.entries(BADGE_DEFINITIONS)
            .filter(([type]) => !earnedTypes.has(type))
            .map(([type, def]) => ({ badge_type: type, ...def, locked: true }));

        res.json({
            earned: achievements,
            available,
            total_earned: achievements.length,
            total_available: Object.keys(BADGE_DEFINITIONS).length
        });
    } catch (err) {
        console.error('Error fetching achievements:', err);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
});

// Check and award achievements (called after various actions)
router.post('/check', authenticateToken, async (req, res) => {
    try {
        const newAchievements = [];

        // Check streak achievements
        const streakResult = await pool.query(`
            SELECT MAX(streak_count) as max_streak FROM (
                SELECT habit_id, COUNT(*) as streak_count
                FROM habit_logs
                WHERE habit_id IN (SELECT id FROM habits WHERE user_id = $1)
                AND completed = true
                GROUP BY habit_id
            ) sub
        `, [req.user.id]);

        const maxStreak = parseInt(streakResult.rows[0]?.max_streak || 0);

        if (maxStreak >= 7) await awardBadge(req.user.id, 'streak_7', newAchievements);
        if (maxStreak >= 30) await awardBadge(req.user.id, 'streak_30', newAchievements);
        if (maxStreak >= 100) await awardBadge(req.user.id, 'streak_100', newAchievements);
        if (maxStreak >= 365) await awardBadge(req.user.id, 'streak_365', newAchievements);

        // Check completion achievements
        const completionResult = await pool.query(`
            SELECT COUNT(*) as total FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = $1 AND hl.completed = true
        `, [req.user.id]);

        const totalCompletions = parseInt(completionResult.rows[0]?.total || 0);

        if (totalCompletions >= 10) await awardBadge(req.user.id, 'complete_10', newAchievements);
        if (totalCompletions >= 100) await awardBadge(req.user.id, 'complete_100', newAchievements);
        if (totalCompletions >= 500) await awardBadge(req.user.id, 'complete_500', newAchievements);
        if (totalCompletions >= 1000) await awardBadge(req.user.id, 'complete_1000', newAchievements);

        // Check journal achievements
        const journalResult = await pool.query(
            'SELECT COUNT(*) as total FROM journal_entries WHERE user_id = $1',
            [req.user.id]
        );

        const totalJournals = parseInt(journalResult.rows[0]?.total || 0);

        if (totalJournals >= 7) await awardBadge(req.user.id, 'journal_7', newAchievements);
        if (totalJournals >= 30) await awardBadge(req.user.id, 'journal_30', newAchievements);

        // Check pro member badge
        if (req.user.is_pro) {
            await awardBadge(req.user.id, 'pro_member', newAchievements);
        }

        res.json({
            new_achievements: newAchievements,
            message: newAchievements.length > 0
                ? `Congratulations! You earned ${newAchievements.length} new badge(s)!`
                : 'No new achievements'
        });
    } catch (err) {
        console.error('Error checking achievements:', err);
        res.status(500).json({ error: 'Failed to check achievements' });
    }
});

async function awardBadge(userId, badgeType, newAchievements) {
    try {
        const def = BADGE_DEFINITIONS[badgeType];
        if (!def) return;

        const result = await pool.query(`
            INSERT INTO achievements (user_id, badge_type, badge_name, badge_description)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, badge_type) DO NOTHING
            RETURNING *
        `, [userId, badgeType, def.name, def.desc]);

        if (result.rows.length > 0) {
            newAchievements.push({
                ...result.rows[0],
                icon: def.icon,
                category: def.category
            });
        }
    } catch (err) {
        console.error('Error awarding badge:', err);
    }
}

module.exports = router;
