-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  name text not null,
  avatar_url text,
  bio text,
  created_at timestamptz default now() not null,
  primary key (id)
);

-- Create dreams table
create table if not exists dreams (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  tags text[] default array[]::text[],
  likes integer default 0,
  comments integer default 0,
  clarity integer default 5,
  analysis jsonb,
  privacy text default 'public' check (privacy in ('public', 'private', 'anonymous')),
  image_url text,
  created_at timestamptz default now() not null
);

-- Create comments table
create table if not exists comments (
  id uuid default uuid_generate_v4() primary key,
  dream_id uuid references dreams(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  likes integer default 0,
  created_at timestamptz default now() not null
);

-- Create collections table
create table if not exists collections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  icon text default 'Folder',
  color text default 'purple',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create collection_dreams junction table
create table if not exists collection_dreams (
  collection_id uuid references collections(id) on delete cascade,
  dream_id uuid references dreams(id) on delete cascade,
  added_at timestamptz default now() not null,
  primary key (collection_id, dream_id)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table dreams enable row level security;
alter table comments enable row level security;
alter table collections enable row level security;
alter table collection_dreams enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Public dreams are viewable by everyone" on dreams;
drop policy if exists "Users can insert own dreams" on dreams;
drop policy if exists "Users can update own dreams" on dreams;
drop policy if exists "Users can delete own dreams" on dreams;
drop policy if exists "Comments are viewable by everyone" on comments;
drop policy if exists "Users can insert own comments" on comments;
drop policy if exists "Users can update own comments" on comments;
drop policy if exists "Users can delete own comments" on comments;
drop policy if exists "Collections are viewable by owner" on collections;
drop policy if exists "Users can insert own collections" on collections;
drop policy if exists "Users can update own collections" on collections;
drop policy if exists "Users can delete own collections" on collections;
drop policy if exists "Collection dreams are viewable by collection owner" on collection_dreams;
drop policy if exists "Users can insert into own collections" on collection_dreams;
drop policy if exists "Users can delete from own collections" on collection_dreams;

-- Create profile handling function
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', 'New User'));
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger for new user profiles
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Recreate policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Dreams policies
create policy "Public dreams are viewable by everyone"
  on dreams for select
  using (privacy = 'public' or user_id = auth.uid());

create policy "Users can insert own dreams"
  on dreams for insert
  with check (auth.uid() = user_id);

create policy "Users can update own dreams"
  on dreams for update
  using (auth.uid() = user_id);

create policy "Users can delete own dreams"
  on dreams for delete
  using (auth.uid() = user_id);

-- Comments policies
create policy "Comments are viewable by everyone"
  on comments for select
  using (true);

create policy "Users can insert own comments"
  on comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own comments"
  on comments for update
  using (auth.uid() = user_id);

create policy "Users can delete own comments"
  on comments for delete
  using (auth.uid() = user_id);

-- Collections policies
create policy "Collections are viewable by owner"
  on collections for select
  using (auth.uid() = user_id);

create policy "Users can insert own collections"
  on collections for insert
  with check (auth.uid() = user_id);

create policy "Users can update own collections"
  on collections for update
  using (auth.uid() = user_id);

create policy "Users can delete own collections"
  on collections for delete
  using (auth.uid() = user_id);

-- Collection dreams policies
create policy "Collection dreams are viewable by collection owner"
  on collection_dreams for select
  using (
    exists (
      select 1 from collections
      where id = collection_dreams.collection_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert into own collections"
  on collection_dreams for insert
  with check (
    exists (
      select 1 from collections
      where id = collection_dreams.collection_id
      and user_id = auth.uid()
    )
  );

create policy "Users can delete from own collections"
  on collection_dreams for delete
  using (
    exists (
      select 1 from collections
      where id = collection_dreams.collection_id
      and user_id = auth.uid()
    )
  );

-- Create functions for auto-updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Drop existing trigger if it exists
drop trigger if exists update_collections_updated_at on collections;

-- Create trigger for collections
create trigger update_collections_updated_at
  before update on collections
  for each row
  execute function update_updated_at_column();

-- Create functions for comment counts
create or replace function increment_dream_comments()
returns trigger as $$
begin
  update dreams
  set comments = comments + 1
  where id = new.dream_id;
  return new;
end;
$$ language plpgsql security definer;

create or replace function decrement_dream_comments()
returns trigger as $$
begin
  update dreams
  set comments = comments - 1
  where id = old.dream_id;
  return old;
end;
$$ language plpgsql security definer;

-- Drop existing triggers if they exist
drop trigger if exists increment_dream_comments_trigger on comments;
drop trigger if exists decrement_dream_comments_trigger on comments;

-- Create triggers for comments
create trigger increment_dream_comments_trigger
  after insert on comments
  for each row
  execute function increment_dream_comments();

create trigger decrement_dream_comments_trigger
  after delete on comments
  for each row
  execute function decrement_dream_comments();

-- Create indexes
create index if not exists dreams_user_id_idx on dreams(user_id);
create index if not exists dreams_privacy_idx on dreams(privacy);
create index if not exists dreams_created_at_idx on dreams(created_at desc);
create index if not exists comments_dream_id_idx on comments(dream_id);
create index if not exists comments_user_id_idx on comments(user_id);
create index if not exists collections_user_id_idx on collections(user_id);
create index if not exists collection_dreams_collection_id_idx on collection_dreams(collection_id);
create index if not exists collection_dreams_dream_id_idx on collection_dreams(dream_id);