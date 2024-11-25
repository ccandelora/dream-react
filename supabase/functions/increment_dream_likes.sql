-- Create a function to safely increment dream likes
create or replace function increment_dream_likes(dream_id uuid)
returns void as $$
begin
  update dreams
  set likes = likes + 1
  where id = dream_id
  and exists (
    select 1 from dreams d
    where d.id = dream_id
    and (d.privacy = 'public' or d.user_id = auth.uid())
  );
end;
$$ language plpgsql security definer;