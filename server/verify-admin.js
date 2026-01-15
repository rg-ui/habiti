const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkAdmin() {
    try {
        const username = 'admin';
        const res = await pool.query("SELECT id, username, is_admin FROM users WHERE username = $1", [username]);

        if (res.rows.length === 0) {
            console.log(`User '${username}' NOT FOUND.`);
        } else {
            console.log(`User '${username}' found:`, res.rows[0]);
        }

        await pool.end();
    } catch (err) {
        console.error("Error:", err);
        await pool.end();
    }
}

checkAdmin();
