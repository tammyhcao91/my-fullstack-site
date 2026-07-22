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


-- ============================================================
--  Admin access
-- ============================================================

-- 6) Allow-list of admin accounts. Being signed in is NOT enough to read
--    leads — the account must also have a row here.
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- A signed-in user may look up their own admin row (and nobody else's).
drop policy if exists "Users can read their own admin row" on public.admins;
create policy "Users can read their own admin row"
  on public.admins
  for select
  to authenticated
  using (user_id = auth.uid());

-- 7) Helper for the policies below. SECURITY DEFINER lets it check the admins
--    table without tripping over that table's own row level security.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- 8) Admins may read and delete leads. Everyone else still cannot — including
--    signed-in accounts that are not on the allow-list.
drop policy if exists "Admins can read leads" on public.leads;
create policy "Admins can read leads"
  on public.leads
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
  on public.leads
  for delete
  to authenticated
  using (public.is_admin());
