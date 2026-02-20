-- Admin & Roles Schema

-- 1. Add Role to Profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- 2. Fix Whitelist for Super Admin
INSERT INTO public.whitelist (email) 
VALUES ('igorgomides.ca@gmail.com') 
ON CONFLICT (email) DO NOTHING;

-- 3. RLS: Allow Admins to view ALL usage logs
-- First, ensure the policy doesn't conflict
DROP POLICY IF EXISTS "Admins can view all usage logs" ON public.usage_logs;

CREATE POLICY "Admins can view all usage logs" ON public.usage_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 4. Promote User to Admin
-- IMPORTANT: This command only works if the user has already signed up and has a profile.
-- If the user catches "Registration denied" error earlier, they need to sign up AGAIN after running step 2 above.
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'igorgomides.ca@gmail.com';
