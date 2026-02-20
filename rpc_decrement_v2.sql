-- Secure Credit Deduction Function v2 (Variable Amount)
-- Drops the old function first to avoid signature conflicts if needed, 
-- though 'create or replace' with different args might create an overload. 
-- Better to replace securely.

create or replace function public.decrement_credits(user_id uuid, amount int)
returns void as $$
begin
  if amount < 0 then
    raise exception 'Amount must be positive';
  end if;

  update public.profiles
  set credits = credits - amount
  where id = user_id
  and credits >= amount;
  
  if not found then
    raise exception 'Insufficient credits';
  end if;
end;
$$ language plpgsql security definer;
