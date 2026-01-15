const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function migrate() {
    try {
        console.log("Starting migration...");

        // Add is_pro to users
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_pro') THEN
                    ALTER TABLE users ADD COLUMN is_pro BOOLEAN DEFAULT FALSE;
                END IF;
            END
            $$;
        `);
        console.log("Added is_pro to users.");

        // Add identity_goal to habits
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='habits' AND column_name='identity_goal') THEN
                    ALTER TABLE habits ADD COLUMN identity_goal VARCHAR(100);
                END IF;
            END
            $$;
        `);
        console.log("Added identity_goal to habits.");

        // Add is_admin to users
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_admin') THEN
                    ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
                END IF;
            END
            $$;
        `);
        console.log("Added is_admin to users.");

        console.log("Migration complete.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
