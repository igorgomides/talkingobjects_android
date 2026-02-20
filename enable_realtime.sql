-- Enable Realtime for profiles table
begin;
  -- Add table to the default publication if not already added
  alter publication supabase_realtime add table profiles;
commit;
