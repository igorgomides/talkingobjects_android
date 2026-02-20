-- Upgrade Usage Logs (v3.2)
-- Enhance audit trail with asset links and cost analysis.

-- 1. Add Asset & Cost Columns
ALTER TABLE public.usage_logs 
ADD COLUMN IF NOT EXISTS asset_url TEXT,
ADD COLUMN IF NOT EXISTS provider_cost NUMERIC DEFAULT 0, -- Cost in USD to developer
ADD COLUMN IF NOT EXISTS meta_details JSONB; -- Flexible field for extra specs

-- 2. Update existing rows (Optional, just to be clean)
UPDATE public.usage_logs SET provider_cost = 0 WHERE provider_cost IS NULL;
