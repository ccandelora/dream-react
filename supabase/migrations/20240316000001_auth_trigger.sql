-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Create a trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, email, name, avatar_url, created_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      'https://ui-avatars.com/api/?name=' || encode(coalesce(new.raw_user_meta_data->>'name', 'New User'), 'url')
    ),
    now()
  );
  return new;
end;
$$;

-- Drop the trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();