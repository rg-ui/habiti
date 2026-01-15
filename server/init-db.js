const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Connect to default 'postgres' database to create the new database if needed
const setupPool = new Pool({
    connectionString: process.env.DATABASE_URL.replace('/habiti', '/postgres')
});

async function init() {
    try {
        // 1. Create Database if not exists
        // Note: Cannot run CREATE DATABASE inside a transaction block, so we use a separate client or basic query.
        // Also PG doesn't support "CREATE DATABASE IF NOT EXISTS" easily in one query without a check.
        console.log("Checking database...");
        const res = await setupPool.query("SELECT 1 FROM pg_database WHERE datname = 'habiti'");
        if (res.rowCount === 0) {
            console.log("Creating database 'habiti'...");
            await setupPool.query('CREATE DATABASE habiti');
        } else {
            console.log("Database 'habiti' already exists.");
        }
        await setupPool.end();

        // 2. Connect to 'habiti' database
        const dbPool = new Pool({
            connectionString: process.env.DATABASE_URL
        });

        // 3. Run Schema
        console.log("Running schema...");
        const schema = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
        console.log("Schema length:", schema.length);
        const schemaRes = await dbPool.query(schema);
        console.log("Schema applied successfully. Result:", schemaRes);
        await dbPool.end();

    } catch (err) {
        console.error("Error initializing database:", err);
    }
}

init();
