const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function makeAdmin(username) {
    try {
        if (!username) {
            console.error("Please provide a username. Usage: node make-admin.js <username>");
            process.exit(1);
        }

        const res = await pool.query(
            "UPDATE users SET is_admin = TRUE WHERE username = $1 RETURNING id, username, is_admin",
            [username]
        );

        if (res.rows.length === 0) {
            console.error(`User '${username}' not found.`);
        } else {
            console.log(`User '${username}' is now an admin.`);
            console.log(res.rows[0]);
        }
        await pool.end();
    } catch (err) {
        console.error("Error:", err);
        await pool.end();
    }
}

const args = process.argv.slice(2);
makeAdmin(args[0]);
