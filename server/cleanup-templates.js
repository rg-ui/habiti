const pool = require('./db');

async function cleanupDuplicates() {
    try {
        console.log('🧹 Checking for duplicate templates...\n');

        // Find duplicates by name
        const duplicates = await pool.query(`
            SELECT name, COUNT(*) as count, array_agg(id ORDER BY id) as ids
            FROM habit_templates
            GROUP BY name
            HAVING COUNT(*) > 1
        `);

        if (duplicates.rows.length === 0) {
            console.log('✓ No duplicate templates found!');
        } else {
            console.log(`Found ${duplicates.rows.length} template(s) with duplicates:\n`);

            for (const dup of duplicates.rows) {
                console.log(`  "${dup.name}" - ${dup.count} copies (IDs: ${dup.ids.join(', ')})`);

                // Keep the first one (lowest ID), delete the rest
                const idsToDelete = dup.ids.slice(1);
                await pool.query(`DELETE FROM habit_templates WHERE id = ANY($1)`, [idsToDelete]);
                console.log(`    ✓ Deleted duplicate IDs: ${idsToDelete.join(', ')}`);
            }
            console.log('\n✅ Duplicate cleanup complete!');
        }

        // Show current templates
        console.log('\n📋 Current templates in database:\n');
        const templates = await pool.query(`
            SELECT id, name, category, is_premium 
            FROM habit_templates 
            ORDER BY category, name
        `);

        for (const t of templates.rows) {
            const badge = t.is_premium ? ' [PRO]' : '';
            console.log(`  ${t.id}. ${t.name} (${t.category})${badge}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

cleanupDuplicates();
