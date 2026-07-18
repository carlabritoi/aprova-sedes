-- Autenticação e progresso do Aprova SEDES no Supabase.
-- Cada tabela exposta usa RLS para isolar os dados por usuário.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  selected_role text check (selected_role in ('tecnico', 'educador')),
  exam_date date,
  days_per_week smallint check (days_per_week between 1 and 7),
  hours_per_day numeric(4,1) check (hours_per_day between 0.5 and 12),
  current_level text,
  difficulties jsonb not null default '[]'::jsonb,
  weekly_question_goal integer not null default 100 check (weekly_question_goal between 1 and 5000),
  preferred_study_time text,
  consent_version text,
  consented_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.question_answers (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  selected_answer text,
  is_correct boolean,
  time_spent_seconds integer not null default 0 check (time_spent_seconds >= 0),
  career text,
  discipline text,
  topic text,
  difficulty text,
  question_type text,
  session_kind text,
  answered_at timestamptz not null default now()
);

create index if not exists question_answers_user_date_idx
  on public.question_answers(user_id, answered_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, consent_version, consented_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'consent_version',
    nullif(new.raw_user_meta_data ->> 'consented_at', '')::timestamptz
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.question_answers enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "progress_select_own" on public.user_progress;
create policy "progress_select_own" on public.user_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "progress_insert_own" on public.user_progress;
create policy "progress_insert_own" on public.user_progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "progress_update_own" on public.user_progress;
create policy "progress_update_own" on public.user_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "answers_select_own" on public.question_answers;
create policy "answers_select_own" on public.question_answers
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "answers_insert_own" on public.question_answers;
create policy "answers_insert_own" on public.question_answers
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on public.profiles, public.user_progress, public.question_answers from anon;
grant select, insert, update on public.profiles, public.user_progress to authenticated;
grant select, insert on public.question_answers to authenticated;
grant usage, select on sequence public.question_answers_id_seq to authenticated;
