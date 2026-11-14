-- IGBS Badminton 2026: live results table.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

create table if not exists public.results (
  match_id   text primary key,                         -- e.g. M07 or 1QF1
  a          integer not null check (a >= 0),          -- points of the first side
  b          integer not null check (b >= 0),          -- points of the second side
  status     text    not null check (status in ('live', 'done')),
  updated_at timestamptz not null default now()
);

alter table public.results enable row level security;

-- everyone may read results (the public site)
create policy "Anyone can read results" on public.results
  for select using (true);

-- only a signed-in admin may write
create policy "Admin can add results" on public.results
  for insert to authenticated with check (true);
create policy "Admin can change results" on public.results
  for update to authenticated using (true) with check (true);
create policy "Admin can remove results" on public.results
  for delete to authenticated using (true);

-- push every change to open pages instantly
alter publication supabase_realtime add table public.results;
