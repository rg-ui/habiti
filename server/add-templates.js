const pool = require('./db');

async function addNewTemplates() {
    try {
        console.log('📚 Adding new templates for Students, Entrepreneurs, and Content Creators...\n');

        const newTemplates = [
            // STUDENT TEMPLATES
            {
                name: 'Exam Warrior',
                description: 'Ace your exams with proven study habits',
                category: 'Students',
                habits: [
                    { title: 'Study 2 hours', identity_goal: 'Be a Top Student', color: '#6366f1' },
                    { title: 'Review notes', identity_goal: 'Master the Material', color: '#8b5cf6' },
                    { title: 'Practice problems', identity_goal: 'Be Problem Solver', color: '#14b8a6' },
                    { title: 'No phone during study', identity_goal: 'Be Focused', color: '#ef4444' }
                ],
                is_premium: false
            },
            {
                name: 'College Success',
                description: 'Balance academics, health, and social life',
                category: 'Students',
                habits: [
                    { title: 'Attend all classes', identity_goal: 'Be Present', color: '#3b82f6' },
                    { title: 'Complete assignments early', identity_goal: 'Be Proactive', color: '#10b981' },
                    { title: 'Study group session', identity_goal: 'Learn Together', color: '#f59e0b' },
                    { title: 'Sleep by 11 PM', identity_goal: 'Be Well-Rested', color: '#8b5cf6' },
                    { title: 'Exercise 30 min', identity_goal: 'Stay Healthy', color: '#ef4444' }
                ],
                is_premium: false
            },
            {
                name: 'UPSC/GATE Prep',
                description: 'Structured preparation for competitive exams',
                category: 'Students',
                habits: [
                    { title: '4 hours focused study', identity_goal: 'Be a Topper', color: '#6366f1' },
                    { title: 'Read newspaper/current affairs', identity_goal: 'Stay Informed', color: '#3b82f6' },
                    { title: 'Solve previous year papers', identity_goal: 'Be Exam Ready', color: '#14b8a6' },
                    { title: 'Revise one subject', identity_goal: 'Master Subjects', color: '#f59e0b' },
                    { title: 'Write answer practice', identity_goal: 'Perfect Writing', color: '#ec4899' }
                ],
                is_premium: true
            },

            // ENTREPRENEUR TEMPLATES
            {
                name: 'Startup Founder',
                description: 'Build your startup with discipline',
                category: 'Entrepreneurs',
                habits: [
                    { title: 'Work on product 2hrs', identity_goal: 'Be a Builder', color: '#6366f1' },
                    { title: 'Talk to 1 customer', identity_goal: 'Understand Users', color: '#10b981' },
                    { title: 'Review metrics', identity_goal: 'Be Data-Driven', color: '#f59e0b' },
                    { title: 'Network/outreach', identity_goal: 'Grow Connections', color: '#3b82f6' }
                ],
                is_premium: false
            },
            {
                name: 'Business Empire',
                description: 'Scale your business systematically',
                category: 'Entrepreneurs',
                habits: [
                    { title: 'CEO morning routine', identity_goal: 'Lead by Example', color: '#8b5cf6' },
                    { title: 'Review financials', identity_goal: 'Know Your Numbers', color: '#10b981' },
                    { title: 'Team sync meeting', identity_goal: 'Align the Team', color: '#3b82f6' },
                    { title: 'Strategic thinking time', identity_goal: 'Think Big', color: '#6366f1' },
                    { title: 'Learn from books/podcasts', identity_goal: 'Never Stop Learning', color: '#f59e0b' },
                    { title: 'Self-care & exercise', identity_goal: 'Sustainable Success', color: '#ef4444' }
                ],
                is_premium: true
            },
            {
                name: 'Side Hustle Builder',
                description: 'Build income while working full-time',
                category: 'Entrepreneurs',
                habits: [
                    { title: '1 hour on side project', identity_goal: 'Build Wealth', color: '#10b981' },
                    { title: 'Learn a new skill', identity_goal: 'Grow Your Value', color: '#6366f1' },
                    { title: 'Engage with community', identity_goal: 'Build Audience', color: '#ec4899' },
                    { title: 'Track income/expenses', identity_goal: 'Be Financially Aware', color: '#f59e0b' }
                ],
                is_premium: false
            },

            // CONTENT CREATOR TEMPLATES
            {
                name: 'YouTube Creator',
                description: 'Grow your YouTube channel consistently',
                category: 'Content Creators',
                habits: [
                    { title: 'Script or plan content', identity_goal: 'Be a Creator', color: '#ef4444' },
                    { title: 'Shoot or edit video', identity_goal: 'Create Daily', color: '#f59e0b' },
                    { title: 'Reply to comments', identity_goal: 'Build Community', color: '#ec4899' },
                    { title: 'Study analytics', identity_goal: 'Grow Strategically', color: '#6366f1' },
                    { title: 'Watch trending content', identity_goal: 'Stay Relevant', color: '#3b82f6' }
                ],
                is_premium: false
            },
            {
                name: 'Instagram Influencer',
                description: 'Build your personal brand on Instagram',
                category: 'Content Creators',
                habits: [
                    { title: 'Post 1 reel or story', identity_goal: 'Be Consistent', color: '#ec4899' },
                    { title: 'Engage with followers', identity_goal: 'Build Connections', color: '#f59e0b' },
                    { title: 'Plan content calendar', identity_goal: 'Be Organized', color: '#6366f1' },
                    { title: 'Collaborate with creators', identity_goal: 'Grow Together', color: '#10b981' },
                    { title: 'Learn new editing skills', identity_goal: 'Level Up Content', color: '#8b5cf6' }
                ],
                is_premium: true
            },
            {
                name: 'Podcast Host',
                description: 'Launch and grow your podcast',
                category: 'Content Creators',
                habits: [
                    { title: 'Research episode topic', identity_goal: 'Deliver Value', color: '#3b82f6' },
                    { title: 'Record or edit audio', identity_goal: 'Create Consistently', color: '#ef4444' },
                    { title: 'Promote on social media', identity_goal: 'Grow Audience', color: '#ec4899' },
                    { title: 'Reach out to guests', identity_goal: 'Network', color: '#10b981' }
                ],
                is_premium: true
            },
            {
                name: 'Twitter/X Growth',
                description: 'Build thought leadership on Twitter/X',
                category: 'Content Creators',
                habits: [
                    { title: 'Post 3 tweets', identity_goal: 'Share Ideas', color: '#3b82f6' },
                    { title: 'Engage with 10 posts', identity_goal: 'Build Network', color: '#6366f1' },
                    { title: 'Write 1 thread/week', identity_goal: 'Thought Leader', color: '#8b5cf6' },
                    { title: 'DM 2 new connections', identity_goal: 'Grow Relationships', color: '#10b981' }
                ],
                is_premium: false
            }
        ];

        let added = 0;
        let skipped = 0;

        for (const template of newTemplates) {
            try {
                // Check if template already exists
                const existing = await pool.query(
                    'SELECT id FROM habit_templates WHERE name = $1',
                    [template.name]
                );

                if (existing.rows.length > 0) {
                    console.log(`  ⏭ "${template.name}" already exists, skipping`);
                    skipped++;
                    continue;
                }

                await pool.query(`
                    INSERT INTO habit_templates (name, description, category, habits, is_premium)
                    VALUES ($1, $2, $3, $4, $5)
                `, [template.name, template.description, template.category, JSON.stringify(template.habits), template.is_premium]);

                const badge = template.is_premium ? ' [PRO]' : '';
                console.log(`  ✓ Added "${template.name}" (${template.category})${badge}`);
                added++;
            } catch (err) {
                console.log(`  ✗ Failed to add "${template.name}": ${err.message}`);
            }
        }

        console.log(`\n✅ Done! Added ${added} new templates, skipped ${skipped} existing ones.`);

        // Show all templates
        console.log('\n📋 All templates in database:\n');
        const all = await pool.query(`
            SELECT name, category, is_premium 
            FROM habit_templates 
            ORDER BY category, name
        `);

        let currentCategory = '';
        for (const t of all.rows) {
            if (t.category !== currentCategory) {
                currentCategory = t.category;
                console.log(`\n  📁 ${currentCategory}`);
            }
            const badge = t.is_premium ? ' [PRO]' : '';
            console.log(`     • ${t.name}${badge}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

addNewTemplates();
