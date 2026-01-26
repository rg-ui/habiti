const pool = require('./db');

async function migrate() {
    try {
        console.log('🚀 Running database migrations...\n');

        // 1. Add identity_goal column if it doesn't exist
        await addColumnIfNotExists('habits', 'identity_goal', 'VARCHAR(200)');

        // 2. Add challenge columns to habits
        await addColumnIfNotExists('habits', 'is_challenge', 'BOOLEAN DEFAULT FALSE');
        await addColumnIfNotExists('habits', 'challenge_days', 'INTEGER DEFAULT 0');
        await addColumnIfNotExists('habits', 'challenge_start_date', 'DATE');

        // 3. Add focus_minutes to habit_logs
        await addColumnIfNotExists('habit_logs', 'focus_minutes', 'INTEGER DEFAULT 0');

        // 4. Add streak freeze columns to users
        await addColumnIfNotExists('users', 'streak_freezes', 'INTEGER DEFAULT 0');
        await addColumnIfNotExists('users', 'last_freeze_date', 'DATE');

        // 5. Create focus_sessions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS focus_sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                habit_id INTEGER REFERENCES habits(id) ON DELETE SET NULL,
                session_date DATE NOT NULL DEFAULT CURRENT_DATE,
                duration_minutes INTEGER NOT NULL,
                session_type VARCHAR(20) DEFAULT 'focus',
                completed BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ focus_sessions table ready');

        // 6. Create achievements table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS achievements (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                badge_type VARCHAR(50) NOT NULL,
                badge_name VARCHAR(100) NOT NULL,
                badge_description TEXT,
                earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, badge_type)
            )
        `);
        console.log('✓ achievements table ready');

        // 7. Create habit_templates table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS habit_templates (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                category VARCHAR(50) NOT NULL,
                habits JSONB NOT NULL,
                is_premium BOOLEAN DEFAULT FALSE,
                usage_count INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ habit_templates table ready');

        // 8. Create streak_freeze_logs table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS streak_freeze_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
                freeze_date DATE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ streak_freeze_logs table ready');

        // 8b. Create user_freezes table for Pro streak freeze feature
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_freezes (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
                freezes_available INTEGER DEFAULT 0,
                freezes_used_this_month INTEGER DEFAULT 0,
                last_freeze_reset TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✓ user_freezes table ready');

        // 8c. Create streak_freeze_log table for tracking individual freeze uses
        await pool.query(`
            CREATE TABLE IF NOT EXISTS streak_freeze_log (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                freeze_date DATE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, freeze_date)
            )
        `);
        console.log('✓ streak_freeze_log table ready');

        // 9. Create indexes
        const indexes = [
            { name: 'idx_habits_user_id', query: 'CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id)' },
            { name: 'idx_habit_logs_habit_id', query: 'CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id)' },
            { name: 'idx_habit_logs_log_date', query: 'CREATE INDEX IF NOT EXISTS idx_habit_logs_log_date ON habit_logs(log_date)' },
            { name: 'idx_focus_sessions_user_id', query: 'CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id)' },
            { name: 'idx_focus_sessions_date', query: 'CREATE INDEX IF NOT EXISTS idx_focus_sessions_date ON focus_sessions(session_date)' },
            { name: 'idx_achievements_user_id', query: 'CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id)' },
        ];

        console.log('\nCreating indexes...');
        for (const idx of indexes) {
            await pool.query(idx.query);
            console.log(`✓ ${idx.name}`);
        }

        // 10. Insert default habit templates
        console.log('\nSeeding habit templates...');
        await seedTemplates();

        console.log('\n✅ All migrations completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

async function addColumnIfNotExists(table, column, definition) {
    const result = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = $2
    `, [table, column]);

    if (result.rows.length === 0) {
        await pool.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        console.log(`✓ Added ${column} to ${table}`);
    } else {
        console.log(`  ${column} already exists in ${table}`);
    }
}

async function seedTemplates() {
    const templates = [
        {
            name: 'Morning Champion',
            description: 'Start your day with energy and focus',
            category: 'Morning Routine',
            habits: [
                { title: 'Wake up early', identity_goal: 'Be an Early Riser', color: '#f59e0b' },
                { title: 'Drink water', identity_goal: 'Stay Hydrated', color: '#3b82f6' },
                { title: '5-minute meditation', identity_goal: 'Be Mindful', color: '#8b5cf6' },
                { title: 'Exercise 15 min', identity_goal: 'Be Fit', color: '#10b981' }
            ],
            is_premium: false
        },
        {
            name: 'Fitness Beast',
            description: 'Build the body you deserve',
            category: 'Health & Fitness',
            habits: [
                { title: 'Workout 30 min', identity_goal: 'Be an Athlete', color: '#ef4444' },
                { title: '10k steps', identity_goal: 'Stay Active', color: '#f97316' },
                { title: 'Protein-rich meal', identity_goal: 'Eat Clean', color: '#22c55e' },
                { title: 'Stretch routine', identity_goal: 'Be Flexible', color: '#06b6d4' }
            ],
            is_premium: false
        },
        {
            name: 'Deep Work Master',
            description: 'Maximize your productivity',
            category: 'Productivity',
            habits: [
                { title: '2-hour deep work', identity_goal: 'Be a Deep Worker', color: '#6366f1' },
                { title: 'No social media', identity_goal: 'Be Focused', color: '#ec4899' },
                { title: 'Plan tomorrow', identity_goal: 'Be Organized', color: '#14b8a6' },
                { title: 'Learn 30 min', identity_goal: 'Be a Learner', color: '#f59e0b' }
            ],
            is_premium: true
        },
        {
            name: 'Mindfulness Journey',
            description: 'Find peace and clarity',
            category: 'Mental Health',
            habits: [
                { title: '10-min meditation', identity_goal: 'Be Present', color: '#8b5cf6' },
                { title: 'Gratitude journal', identity_goal: 'Be Grateful', color: '#f59e0b' },
                { title: 'Digital detox 1hr', identity_goal: 'Be Mindful', color: '#06b6d4' },
                { title: 'Evening reflection', identity_goal: 'Be Self-Aware', color: '#ec4899' }
            ],
            is_premium: true
        },
        {
            name: '21-Day Challenge',
            description: 'Build a new habit in 21 days',
            category: 'Challenges',
            habits: [
                { title: 'Your Challenge Habit', identity_goal: 'Build Discipline', color: '#ef4444', is_challenge: true, challenge_days: 21 }
            ],
            is_premium: false
        },
        {
            name: '66-Day Transformation',
            description: 'Make it automatic - the science-backed approach',
            category: 'Challenges',
            habits: [
                { title: 'Your Transformation Habit', identity_goal: 'Transform Your Life', color: '#8b5cf6', is_challenge: true, challenge_days: 66 }
            ],
            is_premium: true
        }
    ];

    for (const template of templates) {
        try {
            await pool.query(`
                INSERT INTO habit_templates (name, description, category, habits, is_premium)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT DO NOTHING
            `, [template.name, template.description, template.category, JSON.stringify(template.habits), template.is_premium]);
            console.log(`  ✓ ${template.name}`);
        } catch (err) {
            console.log(`  Template ${template.name} may already exist`);
        }
    }
}

migrate();
