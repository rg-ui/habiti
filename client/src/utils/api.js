import { supabase } from './supabaseClient';

// Helper to simulate Axios response structure
const createResponse = (data) => ({ data });

const api = {
    get: async (url) => {
        try {
            // Habits
            if (url === '/habits') {
                const { data, error } = await supabase
                    .from('habits')
                    .select('*')
                    .order('created_at', { ascending: true });
                if (error) throw error;
                return createResponse(data);
            }

            // Single Habit Streak (Mock for now, or implement client-side calc if needed)
            if (url.match(/\/habits\/\d+\/streak/)) {
                return createResponse({ current_streak: 0, total_completions: 0 });
            }

            // Habit Logs
            if (url === '/habits/logs') {
                const { data, error } = await supabase
                    .from('habit_logs')
                    .select('*, habits!inner(user_id)') // !inner ensures we only get logs for habits user can see (redundant with RLS but good practice)
                    .order('log_date', { ascending: false });
                if (error) throw error;
                return createResponse(data);
            }

            // Journal
            if (url === '/journal') {
                // Return empty array for now
                return createResponse([]);
            }

            console.warn(`[Supabase Adapter] Unhandled GET request: ${url}`);
            return createResponse([]);
        } catch (err) {
            console.error('[Supabase Adapter] GET Error:', err);
            throw err;
        }
    },

    post: async (url, body) => {
        try {
            // Habits
            if (url === '/habits') {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('User not authenticated');

                const { data, error } = await supabase.from('habits').insert([
                    {
                        title: body.title,
                        description: body.description,
                        color: body.color,
                        goal_frequency: body.goal_frequency,
                        identity_goal: body.identity_goal,
                        user_id: user.id
                    }
                ]).select();

                if (error) throw error;
                return createResponse(data[0]);
            }

            // Toggle Check
            if (url.match(/\/habits\/\d+\/check/)) {
                const habitId = url.split('/')[2];
                const { date, completed } = body;

                if (completed) {
                    const { error } = await supabase.from('habit_logs').upsert({
                        habit_id: parseInt(habitId),
                        log_date: date,
                        completed: true
                    });
                    if (error) throw error;
                } else {
                    const { error } = await supabase.from('habit_logs').delete().match({
                        habit_id: parseInt(habitId),
                        log_date: date
                    });
                    if (error) throw error;
                }
                return createResponse({ message: 'Success' });
            }

            // Chat - Mock response until Edge Function is ready
            if (url === '/chat/ask') {
                // Simulating AI response
                return createResponse({ reply: "I'm currently being migrated to a smarter brain! My AI features will be back online shortly." });
            }

            console.warn(`[Supabase Adapter] Unhandled POST request: ${url}`);
            return createResponse({});
        } catch (err) {
            console.error('[Supabase Adapter] POST Error:', err);
            throw err;
        }
    },

    put: async (url, body) => {
        try {
            if (url.startsWith('/habits/')) {
                const id = url.split('/')[2];
                const { data, error } = await supabase
                    .from('habits')
                    .update({
                        title: body.title,
                        description: body.description,
                        color: body.color,
                        goal_frequency: body.goal_frequency,
                        identity_goal: body.identity_goal
                    })
                    .eq('id', parseInt(id))
                    .select();

                if (error) throw error;
                return createResponse(data[0]);
            }
            return createResponse({});
        } catch (err) {
            console.error('[Supabase Adapter] PUT Error:', err);
            throw err;
        }
    },

    delete: async (url) => {
        try {
            if (url.startsWith('/habits/')) {
                const id = url.split('/')[2];
                const { error } = await supabase.from('habits').delete().eq('id', parseInt(id));
                if (error) throw error;
                return createResponse({ message: 'Deleted' });
            }
            return createResponse({});
        } catch (err) {
            console.error('[Supabase Adapter] DELETE Error:', err);
            throw err;
        }
    }
};

export default api;
