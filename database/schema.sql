-- Aprova SEDES — PostgreSQL 16+
-- Modelo relacional completo de referência para evolução da plataforma.
-- NÃO aplicar este arquivo diretamente no Supabase. Para ativar autenticação,
-- progresso e RLS, use supabase/migrations/202607170001_auth_and_progress.sql.
create extension if not exists pgcrypto;

create type user_role as enum ('student', 'content_reviewer', 'admin', 'super_admin');
create type content_status as enum ('draft', 'ai_review', 'human_review', 'published', 'rejected', 'archived');
create type question_type as enum ('multiple_choice', 'true_false');
create type difficulty_level as enum ('easy', 'medium', 'hard', 'advanced');
create type review_priority as enum ('low', 'medium', 'high', 'critical');
create type task_status as enum ('pending', 'completed', 'postponed', 'cancelled');

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text,
  email_confirmed_at timestamptz,
  role user_role not null default 'student',
  status text not null default 'active',
  consent_version text,
  consented_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table profiles (
  user_id uuid primary key references users(id) on delete cascade,
  name text not null,
  avatar_url text,
  selected_role_id uuid,
  exam_date date,
  days_per_week smallint check (days_per_week between 1 and 7),
  hours_per_day numeric(4,1) check (hours_per_day > 0),
  current_level text,
  weekly_question_goal integer default 100,
  preferred_study_time text,
  timezone text not null default 'America/Sao_Paulo',
  ranking_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table careers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  slug text not null unique,
  name text not null,
  full_name text not null,
  education_level text,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table profiles add constraint profiles_selected_role_fk foreign key (selected_role_id) references careers(id);

create table exam_notices (
  id uuid primary key default gen_random_uuid(),
  organization text not null,
  board text not null,
  number text not null,
  version integer not null default 1,
  official_url text not null,
  published_on date,
  last_verified_at timestamptz,
  status content_status not null default 'draft',
  checksum text,
  unique (organization, number, version)
);

create table disciplines (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table career_disciplines (
  career_id uuid references careers(id) on delete cascade,
  discipline_id uuid references disciplines(id) on delete cascade,
  exam_notice_id uuid references exam_notices(id) on delete cascade,
  area text not null check (area in ('general', 'specific')),
  weight numeric(6,2) not null default 1,
  question_count integer,
  display_order integer not null default 0,
  primary key (career_id, discipline_id, exam_notice_id)
);

create table topics (
  id uuid primary key default gen_random_uuid(),
  discipline_id uuid not null references disciplines(id) on delete cascade,
  parent_id uuid references topics(id) on delete cascade,
  exam_notice_id uuid references exam_notices(id) on delete cascade,
  code text,
  name text not null,
  edital_text text,
  estimated_minutes integer,
  frequency_score numeric(5,2) default 0,
  display_order integer default 0,
  status content_status not null default 'draft'
);

create table contents (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  kind text not null check (kind in ('full_summary','quick_summary','key_points','mind_map','comparison','example','board_trap')),
  title text not null,
  body jsonb not null,
  candidate_level text,
  version integer not null default 1,
  status content_status not null default 'draft',
  created_by uuid references users(id),
  reviewed_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table laws (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  title text not null,
  jurisdiction text not null,
  official_url text not null,
  active boolean not null default true,
  unique (number, jurisdiction)
);

create table law_versions (
  id uuid primary key default gen_random_uuid(),
  law_id uuid not null references laws(id) on delete cascade,
  version_label text not null,
  effective_from date,
  verified_at timestamptz not null,
  checksum text,
  source_url text not null,
  is_current boolean not null default false
);

create unique index law_one_current_version on law_versions(law_id) where is_current;

create table law_articles (
  id uuid primary key default gen_random_uuid(),
  law_version_id uuid not null references law_versions(id) on delete cascade,
  parent_id uuid references law_articles(id) on delete cascade,
  article_number text not null,
  heading text,
  body text not null,
  search_vector tsvector generated always as (to_tsvector('portuguese', coalesce(heading,'') || ' ' || body)) stored
);

create table topic_laws (
  topic_id uuid references topics(id) on delete cascade,
  law_id uuid references laws(id) on delete cascade,
  primary key (topic_id, law_id)
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  career_id uuid not null references careers(id),
  discipline_id uuid not null references disciplines(id),
  topic_id uuid not null references topics(id),
  type question_type not null,
  difficulty difficulty_level not null,
  statement text not null,
  correct_answer text not null,
  explanation text not null,
  alternative_analysis jsonb,
  source_kind text not null default 'ai_generated',
  ai_model text,
  confidence numeric(5,2) check (confidence between 0 and 100),
  ambiguity_score numeric(5,2),
  edital_adherence_score numeric(5,2),
  law_version_id uuid references law_versions(id),
  law_article_id uuid references law_articles(id),
  theoretical_reference text,
  verified_at timestamptz,
  status content_status not null default 'ai_review',
  created_by uuid references users(id),
  reviewed_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index questions_filter_idx on questions(career_id, discipline_id, topic_id, type, difficulty, status);

create table alternatives (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  label char(1) not null,
  body text not null,
  is_correct boolean not null default false,
  justification text,
  unique (question_id, label)
);

create unique index one_correct_multiple_choice on alternatives(question_id) where is_correct;

create table question_reviews (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  reviewer_id uuid references users(id),
  decision text not null check (decision in ('approve','reject','request_changes','report')),
  reason text,
  snapshot jsonb,
  created_at timestamptz not null default now()
);

create table simulations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references users(id),
  career_id uuid not null references careers(id),
  exam_notice_id uuid references exam_notices(id),
  title text not null,
  kind text not null,
  question_count integer not null,
  duration_seconds integer,
  scoring_rule jsonb not null,
  filters jsonb,
  official boolean not null default false,
  created_at timestamptz not null default now()
);

create table simulation_questions (
  simulation_id uuid references simulations(id) on delete cascade,
  question_id uuid references questions(id),
  position integer not null,
  weight numeric(6,2) not null default 1,
  primary key (simulation_id, position),
  unique (simulation_id, question_id)
);

create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  career_id uuid not null references careers(id),
  kind text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer,
  metadata jsonb not null default '{}'
);

create table answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  question_id uuid not null references questions(id),
  selected_answer text,
  is_correct boolean,
  left_blank boolean not null default false,
  time_spent_seconds integer not null default 0,
  answered_at timestamptz not null default now(),
  career_id uuid not null references careers(id),
  discipline_id uuid not null references disciplines(id),
  topic_id uuid not null references topics(id),
  difficulty difficulty_level not null,
  question_type question_type not null,
  study_session_id uuid references study_sessions(id),
  simulation_id uuid references simulations(id),
  confidence_label text,
  marked_for_review boolean not null default false
);

create index answers_user_performance_idx on answers(user_id, discipline_id, topic_id, answered_at desc);

create table simulation_results (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid not null references simulations(id),
  user_id uuid not null references users(id) on delete cascade,
  gross_score numeric(8,2) not null,
  net_score numeric(8,2) not null,
  correct_count integer not null,
  wrong_count integer not null,
  blank_count integer not null,
  duration_seconds integer not null,
  average_seconds numeric(8,2),
  performance_by_discipline jsonb not null,
  performance_by_topic jsonb not null,
  ai_diagnosis text,
  recovery_plan jsonb,
  completed_at timestamptz not null default now()
);

create table study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  career_id uuid not null references careers(id),
  starts_on date not null,
  ends_on date,
  parameters jsonb not null,
  generation_reason jsonb,
  version integer not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table study_tasks (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references study_plans(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  topic_id uuid references topics(id),
  task_type text not null,
  scheduled_for timestamptz not null,
  estimated_minutes integer not null,
  status task_status not null default 'pending',
  priority review_priority not null default 'medium',
  completed_at timestamptz,
  source_reason text,
  metadata jsonb not null default '{}'
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  topic_id uuid not null references topics(id),
  source_type text not null,
  source_id uuid,
  cycle_days integer,
  due_at timestamptz not null,
  priority review_priority not null,
  status task_status not null default 'pending',
  completed_at timestamptz,
  outcome jsonb
);

create index reviews_today_idx on reviews(user_id, due_at, status);

create table flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  topic_id uuid not null references topics(id),
  question_id uuid references questions(id),
  front text not null,
  back text not null,
  source_type text not null,
  next_review_at timestamptz,
  interval_days integer not null default 0,
  ease_factor numeric(4,2) not null default 2.50,
  repetitions integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table error_notebook (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  question_id uuid not null references questions(id),
  selected_answer text,
  correct_answer text not null,
  error_reason text,
  probable_cause text,
  personal_note text,
  memory_rule text,
  error_count integer not null default 1,
  first_error_at timestamptz not null default now(),
  last_error_at timestamptz not null default now(),
  last_review_at timestamptz,
  next_review_at timestamptz,
  unique (user_id, question_id)
);

create table essays (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  career_id uuid not null references careers(id),
  topic_id uuid references topics(id),
  prompt text not null,
  body text not null,
  word_count integer,
  line_estimate integer,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table essay_evaluations (
  id uuid primary key default gen_random_uuid(),
  essay_id uuid not null references essays(id) on delete cascade,
  estimated_score numeric(6,2),
  command_score numeric(6,2),
  organization_score numeric(6,2),
  language_score numeric(6,2),
  strengths jsonb,
  improvements jsonb,
  annotated_version text,
  rewrite_proposal text,
  ai_model text,
  disclaimer text not null default 'Estimativa de treinamento; não constitui nota oficial.',
  created_at timestamptz not null default now()
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  kind text not null,
  period_start date not null,
  period_end date not null,
  target numeric(10,2) not null,
  current_value numeric(10,2) not null default 0,
  completed_at timestamptz
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  rule jsonb not null,
  points integer not null default 0,
  active boolean not null default true
);

create table user_achievements (
  user_id uuid references users(id) on delete cascade,
  achievement_id uuid references achievements(id),
  earned_at timestamptz not null default now(),
  metadata jsonb,
  primary key (user_id, achievement_id)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  data jsonb,
  scheduled_at timestamptz,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table notification_preferences (
  user_id uuid primary key references users(id) on delete cascade,
  study_reminders boolean not null default true,
  review_reminders boolean not null default true,
  goal_alerts boolean not null default true,
  streak_alerts boolean not null default true,
  performance_alerts boolean not null default true,
  new_simulations boolean not null default false,
  email_enabled boolean not null default true,
  push_enabled boolean not null default true
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  plan_code text not null default 'free',
  status text not null default 'active',
  provider text,
  provider_customer_id text,
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  metadata jsonb
);

create table ai_jobs (
  id uuid primary key default gen_random_uuid(),
  kind text not null,
  requested_by uuid references users(id),
  input jsonb not null,
  output jsonb,
  status text not null default 'queued',
  confidence numeric(5,2),
  error text,
  attempts integer not null default 0,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz
);

create table admin_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);

-- Em produção, habilite RLS e permita que estudantes acessem apenas as próprias linhas.
alter table profiles enable row level security;
alter table answers enable row level security;
alter table simulation_results enable row level security;
alter table study_plans enable row level security;
alter table study_tasks enable row level security;
alter table reviews enable row level security;
alter table flashcards enable row level security;
alter table error_notebook enable row level security;
alter table essays enable row level security;
alter table goals enable row level security;
alter table notifications enable row level security;
