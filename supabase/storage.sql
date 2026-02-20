-- Enable Storage
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

-- Policy: Allow public read access to all files in 'assets' bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'assets' );

-- Policy: Allow authenticated users to upload files to their own folder
DROP POLICY IF EXISTS "User Upload" ON storage.objects;
create policy "User Upload"
  on storage.objects for insert
  with check ( bucket_id = 'assets' and auth.uid()::text = (storage.foldername(name))[2] );
