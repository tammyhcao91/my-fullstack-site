-- Vermazing Soaps — database schema
-- How to run: Supabase dashboard → SQL Editor → New query → paste all of this → Run.
-- Safe to run more than once.

-- 1) Leads: messages submitted through the website contact form.
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null check (char_length(trim(name)) between 1 and 100),
  email      text not null check (
               char_length(email) between 3 and 200
               and position('@' in email) > 1
             ),
  message    text check (char_length(message) <= 2000)
);

-- 2) Turn on Row Level Security. Once enabled, EVERYTHING is denied by default
--    and only the policies below are permitted. This is what makes it safe to
--    ship the anon key to the browser.
alter table public.leads enable row level security;

-- 3) Anyone visiting the site may SUBMIT a message.
drop policy if exists "Public can submit a lead" on public.leads;
create policy "Public can submit a lead"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- 4) Deliberately NO select / update / delete policy.
--    => Nobody can read, edit, or delete leads using the public anon key.
--    You read your messages in the Supabase dashboard (Table Editor), which
--    uses the service role and bypasses RLS.

-- 5) Index for listing newest messages first.
create index if not exists leads_created_at_idx
  on public.leads (created_at desc);
