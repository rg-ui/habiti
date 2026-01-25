const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Motivational Quotes Database - Organized by Theme
const QUOTES = {
    morning: [
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "Every morning brings new potential. Don't waste it.", author: "Harvey Mackay" },
        { text: "Today is a new day. Don't let your history interfere with your destiny.", author: "Steve Maraboli" },
        { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
    ],
    streak: [
        { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
        { text: "Consistency is what transforms average into excellence.", author: "Unknown" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
        { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
    ],
    motivation: [
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
        { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "Motivation gets you started. Habit keeps you going.", author: "Jim Rohn" },
    ],
    struggling: [
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { text: "Failure is simply the opportunity to begin again, this time more intelligently.", author: "Henry Ford" },
        { text: "The comeback is always stronger than the setback.", author: "Unknown" },
        { text: "Every expert was once a beginner. Every pro was once an amateur.", author: "Robin Sharma" },
        { text: "Progress, not perfection, is what we should be asking of ourselves.", author: "Julia Cameron" },
    ],
    celebration: [
        { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
        { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
        { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    ],
    identity: [
        { text: "We become what we repeatedly do.", author: "Sean Covey" },
        { text: "Your identity is not defined by your past. It's built by your daily choices.", author: "James Clear" },
        { text: "The person who you will be in 5 years is based on the habits you build today.", author: "Unknown" },
        { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear" },
    ]
};

// Get personalized tips based on user data
const generatePersonalizedTips = (userData) => {
    const tips = [];
    const { habits, completions, currentStreak, longestStreak, todayCompleted, totalHabits, recentMood, focusMinutes } = userData;

    // Time-based greetings
    const hour = new Date().getHours();
    if (hour < 12) {
        tips.push("🌅 Good morning! Morning is the best time to build habits. Start strong today!");
    } else if (hour < 17) {
        tips.push("☀️ Good afternoon! You still have time to make today count.");
    } else {
        tips.push("🌙 Good evening! Reflect on your wins today and prepare for tomorrow.");
    }

    // Based on completions
    if (todayCompleted === 0 && totalHabits > 0) {
        tips.push("💪 You haven't checked any habits yet today. Start with the easiest one to build momentum!");
    } else if (todayCompleted === totalHabits && totalHabits > 0) {
        tips.push("🎉 Amazing! You've completed ALL your habits today! You're building the identity you want.");
    } else if (todayCompleted > 0) {
        tips.push(`✨ Great progress! You've completed ${todayCompleted}/${totalHabits} habits today. Keep going!`);
    }

    // Streak-based advice
    if (currentStreak >= 7) {
        tips.push(`🔥 Incredible ${currentStreak}-day streak! You're in the habit-forming zone. Don't break it!`);
    } else if (currentStreak >= 3) {
        tips.push(`⚡ ${currentStreak} days strong! After 3 days, your brain starts expecting this behavior. Keep it up!`);
    } else if (currentStreak === 0 && longestStreak > 0) {
        tips.push(`🌱 Your best streak was ${longestStreak} days. Today is a great day to start a new one!`);
    }

    // Focus minutes advice
    if (focusMinutes > 60) {
        tips.push(`🧠 You've done ${focusMinutes} minutes of focused work today! Deep work builds deep results.`);
    } else if (focusMinutes > 0) {
        tips.push(`⏱️ ${focusMinutes} minutes of focus logged. Try adding one more Pomodoro session!`);
    }

    // Habit-specific advice
    if (habits && habits.length > 0) {
        const randomHabit = habits[Math.floor(Math.random() * habits.length)];
        if (randomHabit.identity_goal) {
            tips.push(`🎯 Remember: Every time you ${randomHabit.title.toLowerCase()}, you're becoming "${randomHabit.identity_goal}".`);
        }
    }

    // Mood-based advice
    if (recentMood === 'sad' || recentMood === 'stressed') {
        tips.push("🫂 I notice you've been feeling down. Start with just ONE tiny habit today. Small wins lead to big changes.");
    } else if (recentMood === 'energetic') {
        tips.push("⚡ You're feeling energetic! This is the perfect time to tackle your hardest habit.");
    }

    return tips;
};

// Get a random quote based on user's situation
const getPersonalizedQuote = (userData) => {
    const { currentStreak, todayCompleted, totalHabits } = userData;

    let category = 'motivation';

    const hour = new Date().getHours();
    if (hour < 10) {
        category = 'morning';
    } else if (todayCompleted === totalHabits && totalHabits > 0) {
        category = 'celebration';
    } else if (currentStreak >= 7) {
        category = 'streak';
    } else if (todayCompleted === 0 && totalHabits > 0) {
        category = 'struggling';
    } else if (Math.random() > 0.5) {
        category = 'identity';
    }

    const quotes = QUOTES[category];
    return quotes[Math.floor(Math.random() * quotes.length)];
};

// Get user's habit data for personalization
const getUserData = async (userId) => {
    const today = new Date().toISOString().split('T')[0];

    // Get habits
    const habitsResult = await pool.query(
        'SELECT * FROM habits WHERE user_id = $1', [userId]
    );

    // Get today's completions
    const todayResult = await pool.query(`
        SELECT COUNT(*) FROM habit_logs hl
        JOIN habits h ON hl.habit_id = h.id
        WHERE h.user_id = $1 AND hl.log_date = $2 AND hl.completed = true
    `, [userId, today]);

    // Get total completions
    const totalResult = await pool.query(`
        SELECT COUNT(*) FROM habit_logs hl
        JOIN habits h ON hl.habit_id = h.id
        WHERE h.user_id = $1 AND hl.completed = true
    `, [userId]);

    // Calculate current streak (simplified)
    const streakResult = await pool.query(`
        SELECT COUNT(DISTINCT log_date) as streak FROM habit_logs hl
        JOIN habits h ON hl.habit_id = h.id
        WHERE h.user_id = $1 
        AND hl.completed = true
        AND log_date >= CURRENT_DATE - INTERVAL '30 days'
    `, [userId]);

    // Get recent mood
    const moodResult = await pool.query(
        'SELECT mood FROM journal_entries WHERE user_id = $1 ORDER BY entry_date DESC LIMIT 1',
        [userId]
    );

    // Get today's focus minutes
    const focusResult = await pool.query(`
        SELECT COALESCE(SUM(duration_minutes), 0) as minutes
        FROM focus_sessions
        WHERE user_id = $1 AND session_date = CURRENT_DATE
    `, [userId]);

    return {
        habits: habitsResult.rows,
        totalHabits: habitsResult.rows.length,
        todayCompleted: parseInt(todayResult.rows[0].count),
        totalCompletions: parseInt(totalResult.rows[0].count),
        currentStreak: parseInt(streakResult.rows[0]?.streak || 0),
        longestStreak: parseInt(streakResult.rows[0]?.streak || 0), // Simplified
        recentMood: moodResult.rows[0]?.mood || null,
        focusMinutes: parseInt(focusResult.rows[0]?.minutes || 0),
    };
};

// Get daily quote
router.get('/daily-quote', authenticateToken, async (req, res) => {
    try {
        const userData = await getUserData(req.user.id);
        const quote = getPersonalizedQuote(userData);

        res.json({
            quote: quote.text,
            author: quote.author,
            category: 'daily',
        });
    } catch (err) {
        console.error('Error getting daily quote:', err);
        res.status(500).json({ error: 'Failed to get quote' });
    }
});

// Get personalized tips
router.get('/tips', authenticateToken, async (req, res) => {
    try {
        const userData = await getUserData(req.user.id);
        const tips = generatePersonalizedTips(userData);
        const quote = getPersonalizedQuote(userData);

        res.json({
            tips,
            quote: {
                text: quote.text,
                author: quote.author
            },
            stats: {
                todayCompleted: userData.todayCompleted,
                totalHabits: userData.totalHabits,
                currentStreak: userData.currentStreak,
                focusMinutes: userData.focusMinutes,
            }
        });
    } catch (err) {
        console.error('Error getting tips:', err);
        res.status(500).json({ error: 'Failed to get tips' });
    }
});

// Chat with AI mentor
router.post('/ask', authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        const userData = await getUserData(req.user.id);
        const lowerMessage = message.toLowerCase();

        let response = '';

        // Context-aware responses based on user question
        if (lowerMessage.includes('motivat') || lowerMessage.includes('inspire') || lowerMessage.includes('quote')) {
            const quote = getPersonalizedQuote(userData);
            response = `Here's something to inspire you:\n\n"${quote.text}"\n— ${quote.author}\n\nRemember, you're building the identity you want, one day at a time. 💪`;
        }
        else if (lowerMessage.includes('progress') || lowerMessage.includes('how am i doing') || lowerMessage.includes('stats')) {
            const percentage = userData.totalHabits > 0
                ? Math.round((userData.todayCompleted / userData.totalHabits) * 100)
                : 0;

            response = `📊 **Your Progress Report**\n\n`;
            response += `• Today: ${userData.todayCompleted}/${userData.totalHabits} habits completed (${percentage}%)\n`;
            response += `• Active streak: ${userData.currentStreak} days\n`;
            response += `• Focus time today: ${userData.focusMinutes} minutes\n`;
            response += `• Total completions: ${userData.totalCompletions}\n\n`;

            if (percentage === 100) {
                response += `🎉 Perfect day! You're absolutely crushing it!`;
            } else if (percentage >= 50) {
                response += `💪 Great progress! Finish strong today!`;
            } else {
                response += `🌱 Every habit you complete is a win. Start with just one!`;
            }
        }
        else if (lowerMessage.includes('streak') || lowerMessage.includes('consistent')) {
            if (userData.currentStreak >= 7) {
                response = `🔥 You're on a ${userData.currentStreak}-day streak! That's incredible!\n\n`;
                response += `After 21 days, habits become easier. After 66 days, they become automatic.\n\n`;
                response += `You're building momentum that's hard to stop. Keep going!`;
            } else if (userData.currentStreak >= 3) {
                response = `⚡ ${userData.currentStreak} days and counting!\n\n`;
                response += `The first week is the hardest. You're proving you can do this.\n\n`;
                response += `Pro tip: Never miss twice in a row. One bad day is fine, two starts a pattern.`;
            } else {
                response = `🌱 Every streak starts at day 1.\n\n`;
                response += `The key isn't motivation—it's showing up even when you don't feel like it.\n\n`;
                response += `What's ONE habit you can do right now? Start there.`;
            }
        }
        else if (lowerMessage.includes('struggling') || lowerMessage.includes('hard') || lowerMessage.includes('difficult') || lowerMessage.includes('help')) {
            response = `🫂 I hear you. Building habits is hard, especially at the beginning.\n\n`;
            response += `Here's what I suggest:\n\n`;
            response += `1. **Make it tiny**: Can't do 30 minutes? Do 2 minutes.\n`;
            response += `2. **Stack it**: Attach your habit to something you already do.\n`;
            response += `3. **Remove friction**: Make the habit as easy as possible to start.\n\n`;
            response += `Remember: You don't rise to the level of your goals. You fall to the level of your systems.\n\n`;
            response += `What's the smallest version of your habit you could do right now?`;
        }
        else if (lowerMessage.includes('habit') && (lowerMessage.includes('start') || lowerMessage.includes('new') || lowerMessage.includes('begin'))) {
            response = `🎯 Starting a new habit? Here's the proven formula:\n\n`;
            response += `**1. Choose an Identity Goal**\n`;
            response += `   Don't say "I want to run." Say "I want to become a runner."\n\n`;
            response += `**2. Start Incredibly Small**\n`;
            response += `   Instead of "run 5km," start with "put on running shoes."\n\n`;
            response += `**3. Never Miss Twice**\n`;
            response += `   Bad days happen. Just don't let one bad day become two.\n\n`;
            response += `**4. Celebrate**\n`;
            response += `   Every check-in is a vote for your new identity. Feel good about it!\n\n`;
            response += `What identity are you trying to build?`;
        }
        else if (lowerMessage.includes('identity') || lowerMessage.includes('who i am') || lowerMessage.includes('become')) {
            response = `🦋 **Identity-Based Habits**\n\n`;
            response += `The most powerful way to change is to focus on WHO you wish to become, not WHAT you want to achieve.\n\n`;

            if (userData.habits.length > 0) {
                const habitWithIdentity = userData.habits.find(h => h.identity_goal);
                if (habitWithIdentity) {
                    response += `You're working toward becoming "${habitWithIdentity.identity_goal}" through your habit "${habitWithIdentity.title}".\n\n`;
                }
            }

            response += `Every action you take is a vote for the type of person you wish to become.\n\n`;
            response += `With ${userData.totalCompletions} habit completions, you've already cast ${userData.totalCompletions} votes for your new identity. Keep voting! 🗳️`;
        }
        else if (lowerMessage.includes('focus') || lowerMessage.includes('pomodoro') || lowerMessage.includes('productivity')) {
            response = `🧠 **Deep Work Tips**\n\n`;
            response += `You've logged ${userData.focusMinutes} minutes of focus today.\n\n`;
            response += `Here's how to maximize your focus sessions:\n\n`;
            response += `1. **25-5 Rule**: 25 min focus, 5 min break.\n`;
            response += `2. **Environment**: Remove phone from sight.\n`;
            response += `3. **One Thing**: Focus on a single task.\n`;
            response += `4. **Energy**: Work with your energy, not against it.\n\n`;
            response += `Pro tip: Link your focus sessions to specific habits for better tracking!`;
        }
        else if (lowerMessage.includes('morning') || lowerMessage.includes('routine')) {
            response = `🌅 **Morning Routine Tips**\n\n`;
            response += `A strong morning sets up a strong day:\n\n`;
            response += `1. **Wake up at the same time** (even weekends)\n`;
            response += `2. **Avoid phone for first 30 min**\n`;
            response += `3. **Hydrate immediately**\n`;
            response += `4. **Do your hardest habit first**\n\n`;
            response += `The morning is when willpower is highest. Use it wisely!\n\n`;
            response += `Check out our "Morning Champion" template for a complete morning routine.`;
        }
        else if (lowerMessage.includes('thank') || lowerMessage.includes('good')) {
            response = `You're welcome! 😊\n\nRemember, I'm here whenever you need motivation, advice, or just someone to talk to about your journey.\n\nKeep building those habits! 💪`;
        }
        else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

            response = `${greeting}! 👋\n\nI'm your personal habit coach. I'm here to help you:\n\n`;
            response += `• Get personalized motivation\n`;
            response += `• Track your progress\n`;
            response += `• Overcome struggles\n`;
            response += `• Build better habits\n\n`;
            response += `You have ${userData.totalHabits} habits and ${userData.todayCompleted} completed today.\n\n`;
            response += `What can I help you with?`;
        }
        else {
            // Default personalized response
            const tips = generatePersonalizedTips(userData);
            const quote = getPersonalizedQuote(userData);

            response = `💡 Here's my advice for you today:\n\n`;
            response += tips.slice(0, 2).join('\n\n');
            response += `\n\n---\n\n`;
            response += `"${quote.text}"\n— ${quote.author}`;
        }

        res.json({
            response,
            userData: {
                todayCompleted: userData.todayCompleted,
                totalHabits: userData.totalHabits,
                streak: userData.currentStreak
            }
        });
    } catch (err) {
        console.error('Error in chat:', err);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

// Get mentoring insights
router.get('/insights', authenticateToken, async (req, res) => {
    try {
        const userData = await getUserData(req.user.id);
        const insights = [];

        // Personalized insights based on data
        if (userData.currentStreak >= 21) {
            insights.push({
                type: 'celebration',
                icon: '🏆',
                title: 'Habit Formed!',
                message: `With ${userData.currentStreak} days, your habit is becoming automatic!`
            });
        }

        if (userData.todayCompleted === userData.totalHabits && userData.totalHabits > 0) {
            insights.push({
                type: 'achievement',
                icon: '⭐',
                title: 'Perfect Day!',
                message: 'You completed all your habits today. Amazing discipline!'
            });
        }

        if (userData.focusMinutes >= 90) {
            insights.push({
                type: 'focus',
                icon: '🧠',
                title: 'Deep Work Master',
                message: `${userData.focusMinutes} minutes of focused work today. You're in the zone!`
            });
        }

        // Add a daily tip
        const tips = generatePersonalizedTips(userData);
        if (tips.length > 0) {
            insights.push({
                type: 'tip',
                icon: '💡',
                title: 'Daily Tip',
                message: tips[Math.floor(Math.random() * tips.length)]
            });
        }

        // Add quote
        const quote = getPersonalizedQuote(userData);
        insights.push({
            type: 'quote',
            icon: '✨',
            title: 'Daily Inspiration',
            message: `"${quote.text}" — ${quote.author}`
        });

        res.json({ insights });
    } catch (err) {
        console.error('Error getting insights:', err);
        res.status(500).json({ error: 'Failed to get insights' });
    }
});

module.exports = router;
