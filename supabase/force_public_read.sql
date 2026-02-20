-- TEMPORARY FIX: Allow everyone to read profiles to verify data visibility
-- We keep the write permissions restricted, but open up reading.

-- 1. Drop the restrictive specific read policies if they exist (to rely on the additive permissive one)
-- (Actually, we don't need to drop them, policies are OR-based. If we add a TRUE policy, it wins.)

CREATE POLICY "Debug Public Read"
ON profiles FOR SELECT
USING ( true );

-- Ensure RLS is actually ON (it should be)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
