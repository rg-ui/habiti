const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });


async function init() {
    try {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            console.error("DATABASE_URL is not defined in .env");
            process.exit(1);
        }

        const url = new URL(dbUrl);
        const dbName = url.pathname.split('/')[1]; // e.g. 'habiti' or 'postgres'

        console.log(`Target database: ${dbName}`);

        // If target is NOT 'postgres', we might need to create it.
        // We connect to 'postgres' database to perform creation.
        if (dbName !== 'postgres') {
            const postgresUrl = new URL(dbUrl);
            postgresUrl.pathname = '/postgres';

            const setupPool = new Pool({
                connectionString: postgresUrl.toString()
            });

            console.log("Checking database...");
            const res = await setupPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

            if (res.rowCount === 0) {
                console.log(`Creating database '${dbName}'...`);
                // Parameterized queries don't work for identifiers like database names in CREATE DATABASE
                await setupPool.query(`CREATE DATABASE "${dbName}"`);
                console.log(`Database '${dbName}' created.`);
            } else {
                console.log(`Database '${dbName}' already exists.`);
            }
            await setupPool.end();
        } else {
            console.log("Target database is 'postgres', skipping creation step.");
        }

        // 2. Connect to the target database
        const dbPool = new Pool({
            connectionString: dbUrl,
            ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false }
        });

        // 3. Run Schema
        console.log("Running schema...");
        const schemaPath = path.join(__dirname, '../schema.sql');
        if (fs.existsSync(schemaPath)) { // Check if schema file exists
            const schema = fs.readFileSync(schemaPath, 'utf8');
            console.log("Schema length:", schema.length);
            const schemaRes = await dbPool.query(schema);
            console.log("Schema applied successfully.");
        } else {
            console.log("Schema file not found at " + schemaPath + ", skipping or checking db folder.");
            // It seems the user might have schema in db/init.sql based on file list
            const initSqlPath = path.join(__dirname, 'db/init.sql');
            if (fs.existsSync(initSqlPath)) {
                const schema = fs.readFileSync(initSqlPath, 'utf8');
                console.log("Found schema at db/init.sql. Applying...");
                await dbPool.query(schema);
                console.log("Schema applied successfully.");
            } else {
                console.warn("No schema file found!");
            }
        }

        await dbPool.end();
        console.log("Initialization complete.");

    } catch (err) {
        console.error("Error initializing database:", err);
        process.exit(1);
    }
}

init();
