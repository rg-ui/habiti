const pool = require('./db');

async function migrate() {
    try {
        console.log('Running migrations...\n');

        // Add identity_goal column if it doesn't exist
        const result = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'habits' AND column_name = 'identity_goal'
        `);

        if (result.rows.length === 0) {
            console.log('Adding identity_goal column to habits table...');
            await pool.query(`
                ALTER TABLE habits 
                ADD COLUMN identity_goal VARCHAR(200)
            `);
            console.log('✓ Added identity_goal column');
        } else {
            console.log('✓ identity_goal column already exists');
        }

        // Create indexes if they don't exist
        console.log('\nCreating indexes...');

        const indexes = [
            { name: 'idx_habits_user_id', query: 'CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id)' },
            { name: 'idx_habit_logs_habit_id', query: 'CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id)' },
            { name: 'idx_habit_logs_log_date', query: 'CREATE INDEX IF NOT EXISTS idx_habit_logs_log_date ON habit_logs(log_date)' },
            { name: 'idx_journal_entries_user_id', query: 'CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id)' },
            { name: 'idx_journal_entries_date', query: 'CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(entry_date)' },
        ];

        for (const idx of indexes) {
            try {
                await pool.query(idx.query);
                console.log(`✓ Index ${idx.name} ready`);
            } catch (err) {
                console.log(`  Index ${idx.name} may already exist`);
            }
        }

        console.log('\n✅ All migrations completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
