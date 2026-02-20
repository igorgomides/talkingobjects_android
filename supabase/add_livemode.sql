-- Add livemode column to transactions table
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS livemode BOOLEAN DEFAULT FALSE;

-- Backfill existing data based on stripe_session_id prefix
-- 'cs_test_' -> livemode = FALSE
-- 'cs_live_' -> livemode = TRUE (or anything else if we want to default to true, but safer to follow the ID)
UPDATE public.transactions
SET livemode = CASE 
    WHEN stripe_session_id LIKE 'cs_test_%' THEN FALSE
    ELSE TRUE
END;
