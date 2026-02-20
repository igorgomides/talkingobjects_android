-- Allow Admins to INSERT into whitelist
DROP POLICY IF EXISTS "Admins can insert into whitelist" ON public.whitelist;
CREATE POLICY "Admins can insert into whitelist" ON public.whitelist
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Allow Admins to DELETE from whitelist
DROP POLICY IF EXISTS "Admins can delete from whitelist" ON public.whitelist;
CREATE POLICY "Admins can delete from whitelist" ON public.whitelist
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);
