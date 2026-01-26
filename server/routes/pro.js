const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// =====================
// STREAK FREEZE FEATURE
// =====================

// Get user's freeze status
router.get('/freezes', authenticateToken, async (req, res) => {
    try {
        // Check if user has freezes table entry
        let result = await pool.query(
            `SELECT freezes_available, freezes_used_this_month, last_freeze_reset 
             FROM user_freezes WHERE user_id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            // Create default entry for new users
            const isPro = req.user.is_pro;
            await pool.query(
                `INSERT INTO user_freezes (user_id, freezes_available, freezes_used_this_month, last_freeze_reset)
                 VALUES ($1, $2, 0, NOW())`,
                [req.user.id, isPro ? 3 : 0]
            );
            result = await pool.query(
                `SELECT freezes_available, freezes_used_this_month, last_freeze_reset 
                 FROM user_freezes WHERE user_id = $1`,
                [req.user.id]
            );
        }

        // Reset monthly freezes if needed
        const lastReset = new Date(result.rows[0].last_freeze_reset);
        const now = new Date();
        if (lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear()) {
            const isPro = req.user.is_pro;
            await pool.query(
                `UPDATE user_freezes 
                 SET freezes_available = $2, freezes_used_this_month = 0, last_freeze_reset = NOW()
                 WHERE user_id = $1`,
                [req.user.id, isPro ? 3 : 0]
            );
            result.rows[0].freezes_available = isPro ? 3 : 0;
            result.rows[0].freezes_used_this_month = 0;
        }

        res.json({
            freezesAvailable: result.rows[0].freezes_available,
            freezesUsedThisMonth: result.rows[0].freezes_used_this_month,
            isPro: req.user.is_pro
        });
    } catch (err) {
        console.error('Error fetching freezes:', err);
        res.status(500).json({ error: 'Failed to fetch freeze status' });
    }
});

// Use a streak freeze
router.post('/freezes/use', authenticateToken, async (req, res) => {
    try {
        if (!req.user.is_pro) {
            return res.status(403).json({ error: 'Streak freeze is a Pro feature' });
        }

        const result = await pool.query(
            `SELECT freezes_available FROM user_freezes WHERE user_id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0 || result.rows[0].freezes_available <= 0) {
            return res.status(400).json({ error: 'No freezes available' });
        }

        // Apply freeze - mark today as "frozen" for all habits
        const today = new Date().toISOString().split('T')[0];

        await pool.query(
            `UPDATE user_freezes 
             SET freezes_available = freezes_available - 1, 
                 freezes_used_this_month = freezes_used_this_month + 1
             WHERE user_id = $1`,
            [req.user.id]
        );

        // Log the freeze
        await pool.query(
            `INSERT INTO streak_freeze_log (user_id, freeze_date) VALUES ($1, $2)
             ON CONFLICT (user_id, freeze_date) DO NOTHING`,
            [req.user.id, today]
        );

        const updated = await pool.query(
            `SELECT freezes_available, freezes_used_this_month FROM user_freezes WHERE user_id = $1`,
            [req.user.id]
        );

        res.json({
            success: true,
            message: 'Streak freeze applied for today!',
            freezesAvailable: updated.rows[0].freezes_available,
            freezesUsedThisMonth: updated.rows[0].freezes_used_this_month
        });
    } catch (err) {
        console.error('Error using freeze:', err);
        res.status(500).json({ error: 'Failed to use freeze' });
    }
});

// =====================
// AI INSIGHTS FEATURE
// =====================

