-- Drop ALL policies we are about to create, just in case
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Drop any other old policies that might interfere
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING ( auth.uid() = id );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING ( auth.uid() = id );

-- Allow users to insert their own profile (on signup)
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK ( auth.uid() = id );

-- Ensure admin can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON profiles FOR SELECT 
USING ( 
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') 
);

-- Ensure admin can update all profiles
CREATE POLICY "Admins can update all profiles" 
ON profiles FOR UPDATE 
USING ( 
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin') 
);
