
-- Add meta_scenario column to generations table
ALTER TABLE public.generations 
ADD COLUMN IF NOT EXISTS meta_scenario TEXT;

-- Comment on column
COMMENT ON COLUMN public.generations.meta_scenario IS 'The scenario preset used for generation (e.g., school_lunchbox, green_screen)';
