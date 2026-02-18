-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_freeze_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_freezes ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_freeze_log ENABLE ROW LEVEL SECURITY;

-- 1. Users Policies using auth.uid()
-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 2. Habits Policies
CREATE POLICY "Users can view own habits" ON habits
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own habits" ON habits
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own habits" ON habits
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own habits" ON habits
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 3. Habit Logs Policies
CREATE POLICY "Users can view own logs" ON habit_logs
    FOR SELECT USING (
        EXISTS ( SELECT 1 FROM habits WHERE id = habit_logs.habit_id AND user_id::text = auth.uid()::text )
    );

CREATE POLICY "Users can insert own logs" ON habit_logs
    FOR INSERT WITH CHECK (
        EXISTS ( SELECT 1 FROM habits WHERE id = habit_logs.habit_id AND user_id::text = auth.uid()::text )
    );

CREATE POLICY "Users can delete own logs" ON habit_logs
    FOR DELETE USING (
        EXISTS ( SELECT 1 FROM habits WHERE id = habit_logs.habit_id AND user_id::text = auth.uid()::text )
    );

-- 4. Focus Sessions Policies
CREATE POLICY "Users can manage own focus sessions" ON focus_sessions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- 5. Achievements Policies
CREATE POLICY "Users can view own achievements" ON achievements
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- 6. User Freezes Policies
CREATE POLICY "Users can view own freezes" ON user_freezes
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, is_pro, is_admin)
  VALUES (new.id::integer, new.raw_user_meta_data->>'username', false, false)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
-- NOTE: This assumes 'id' in public.users is changed to UUID or handled appropriately.
-- Currently 'id' is SERIAL (integer). Supabase auth.users uses UUID.
-- We must Changing public.users.id to UUID or map it.
-- DECISION: Since existing data uses Integer IDs, mapping UUID to Integer is messy.
-- STRATEGY: Migration to UUID for user_id is best practice for Supabase.

-- MIGRATION TO UUID (Optional but Recommended for Supabase)
-- For this step, we will assume we keep Integer IDs for existing tables to avoid breaking everything immediately,
-- BUT Supabase Auth uses UUID.
-- A bridge table or column `auth_id` (UUID) in `users` table is needed.

ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_id uuid REFERENCES auth.users(id);

-- Update RLS policies to use auth_id
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = auth_id);

-- Re-create User Trigger with UUID mapping
CREATE OR REPLACE FUNCTION public.handle_new_user_uuid()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (username, auth_id, is_pro, is_admin)
  VALUES (new.raw_user_meta_data->>'username', new.id, false, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_uuid();
