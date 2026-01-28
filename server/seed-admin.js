const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function seedAdmin() {
    const username = 'admin';
    const password = 'habiti@admin';

    try {
        console.log(`🔒 Seeding admin user: ${username}`);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        const checkRes = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

        if (checkRes.rows.length > 0) {
            // Update existing user
            console.log('User exists. Updating credentials and role...');
            await pool.query(
                'UPDATE users SET password_hash = $1, is_admin = TRUE WHERE username = $2',
                [hashedPassword, username]
            );
            console.log('✅ Admin user updated successfully.');
        } else {
            // Create new user
            console.log('User does not exist. Creating new admin user...');
            await pool.query(
                'INSERT INTO users (username, password_hash, is_admin, is_pro) VALUES ($1, $2, TRUE, TRUE)',
                [username, hashedPassword]
            );
            console.log('✅ Admin user created successfully.');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding admin:', err);
        process.exit(1);
    }
}

seedAdmin();