// Get personalized AI insight for dashboard
router.get('/insights/daily', authenticateToken, async (req, res) => {
    try {
        if (!req.user.is_pro) {
            return res.status(403).json({ error: 'AI Insights is a Pro feature' });
        }

        // Get user's habit data
        const habitsResult = await pool.query(
            `SELECT h.id, h.title, h.color,
                    COUNT(CASE WHEN hl.completed THEN 1 END) as completions,
                    MAX(hl.log_date) as last_completed
             FROM habits h
             LEFT JOIN habit_logs hl ON h.id = hl.habit_id
             WHERE h.user_id = $1
             GROUP BY h.id`,
            [req.user.id]
        );

        const habits = habitsResult.rows;
        const totalHabits = habits.length;

        // Get today's completions
        const today = new Date().toISOString().split('T')[0];
        const todayResult = await pool.query(
            `SELECT COUNT(*) as count FROM habit_logs 
             WHERE habit_id IN (SELECT id FROM habits WHERE user_id = $1)
             AND log_date = $2 AND completed = true`,
            [req.user.id, today]
        );
        const todayCompletions = parseInt(todayResult.rows[0].count);

        // Get recent mood
        const moodResult = await pool.query(
            `SELECT mood FROM journal_entries 
             WHERE user_id = $1 
             ORDER BY entry_date DESC LIMIT 1`,
            [req.user.id]
        );
        const recentMood = moodResult.rows[0]?.mood || 'neutral';

        // Generate insight based on data
        let insight = '';
        let tip = '';
        let emoji = '💡';

        const completionRate = totalHabits > 0 ? todayCompletions / totalHabits : 0;

        if (completionRate >= 1) {
            insight = "Perfect day! You've completed all your habits.";
            tip = "Consider adding a stretch goal or reviewing your long-term progress.";
            emoji = '🏆';
        } else if (completionRate >= 0.7) {
            insight = "Great momentum! You're 70%+ through today's habits.";
            tip = "Push through the last few habits to maintain your streak.";
            emoji = '🔥';
        } else if (completionRate >= 0.3) {
            insight = "Solid start! You've got momentum building.";
            const incompleteHabit = habits.find(h => {
                const lastCompleted = h.last_completed ? new Date(h.last_completed).toISOString().split('T')[0] : null;
                return lastCompleted !== today;
            });
            tip = incompleteHabit
                ? `Try tackling "${incompleteHabit.title}" next - small wins compound!`
                : "Keep going, you're building strong patterns!";
            emoji = '💪';
        } else {
            insight = "Fresh start today! Every moment is a chance to begin.";
            tip = "Start with your easiest habit to build momentum.";
            emoji = '🌅';
        }

        // Add mood-based insight
        if (recentMood === 'sad') {
            tip += " Remember: progress over perfection. Even one habit completed is a win!";
        } else if (recentMood === 'happy') {
            tip += " Your positive energy is a superpower - channel it into your habits!";
        }

        res.json({
            insight,
            tip,
            emoji,
            stats: {
                todayCompletions,
                totalHabits,
                completionRate: Math.round(completionRate * 100)
            }
        });
    } catch (err) {
        console.error('Error generating insight:', err);
        res.status(500).json({ error: 'Failed to generate insight' });
    }
});

// =====================
// AI JOURNAL PROMPTS
// =====================

const JOURNAL_PROMPTS = [
    "What small win from today deserves recognition?",
    "What's one thing you're grateful for right now?",
    "What challenge did you overcome recently?",
    "How do you feel about your progress this week?",
    "What would make tomorrow even better than today?",
    "What habit are you most proud of building?",
    "When do you feel most focused and productive?",
    "What's something you learned about yourself lately?",
    "How can you be kinder to yourself today?",
    "What's one small step toward your biggest goal?",
    "Who or what inspired you recently?",
    "What's draining your energy that you could let go of?",
    "What would your ideal morning routine look like?",
    "How has your mindset changed in the past month?",
    "What boundaries do you need to set for yourself?"
];

router.get('/prompts/daily', authenticateToken, async (req, res) => {
    try {
        if (!req.user.is_pro) {
            return res.status(403).json({ error: 'AI Prompts is a Pro feature' });
        }

        // Get a prompt based on the day of the year (consistent daily prompt)
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        const promptIndex = dayOfYear % JOURNAL_PROMPTS.length;

        res.json({
            prompt: JOURNAL_PROMPTS[promptIndex],
            category: 'reflection'
        });
    } catch (err) {
        console.error('Error fetching prompt:', err);
        res.status(500).json({ error: 'Failed to fetch prompt' });
    }
});

// =====================
// DATA EXPORT FEATURE
// =====================

router.get('/export', authenticateToken, async (req, res) => {
    try {
        if (!req.user.is_pro) {
            return res.status(403).json({ error: 'Data export is a Pro feature' });
        }

        // Fetch all user data
        const habits = await pool.query(
            `SELECT id, title, description, identity_goal, color, goal_frequency, created_at
             FROM habits WHERE user_id = $1`,
            [req.user.id]
        );

        const habitLogs = await pool.query(
            `SELECT hl.habit_id, h.title as habit_title, hl.log_date, hl.completed
             FROM habit_logs hl
             JOIN habits h ON hl.habit_id = h.id
             WHERE h.user_id = $1
             ORDER BY hl.log_date DESC`,
            [req.user.id]
        );

        const journal = await pool.query(
            `SELECT entry_date, content, mood, created_at
             FROM journal_entries WHERE user_id = $1
             ORDER BY entry_date DESC`,
            [req.user.id]
        );

        const focusSessions = await pool.query(
            `SELECT fs.session_date, fs.duration_minutes, fs.session_type, h.title as linked_habit
             FROM focus_sessions fs
             LEFT JOIN habits h ON fs.habit_id = h.id
             WHERE fs.user_id = $1
             ORDER BY fs.session_date DESC`,
            [req.user.id]
        );

        const exportData = {
            exportDate: new Date().toISOString(),
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email
            },
            habits: habits.rows,
            habitLogs: habitLogs.rows,
            journal: journal.rows,
            focusSessions: focusSessions.rows,
            summary: {
                totalHabits: habits.rows.length,
                totalLogs: habitLogs.rows.length,
                totalJournalEntries: journal.rows.length,
                totalFocusSessions: focusSessions.rows.length
            }
        };

        res.json(exportData);
    } catch (err) {
        console.error('Error exporting data:', err);
        res.status(500).json({ error: 'Failed to export data' });
    }
});

module.exports = router;
