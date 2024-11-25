-- Seed data for testing
begin;

-- First, create users in auth.users
insert into auth.users (id, email, email_confirmed_at)
values 
  ('00000000-0000-4000-a000-000000000001', 'luna@example.com', now()),
  ('00000000-0000-4000-a000-000000000002', 'aiden@example.com', now()),
  ('00000000-0000-4000-a000-000000000003', 'maya@example.com', now());

-- Then create profiles
insert into public.profiles (id, email, name, avatar_url, bio)
values 
  ('00000000-0000-4000-a000-000000000001', 'luna@example.com', 'Luna Dreamweaver', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Exploring the depths of consciousness through lucid dreaming'),
  ('00000000-0000-4000-a000-000000000002', 'aiden@example.com', 'Aiden Starlight', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Dream researcher and consciousness explorer'),
  ('00000000-0000-4000-a000-000000000003', 'maya@example.com', 'Maya Nightshade', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'Recording my dream journey one night at a time');

-- Insert sample dreams
insert into public.dreams (user_id, content, tags, clarity, privacy, analysis)
values 
  ('00000000-0000-4000-a000-000000000001', 
   'I was flying over a vast ocean at sunset. The water below was crystal clear, and I could see whales swimming beneath the surface.',
   array['Flying', 'Ocean', 'Lucid'],
   9,
   'public',
   '{"symbols": ["Ocean", "Flying", "Whales"], "interpretation": "This dream suggests a deep connection with your emotional state and spiritual journey.", "mood": "Peaceful", "themes": ["Freedom", "Spirituality", "Connection"]}'::jsonb
  );

-- Insert sample collections
insert into public.collections (user_id, name, description, icon, color)
values 
  ('00000000-0000-4000-a000-000000000001',
   'Lucid Adventures',
   'Collection of my most vivid lucid dreams',
   'Sparkles',
   'purple'
  );

commit;