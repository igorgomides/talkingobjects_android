-- 1. Create the new Lead Whitelist Table
CREATE TABLE public.whitelist_lead (
    email TEXT PRIMARY KEY,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.whitelist_lead ENABLE ROW LEVEL SECURITY;

-- Allow public read of lead whitelist (similar to normal whitelist)
CREATE POLICY "Allow public read of whitelist_lead" ON public.whitelist_lead FOR SELECT USING (true);

-- Allow Admins to manage whitelist_lead
CREATE POLICY "Admins can insert into whitelist_lead" ON public.whitelist_lead
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

CREATE POLICY "Admins can delete from whitelist_lead" ON public.whitelist_lead
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- IMPORTANT: Allow anonymous public inserts for the Lead Capture page
CREATE POLICY "Public can insert into whitelist_lead" ON public.whitelist_lead 
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- 2. Update the New User Trigger to Handle Credit Rules
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
    is_beta_whitelisted BOOLEAN;
    is_lead_whitelisted BOOLEAN;
    credit_award INTEGER;
    plan_name TEXT;
BEGIN
    -- Check if email is in the premium beta whitelist (50 credits)
    SELECT EXISTS(SELECT 1 FROM public.whitelist WHERE email = NEW.email) INTO is_beta_whitelisted;
    
    -- Check if email is in the lead capture whitelist (20 credits)
    SELECT EXISTS(SELECT 1 FROM public.whitelist_lead WHERE email = NEW.email) INTO is_lead_whitelisted;

    IF is_beta_whitelisted THEN
        credit_award := 50;
        plan_name := 'beta_tester';
    ELSIF is_lead_whitelisted THEN
        credit_award := 20;
        plan_name := 'lead_capture';
    ELSE
        -- Block sign up (Raise exception rolls back the transaction)
        RAISE EXCEPTION 'Registration denied: Email not on beta whitelist or lead list.';
    END IF;

    -- Create profile with awarded credits
    INSERT INTO public.profiles (id, email, credits, plan_tier)
    VALUES (NEW.id, NEW.email, credit_award, plan_name);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
