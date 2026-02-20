-- Atomic Credit Increment Function
create or replace function public.increment_credits(user_id uuid, amount int)
returns void as $$
begin
  update public.profiles
  set credits = credits + amount
  where id = user_id;
end;
$$ language plpgsql security definer;
