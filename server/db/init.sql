-- Database Schema for Habit Tracker
-- Run this file to set up the PostgreSQL database

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_pro BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    streak_freezes INTEGER DEFAULT 0,
    last_freeze_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    identity_goal VARCHAR(200),
    color VARCHAR(20) DEFAULT '#3B82F6',
    goal_frequency VARCHAR(20) DEFAULT 'daily',
    is_challenge BOOLEAN DEFAULT FALSE,
    challenge_days INTEGER DEFAULT 0,
    challenge_start_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habit_logs (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    notes TEXT,
    focus_minutes INTEGER DEFAULT 0,
    UNIQUE(habit_id, log_date)
);

CREATE TABLE IF NOT EXISTS journal_entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    content TEXT,
    mood VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, entry_date)
);

-- Focus Sessions Table (Pomodoro Timer)
CREATE TABLE IF NOT EXISTS focus_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    habit_id INTEGER REFERENCES habits(id) ON DELETE SET NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    duration_minutes INTEGER NOT NULL,
    session_type VARCHAR(20) DEFAULT 'focus', -- 'focus' or 'break'
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Achievements/Badges Table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    badge_description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_type)
);

-- Habit Templates Table
CREATE TABLE IF NOT EXISTS habit_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    habits JSONB NOT NULL, -- Array of habit objects
    is_premium BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Streak Freeze Logs
CREATE TABLE IF NOT EXISTS streak_freeze_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
    freeze_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_log_date ON habit_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_date ON focus_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- Insert Default Habit Templates
INSERT INTO habit_templates (name, description, category, habits, is_premium) VALUES
('Morning Champion', 'Start your day with energy and focus', 'Morning Routine', 
 '[{"title": "Wake up early", "identity_goal": "Be an Early Riser", "color": "#f59e0b"},
   {"title": "Drink water", "identity_goal": "Stay Hydrated", "color": "#3b82f6"},
   {"title": "5-minute meditation", "identity_goal": "Be Mindful", "color": "#8b5cf6"},
   {"title": "Exercise 15 min", "identity_goal": "Be Fit", "color": "#10b981"}]', false),

('Fitness Beast', 'Build the body you deserve', 'Health & Fitness',
 '[{"title": "Workout 30 min", "identity_goal": "Be an Athlete", "color": "#ef4444"},
   {"title": "10k steps", "identity_goal": "Stay Active", "color": "#f97316"},
   {"title": "Protein-rich meal", "identity_goal": "Eat Clean", "color": "#22c55e"},
   {"title": "Stretch routine", "identity_goal": "Be Flexible", "color": "#06b6d4"}]', false),

('Deep Work Master', 'Maximize your productivity', 'Productivity',
 '[{"title": "2-hour deep work", "identity_goal": "Be a Deep Worker", "color": "#6366f1"},
   {"title": "No social media", "identity_goal": "Be Focused", "color": "#ec4899"},
   {"title": "Plan tomorrow", "identity_goal": "Be Organized", "color": "#14b8a6"},
   {"title": "Learn 30 min", "identity_goal": "Be a Learner", "color": "#f59e0b"}]', true),

('Mindfulness Journey', 'Find peace and clarity', 'Mental Health',
 '[{"title": "10-min meditation", "identity_goal": "Be Present", "color": "#8b5cf6"},
   {"title": "Gratitude journal", "identity_goal": "Be Grateful", "color": "#f59e0b"},
   {"title": "Digital detox 1hr", "identity_goal": "Be Mindful", "color": "#06b6d4"},
   {"title": "Evening reflection", "identity_goal": "Be Self-Aware", "color": "#ec4899"}]', true),

('21-Day Challenge', 'Build a new habit in 21 days', 'Challenges',
 '[{"title": "Your Challenge Habit", "identity_goal": "Build Discipline", "color": "#ef4444", "is_challenge": true, "challenge_days": 21}]', false),

('66-Day Transformation', 'Make it automatic - the science-backed approach', 'Challenges',
 '[{"title": "Your Transformation Habit", "identity_goal": "Transform Your Life", "color": "#8b5cf6", "is_challenge": true, "challenge_days": 66}]', true)

ON CONFLICT DO NOTHING;
