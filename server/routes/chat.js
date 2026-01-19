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

        // Calculate detailed stats
        const totalHabits = habits.length;
        const totalLogs = logs.length;
        const totalCompleted = logs.filter(l => l.completed).length;

        // Calculate stats per habit
        const habitStats = habits.map(habit => {
            const habitLogs = logs.filter(l => l.habit_id === habit.id);
            const completions = habitLogs.filter(l => l.completed).length;
            return {
                title: habit.title,
                completions,
                // Simple streak calculation (consecutive days looking back from today)
                // Note: This is a basic estimation based on available logs
                isActive: completions > 0
            };
        });

        // Sort by completions to find best/worst
        habitStats.sort((a, b) => b.completions - a.completions);
        const bestHabit = habitStats[0];
        const activeHabits = habitStats.filter(h => h.completions > 0);
        const worstHabit = activeHabits.length > 0 ? activeHabits[activeHabits.length - 1] : null;



        // Simple Intent Recognition
        if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
            responseContent = `Hello! I'm here to analyze your performance. Ask me for a **performance report**, **summary**, or about a specific habit like "**${habits[0]?.title || 'Reading'}**".`;

        } else if (lowerMsg.includes('performance') || lowerMsg.includes('analysis') || lowerMsg.includes('report')) {
            if (totalHabits === 0) {
                responseContent = "You haven't set up any habits yet. Go to the Dashboard to create one!";
            } else {
                responseContent = `📊 **Performance Report (Last 30 Days)**<br/><br/>`;

                if (bestHabit && bestHabit.completions > 0) {
                    responseContent += `🏆 **Top Habit**: **${bestHabit.title}** is your strongest habit with **${bestHabit.completions}** completions.<br/>`;
                }

                if (worstHabit && worstHabit !== bestHabit) {
                    responseContent += `⚠️ **Needs Focus**: **${worstHabit.title}** is lagging behind with **${worstHabit.completions}** completions.<br/>`;
                }

                const unusedHabits = habitStats.filter(h => h.completions === 0);
                if (unusedHabits.length > 0) {
                    responseContent += `💤 **Inactive**: You haven't logged **${unusedHabits[0].title}** ${unusedHabits.length > 1 ? `and ${unusedHabits.length - 1} others` : ''} recently.<br/>`;
                }

                responseContent += `<br/>Overall, you're maintaining **${activeHabits.length}** active habits. Keep it up!`;
            }

        } else if (lowerMsg.includes('summary') || lowerMsg.includes('how am i doing') || lowerMsg.includes('stats') || lowerMsg.includes('progress')) {
            const avgCompletions = totalHabits > 0 ? (totalCompleted / totalHabits).toFixed(1) : 0;

            responseContent = `📝 **Monthly Summary**<br/>`;
            responseContent += `You've tracked a total of **${totalLogs}** activities in the last 30 days.<br/><br/>`;
            responseContent += `• **Total Completions**: ${totalCompleted}<br/>`;
            responseContent += `• **Avg per Habit**: ${avgCompletions}<br/>`;

            if (totalCompleted > 20) {
                responseContent += `<br/>🔥 You are on a roll! Your consistency is impressive.`;
            } else if (totalCompleted > 0) {
                responseContent += `<br/>🌱 You're building momentum. Great start!`;
            } else {
                responseContent += `<br/>Let's get started today! log your first habit.`;
            }

        } else if (lowerMsg.includes('motivation') || lowerMsg.includes('inspire')) {
            const quotes = [
                "Success is the sum of small efforts, repeated day in and day out.",
                "The secret of your future is hidden in your daily routine.",
                "Don't watch the clock; do what it does. Keep going.",
                "You don't have to be great to start, but you have to start to be great.",
                "Small habits, when performed consistently, lead to massive results."
            ];
            responseContent = quotes[Math.floor(Math.random() * quotes.length)];

        } else if (lowerMsg.includes('what is habiti') || lowerMsg.includes('about this app') || lowerMsg.includes('who are you')) {
            responseContent = "I'm **Habiti AI**, your personal growth companion. My goal is to help you build better habits, track your progress, and stay consistent on your journey to a better you.";

        } else if (lowerMsg.includes('how to create') || lowerMsg.includes('add habit') || lowerMsg.includes('new habit')) {
            responseContent = "To create a new habit, go to your **Dashboard** and look for the card with the **'+'** icon. meaningful title, choose a color, and you're set!";

        } else if (lowerMsg.includes('how to delete') || lowerMsg.includes('remove habit')) {
            responseContent = "You can manage your habits in the **Dashboard**. Look for the settings or edit option on the specific habit card you wish to remove.";

        } else if (lowerMsg.includes('why') && lowerMsg.includes('habit')) {
            responseContent = "Habits are the compound interest of self-improvement. Building good habits allows you to reach your goals on autopilot, freeing up mental energy for deeper work.";

        } else if (lowerMsg.includes('tip') || lowerMsg.includes('advice') || lowerMsg.includes('start')) {
            const tips = [
                "**Start Small**: Don't try to change everything at once. Pick one tiny habit and master it.",
                "**Two-Minute Rule**: If a new habit takes less than two minutes to do, do it right now.",
                "**Habit Stacking**: Attach your new habit to a current one. 'After I pour my coffee, I will meditate for 1 minute.'",
                "**Never Miss Twice**: If you miss a day, that's okay. Just don't miss two days in a row."
            ];
            responseContent = tips[Math.floor(Math.random() * tips.length)];

        } else if (lowerMsg.includes('help')) {
            responseContent = "I can analyze your data or answer basic questions. Try asking:<br/>• **How is my performance?**<br/>• **How to add a habit?**<br/>• **Give me a tip**<br/>• **What is Habiti?**";


        } else {
            // Check for specific habit names in user input
            const foundHabit = habits.find(h => lowerMsg.includes(h.title.toLowerCase()));

            if (foundHabit) {
                const habitLogs = logs.filter(l => l.habit_id === foundHabit.id);
                const completedLast30 = habitLogs.filter(l => l.completed).length;
                const completedLast7 = habitLogs.filter(l => l.completed && new Date(l.log_date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

                responseContent = `🔍 **${foundHabit.title} Analysis**<br/>`;
                responseContent += `• Last 30 Days: **${completedLast30}** times<br/>`;
                responseContent += `• Last 7 Days: **${completedLast7}** times<br/><br/>`;

                if (completedLast7 >= 5) {
                    responseContent += "You're crushing this habit! 🌟";
                } else if (completedLast7 >= 1) {
                    responseContent += "Good consistency. Try to increase frequency next week! 📈";
                } else {
                    responseContent += "Let's try to get back on track with this one. You got this! 💪";
                }
            } else {
                // Fallback
                responseContent = "I'm not sure which habit you mean. Try asking for a **performance report** or mention a specific habit name.";
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
