-- 1. Create a secure function to check admin status
-- SECURITY DEFINER allows this function to bypass RLS and read the table directly
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 2. Drop the recursive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
-- Drop the temporary debug policy if it exists
DROP POLICY IF EXISTS "Debug Public Read" ON profiles;


-- 3. Re-create Admin policies using the secure function
-- This avoids the recursion because the function runs as the owner (bypassing the policy check inside)
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING ( is_admin() );

CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING ( is_admin() );


-- 4. Ensure Users can still see and update their own stuff (these were fine, but good to double check)
-- "Users can view own profile" (already exists, non-recursive: auth.uid() = id)
-- "Users can update own profile" (already exists, non-recursive: auth.uid() = id)
