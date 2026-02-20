-- AI Speaking Object v3.0 - Database Schema

-- 1. Whitelist Table (Controls who can sign up)
CREATE TABLE public.whitelist (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Profiles Table (Linked to Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    credits INTEGER DEFAULT 50,
    plan_tier TEXT DEFAULT 'beta_tester',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Generations Table (History of created videos)
CREATE TABLE public.generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    prompt_text TEXT,
    image_url TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Security Rules)

-- Whitelist: Read-only for everyone (or restricting to system only is better, but let's keep simple)
CREATE POLICY "Allow public read of whitelist" ON public.whitelist FOR SELECT USING (true);

-- Profiles: Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles 
FOR SELECT USING (auth.uid() = id);

-- Generations: Users can read/insert their own generations
CREATE POLICY "Users can view own generations" ON public.generations 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON public.generations 
FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 5. Logic: Handle New User Sign-up with Whitelist Check
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    is_whitelisted BOOLEAN;
BEGIN
    -- Check if email is in whitelist
    SELECT EXISTS(SELECT 1 FROM public.whitelist WHERE email = NEW.email) INTO is_whitelisted;

    IF is_whitelisted THEN
        -- Create profile with 50 credits
        INSERT INTO public.profiles (id, email, credits)
        VALUES (NEW.id, NEW.email, 50);
        RETURN NEW;
    ELSE
        -- Block sign up (Raise exception rolls back the transaction)
        RAISE EXCEPTION 'Registration denied: Email not on beta whitelist.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 6. Seed Initial Whitelist (REPLACE WITH REAL EMAILS)
INSERT INTO public.whitelist (email) VALUES 
('seu-email-admin@example.com'),
('igor.gomides@example.com'),
('guest1@example.com');
