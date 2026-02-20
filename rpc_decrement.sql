-- Secure Credit Deduction Function
create or replace function public.decrement_credits(user_id uuid)
returns void as $$
begin
  update public.profiles
  set credits = credits - 1
  where id = user_id
  and credits > 0;
end;
$$ language plpgsql security definer;
