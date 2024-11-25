-- Create a function to safely increment comment likes
create or replace function increment_comment_likes(comment_id uuid)
returns void as $$
begin
  update comments
  set likes = likes + 1
  where id = comment_id
  and exists (
    select 1 from comments c
    where c.id = comment_id
    and exists (
      select 1 from dreams d
      where d.id = c.dream_id
      and (d.privacy = 'public' or d.user_id = auth.uid())
    )
  );
end;
$$ language plpgsql security definer;