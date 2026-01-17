const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

router.get('/tips', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch habits
        const habitsResult = await pool.query('SELECT * FROM habits WHERE user_id = $1', [userId]);
        const habits = habitsResult.rows;

        // Fetch logs for the last 7 days
        const logsResult = await pool.query(`
            SELECT hl.*, h.title 
            FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = $1 
            AND hl.log_date >= CURRENT_DATE - INTERVAL '7 days'
        `, [userId]);
        const logs = logsResult.rows;

        // Simple Rule-Based AI
        let messages = [];

        if (habits.length === 0) {
            messages.push({
                role: 'assistant',
                content: "Hi there! I'm Habiti AI. I see you're new here. Start by adding a habit you want to build!"
            });
        } else {
            // General greeting
            messages.push({
                role: 'assistant',
                content: `Hi ${req.user.username}! I've been analyzing your progress.`
            });

            // Analyze specific habits
            let strugglingHabits = [];
            let doingGreatHabits = [];

            habits.forEach(habit => {
                const habitLogs = logs.filter(l => l.habit_id === habit.id);
                const completedCount = habitLogs.filter(l => l.completed).length;

                if (completedCount <= 1) {
                    strugglingHabits.push(habit.title);
                } else if (completedCount >= 4) {
                    doingGreatHabits.push(habit.title);
                }
            });

            if (strugglingHabits.length > 0) {
                const habitName = strugglingHabits[0];
                messages.push({
                    role: 'assistant',
                    content: `I noticed you're struggling a bit with **${habitName}**. Try setting a smaller goal or attaching it to an existing habit (habit stacking)!`
                });
            }

            if (doingGreatHabits.length > 0) {
                const habitName = doingGreatHabits[0];
                messages.push({
                    role: 'assistant',
                    content: `You're doing excellent with **${habitName}**! Consistency is key, and you're nailing it.`
                });
            }

            // Motivation
            messages.push({
                role: 'assistant',
                content: "Remember, progress is not linear. Keep showing up!"
            });
        }

        res.json(messages);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/ask', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const lowerMsg = message.toLowerCase();
        const userId = req.user.id;

        // Fetch data context
        const habitsResult = await pool.query('SELECT * FROM habits WHERE user_id = $1', [userId]);
        const habits = habitsResult.rows;

        // Fetch broader logs for context (30 days)
        const logsResult = await pool.query(`
            SELECT hl.*, h.title 
            FROM habit_logs hl
            JOIN habits h ON hl.habit_id = h.id
            WHERE h.user_id = $1 
            AND hl.log_date >= CURRENT_DATE - INTERVAL '30 days'
        `, [userId]);
        const logs = logsResult.rows;

        let responseContent = "";

        // Simple Intent Recognition
        if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
            responseContent = "Hello! I'm here to help you stay on track. Ask me for a **summary**, **motivation**, or about a specific habit.";

        } else if (lowerMsg.includes('summary') || lowerMsg.includes('how am i doing') || lowerMsg.includes('stats')) {
            const totalLogs = logs.length;
            const completed = logs.filter(l => l.completed).length;
            const rate = totalLogs > 0 ? Math.round((completed / totalLogs) * 100) : 0;
            responseContent = `In the last 30 days, you've tracked **${totalLogs}** times with a **${rate}%** completion rate across all habits. Keep pushing!`;

        } else if (lowerMsg.includes('motivation') || lowerMsg.includes('inspire')) {
            const quotes = [
                "Success is the sum of small efforts, repeated day in and day out.",
                "The secret of your future is hidden in your daily routine.",
                "Don't watch the clock; do what it does. Keep going.",
                "You don't have to be great to start, but you have to start to be great."
            ];
            responseContent = quotes[Math.floor(Math.random() * quotes.length)];

        } else if (lowerMsg.includes('help')) {
            responseContent = "I can give you a **summary** of your progress, provide **motivation**, or tell you stats about specific habits (e.g., ask 'How is my Reading habit?').";

        } else {
            // Check for specific habit names in user input
            const foundHabit = habits.find(h => lowerMsg.includes(h.title.toLowerCase()));

            if (foundHabit) {
                const habitLogs = logs.filter(l => l.habit_id === foundHabit.id);
                const completedLast30 = habitLogs.filter(l => l.completed).length;
                const completedLast7 = habitLogs.filter(l => l.completed && new Date(l.log_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

                responseContent = `Creating the **${foundHabit.title}** habit looks good! You've done it **${completedLast30}** times in the last month (${completedLast7} times this week).`;
            } else {
                // Fallback
                responseContent = "I didn't quite catch that. Try asking for a **summary** or mention a specific habit by name.";
            }
        }

        // Simulate a small "thinking" delay for realism
        await new Promise(resolve => setTimeout(resolve, 600));

        res.json({ role: 'assistant', content: responseContent });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
