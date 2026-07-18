const config = window.__APROVA_CONFIG__ || {};
const sdk = window.supabase;

const configured = Boolean(
  sdk?.createClient &&
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(config.supabaseUrl || '') &&
  typeof config.supabasePublishableKey === 'string' &&
  config.supabasePublishableKey.length > 20
);

const client = configured
  ? sdk.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

function requireClient() {
  if (!client) throw new Error('O cadastro online ainda não foi ativado. Use a demonstração enquanto concluímos a configuração.');
  return client;
}

function baseUrl() {
  if (['localhost', '127.0.0.1'].includes(window.location.hostname)) return `${window.location.origin}/`;
  if (config.siteUrl) return config.siteUrl.endsWith('/') ? config.siteUrl : `${config.siteUrl}/`;
  const url = new URL(window.location.href);
  url.hash = '';
  url.search = '';
  if (!url.pathname.endsWith('/')) url.pathname = url.pathname.slice(0, url.pathname.lastIndexOf('/') + 1);
  return url.toString();
}

function translateError(error) {
  const messages = {
    user_already_exists: 'Este e-mail já está cadastrado.',
    email_exists: 'Este e-mail já está cadastrado.',
    invalid_credentials: 'E-mail ou senha incorretos.',
    email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
    weak_password: 'Use uma senha mais forte, com pelo menos 8 caracteres.',
    over_email_send_rate_limit: 'Muitas mensagens foram solicitadas. Aguarde alguns minutos e tente novamente.',
    signup_disabled: 'Novos cadastros estão temporariamente desativados.'
  };
  const translated = messages[error?.code];
  return new Error(translated || error?.message || 'Não foi possível concluir. Tente novamente.');
}

function profileRow(userId, profile = {}) {
  return {
    id: userId,
    name: profile.name || '',
    selected_role: profile.selectedRole || null,
    exam_date: profile.examDate || null,
    days_per_week: Number(profile.daysPerWeek) || null,
    hours_per_day: Number(profile.hoursPerDay) || null,
    current_level: profile.level || null,
    difficulties: Array.isArray(profile.difficulties) ? profile.difficulties : [],
    weekly_question_goal: Number(profile.weeklyGoal) || 100,
    preferred_study_time: profile.preferredTime || null,
    updated_at: new Date().toISOString()
  };
}

export function hasCloudBackend() {
  return configured;
}

export function isGoogleCloudEnabled() {
  return configured && config.googleEnabled === true;
}

export async function getCloudSession() {
  if (!client) return null;
  const { data, error } = await client.auth.getSession();
  if (error) throw translateError(error);
  return data.session;
}

export function onCloudAuthStateChange(callback) {
  if (!client) return { unsubscribe() {} };
  const { data } = client.auth.onAuthStateChange(callback);
  return data.subscription;
}

export async function signUpCloud({ name, email, password }) {
  const { data, error } = await requireClient().auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: baseUrl(),
      data: {
        name,
        consent_version: '2026-07-17',
        consented_at: new Date().toISOString()
      }
    }
  });
  if (error) throw translateError(error);
  return data;
}

export async function signInCloud({ email, password }) {
  const { data, error } = await requireClient().auth.signInWithPassword({ email, password });
  if (error) throw translateError(error);
  return data;
}

export async function signInGoogleCloud() {
  if (!isGoogleCloudEnabled()) throw new Error('O login com Google ainda está em configuração. Use e-mail e senha.');
  const { data, error } = await requireClient().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: baseUrl() }
  });
  if (error) throw translateError(error);
  return data;
}

export async function sendPasswordResetCloud(email) {
  const { error } = await requireClient().auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl()}#/recuperar-senha`
  });
  if (error) throw translateError(error);
}

export async function updatePasswordCloud(password) {
  const { error } = await requireClient().auth.updateUser({ password });
  if (error) throw translateError(error);
}

export async function signOutCloud() {
  if (!client) return;
  const { error } = await client.auth.signOut({ scope: 'local' });
  if (error) throw translateError(error);
}

export async function loadCloudData(userId) {
  const db = requireClient();
  const [profileResult, progressResult] = await Promise.all([
    db.from('profiles').select('*').eq('id', userId).maybeSingle(),
    db.from('user_progress').select('state, updated_at').eq('user_id', userId).maybeSingle()
  ]);
  if (profileResult.error) throw translateError(profileResult.error);
  if (progressResult.error) throw translateError(progressResult.error);
  return { profile: profileResult.data, progress: progressResult.data };
}

export async function saveCloudData(userId, state, profile) {
  const db = requireClient();
  const [profileResult, progressResult] = await Promise.all([
    db.from('profiles').upsert(profileRow(userId, profile), { onConflict: 'id' }),
    db.from('user_progress').upsert({
      user_id: userId,
      state,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
  ]);
  if (profileResult.error) throw translateError(profileResult.error);
  if (progressResult.error) throw translateError(progressResult.error);
}

export async function recordCloudAnswer(userId, answer) {
  const { error } = await requireClient().from('question_answers').insert({
    user_id: userId,
    question_id: String(answer.questionId),
    selected_answer: String(answer.selected),
    is_correct: Boolean(answer.correct),
    time_spent_seconds: Number(answer.timeSpent) || 0,
    career: answer.role || null,
    discipline: answer.subject || null,
    topic: answer.topic || null,
    difficulty: answer.difficulty || null,
    question_type: answer.type || null,
    session_kind: answer.session || null
  });
  if (error) throw translateError(error);
}

export async function deleteCloudAccount() {
  const { error } = await requireClient().functions.invoke('delete-account', { body: {} });
  if (error) throw translateError(error);
}
