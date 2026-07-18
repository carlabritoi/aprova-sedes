import {
  EDITAL_URL, QUADRIX_URL, roles, commonSubjects, specificSubjects, makeQuestionSet,
  initialTasks, reviews, flashcards, achievements
} from './data.js';
import {
  deleteCloudAccount, getCloudSession, hasCloudBackend, isGoogleCloudEnabled, loadCloudData,
  onCloudAuthStateChange, recordCloudAnswer, saveCloudData, sendPasswordResetCloud,
  signInCloud, signInGoogleCloud, signOutCloud, signUpCloud, updatePasswordCloud
} from './supabase-client.js';

const app = document.querySelector('#app');
const toastRegion = document.querySelector('#toast-region');

const icons = {
  logo: '<path d="M7 19V7l5-3 5 3v12l-5-3-5 3Z"/><path d="m9.5 10.5 2 2 3.5-4"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z"/><path d="M8 7h8M8 11h6"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4.5V3h6v1.5M8.5 9h7M8.5 13h7M8.5 17H13"/>',
  refresh: '<path d="M20 7h-6V1"/><path d="M20 7a9 9 0 1 0 1 7"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  bot: '<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M8 12h.01M16 12h.01M8 16h8"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 2l.06.06-2.12 2.12-.06-.06a1.8 1.8 0 0 0-2-.36 1.8 1.8 0 0 0-1.1 1.65V20.5h-3v-.09a1.8 1.8 0 0 0-1.1-1.65 1.8 1.8 0 0 0-2 .36l-.06.06-2.12-2.12.06-.06a1.8 1.8 0 0 0 .36-2A1.8 1.8 0 0 0 5 13.9H5v-3h.09A1.8 1.8 0 0 0 6.74 9.8a1.8 1.8 0 0 0-.36-2l-.06-.06 2.12-2.12.06.06a1.8 1.8 0 0 0 2 .36A1.8 1.8 0 0 0 11.6 4.4V4.3h3v.09a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 2-.36l.06-.06 2.12 2.12-.06.06a1.8 1.8 0 0 0-.36 2A1.8 1.8 0 0 0 21.1 10.9h.09v3h-.09A1.8 1.8 0 0 0 19.4 15Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  flame: '<path d="M12 22c4 0 7-3 7-7 0-3-1.5-5.3-4.3-7.7.2 2.2-1 3.4-2 4.1.2-3.7-2.1-6.5-5-8.4.2 4.4-3 6.3-3 10.7C4.7 18.3 7.8 22 12 22Z"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6M12 2v3"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H3v2a4 4 0 0 0 4 4M17 6h4v2a4 4 0 0 1-4 4"/>',
  star: '<path d="m12 2 3 6 7 .9-5 4.7 1.4 6.9L12 17l-6.4 3.5L7 13.6 2 8.9 9 8l3-6Z"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6ZM9 3v15M15 6v15"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
  scale: '<path d="M12 3v18M5 7h14M4 7l-3 6h6L4 7ZM20 7l-3 6h6l-3-6ZM8 21h8"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  landmark: '<path d="m3 10 9-7 9 7M5 10v8M9 10v8M15 10v8M19 10v8M3 18h18M2 22h20"/>',
  message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8M8 13h5"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"/>',
  archive: '<path d="M4 7v14h16V7M2 3h20v4H2zM9 11h6"/>',
  box: '<path d="m21 8-9 5-9-5 9-5 9 5ZM3 8v10l9 5 9-5V8M12 13v10"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M8 13v9l4-2 4 2v-9"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
  lightbulb: '<path d="M9 18h6M10 22h4M8.5 15.5A7 7 0 1 1 15.5 15.5c-.9.7-1.5 1.4-1.5 2.5h-4c0-1.1-.6-1.8-1.5-2.5Z"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4V3Z"/>',
  flag: '<path d="M5 22V4M5 5h12l-2 4 2 4H5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  alert: '<path d="M10.3 3.8 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.8a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 21h16"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  zap: '<path d="m13 2-9 12h8l-1 8 9-12h-8l1-8Z"/>',
  brain: '<path d="M9.5 4A3.5 3.5 0 0 0 6 7.5c0 .2 0 .4.1.6A4 4 0 0 0 7 16v.5A3.5 3.5 0 0 0 10.5 20H12V4H9.5ZM14.5 4A3.5 3.5 0 0 1 18 7.5c0 .2 0 .4-.1.6A4 4 0 0 1 17 16v.5a3.5 3.5 0 0 1-3.5 3.5H12V4h2.5Z"/><path d="M8 9h4M12 14h4"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  external: '<path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  filter: '<path d="M4 5h16M7 12h10M10 19h4"/>',
  paperclip: '<path d="m21 11.5-8.5 8.5a6 6 0 0 1-8.5-8.5l9-9a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 0 1-2.9-2.8l8.4-8.4"/>',
  send: '<path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/>',
  printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/>'
};

function icon(name, cls = '') {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.star}</svg>`;
}

function readLocal(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}

const defaultUser = {
  id: 'demo-user', name: 'Mariana', email: 'mariana@exemplo.com', role: 'student',
  profile: { selectedRole: 'tecnico', examDate: '2026-09-06', daysPerWeek: 6, hoursPerDay: 2, level: 'Intermediário', weeklyGoal: 180, preferredTime: 'Noite' }
};

const state = {
  auth: readLocal('aprova_auth', null),
  user: readLocal('aprova_user', defaultUser),
  dark: readLocal('aprova_dark', false),
  sidebar: false,
  tasks: readLocal('aprova_tasks', initialTasks),
  stats: readLocal('aprova_stats', { questions: 324, correct: 246, accuracy: 76, streak: 9, hours: 42.5, reviews: 8, simulations: 3, weeklyDone: 126, weeklyGoal: 180 }),
  questionIndex: 0,
  practiceQuestions: makeQuestionSet(readLocal('aprova_user', defaultUser).profile?.selectedRole || 'tecnico', 24),
  practiceAnswers: {},
  practiceConfirmed: {},
  practiceFavorites: readLocal('aprova_favorites', []),
  exam: readLocal('aprova_exam', null),
  lastResult: readLocal('aprova_result', null),
  onboardingStep: 1,
  onboarding: { selectedRole: 'tecnico', examDate: '2026-09-06', daysPerWeek: 6, hoursPerDay: 2, level: 'Intermediário', difficulties: ['Direito Administrativo'], weeklyGoal: 180, preferredTime: 'Noite' },
  flashIndex: 0,
  flashFlipped: false,
  chat: readLocal('aprova_chat', [{ from: 'ai', text: 'Olá, Mariana! Analisei seu plano e seu desempenho recente. Você tem 1h50 de estudo previsto hoje. Posso explicar uma questão, reorganizar sua semana ou indicar sua prioridade agora.' }]),
  modal: null,
  routeAfterAuth: null,
  examTimer: null,
  passwordRecovery: false
};

let cloudSyncEnabled = false;
let cloudSyncTimer = null;
let activeCloudUserId = null;

document.body.classList.toggle('dark', state.dark);

function cloudSnapshot() {
  return {
    tasks: state.tasks,
    stats: state.stats,
    favorites: state.practiceFavorites,
    chat: state.chat,
    exam: state.exam,
    lastResult: state.lastResult,
    onboarding: state.onboarding
  };
}

function scheduleCloudSync() {
  if (!cloudSyncEnabled || !activeCloudUserId || state.auth?.provider !== 'supabase') return;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(async () => {
    try {
      await saveCloudData(activeCloudUserId, cloudSnapshot(), { name: state.user.name, ...state.user.profile });
    } catch (error) {
      console.error('Falha ao sincronizar o progresso.', error);
      toast('Seu progresso ficou salvo neste dispositivo e será sincronizado quando a conexão voltar.', 'error');
    }
  }, 700);
}

function saveState({ syncCloud = true } = {}) {
  localStorage.setItem('aprova_user', JSON.stringify(state.user));
  localStorage.setItem('aprova_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('aprova_stats', JSON.stringify(state.stats));
  localStorage.setItem('aprova_favorites', JSON.stringify(state.practiceFavorites));
  localStorage.setItem('aprova_chat', JSON.stringify(state.chat));
  localStorage.setItem('aprova_dark', JSON.stringify(state.dark));
  if (state.auth) localStorage.setItem('aprova_auth', JSON.stringify(state.auth)); else localStorage.removeItem('aprova_auth');
  if (state.exam) localStorage.setItem('aprova_exam', JSON.stringify(state.exam)); else localStorage.removeItem('aprova_exam');
  if (state.lastResult) localStorage.setItem('aprova_result', JSON.stringify(state.lastResult));
  if (syncCloud) scheduleCloudSync();
}

function toast(message, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type === 'error' ? 'error' : ''}`;
  el.innerHTML = `${icon(type === 'error' ? 'alert' : 'checkCircle')}<span>${message}</span>`;
  toastRegion.appendChild(el);
  setTimeout(() => el.remove(), 3600);
}

function getRoute() {
  return (location.hash.replace(/^#\/?/, '') || 'inicio').split('?')[0];
}

function navigate(route) {
  state.sidebar = false;
  if (location.hash === `#/${route}`) render(); else location.hash = `#/${route}`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'AS';
}

function roleData() {
  return roles[state.user?.profile?.selectedRole || 'tecnico'];
}

function daysUntil(dateString) {
  const exam = new Date(`${dateString || '2026-09-06'}T12:00:00`);
  const now = new Date();
  return Math.max(0, Math.ceil((exam - now) / 86400000));
}

function pct(n, total) { return total ? Math.round((n / total) * 100) : 0; }
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600); const m = Math.floor((seconds % 3600) / 60); const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function logo(light = false) {
  return `<a class="brand" href="#/inicio" data-route="inicio"><span class="brand-mark">${icon('logo')}</span><span>Aprova SEDES<small>${light ? 'Preparação inteligente' : 'SEDES/DF • Quadrix'}</small></span></a>`;
}

function landingPage() {
  const benefits = [
    ['calendar', 'Plano personalizado', 'Sua rotina adaptada ao tempo disponível, desempenho e proximidade da prova.'],
    ['bot', 'Questões com IA', 'Itens inéditos, explicados e vinculados ao conteúdo programático.'],
    ['timer', 'Simulados Quadrix', '60 questões, 4 horas e pontuação conforme o edital vigente.'],
    ['refresh', 'Revisão inteligente', 'Ciclos de 24h, 7, 30 e 90 dias priorizados por dificuldade.'],
    ['chart', 'Desempenho claro', 'Gráficos simples para transformar resultados em decisões de estudo.'],
    ['archive', 'Caderno de erros', 'Cada erro se transforma automaticamente em uma nova revisão.'],
    ['target', 'Metas semanais', 'Ritmo sustentável com acompanhamento da sua consistência.'],
    ['file', 'Estudo pelo edital', 'Conteúdo organizado item por item, com controle de versão.'],
    ['edit', 'Treino discursivo', 'Temas específicos e avaliação formativa baseada nos critérios do edital.'],
    ['trophy', 'Conquistas', 'Gamificação equilibrada para manter a motivação sem perder o foco.']
  ];
  return `<div class="landing">
    <nav class="public-nav" aria-label="Navegação principal">
      ${logo(true)}
      <div class="public-links"><a href="#beneficios">Recursos</a><a href="#cargos">Cargos</a><a href="#edital-oficial">Edital</a><a href="#como-funciona">Como funciona</a></div>
      <div class="public-actions"><button class="btn btn-ghost btn-sm" data-route="login">Entrar</button><button class="btn btn-primary btn-sm" data-route="cadastro">Começar grátis ${icon('arrowRight','icon-sm')}</button></div>
    </nav>
    <main id="main">
      <section class="hero">
        <div class="hero-inner">
          <div class="hero-copy">
            <span class="badge badge-dark">${icon('zap','icon-sm')} Edital 01/2026 atualizado</span>
            <h1>Sua aprovação na SEDES/DF começa com um <span>plano inteligente.</span></h1>
            <p>Estude pelo edital, resolva questões no estilo Quadrix e acompanhe sua evolução com inteligência artificial.</p>
            <div class="hero-actions"><button class="btn btn-primary btn-lg" data-route="cadastro">Começar agora ${icon('arrowRight')}</button><button class="btn btn-white btn-lg" data-action="demo-diagnostic">${icon('clipboard')} Fazer diagnóstico</button></div>
            <div class="hero-trust"><span>${icon('checkCircle')} Gratuito e acessível</span><span>${icon('checkCircle')} Progresso salvo</span><span>${icon('checkCircle')} Sem promessa de aprovação</span></div>
          </div>
          <div class="hero-panel" aria-label="Prévia do painel do aluno">
            <div class="preview-card">
              <div class="preview-top"><div class="preview-user"><span class="avatar">MS</span><div><strong>Bom dia, Mariana!</strong><div class="small muted">Seu plano está pronto</div></div></div><span class="badge badge-success">${icon('flame','icon-sm')} 9 dias</span></div>
              <div class="preview-main">
                <div class="preview-chart"><span class="small muted">Evolução semanal</span><strong>76%</strong><span class="badge badge-success">+8% no mês</span>
                  <svg class="mini-chart" viewBox="0 0 280 115" role="img" aria-label="Evolução de 58 a 76 por cento"><defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#278ce4" stop-opacity=".27"/><stop offset="1" stop-color="#278ce4" stop-opacity="0"/></linearGradient></defs><path class="area" d="M0 94 C35 90 39 66 70 73 S119 80 142 54 S188 67 210 42 S250 39 280 17 V115 H0Z"/><path class="line" d="M0 94 C35 90 39 66 70 73 S119 80 142 54 S188 67 210 42 S250 39 280 17"/></svg>
                </div>
                <div class="preview-side"><span class="small muted">Meta semanal</span><div class="ring" style="--value:70"><b>126/180</b></div><div class="small muted" style="text-align:center">54 questões restantes</div></div>
                <div class="preview-task"><span class="preview-task-icon">${icon('book')}</span><div style="flex:1"><strong class="small">Próxima tarefa</strong><div class="small muted">LC nº 840 • Provimento e vacância</div><div class="progress"><div class="progress-bar" style="width:42%"></div></div></div><button class="btn btn-primary btn-sm" data-action="demo-login">Continuar</button></div>
              </div>
              <div class="floating-note"><span class="check">${icon('checkCircle','icon-sm')}</span><span>Meta diária concluída<br><small class="muted">+25 pontos</small></span></div>
            </div>
          </div>
        </div>
      </section>
      <section id="beneficios" class="section section-soft"><div class="section-inner"><div class="section-head center"><span class="eyebrow">Preparação completa</span><h2>Tudo o que você precisa, em um único lugar</h2><p>Um ambiente que transforma o edital e o seu desempenho em um próximo passo claro.</p></div><div class="benefit-grid">${benefits.map(([i,t,d]) => `<article class="benefit-card"><span class="benefit-icon">${icon(i)}</span><h3>${t}</h3><p>${d}</p></article>`).join('')}</div></div></section>
      <section id="cargos" class="section"><div class="section-inner"><div class="section-head"><span class="eyebrow">Escolha seu cargo</span><h2>Conteúdo específico para sua prova</h2><p>Cada trilha considera a estrutura, os objetos de avaliação e os critérios do Edital nº 1/2026.</p></div><div class="role-grid">${Object.values(roles).map((role, idx) => `<article class="role-card"><div class="role-top"><div><span class="role-icon">${icon(idx ? 'heart' : 'briefcase')}</span><span class="badge">Cargo ${role.code} • ${role.level}</span><h3>${role.name}</h3><p>${role.fullName}</p></div><span class="badge badge-success">${role.topics} tópicos</span></div><div class="subject-pills">${role.subjects.slice(0,6).map(s=>`<span>${s}</span>`).join('')}<span>+${role.subjects.length-6} disciplinas</span></div><div class="role-actions"><button class="btn btn-primary" data-action="select-role" data-role="${role.id}">Selecionar cargo</button><button class="btn btn-outline" data-action="view-role" data-role="${role.id}">Ver conteúdo</button></div></article>`).join('')}</div></div></section>
      <section id="edital-oficial" class="section section-soft"><div class="section-inner"><div class="official-strip"><div><span class="badge badge-dark">Fonte oficial verificada</span><h2 style="margin:12px 0 0">Edital SEDES/DF nº 1/2026</h2><p>Versão atualizada conforme as retificações nº 2 e nº 3.</p></div><div class="official-meta"><div><small>Prova</small><strong>06/09/2026</strong></div><div><small>Objetiva</small><strong>60 questões</strong></div><div><small>Duração</small><strong>4 horas</strong></div><a class="btn btn-white" href="${EDITAL_URL}" target="_blank" rel="noopener">Ver edital ${icon('external','icon-sm')}</a></div></div></div></section>
      <section id="como-funciona" class="section"><div class="section-inner"><div class="cta-box"><div><span class="badge badge-dark">Comece em poucos minutos</span><h2>Seu desempenho indica o próximo passo.</h2><p>Faça o diagnóstico, receba um plano inicial e transforme cada sessão de estudo em dados para sua próxima recomendação.</p></div><div class="cta-actions"><button class="btn btn-white btn-lg" data-route="cadastro">Criar conta grátis</button><button class="btn btn-ghost btn-lg" style="color:white" data-action="demo-login">Explorar demonstração</button></div></div></div></section>
    </main>
    <footer class="footer"><div class="footer-grid"><div class="footer-intro">${logo()}<p>Preparação estratégica para maximizar suas chances de aprovação, com método, dados e inteligência artificial.</p></div><div><h4>Plataforma</h4><a href="#beneficios">Recursos</a><a href="#cargos">Cargos</a><a href="#edital-oficial">Edital</a></div><div><h4>Suporte</h4><a href="${QUADRIX_URL}" target="_blank">Página oficial do concurso</a><a href="#/configuracoes">Acessibilidade</a><a href="#/inicio">Ajuda</a></div><div><h4>Legal</h4><a href="#/inicio">Privacidade e LGPD</a><a href="#/inicio">Termos de uso</a><a href="#/inicio">Fontes oficiais</a></div></div><div class="footer-bottom"><span>© 2026 Aprova SEDES. Projeto educacional independente.</span><span>Não possui vínculo oficial com a SEDES/DF ou o Instituto Quadrix.</span></div></footer>
  </div>`;
}

function authPage(mode = 'login') {
  const isRegister = mode === 'cadastro';
  return `<main id="main" class="auth-layout">
    <section class="auth-visual"><div>${logo()}</div><div class="auth-message"><span class="badge badge-dark">${icon('brain','icon-sm')} Preparação adaptativa</span><h1>${isRegister ? 'Construa uma rotina que cabe na sua vida.' : 'Continue de onde parou.'}</h1><p>${isRegister ? 'Seu plano combina edital, tempo disponível e desempenho para definir o que estudar a cada dia.' : 'Seu plano, suas revisões e todo o histórico de desempenho estão esperando por você.'}</p></div><div class="auth-proof">${icon('shield')}<div><strong>Seus dados protegidos</strong><div class="small" style="color:#b9ccdf">Controles de privacidade e exclusão conforme a LGPD.</div></div></div></section>
    <section class="auth-main"><div class="auth-card"><a class="auth-back" href="#/inicio" data-route="inicio">${icon('arrowLeft','icon-sm')} Voltar para o início</a><h2>${isRegister ? 'Crie sua conta grátis' : 'Bem-vindo de volta'}</h2><p>${isRegister ? 'Comece sua preparação estratégica para a SEDES/DF.' : 'Entre para acessar seu plano de estudos.'}</p>
      <form id="auth-form" data-mode="${mode}">
        ${isRegister ? `<div class="form-group"><label for="name">Nome completo</label><div class="input-wrap">${icon('user','icon-sm')}<input class="input" id="name" name="name" autocomplete="name" required placeholder="Como podemos chamar você?"></div></div>` : ''}
        <div class="form-group"><label for="email">E-mail</label><div class="input-wrap">${icon('mail','icon-sm')}<input class="input" id="email" name="email" type="email" autocomplete="email" required placeholder="voce@exemplo.com"></div></div>
        <div class="form-group"><label for="password">Senha</label><div class="input-wrap">${icon('lock','icon-sm')}<input class="input" id="password" name="password" type="password" autocomplete="${isRegister ? 'new-password' : 'current-password'}" minlength="8" required placeholder="${isRegister ? 'Mínimo de 8 caracteres' : 'Digite sua senha'}"></div></div>
        ${isRegister ? `<label class="checkbox" style="margin:-3px 0 21px"><input type="checkbox" name="consent" value="accepted" required> Li e concordo com os Termos e a Política de Privacidade.</label>` : `<div class="check-row"><label class="checkbox"><input type="checkbox" name="remember" checked> Permanecer conectado</label><a class="text-link" href="#/recuperar-senha">Esqueci a senha</a></div>`}
        <div id="auth-error"></div><button class="btn btn-primary btn-lg" type="submit">${isRegister ? 'Criar minha conta' : 'Entrar na minha conta'} ${icon('arrowRight','icon-sm')}</button>
      </form>
      <div class="divider">ou continue com</div><button class="btn btn-outline btn-lg google-btn" data-action="google-login" ${isGoogleCloudEnabled()?'':'disabled aria-disabled="true"'}><span class="google-logo">G</span> ${isGoogleCloudEnabled()?'Google':'Google — em configuração'}</button>
      <button class="btn btn-ghost" style="width:100%;margin-top:10px" data-action="demo-login">Explorar com dados demonstrativos</button>
      <div class="auth-switch">${isRegister ? 'Já tem uma conta? <a href="#/login">Entrar</a>' : 'Ainda não tem conta? <a href="#/cadastro">Criar conta grátis</a>'}</div>
    </div></section>
  </main>`;
}

function recoverPage() {
  const form = state.passwordRecovery
    ? `<h2>Crie uma nova senha</h2><p>Use pelo menos 8 caracteres.</p><form id="reset-password-form"><div class="form-group"><label for="new-password">Nova senha</label><div class="input-wrap">${icon('lock','icon-sm')}<input class="input" id="new-password" name="password" type="password" minlength="8" autocomplete="new-password" required placeholder="Mínimo de 8 caracteres"></div></div><div id="auth-error"></div><button class="btn btn-primary btn-lg" type="submit">Salvar nova senha</button></form>`
    : `<h2>Esqueceu sua senha?</h2><p>Digite seu e-mail para receber o link de recuperação.</p><form id="recover-form"><div class="form-group"><label for="email">E-mail</label><div class="input-wrap">${icon('mail','icon-sm')}<input class="input" id="email" name="email" type="email" required placeholder="voce@exemplo.com"></div></div><div id="auth-error"></div><button class="btn btn-primary btn-lg" type="submit">Enviar instruções</button></form>`;
  return `<main id="main" class="auth-layout"><section class="auth-visual"><div>${logo()}</div><div class="auth-message"><span class="badge badge-dark">${icon('lock','icon-sm')} Acesso seguro</span><h1>Recupere seu acesso.</h1><p>Proteja sua conta com uma senha forte e exclusiva.</p></div><div></div></section><section class="auth-main"><div class="auth-card"><a class="auth-back" href="#/login">${icon('arrowLeft','icon-sm')} Voltar para o login</a>${form}</div></section></main>`;
}

const navSections = [
  ['Visão geral', [['dashboard','home','Início'], ['plano','calendar','Plano de estudos'], ['revisoes','refresh','Revisões', '8']]],
  ['Estudar', [['disciplinas','book','Disciplinas'], ['edital','clipboard','Conteúdo do edital'], ['resumos','file','Resumos'], ['mapas-mentais','brain','Mapas mentais'], ['lei-seca','scale','Lei seca'], ['flashcards','layers','Flashcards']]],
  ['Praticar', [['questoes','checkCircle','Banco de questões'], ['simulados','timer','Simulados'], ['discursiva','edit','Discursiva'], ['caderno-erros','archive','Caderno de erros']]],
  ['Evolução', [['estatisticas','chart','Desempenho'], ['assistente','bot','Assistente de IA']]],
  ['Conta', [['perfil','user','Perfil'], ['assinatura','star','Plano gratuito'], ['configuracoes','settings','Configurações']]]
];

const routeTitles = {
  dashboard: 'Visão geral', plano: 'Plano de estudos', revisoes: 'Revisões', disciplinas: 'Disciplinas', edital: 'Conteúdo do edital',
  resumos: 'Resumos', 'mapas-mentais': 'Mapas mentais', 'lei-seca': 'Lei seca', flashcards: 'Flashcards', questoes: 'Banco de questões', simulados: 'Simulados',
  discursiva: 'Treino discursivo', 'caderno-erros': 'Caderno de erros', estatisticas: 'Desempenho', assistente: 'Assistente de IA',
  perfil: 'Perfil', configuracoes: 'Configurações', admin: 'Administração', assinatura: 'Plano gratuito'
};

function sidebar(route) {
  return `<aside class="sidebar ${state.sidebar ? 'open' : ''}" aria-label="Menu da plataforma">
    <div class="side-brand">${logo()}</div>
    <nav class="side-nav">${navSections.map(([label, links]) => `<div class="nav-label">${label}</div>${links.map(([r,i,t,c]) => `<button class="nav-link ${route === r ? 'active':''}" data-route="${r}">${icon(i)}<span>${t}</span>${c ? `<span class="nav-count">${c}</span>`:''}</button>`).join('')}`).join('')}${state.user.role === 'admin' || state.auth?.token === 'demo' ? `<div class="nav-label">Gestão</div><button class="nav-link ${route === 'admin'?'active':''}" data-route="admin">${icon('shield')}<span>Painel administrativo</span><span class="nav-count">demo</span></button>` : ''}</nav>
    <div class="side-bottom"><div class="side-goal"><div class="side-goal-top"><span>Meta semanal</span><strong>${state.stats.weeklyDone}/${state.stats.weeklyGoal}</strong></div><div class="progress"><div class="progress-bar progress-green" style="width:${Math.min(100,pct(state.stats.weeklyDone,state.stats.weeklyGoal))}%"></div></div></div><div class="sidebar-user" data-route="perfil"><span class="avatar">${initials(state.user.name)}</span><div><strong>${escapeHtml(state.user.name)}</strong><span>${roleData().short} • Cargo ${roleData().code}</span></div>${icon('more','icon-sm')}</div></div>
  </aside>`;
}

function topbar(route) {
  return `<header class="topbar"><div class="topbar-left"><button class="btn btn-ghost btn-icon menu-btn" data-action="toggle-sidebar" aria-label="Abrir menu">${icon('menu')}</button><div class="page-crumb">Aprova SEDES&nbsp; / &nbsp;<strong>${routeTitles[route] || 'Área do aluno'}</strong></div></div><div class="topbar-actions"><button class="search-trigger" data-action="search">${icon('search','icon-sm')} Buscar conteúdo <kbd>Ctrl K</kbd></button><button class="btn btn-ghost btn-icon" data-action="toggle-dark" aria-label="Alternar tema">${icon(state.dark ? 'sun':'moon')}</button><button class="btn btn-ghost btn-icon notify-dot" data-action="notifications" aria-label="Notificações">${icon('bell')}</button></div></header>`;
}

function appShell(route, content) {
  return `<div class="app-shell">${sidebar(route)}<div class="mobile-overlay ${state.sidebar ? 'open':''}" data-action="toggle-sidebar"></div><div class="app-main">${topbar(route)}<main id="main" class="page">${content}</main></div></div>${modalHtml()}`;
}

function modalHtml() {
  if (!state.modal) return '';
  return `<div class="modal-backdrop" data-action="modal-backdrop"><div class="modal ${state.modal.large ? 'modal-lg':''}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><h2 id="modal-title">${state.modal.title}</h2><button class="btn btn-ghost btn-icon" data-action="close-modal" aria-label="Fechar">${icon('x')}</button></div><div class="modal-body">${state.modal.body}</div>${state.modal.footer ? `<div class="modal-footer">${state.modal.footer}</div>`:''}</div></div>`;
}

function onboardingPage() {
  const step = state.onboardingStep;
  const content = step === 1 ? `<h1>Qual cargo você vai conquistar?</h1><p>O plano e o conteúdo serão personalizados para a sua escolha.</p><div class="choice-grid">${Object.values(roles).map(role => `<button class="choice-card ${state.onboarding.selectedRole===role.id?'selected':''}" data-action="onboard-role" data-role="${role.id}"><span class="choice-check">${icon('checkCircle','icon-sm')}</span><span class="feature-icon">${icon(role.id==='tecnico'?'clipboard':'heart')}</span><h3>${role.name}</h3><p>${role.fullName}<br>${role.topics} tópicos do edital</p></button>`).join('')}</div>`
  : step === 2 ? `<h1>Como é sua rotina de estudos?</h1><p>Use dados realistas. Você poderá mudar isso quando quiser.</p><div class="form-row" style="margin-top:24px"><div class="form-group"><label>Data prevista da prova</label><input class="input" type="date" id="onboard-date" value="${state.onboarding.examDate}"></div><div class="form-group"><label>Nível atual</label><select class="select" id="onboard-level">${['Inicial','Básico','Intermediário','Avançado'].map(v=>`<option ${v===state.onboarding.level?'selected':''}>${v}</option>`).join('')}</select></div></div><div class="form-group"><label>Dias disponíveis por semana</label><div class="range-row"><input class="range" id="onboard-days" type="range" min="2" max="7" value="${state.onboarding.daysPerWeek}"><input class="input" value="${state.onboarding.daysPerWeek} dias" readonly></div></div><div class="form-group"><label>Horas disponíveis por dia</label><div class="range-row"><input class="range" id="onboard-hours" type="range" min="1" max="6" step=".5" value="${state.onboarding.hoursPerDay}"><input class="input" value="${state.onboarding.hoursPerDay}h" readonly></div></div><div class="form-row"><div class="form-group"><label>Meta semanal de questões</label><input class="input" id="onboard-goal" type="number" min="20" max="1000" value="${state.onboarding.weeklyGoal}"></div><div class="form-group"><label>Horário preferido</label><select class="select" id="onboard-time">${['Manhã','Tarde','Noite','Flexível'].map(v=>`<option ${v===state.onboarding.preferredTime?'selected':''}>${v}</option>`).join('')}</select></div></div>`
  : `<h1>Seu ponto de partida</h1><p>Selecione as disciplinas que hoje exigem mais atenção.</p><div class="choice-grid">${[...commonSubjects,...specificSubjects[state.onboarding.selectedRole]].slice(0,8).map(s=>`<button class="choice-card ${state.onboarding.difficulties.includes(s.name)?'selected':''}" data-action="toggle-difficulty" data-value="${s.name}"><span class="choice-check">${icon('checkCircle','icon-sm')}</span><span class="feature-icon">${icon(s.icon)}</span><h3>${s.name}</h3><p>Desempenho inicial estimado: ${s.accuracy}%</p></button>`).join('')}</div><div class="notice" style="margin-top:18px">${icon('lightbulb')} O diagnóstico ajustará estas prioridades com base nas suas respostas.</div>`;
  return `<main id="main" class="onboarding"><div class="onboard-card"><div class="onboard-top">${logo()}<div class="steps">${[1,2,3].map((n)=>`<div class="step ${step===n?'active':step>n?'done':''}"><span class="step-no">${step>n?icon('checkCircle','icon-sm'):n}</span><span class="step-label">${['Cargo','Disponibilidade','Prioridades'][n-1]}</span></div>`).join('')}</div></div><div class="onboard-body">${content}</div><div class="onboard-footer"><button class="btn btn-ghost" data-action="onboard-back" ${step===1?'disabled':''}>${icon('arrowLeft','icon-sm')} Voltar</button><span class="small muted">Etapa ${step} de 3</span><button class="btn btn-primary" data-action="onboard-next">${step===3?'Gerar meu plano':'Continuar'} ${icon('arrowRight','icon-sm')}</button></div></div></main>`;
}

function pageHeader(title, subtitle, actions = '') {
  return `<div class="page-header"><div><h1>${title}</h1><p>${subtitle}</p></div>${actions ? `<div class="page-actions">${actions}</div>`:''}</div>`;
}

function lineChart(values = [58,62,60,67,71,69,76], labels = ['10/06','17/06','24/06','01/07','08/07','15/07','Hoje']) {
  const max=100, min=40, w=620, h=190, pad=28;
  const pts=values.map((v,i)=>({x:pad+i*((w-pad*2)/(values.length-1)), y:h-pad-((v-min)/(max-min))*(h-pad*2)}));
  const path=pts.map((p,i)=>`${i?'L':'M'} ${p.x} ${p.y}`).join(' ');
  const area=`${path} L ${pts.at(-1).x} ${h-pad} L ${pts[0].x} ${h-pad} Z`;
  return `<svg class="weekly-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Evolução de desempenho">${[50,60,70,80,90].map(v=>{const y=h-pad-((v-min)/(max-min))*(h-pad*2);return `<line class="chart-grid" x1="${pad}" y1="${y}" x2="${w-pad}" y2="${y}"/><text class="chart-label" x="0" y="${y+3}">${v}%</text>`}).join('')}<defs><linearGradient id="dashboardArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1477d4" stop-opacity=".22"/><stop offset="1" stop-color="#1477d4" stop-opacity="0"/></linearGradient></defs><path class="chart-area" d="${area}"/><path class="chart-line" d="${path}"/>${pts.map((p,i)=>`<circle class="chart-dot" cx="${p.x}" cy="${p.y}" r="4"/><text class="chart-label" x="${p.x}" y="${h-5}" text-anchor="middle">${labels[i]}</text>`).join('')}</svg>`;
}

function dashboardPage() {
  const completed = state.tasks.filter(t=>t.done).length;
  const first = escapeHtml((state.user.name || 'Estudante').split(' ')[0]);
  const statItems = [
    ['checkCircle','Questões resolvidas',state.stats.questions,'+42 esta semana',''],['target','Acertos gerais',`${state.stats.accuracy}%`,'+3,2%','green-bg'],['flame','Sequência',`${state.stats.streak} dias`,'Recorde: 12','amber-bg'],['clock','Horas estudadas',`${state.stats.hours}h`,'+6h esta semana','purple-bg'],['refresh','Revisões pendentes',state.stats.reviews,'3 prioritárias','amber-bg'],['timer','Simulados',state.stats.simulations,'Último: 78%','green-bg']
  ];
  return appShell('dashboard', `<div class="welcome-banner"><div><h1>Olá, ${first}! Pronta para avançar? 👋</h1><p>Seu foco de hoje: <strong>Lei Complementar nº 840/2011</strong> e revisão de <strong>NOB/SUAS</strong>.</p></div><div class="countdown">${icon('calendar')}<div><b>${daysUntil(state.user.profile.examDate)} dias</b><small>até a prova • 06 set 2026</small></div></div></div>
    <div class="stat-grid">${statItems.map(([i,l,v,d,c])=>`<div class="stat-card"><div class="stat-card-top"><span>${l}</span><span class="stat-icon ${c}">${icon(i,'icon-sm')}</span></div><div class="stat-value"><strong>${v}</strong><small>${d}</small></div></div>`).join('')}</div>
    <div class="dashboard-grid"><section class="card today-card"><div class="card-title"><div><h2>Plano de hoje</h2><p>${new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'2-digit',month:'long'}).format(new Date())} • 1h50 planejadas</p></div><button class="btn btn-outline btn-sm" data-route="plano">Ver plano completo ${icon('chevronRight','icon-sm')}</button></div><div class="today-progress"><span class="feature-icon">${icon('target')}</span><div><div style="display:flex;justify-content:space-between;font-size:11px"><strong>${completed} de ${state.tasks.length} tarefas concluídas</strong><span class="muted">${pct(completed,state.tasks.length)}%</span></div><div class="progress"><div class="progress-bar progress-green" style="width:${pct(completed,state.tasks.length)}%"></div></div></div><span class="badge badge-success">+${completed*25} pts</span></div>${state.tasks.slice(0,4).map(taskRow).join('')}<div class="quick-grid">${[['play','Estudar agora','Retome seu plano','plano'],['checkCircle','Resolver questões','Sessão de 20 itens','questoes'],['timer','Fazer simulado','Treino cronometrado','simulados'],['archive','Revisar erros','8 revisões hoje','caderno-erros']].map(([i,t,s,r])=>`<button class="quick-card" data-route="${r}"><span class="quick-icon">${icon(i,'icon-sm')}</span><span><strong>${t}</strong><span>${s}</span></span></button>`).join('')}</div></section>
    <aside class="stack"><section class="card card-pad"><div class="card-title"><div><h3>Assuntos prioritários</h3><p>Recalculados pelo seu desempenho</p></div>${icon('bot')}</div><div class="priority-list">${[['#e34f5f','NOB/SUAS',48],['#ec702b','LC nº 840/2011',54],['#eea71b','Arquivologia',63],['#15a369','Língua Portuguesa',81]].map(([c,n,v])=>`<div class="priority-row"><span class="priority-dot" style="background:${c}"></span><div><strong>${n}</strong><div class="progress"><div class="progress-bar" style="width:${v}%;background:${c}"></div></div></div><b>${v}%</b></div>`).join('')}</div><button class="btn btn-secondary btn-sm" style="width:100%;margin-top:18px" data-route="revisoes">Iniciar revisão prioritária</button></section><section class="card card-pad"><div class="card-title"><div><h3>Meta semanal</h3><p>126 de 180 questões</p></div><span class="badge badge-success">70%</span></div><div class="progress" style="height:9px"><div class="progress-bar progress-green" style="width:70%"></div></div><p class="small muted" style="margin:12px 0 0">Faltam 54 questões. Mantendo o ritmo, você conclui na sexta-feira.</p></section></aside></div>
    <div class="grid grid-2" style="margin-top:18px"><section class="card card-pad"><div class="card-title"><div><h3>Evolução semanal</h3><p>Percentual de acertos • média móvel</p></div><span class="badge badge-success">+8% no período</span></div>${lineChart()}</section><section class="card card-pad"><div class="card-title"><div><h3>Conquistas recentes</h3><p>Consistência também é progresso</p></div><button class="btn btn-ghost btn-sm">Ver todas</button></div><div class="stack">${achievements.slice(0,4).map(a=>`<div style="display:flex;align-items:center;gap:12px;opacity:${a.earned?1:.45}"><span class="feature-icon" style="color:${a.earned?'var(--amber)':'var(--muted)'};background:${a.earned?'var(--amber-soft)':'var(--canvas)'}">${icon(a.icon)}</span><div style="flex:1"><strong class="small">${a.name}</strong><div class="small muted">${a.earned?'Conquista desbloqueada':'Continue estudando para desbloquear'}</div></div>${a.earned?icon('checkCircle','green'):icon('lock')}</div>`).join('')}</div></section></div>`);
}

function taskRow(task) {
  return `<div class="plan-task ${task.done?'done':''}" data-task="${task.id}"><button class="task-check ${task.done?'done':''}" data-action="toggle-task" data-id="${task.id}" aria-label="${task.done?'Reabrir':'Concluir'} tarefa">${icon('checkCircle','icon-sm')}</button><div><div class="task-name">${task.subject}</div><div class="task-meta"><span>${icon('clock','icon-sm')} ${task.duration}</span><span>${icon('book','icon-sm')} ${task.topic}</span><span class="badge">${task.type}</span></div></div><span class="task-type">${icon(task.icon,'icon-sm')}</span></div>`;
}

function questionsPage() {
  const q = state.practiceQuestions[state.questionIndex];
  const chosen = state.practiceAnswers[q.id];
  const confirmed = state.practiceConfirmed[q.id];
  const favorite = state.practiceFavorites.includes(q.id);
  return appShell('questoes', `${pageHeader('Banco de questões','Treine com questões inéditas alinhadas ao conteúdo do edital e ao formato da prova.',`<button class="btn btn-outline">${icon('filter','icon-sm')} Meus filtros</button><button class="btn btn-primary" data-action="new-practice">${icon('zap','icon-sm')} Gerar nova sessão</button>`)}
    <div class="filter-bar"><div class="filter-search">${icon('search','icon-sm')}<input class="input" placeholder="Buscar disciplina ou assunto"></div><select class="select"><option>${roleData().name}</option></select><select class="select"><option>Todas as disciplinas</option>${roleData().subjects.map(s=>`<option>${s}</option>`).join('')}</select><select class="select"><option>Todos os níveis</option><option>Fácil</option><option>Médio</option><option>Difícil</option></select><select class="select" id="question-mode"><option>Modo estudo</option><option>Modo prova</option><option>Modo revisão</option></select></div>
    <div class="question-layout"><section class="card question-card"><header class="question-head"><div class="question-meta"><span class="badge">Questão ${state.questionIndex+1} de ${state.practiceQuestions.length}</span><span class="badge ${q.difficulty==='Difícil'?'badge-warning':''}">${q.difficulty}</span><span class="small muted">${q.area}</span></div><div class="question-tools"><button class="btn btn-ghost btn-icon ${favorite?'green':''}" data-action="favorite-question" title="Favoritar">${icon('bookmark')}</button><button class="btn btn-ghost btn-icon" data-action="report-question" title="Reportar">${icon('flag')}</button></div></header><div class="question-body"><div class="question-context">${icon('book','icon-sm')} ${q.subject} <span>•</span> ${q.topic}</div><div class="question-text">${q.text}</div><div class="answers">${q.options.map((opt,i)=>{const cls=confirmed?(i===q.answer?'correct':i===chosen?'incorrect':''):(i===chosen?'selected':'');return `<button class="answer-option ${cls}" data-action="select-answer" data-index="${i}" ${confirmed?'disabled':''}><span class="answer-letter">${String.fromCharCode(65+i)}</span><span class="answer-text">${opt}</span>${confirmed&&i===q.answer?icon('checkCircle','green'):confirmed&&i===chosen?icon('x','red'):''}</button>`}).join('')}</div>${confirmed?`<div class="explanation"><div class="explanation-title">${icon(chosen===q.answer?'checkCircle':'lightbulb')} ${chosen===q.answer?'Resposta correta!':'Entenda a resposta'}</div><p>${q.explanation}</p><div class="reference">${icon('file','icon-sm')}<span><strong>Referência:</strong> ${q.reference}<br><strong>Validação:</strong> ${q.confidence} • confiança ${q.validation}%.</span></div></div>`:''}</div><footer class="question-footer"><div class="left"><button class="btn btn-outline" data-action="prev-question" ${state.questionIndex===0?'disabled':''}>${icon('arrowLeft','icon-sm')} Anterior</button>${confirmed?`<button class="btn btn-secondary" data-action="similar-question">${icon('refresh','icon-sm')} Gerar semelhante</button>`:''}</div><div class="right">${!confirmed?`<button class="btn btn-primary" data-action="confirm-answer" ${chosen===undefined?'disabled':''}>Confirmar resposta</button>`:`<button class="btn btn-primary" data-action="next-question">Próxima questão ${icon('arrowRight','icon-sm')}</button>`}</div></footer></section>
    <aside class="question-side"><section class="card"><div class="card-title"><div><h3>Sessão atual</h3><p>Modo estudo • sem cronômetro</p></div></div><div class="session-progress"><div class="session-ring" style="--p:${pct(Object.keys(state.practiceConfirmed).length,state.practiceQuestions.length)}"><strong>${Object.keys(state.practiceConfirmed).length}/${state.practiceQuestions.length}</strong></div><div><strong class="small">${Object.keys(state.practiceConfirmed).length} respondidas</strong><div class="small green">${Object.values(state.practiceConfirmed).filter(Boolean).length} acertos</div><div class="small red">${Object.values(state.practiceConfirmed).filter(v=>!v).length} erros</div></div></div><div class="progress" style="margin-top:15px"><div class="progress-bar" style="width:${pct(Object.keys(state.practiceConfirmed).length,state.practiceQuestions.length)}%"></div></div></section><section class="card"><div class="card-title"><div><h3>Confiança na resposta</h3><p>Isso melhora suas revisões</p></div></div><div class="confidence-row"><button data-action="confidence">Chutei</button><button data-action="confidence">Dúvida</button><button data-action="confidence">Certeza</button></div></section><section class="card"><div class="card-title"><div><h3>Qualidade do item</h3><p>Geração assistida por IA</p></div><span class="badge ${q.validation<85?'badge-warning':'badge-success'}">${q.validation}%</span></div><div class="small muted">${q.validation<85?'Esta questão precisa de validação antes de entrar no banco principal.':'Coerência, gabarito e aderência ao edital verificados automaticamente.'}</div></section><section class="card"><div class="notice notice-warning">${icon('alert')} Questões inéditas de treino. A plataforma não copia itens protegidos da banca.</div></section></aside></div>`);
}

function simulationsPage() {
  const types = [
    ['timer','Simulado completo','Reproduz a estrutura do Edital nº 1/2026.','60 questões','4 horas','featured','complete'],
    ['zap','Simulado rápido','Uma sessão curta para manter o ritmo.','20 questões','30 min','','quick'],
    ['book','Por disciplina','Concentre o treino em uma disciplina.','Personalizado','Até 2h','','subject'],
    ['target','Por assunto','Ataque um tópico específico do edital.','Personalizado','Livre','','topic'],
    ['refresh','Questões erradas','Transforme seus erros em recuperação.','18 questões','35 min','','errors'],
    ['settings','Personalizado','Escolha quantidade, temas e dificuldade.','5 a 60','Livre','','custom'],
    ['checkCircle','Certo ou errado','Modalidade extra de treino e revisão.','20 itens','30 min','','truefalse'],
    ['layers','Simulado misto','Combine múltipla escolha e certo ou errado.','40 itens','1h30','','mixed']
  ];
  const history = state.lastResult ? [state.lastResult] : [];
  const demoHistory = [
    {date:'12/07/2026', name:'Simulado completo #3', score:78, correct:48, wrong:12, time:'03h18'},
    {date:'05/07/2026', name:'Simulado completo #2', score:72, correct:44, wrong:16, time:'03h32'},
    {date:'28/06/2026', name:'Simulado diagnóstico', score:61, correct:38, wrong:22, time:'03h41'}
  ];
  return appShell('simulados', `${pageHeader('Simulados','Treine com tempo, estrutura e pontuação alinhados à sua prova.',`<button class="btn btn-outline" data-action="simulation-settings">${icon('settings','icon-sm')} Configurar</button><button class="btn btn-primary" data-action="start-full-exam">${icon('play','icon-sm')} Iniciar simulado completo</button>`)}
    <div class="notice" style="margin-bottom:18px">${icon('info')} <div><strong>Estrutura oficial conferida:</strong> 20 questões de conhecimentos gerais (1 ponto cada) + 40 de conhecimentos específicos (2 pontos cada), total de 100 pontos, sem penalização por erro. A prova objetiva e a discursiva compartilham 4 horas.</div></div>
    <div class="sim-type-grid">${types.map(([i,t,d,q,time,cls,type])=>`<article class="sim-type ${cls}" data-action="choose-simulation" data-type="${type}"><span class="feature-icon">${icon(i)}</span><h3>${t}</h3><p>${d}</p><div class="sim-type-meta"><span>${icon('checkCircle','icon-sm')} ${q}</span><span>${icon('clock','icon-sm')} ${time}</span></div></article>`).join('')}</div>
    <section class="card simulation-history"><div class="card-title" style="padding:18px 18px 0"><div><h2>Histórico de simulados</h2><p>Compare desempenho, velocidade e assuntos prioritários</p></div><button class="btn btn-ghost btn-sm" data-route="estatisticas">Ver análise completa</button></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>Simulado</th><th>Data</th><th>Nota</th><th>Acertos</th><th>Erros</th><th>Tempo</th><th></th></tr></thead><tbody>${[...history,...demoHistory].slice(0,4).map((h,i)=>`<tr><td><div class="table-main"><span class="table-icon">${icon('timer','icon-sm')}</span><div><strong>${h.name || 'Simulado completo recente'}</strong><div class="small muted">${roleData().name}</div></div></div></td><td>${h.date || new Date(h.finishedAt).toLocaleDateString('pt-BR')}</td><td><div class="score-circle" style="--score:${h.score}"><b>${h.score}%</b></div></td><td class="green"><strong>${h.correct}</strong></td><td class="red"><strong>${h.wrong}</strong></td><td>${h.time || formatTime(h.elapsed || 0).slice(0,5)}</td><td><button class="btn btn-ghost btn-icon" data-action="view-result" data-index="${i}">${icon('chevronRight')}</button></td></tr>`).join('')}</tbody></table></div></section>`);
}

function examPage() {
  if (!state.exam?.questions?.length) { setTimeout(()=>navigate('simulados')); return `<div class="boot"><span class="spinner"></span></div>`; }
  const exam = state.exam, q = exam.questions[exam.current], chosen = exam.answers[q.id];
  return `<div class="exam-shell"><header class="exam-topbar"><div class="exam-name"><span class="brand-mark">${icon('logo')}</span><div><strong>Simulado SEDES/DF</strong><small>${roleData().fullName} • Edital nº 1/2026</small></div></div><div class="timer ${exam.seconds<1800?'warning':''}" id="exam-timer">${icon('timer','icon-sm')} <span>${formatTime(exam.seconds)}</span></div><button class="btn btn-ghost btn-sm" style="color:#c2d0df" data-action="pause-exam">Pausar e sair</button></header><main id="main" class="exam-body"><section class="exam-question"><div class="question-head"><div class="question-meta"><span class="badge">Questão ${exam.current+1} de ${exam.questions.length}</span><span class="badge">${q.weight} ${q.weight===1?'ponto':'pontos'}</span><span class="small muted">${q.area}</span></div><button class="btn btn-ghost btn-sm ${exam.flags.includes(q.id)?'amber':''}" data-action="flag-exam">${icon('flag','icon-sm')} ${exam.flags.includes(q.id)?'Marcada':'Marcar para revisão'}</button></div><div class="question-body"><div class="question-context">${icon('book','icon-sm')} ${q.subject} • ${q.topic}</div><div class="question-text">${q.text}</div><div class="answers">${q.options.map((opt,i)=>`<button class="answer-option ${chosen===i?'selected':''}" data-action="exam-answer" data-index="${i}"><span class="answer-letter">${String.fromCharCode(65+i)}</span><span class="answer-text">${opt}</span></button>`).join('')}</div></div><footer class="question-footer"><div class="left"><button class="btn btn-outline" data-action="exam-prev" ${exam.current===0?'disabled':''}>${icon('arrowLeft','icon-sm')} Anterior</button></div><div class="right"><button class="btn btn-primary" data-action="exam-next">${exam.current===exam.questions.length-1?'Revisar respostas':'Próxima'} ${icon('arrowRight','icon-sm')}</button></div></footer></section><aside class="exam-side"><section class="card card-pad"><div class="card-title"><div><h3>Cartão de respostas</h3><p>${Object.keys(exam.answers).length} respondidas • ${exam.questions.length-Object.keys(exam.answers).length} em branco</p></div></div><div class="progress"><div class="progress-bar" style="width:${pct(Object.keys(exam.answers).length,exam.questions.length)}%"></div></div><div class="exam-map">${exam.questions.map((item,i)=>`<button class="q-number ${exam.answers[item.id]!==undefined?'answered':''} ${exam.current===i?'current':''} ${exam.flags.includes(item.id)?'flagged':''}" data-action="exam-jump" data-index="${i}">${i+1}</button>`).join('')}</div><div class="exam-legend"><span><i class="legend-dot" style="background:var(--blue-600)"></i>Respondida</span><span><i class="legend-dot"></i>Em branco</span><span><i class="legend-dot" style="background:var(--amber)"></i>Revisar</span></div><button class="btn btn-primary exam-finish" data-action="finish-exam">Finalizar simulado</button></section><section class="card card-pad" style="margin-top:13px"><div class="notice notice-warning">${icon('alert')} O gabarito e as explicações serão exibidos somente após a finalização.</div></section></aside></main>${modalHtml()}</div>`;
}

function resultsPage() {
  const r = state.lastResult || {score:78, raw:78, correct:48, wrong:12, blank:0, elapsed:11880, avg:198, bySubject:{'Língua Portuguesa':82,'Legislação do DF':64,'Políticas de Assistência Social':71,'Direito Administrativo':58,'Arquivologia':76,'Lei nº 14.133/2021':69}, finishedAt:new Date().toISOString()};
  const diagnosticLevel = r.score < 40 ? 'Nível inicial' : r.score < 60 ? 'Nível básico' : r.score < 75 ? 'Nível intermediário' : r.score < 90 ? 'Nível avançado' : 'Domínio elevado';
  const subjectEntries = Object.entries(r.bySubject || {});
  return appShell('simulados', `<div class="result-hero"><div class="result-score" style="--p:${r.score}"><div><strong>${r.score}%</strong><small>aproveitamento</small></div></div><div class="result-copy"><span class="badge badge-dark">${r.diagnostic?`Diagnóstico • ${diagnosticLevel}`:'Simulado concluído'}</span><h1>${r.diagnostic?`Seu ponto de partida é: ${diagnosticLevel}.`:r.score>=75?'Ótimo avanço! Seu desempenho está competitivo.':r.score>=60?'Bom trabalho! Agora vamos atacar os pontos fracos.':'Este resultado já mostra exatamente por onde começar.'}</h1><p>Você demonstrou bom domínio em Língua Portuguesa, mas precisa reforçar ${roleData().id==='tecnico'?'Direito Administrativo, LC nº 840 e Lei nº 14.133/2021':'Redução de Danos, NOB/SUAS e prática socioeducativa'}.</p></div><div class="result-actions"><button class="btn btn-white" data-route="caderno-erros">Revisar meus erros</button><button class="btn btn-ghost" style="color:white" data-action="repeat-exam">${r.diagnostic?'Ir para simulado':'Refazer simulado'}</button></div></div>
    <div class="result-metrics">${[['Nota bruta',`${r.raw ?? r.score} pts`,'blue'],['Acertos',r.correct,'green'],['Erros',r.wrong,'red'],['Em branco',r.blank,'amber'],['Tempo total',formatTime(r.elapsed||0).slice(0,5),''],['Média/questão',`${Math.round(r.avg||0)}s`,'']].map(([l,v,c])=>`<div class="metric"><span>${l}</span><strong class="${c}">${v}</strong></div>`).join('')}</div>
    <div class="grid grid-2"><section class="card card-pad"><div class="card-title"><div><h2>Desempenho por disciplina</h2><p>Percentual de acertos no simulado</p></div><span class="badge">Meta 75%</span></div><div class="bar-chart">${subjectEntries.length?subjectEntries.map(([s,v])=>`<div class="bar-row"><label title="${s}">${s}</label><div class="progress"><div class="progress-bar ${v<60?'progress-red':v<75?'progress-amber':'progress-green'}" style="width:${v}%"></div></div><b>${v}%</b></div>`).join(''):'<div class="empty">Não há dados por disciplina.</div>'}</div></section><section class="card card-pad"><div class="card-title"><div><h2>Distribuição das respostas</h2><p>Acertos, erros e questões em branco</p></div></div><div class="donut-wrap"><div class="donut" style="--a:${pct(r.correct,r.correct+r.wrong+r.blank)};--b:${pct(r.wrong,r.correct+r.wrong+r.blank)}"><div><strong>${r.correct+r.wrong+r.blank}</strong><small>questões</small></div></div><ul class="legend-list"><li><i class="dot" style="background:var(--green)"></i><span>Acertos</span><strong>${r.correct}</strong></li><li><i class="dot" style="background:var(--red)"></i><span>Erros</span><strong>${r.wrong}</strong></li><li><i class="dot" style="background:#dfe5ed"></i><span>Em branco</span><strong>${r.blank}</strong></li></ul></div></section></div>
    <div class="grid grid-2" style="margin-top:18px"><section class="card card-pad"><div class="card-title"><div><h2>Mapa de domínio</h2><p>Prioridades calculadas a partir do resultado</p></div></div><div class="domain-grid">${subjectEntries.slice(0,8).map(([s,v])=>`<div class="domain-item ${v>=80?'domain-high':v>=65?'domain-watch':v>=50?'domain-hard':'domain-critical'}"><strong>${s}</strong><span>${v>=80?'Domínio elevado':v>=65?'Atenção':v>=50?'Dificuldade':'Prioridade máxima'} • ${v}%</span></div>`).join('')}</div></section><section class="card card-pad"><div class="card-title"><div><h2>Plano de recuperação sugerido</h2><p>Recomendação automática para os próximos 7 dias</p></div>${icon('bot','purple')}</div><div class="stack"><div class="notice">${icon('lightbulb')} Dedique 40% do tempo de questões às duas disciplinas com menor desempenho.</div>${[['Revisão guiada do pior assunto','Hoje • 25 min','refresh'],['20 questões comentadas','Amanhã • 35 min','checkCircle'],['Revisão de erros + flashcards','Em 7 dias • 20 min','layers']].map(([t,s,i])=>`<div style="display:flex;align-items:center;gap:11px"><span class="feature-icon">${icon(i)}</span><div style="flex:1"><strong class="small">${t}</strong><div class="small muted">${s}</div></div><button class="btn btn-outline btn-sm" data-route="plano">Adicionar</button></div>`).join('')}</div></section></div>`);
}

function planPage() {
  const completed = state.tasks.filter(t=>t.done).length;
  const today = new Date();
  const week = Array.from({length:7},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()-today.getDay()+1+i);return d});
  return appShell('plano', `${pageHeader('Plano de estudos','Sua semana se adapta ao desempenho, às revisões e ao tempo disponível.',`<div class="segmented"><button class="active">Dia</button><button>Semana</button><button>Mês</button></div><button class="btn btn-outline" data-action="calendar-sync">${icon('calendar','icon-sm')} Sincronizar</button><button class="btn btn-primary" data-action="add-study">${icon('plus','icon-sm')} Estudo extra</button>`)}
    <div class="week-strip">${week.map((d,i)=>`<button class="day-pill ${d.toDateString()===today.toDateString()?'active':''}"><span>${new Intl.DateTimeFormat('pt-BR',{weekday:'short'}).format(d).replace('.','')}</span><strong>${d.getDate()}</strong><span>${i<5?'2h':'1h'}</span></button>`).join('')}</div>
    <div class="plan-layout"><div class="stack"><section class="card card-pad"><div class="card-title"><div><h2>Quinta-feira, 16 de julho</h2><p>1h50 planejadas • ${completed}/${state.tasks.length} tarefas concluídas</p></div><span class="badge badge-success">${pct(completed,state.tasks.length)}% do dia</span></div><div class="today-progress"><span class="feature-icon">${icon('target')}</span><div><div style="display:flex;justify-content:space-between;font-size:11px"><strong>Progresso do dia</strong><span>${completed*25} pontos</span></div><div class="progress"><div class="progress-bar progress-green" style="width:${pct(completed,state.tasks.length)}%"></div></div></div></div>${state.tasks.map(t=>`<div class="schedule-row"><span class="schedule-time">${t.time}</span><span class="schedule-color ${t.type.includes('Revisão')?'amber':t.done?'green':''}"></span><div class="schedule-info"><strong class="${t.done?'muted':''}">${t.subject}</strong><span>${t.type} • ${t.topic} • ${t.duration}</span></div><button class="btn ${t.done?'btn-secondary':'btn-primary'} btn-sm" data-action="toggle-task" data-id="${t.id}">${t.done?'Concluída':'Iniciar'}</button></div>`).join('')}</section><section class="card card-pad"><div class="card-title"><div><h2>Ciclos de revisão</h2><p>Repetição espaçada para aumentar a retenção</p></div></div><div class="cycle">${[['24h','done'],['7 dias','current'],['30 dias',''],['90 dias','']].map(([t,c],i)=>`<div class="cycle-step ${c}"><span class="cycle-dot">${c==='done'?icon('checkCircle','icon-sm'):i+1}</span><span>${t}</span></div>`).join('')}</div></section></div><aside class="stack"><section class="card card-pad"><div class="card-title"><div><h3>Distribuição da semana</h3><p>12h30 de estudo planejado</p></div></div><div class="bar-chart">${[['Teoria',32,''],['Questões',36,'progress-green'],['Revisões',18,'progress-amber'],['Lei seca',9,''],['Discursiva',5,'']].map(([s,v,c])=>`<div class="bar-row" style="grid-template-columns:75px 1fr 32px"><label>${s}</label><div class="progress"><div class="progress-bar ${c}" style="width:${v*2}%"></div></div><b>${v}%</b></div>`).join('')}</div></section><section class="card card-pad"><div class="card-title"><div><h3>Plano adaptativo</h3><p>Último ajuste: hoje, 06:00</p></div>${icon('bot','purple')}</div><p class="small muted">A frequência de <strong>LC nº 840/2011</strong> aumentou após 3 erros. A carga teórica de <strong>Português</strong> foi reduzida em favor de questões.</p><button class="btn btn-secondary btn-sm" style="width:100%" data-action="show-plan-reason">Entender ajustes</button></section><section class="card card-pad"><div class="card-title"><div><h3>Disponibilidade</h3><p>${state.user.profile.daysPerWeek} dias • ${state.user.profile.hoursPerDay}h por dia</p></div></div><button class="btn btn-outline btn-sm" style="width:100%" data-route="perfil">Alterar disponibilidade</button></section></aside></div>`);
}

function reviewsPage() {
  const total = reviews.reduce((sum,r)=>sum+r.count,0);
  return appShell('revisoes', `${pageHeader('Revisões de hoje','Cada revisão foi priorizada pelo tempo decorrido e pelo seu desempenho.',`<button class="btn btn-outline">${icon('calendar','icon-sm')} Ver calendário</button><button class="btn btn-primary" data-action="start-review">${icon('play','icon-sm')} Iniciar revisão</button>`)}
    <div class="grid grid-4" style="margin-bottom:18px">${[['refresh','Revisões pendentes',reviews.length,'Hoje'],['checkCircle','Questões programadas',total,'Em 1h27'],['alert','Prioridade alta',2,'Comece por aqui'],['flame','Sequência de revisão','6 dias','Melhor: 11 dias']].map(([i,l,v,s],idx)=>`<div class="card admin-stat"><span class="feature-icon" style="color:${idx===2?'var(--red)':''}">${icon(i)}</span><div><strong>${v}</strong><span>${l}<br>${s}</span></div></div>`).join('')}</div>
    <div class="notice" style="margin-bottom:17px">${icon('brain')} <div><strong>Recomendação do dia:</strong> comece por NOB/SUAS. O assunto combina alta incidência no edital com desempenho recente abaixo de 50%.</div></div><div class="stack">${reviews.map(r=>`<article class="review-card"><span class="review-priority ${r.priority==='Média'?'medium':r.priority==='Baixa'?'low':''}"></span><div><h3>${r.subject} — ${r.topic}</h3><p>${r.reason}</p><div class="review-meta"><span>${icon('clock','icon-sm')} ${r.time}</span><span>${icon('checkCircle','icon-sm')} ${r.count} itens</span><span>${icon('layers','icon-sm')} ${r.type}</span><span class="badge ${r.priority==='Alta'?'badge-danger':r.priority==='Média'?'badge-warning':'badge-success'}">Prioridade ${r.priority.toLowerCase()}</span></div></div><div style="display:flex;gap:8px"><button class="btn btn-ghost btn-icon" data-action="postpone-review" data-id="${r.id}" title="Adiar">${icon('calendar')}</button><button class="btn btn-primary btn-sm" data-action="open-review" data-id="${r.id}">Iniciar ${icon('arrowRight','icon-sm')}</button></div></article>`).join('')}</div>`);
}

function disciplinesPage() {
  const subjects = [...commonSubjects,...specificSubjects[roleData().id]];
  return appShell('disciplinas', `${pageHeader('Disciplinas do edital',`${subjects.length} disciplinas organizadas para ${roleData().fullName}.`,`<button class="btn btn-outline" data-route="edital">${icon('clipboard','icon-sm')} Ver edital completo</button><button class="btn btn-primary" data-route="plano">${icon('play','icon-sm')} Continuar estudando</button>`)}
    <div class="filter-bar"><div class="filter-search">${icon('search','icon-sm')}<input class="input" placeholder="Buscar disciplina"></div><select class="select"><option>Todas</option><option>Não iniciadas</option><option>Em andamento</option><option>Concluídas</option></select><select class="select"><option>Ordenar por prioridade</option><option>Progresso</option><option>Desempenho</option></select></div><div class="discipline-grid">${subjects.map((s,i)=>`<article class="discipline-card" data-action="open-discipline" data-index="${i}"><div class="discipline-top"><span class="feature-icon" style="color:${s.color};background:${s.color}16">${icon(s.icon)}</span><span class="badge ${s.accuracy<60?'badge-danger':s.accuracy<75?'badge-warning':'badge-success'}">${s.accuracy}% acertos</span></div><h3>${s.name}</h3><p>${s.topics} tópicos • ${s.questions} questões resolvidas</p><div class="discipline-stats"><span>Progresso do edital</span><strong>${s.progress}%</strong></div><div class="progress"><div class="progress-bar" style="width:${s.progress}%;background:${s.color}"></div></div></article>`).join('')}</div>`);
}

function editalPage() {
  const subjects = [...commonSubjects,...specificSubjects[roleData().id]];
  const topicNames = ['Fundamentos e conceitos essenciais','Organização, princípios e diretrizes','Aplicação prática e casos','Legislação e normas vinculadas'];
  return appShell('edital', `${pageHeader('Conteúdo programático',`Edital nº 1/2026 • Cargo ${roleData().code} • versão atualizada após as retificações.`,`<a class="btn btn-outline" href="${EDITAL_URL}" target="_blank" rel="noopener">${icon('external','icon-sm')} Abrir edital oficial</a><button class="btn btn-primary" data-action="export-edital">${icon('download','icon-sm')} Exportar progresso</button>`)}
    <div class="notice notice-warning" style="margin-bottom:18px">${icon('alert')} Esta organização facilita o estudo, mas o PDF oficial e suas retificações permanecem como fonte normativa do concurso. Última conferência: 16/07/2026.</div><div class="grid" style="grid-template-columns:280px 1fr"><aside class="card card-pad"><div class="card-title"><div><h3>Visão geral</h3><p>${roleData().topics} tópicos mapeados</p></div></div><div class="ring" style="--value:58;width:120px;height:120px;margin:15px auto"><b>58%</b></div><div class="small muted" style="text-align:center">do edital estudado</div><div class="stack" style="margin-top:22px"><div><div class="small" style="display:flex;justify-content:space-between"><span>Estudado</span><strong>49 tópicos</strong></div></div><div><div class="small" style="display:flex;justify-content:space-between"><span>Em andamento</span><strong>18 tópicos</strong></div></div><div><div class="small" style="display:flex;justify-content:space-between"><span>Não iniciado</span><strong>${Math.max(0,roleData().topics-67)} tópicos</strong></div></div></div></aside><section class="card card-pad"><div class="card-title"><div><h2>Disciplinas e tópicos</h2><p>Marque e acompanhe cada objeto de avaliação</p></div><span class="badge">${roleData().short}</span></div>${subjects.map((s,i)=>`<details ${i<2?'open':''} style="border-bottom:1px solid var(--line);padding:5px 0"><summary style="display:flex;align-items:center;gap:10px;padding:12px 5px;cursor:pointer"><span class="table-icon">${icon(s.icon,'icon-sm')}</span><strong style="flex:1">${s.name}</strong><span class="badge ${s.progress>70?'badge-success':'badge-warning'}">${s.progress}%</span></summary><div class="edital-tree">${topicNames.slice(0,Math.min(4,s.topics)).map((t,j)=>`<div class="tree-row"><div><strong>${j+1}.${i+1} ${t}</strong><span> • ${s.name}</span></div><span class="status">${j < Math.round(s.progress/25)?icon('checkCircle','icon-sm'):icon('more','icon-sm')}</span></div>`).join('')}</div></details>`).join('')}</section></div>`);
}

function summariesPage() {
  return appShell('resumos', `${pageHeader('Resumos inteligentes','Conteúdo adaptado ao seu nível e aos pontos mais cobrados do edital.',`<button class="btn btn-outline">${icon('search','icon-sm')} Escolher assunto</button><button class="btn btn-primary" data-action="generate-summary">${icon('bot','icon-sm')} Gerar novo resumo</button>`)}
    <div class="grid" style="grid-template-columns:260px 1fr"><aside class="card card-pad"><div class="form-group"><label>Disciplina</label><select class="select"><option>Políticas de Assistência Social</option><option>Direito Administrativo</option><option>Língua Portuguesa</option></select></div><div class="form-group"><label>Assunto</label><select class="select"><option>Organização do SUAS</option><option>Proteção Social Básica</option><option>Proteção Social Especial</option></select></div><div class="nav-label">Neste resumo</div>${['Visão geral','Princípios organizativos','Proteções sociais','Gestão compartilhada','Armadilhas da banca','Questões relacionadas'].map((s,i)=>`<button class="nav-link ${i===0?'active':''}" style="color:${i===0?'var(--blue-700)':'var(--muted)'};${i===0?'background:var(--blue-50)':''}">${s}</button>`).join('')}</aside><article class="card card-pad"><div class="card-title"><div><span class="badge">Nível intermediário</span><h2 style="margin-top:10px">Sistema Único de Assistência Social — SUAS</h2><p>Resumo validado • 8 min de leitura • atualizado em 16/07/2026</p></div><div style="display:flex;gap:6px"><button class="btn btn-ghost btn-icon">${icon('bookmark')}</button><button class="btn btn-ghost btn-icon">${icon('printer')}</button></div></div><div class="summary-tabs"><button class="active">Resumo completo</button><button>Resumo rápido</button><button>Tópicos essenciais</button><button>Quadro comparativo</button><button>Armadilhas</button></div><div class="summary-content"><p>O <strong>Sistema Único de Assistência Social (SUAS)</strong> organiza de forma descentralizada e participativa as ações da assistência social. Seu desenho busca articular responsabilidades, serviços, benefícios, programas e projetos nos diferentes níveis de governo.</p><div class="key-box"><div><strong>Descentralização</strong><br>Competências compartilhadas entre os entes.</div><div><strong>Territorialização</strong><br>Leitura das necessidades a partir do território.</div><div><strong>Matricialidade</strong><br>Família no centro da proteção socioassistencial.</div></div><h3>Proteções sociais</h3><ul><li><strong>Proteção Social Básica:</strong> prevenção de situações de risco, desenvolvimento de potencialidades e fortalecimento de vínculos.</li><li><strong>Proteção Social Especial:</strong> atendimento a famílias e indivíduos em situação de risco pessoal e social por violação de direitos.</li></ul><h3>Armadilha recorrente</h3><div class="notice notice-warning">${icon('alert')} Assistência social é política não contributiva. Não se deve confundir seu acesso com o caráter contributivo da previdência social.</div><h3>Próximo passo recomendado</h3><p>Resolva 10 questões sobre a diferença entre proteção básica e especial e agende uma revisão em 7 dias.</p><button class="btn btn-primary" data-route="questoes">Resolver questões deste assunto ${icon('arrowRight','icon-sm')}</button></div></article></div>`);
}

function mindMapsPage() {
  const branches = [
    ['Proteção Social Básica',['Prevenção de riscos','Fortalecimento de vínculos','CRAS • PAIF • SCFV'],'#1477d4'],
    ['Proteção Social Especial',['Violação de direitos','Média e alta complexidade','CREAS • PAEFI • Acolhimento'],'#e34f5f'],
    ['Organização',['Descentralização','Participação social','Gestão compartilhada'],'#15a369'],
    ['Eixos',['Territorialização','Matricialidade sociofamiliar','Vigilância socioassistencial'],'#eea71b']
  ];
  return appShell('mapas-mentais', `${pageHeader('Mapas mentais','Visualize relações entre os conceitos centrais do edital.',`<button class="btn btn-outline">${icon('search','icon-sm')} Escolher assunto</button><button class="btn btn-primary" data-action="generate-mindmap">${icon('bot','icon-sm')} Gerar mapa</button>`)}
    <div class="filter-bar"><select class="select"><option>Políticas de Assistência Social</option><option>Direito Administrativo</option><option>Língua Portuguesa</option></select><select class="select"><option>Sistema Único de Assistência Social</option><option>Proteções sociais</option><option>Gestão do SUAS</option></select><span class="badge badge-success">Validado • nível intermediário</span></div><section class="card card-pad" style="min-height:600px;overflow:auto"><div class="card-title"><div><h2>Sistema Único de Assistência Social — SUAS</h2><p>Arraste a visualização mentalmente do centro para as relações específicas</p></div><button class="btn btn-outline btn-sm" data-action="print-mindmap">${icon('printer','icon-sm')} Imprimir</button></div><div style="display:grid;grid-template-columns:1fr auto 1fr;gap:34px;align-items:center;min-width:750px;padding:45px 10px"><div class="stack">${branches.slice(0,2).map(([title,items,color])=>`<div class="card card-pad" style="border-left:5px solid ${color}"><strong style="color:${color}">${title}</strong><ul class="small muted" style="list-style:disc;padding-left:18px;margin-top:9px">${items.map(i=>`<li style="margin:6px 0">${i}</li>`).join('')}</ul></div>`).join('')}</div><div style="position:relative;width:180px;height:180px;display:grid;place-items:center;text-align:center;color:white;background:linear-gradient(145deg,var(--blue-600),var(--navy-900));border-radius:50%;box-shadow:0 0 0 18px var(--blue-50),var(--shadow-lg)"><div>${icon('brain','icon-lg')}<strong style="display:block;margin-top:7px">SUAS</strong><span class="small" style="color:#c7ddf0">Sistema público<br>não contributivo</span></div></div><div class="stack">${branches.slice(2).map(([title,items,color])=>`<div class="card card-pad" style="border-right:5px solid ${color}"><strong style="color:${color}">${title}</strong><ul class="small muted" style="list-style:disc;padding-left:18px;margin-top:9px">${items.map(i=>`<li style="margin:6px 0">${i}</li>`).join('')}</ul></div>`).join('')}</div></div><div class="notice">${icon('lightbulb')} Use este mapa para recordar relações. Para definições, exceções e detalhes normativos, consulte o resumo e a fonte oficial vinculada.</div></section>`);
}

function subscriptionPage() {
  return appShell('assinatura', `${pageHeader('Plano gratuito','A preparação essencial permanece acessível a todos, sem cobrança.')}
    <div class="card" style="max-width:900px;margin:auto;overflow:hidden"><div style="padding:34px;color:white;background:linear-gradient(125deg,#08213e,#0e579d)"><span class="badge badge-dark">Acesso atual</span><h1 style="margin:14px 0 8px">Plano Comunidade — R$ 0</h1><p style="margin:0;color:#c6dcef">Preparação estratégica para maximizar suas chances, sem promessa de aprovação.</p></div><div class="card-pad"><div class="grid grid-2">${['Plano de estudos personalizado','Banco de questões de treino','Simulado completo de 60 questões','Revisões e flashcards','Caderno de erros','Gráficos de desempenho','Treino discursivo formativo','Assistente de estudos contextual'].map(item=>`<div style="display:flex;align-items:center;gap:9px">${icon('checkCircle','green')}<strong class="small">${item}</strong></div>`).join('')}</div><div class="notice" style="margin-top:25px">${icon('shield')} Não há cartão cadastrado nem renovação automática. Se futuramente houver recursos opcionais pagos, o acesso gratuito principal será claramente separado.</div></div></div>`);
}

function lawPage() {
  return appShell('lei-seca', `${pageHeader('Lei seca','Leia, destaque e transforme dispositivos em questões e flashcards.',`<button class="btn btn-outline">${icon('bookmark','icon-sm')} Meus destaques</button><button class="btn btn-primary" data-action="generate-law-question">${icon('zap','icon-sm')} Gerar questão do trecho</button>`)}
    <div class="notice notice-warning" style="margin-bottom:17px">${icon('alert')} O conteúdo legal deve ser mantido atualizado com fontes oficiais. A data e a versão da norma são registradas em cada questão gerada.</div><div class="law-layout"><aside class="card card-pad law-list"><div class="form-group"><label>Buscar legislação</label><input class="input" placeholder="Nome ou número"></div>${['LC nº 840/2011','Lei nº 14.133/2021','Lei Maria da Penha','LOAS — Lei nº 8.742/1993','ECA — Lei nº 8.069/1990','Lei Distrital nº 7.484/2024'].map((l,i)=>`<button class="${i===0?'active':''}">${icon('file','icon-sm')} ${l}</button>`).join('')}</aside><article class="card law-reader"><span class="badge">Versão demonstrativa • verificar fonte oficial</span><h2>Lei Complementar nº 840/2011</h2><p><strong>Título II — Dos Cargos Públicos e das Funções de Confiança</strong></p><p><strong>Art. demonstrativo.</strong> Para fins de estudo do conteúdo programático, considere que o provimento representa o preenchimento do cargo público nas formas previstas em lei.</p><p><mark>A vacância corresponde à desocupação do cargo nas hipóteses legalmente estabelecidas.</mark> A relação entre provimento e vacância é recorrente em questões que exigem distinguir ingresso, movimentação e desligamento.</p><p>Consulte o texto integral e atualizado no Sistema Integrado de Normas Jurídicas do Distrito Federal antes de memorizar prazos, listas ou exceções.</p><div class="notice">${icon('info')} O trecho acima é um resumo pedagógico, não uma reprodução integral nem substitui a norma oficial.</div></article><aside class="card card-pad law-tools"><div class="card-title"><div><h3>Ferramentas</h3><p>Use o trecho selecionado</p></div></div><button class="btn btn-outline">${icon('edit','icon-sm')} Destacar trecho</button><button class="btn btn-outline">${icon('message','icon-sm')} Fazer anotação</button><button class="btn btn-outline" data-action="generate-law-question">${icon('checkCircle','icon-sm')} Gerar questão</button><button class="btn btn-outline" data-action="make-flashcard">${icon('layers','icon-sm')} Criar flashcard</button><button class="btn btn-outline">${icon('bookmark','icon-sm')} Favoritar artigo</button></aside></div>`);
}

function flashcardsPage() {
  const card = flashcards[state.flashIndex % flashcards.length];
  return appShell('flashcards', `${pageHeader('Flashcards','Revisão ativa e espaçada a partir dos seus erros e conteúdos prioritários.',`<button class="btn btn-outline">${icon('layers','icon-sm')} Meus baralhos</button><button class="btn btn-primary" data-action="make-flashcard">${icon('plus','icon-sm')} Novo flashcard</button>`)}
    <div class="flash-layout"><aside class="card card-pad"><div class="card-title"><div><h3>Sessão de hoje</h3><p>${state.flashIndex+1} de ${flashcards.length}</p></div></div><div class="ring" style="--value:${pct(state.flashIndex,flashcards.length)};width:110px;height:110px;margin:20px auto"><b>${state.flashIndex}/${flashcards.length}</b></div><div class="small muted" style="text-align:center">Próxima revisão calculada pela dificuldade informada.</div></aside><div><div class="flashcard-wrap"><button class="flashcard" data-action="flip-card" style="width:100%"><span class="badge">${card.subject}</span>${state.flashFlipped?`<h2>Resposta</h2><p>${card.back}</p>`:`<h2>${card.front}</h2><p class="flash-hint">${icon('refresh','icon-sm')} Clique no cartão para revelar a resposta</p>`}</button></div>${state.flashFlipped?`<div class="flash-actions"><button data-action="rate-flash" data-rating="again">Não lembrei<br><small>1 min</small></button><button data-action="rate-flash" data-rating="hard">Difícil<br><small>1 dia</small></button><button data-action="rate-flash" data-rating="medium">Médio<br><small>7 dias</small></button><button data-action="rate-flash" data-rating="easy">Fácil<br><small>30 dias</small></button></div>`:''}</div><aside class="card card-pad"><div class="card-title"><div><h3>Próximas revisões</h3><p>Agenda espaçada</p></div></div><div class="stack">${[['Hoje',12,'red'],['Amanhã',8,'amber'],['Em 7 dias',27,'green'],['Em 30 dias',42,'']].map(([d,n,c])=>`<div style="display:flex;justify-content:space-between;align-items:center"><span class="small muted">${d}</span><strong class="${c}">${n}</strong></div>`).join('')}</div></aside></div>`);
}

function errorsPage() {
  const qs = state.practiceQuestions.slice(3,8);
  const reasons = ['Confusão entre conceitos','Falta de conhecimento','Desatenção','Interpretação','Esquecimento'];
  return appShell('caderno-erros', `${pageHeader('Caderno de erros','Revise padrões de erro e transforme fragilidades em domínio.',`<button class="btn btn-outline">${icon('filter','icon-sm')} Filtrar erros</button><button class="btn btn-primary" data-action="start-error-review">${icon('play','icon-sm')} Revisar agora</button>`)}
    <div class="grid grid-4" style="margin-bottom:18px">${[['archive','Erros salvos',28,'5 nesta semana'],['refresh','Para revisar hoje',8,'3 prioritários'],['brain','Padrão principal','Interpretação','32% dos erros'],['chart','Taxa de recuperação','64%','+11% no mês']].map(([i,l,v,s])=>`<div class="card admin-stat"><span class="feature-icon">${icon(i)}</span><div><strong>${v}</strong><span>${l}<br>${s}</span></div></div>`).join('')}</div><div class="notice" style="margin-bottom:17px">${icon('bot')} <div><strong>Padrão identificado:</strong> você tende a errar quando o enunciado diferencia conceitos próximos. Sublinhe o comando e compare cada alternativa com a definição central.</div></div><div class="stack">${qs.map((q,i)=>`<article class="error-item"><div class="error-top"><div><span class="badge">${q.subject}</span><h3 style="margin-top:9px">${q.text}</h3></div><span class="badge badge-danger">Errou ${i%2+1}x</span></div><div class="error-answers"><div class="error-answer wrong"><strong>Sua resposta:</strong> ${q.options[(q.answer+1)%5]}</div><div class="error-answer right"><strong>Resposta correta:</strong> ${q.options[q.answer]}</div></div><div class="error-note">${icon('brain','icon-sm')} Motivo provável: <strong>${reasons[i]}</strong><span>•</span> Próxima revisão: <strong>${i<2?'Hoje':`${i+1} dias`}</strong><button class="btn btn-ghost btn-sm" style="margin-left:auto" data-action="error-note">${icon('edit','icon-sm')} Anotação</button><button class="btn btn-secondary btn-sm" data-route="questoes">Revisar</button></div></article>`).join('')}</div>`);
}

function statsPage() {
  const subjects = [...commonSubjects,...specificSubjects[roleData().id]].slice(0,8);
  return appShell('estatisticas', `${pageHeader('Seu desempenho','Dados claros para orientar a próxima decisão de estudo.',`<div class="segmented"><button class="active">7 dias</button><button>30 dias</button><button>90 dias</button></div><button class="btn btn-outline">${icon('download','icon-sm')} Exportar relatório</button>`)}
    <div class="grid grid-4" style="margin-bottom:18px">${[['target','Aproveitamento geral','76%','+3,2%'],['checkCircle','Questões no período','324','+42'],['clock','Tempo médio','1m42s','-12s'],['chart','Evolução mensal','+8%','Melhor período']].map(([i,l,v,s],idx)=>`<div class="card admin-stat"><span class="feature-icon ${idx===0?'green':''}">${icon(i)}</span><div><strong>${v}</strong><span>${l}<br><span class="green">${s}</span></span></div></div>`).join('')}</div>
    <div class="grid grid-2"><section class="card card-pad"><div class="card-title"><div><h2>Evolução de acertos</h2><p>Percentual semanal e média móvel</p></div><span class="badge badge-success">Meta: 80%</span></div>${lineChart([59,61,64,63,69,72,76])}</section><section class="card card-pad"><div class="card-title"><div><h2>Questões por resultado</h2><p>Distribuição das 324 questões</p></div></div><div class="donut-wrap"><div class="donut" style="--a:76;--b:20"><div><strong>76%</strong><small>acertos</small></div></div><ul class="legend-list"><li><i class="dot" style="background:var(--green)"></i><span>Acertos</span><strong>246</strong></li><li><i class="dot" style="background:var(--red)"></i><span>Erros</span><strong>65</strong></li><li><i class="dot" style="background:#dfe5ed"></i><span>Em branco</span><strong>13</strong></li></ul></div></section></div>
    <div class="grid grid-2" style="margin-top:18px"><section class="card card-pad"><div class="card-title"><div><h2>Desempenho por disciplina</h2><p>Aproveitamento e volume de questões</p></div><select class="select" style="width:auto;min-height:36px"><option>Por aproveitamento</option></select></div><div class="bar-chart">${subjects.map(s=>`<div class="bar-row"><label title="${s.name}">${s.name}</label><div class="progress"><div class="progress-bar ${s.accuracy<60?'progress-red':s.accuracy<75?'progress-amber':'progress-green'}" style="width:${s.accuracy}%"></div></div><b>${s.accuracy}%</b></div>`).join('')}</div></section><section class="card card-pad"><div class="card-title"><div><h2>Mapa de domínio</h2><p>Leitura rápida das suas prioridades</p></div></div><div class="domain-grid">${subjects.map(s=>`<div class="domain-item ${s.accuracy>=80?'domain-high':s.accuracy>=70?'domain-watch':s.accuracy>=60?'domain-hard':'domain-critical'}"><strong>${s.name}</strong><span>${s.accuracy>=80?'Domínio elevado':s.accuracy>=70?'Atenção':s.accuracy>=60?'Dificuldade':'Prioridade máxima'} • ${s.accuracy}%</span></div>`).join('')}</div></section></div>
    <div class="grid grid-2" style="margin-top:18px"><section class="card card-pad"><div class="card-title"><div><h2>Velocidade de resolução</h2><p>Tempo médio por questão</p></div></div>${lineChart([78,76,73,70,68,64,62],['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Atual'])}</section><section class="card card-pad"><div class="card-title"><div><h2>Comparativo de simulados</h2><p>Primeiro versus último resultado</p></div></div><div style="display:flex;align-items:flex-end;justify-content:center;gap:55px;height:210px;padding-top:25px"><div style="text-align:center"><div style="width:72px;height:110px;background:#cfd9e5;border-radius:10px 10px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:10px"><b>61%</b></div><span class="small muted">Primeiro</span></div><div style="text-align:center"><div style="width:72px;height:165px;background:linear-gradient(var(--blue-500),var(--blue-700));color:white;border-radius:10px 10px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:10px"><b>78%</b></div><span class="small muted">Último</span></div></div></section></div>`);
}

function assistantPage() {
  const suggestions = ['O que devo estudar hoje?','Qual é minha pior disciplina?','Quais assuntos mais erro?','Quantas questões devo fazer?','Reorganize meu plano semanal','Gere um resumo de NOB/SUAS'];
  return appShell('assistente', `${pageHeader('Assistente de estudos','Orientação contextual usando o edital validado e o seu histórico.')}
    <div class="assistant-layout"><aside class="card assistant-side"><div class="card-title"><div><h3>Perguntas sugeridas</h3><p>Atalhos para sua rotina</p></div></div>${suggestions.map(s=>`<button class="suggestion" data-action="ask-suggestion" data-text="${s}">${icon('message','icon-sm')} ${s}</button>`).join('')}<div class="notice" style="margin-top:20px">${icon('shield')} As respostas usam somente conteúdo do edital e dados validados da plataforma.</div></aside><section class="card chat"><header class="chat-head"><span class="ai-avatar">${icon('bot')}</span><div><strong>Mentor Aprova</strong><span class="online">● Online • contexto do cargo ${roleData().code}</span></div></header><div class="chat-messages" id="chat-messages">${state.chat.map(m=>`<div class="message ${m.from==='user'?'user':''}"><span class="message-mini-avatar">${m.from==='user'?initials(state.user.name):'IA'}</span><div class="message-bubble">${escapeHtml(m.text).replace(/\n/g,'<br>')}</div></div>`).join('')}</div><form class="chat-compose" id="chat-form"><input class="input" name="message" autocomplete="off" placeholder="Pergunte sobre seu plano, desempenho ou conteúdo…"><button class="btn btn-primary btn-icon" type="submit" aria-label="Enviar">${icon('send')}</button></form></section></div>`);
}

function essayPage() {
  const saved = readLocal('aprova_essay','');
  const words = saved.trim() ? saved.trim().split(/\s+/).length : 0;
  return appShell('discursiva', `${pageHeader('Treino discursivo','Pratique com temas alinhados aos conhecimentos específicos do seu cargo.',`<button class="btn btn-outline">${icon('refresh','icon-sm')} Trocar tema</button><button class="btn btn-primary" data-action="evaluate-essay">${icon('bot','icon-sm')} Avaliar texto</button>`)}
    <div class="essay-topic"><span class="badge">Tema #08 • Atualidades do edital</span><h3 style="margin-top:11px">A atuação intersetorial no enfrentamento da vulnerabilidade social no Distrito Federal</h3><p class="small muted" style="margin:0">Redija um texto dissertativo-argumentativo, entre 20 e 30 linhas, apresentando desafios e caminhos para a articulação entre assistência social, saúde, educação e justiça.</p></div><div class="essay-layout"><section class="card essay-editor"><div class="editor-toolbar"><div class="small muted">Salvamento automático ativo</div><div class="small"><strong id="word-count">${words}</strong> palavras • estimativa de <strong>${Math.ceil(words/10)}</strong> linhas</div></div><textarea class="editor-area" id="essay-text" placeholder="Comece sua redação aqui…">${escapeHtml(saved)}</textarea></section><aside class="stack"><section class="card card-pad"><div class="card-title"><div><h3>Critérios de avaliação</h3><p>Conforme Edital nº 1/2026</p></div></div>${[['Conteúdo e comando','Peso 7'],['Organização textual','Peso 1,5'],['Domínio da língua','Peso 1,5']].map(([t,p])=>`<div class="criteria-row"><div><span>${t}</span><div class="progress" style="margin-top:5px"><div class="progress-bar" style="width:0%"></div></div></div><b>${p}</b></div>`).join('')}<div class="notice notice-warning" style="margin-top:16px">${icon('info')} A nota gerada é uma estimativa de treinamento, nunca uma nota oficial.</div></section><section class="card card-pad"><div class="card-title"><div><h3>Checklist antes de enviar</h3></div></div><div class="stack">${['Atendi ao tema e ao comando','Estruturei introdução, desenvolvimento e conclusão','Usei conectivos com clareza','Revisei gramática e ortografia','Mantive entre 20 e 30 linhas'].map(t=>`<label class="checkbox"><input type="checkbox"> ${t}</label>`).join('')}</div></section></aside></div>`);
}

function profilePage() {
  return appShell('perfil', `${pageHeader('Meu perfil','Gerencie seus dados, cargo e preferências de estudo.')}
    <div class="profile-layout"><aside class="card profile-side"><span class="avatar">${initials(state.user.name)}</span><h2>${escapeHtml(state.user.name)}</h2><p>${escapeHtml(state.user.email)}</p><span class="badge badge-success">Plano gratuito</span><div class="profile-nav"><button class="active">Dados pessoais</button><button>Preparação</button><button>Privacidade</button><button>Conquistas</button></div></aside><section class="card profile-main"><div class="card-title"><div><h2>Dados pessoais</h2><p>Informações usadas para personalizar sua experiência</p></div><button class="btn btn-outline btn-sm" data-action="edit-avatar">Alterar foto</button></div><form id="profile-form"><div class="form-row"><div class="form-group"><label>Nome completo</label><input class="input" name="name" value="${escapeHtml(state.user.name)}"></div><div class="form-group"><label>E-mail</label><input class="input" name="email" type="email" value="${escapeHtml(state.user.email)}" disabled></div></div><div class="form-row"><div class="form-group"><label>Cargo selecionado</label><select class="select" name="selectedRole">${Object.values(roles).map(r=>`<option value="${r.id}" ${r.id===roleData().id?'selected':''}>${r.name}</option>`).join('')}</select></div><div class="form-group"><label>Data da prova</label><input class="input" name="examDate" type="date" value="${state.user.profile.examDate}"></div></div><div class="form-row"><div class="form-group"><label>Dias por semana</label><input class="input" name="daysPerWeek" type="number" min="1" max="7" value="${state.user.profile.daysPerWeek}"></div><div class="form-group"><label>Horas por dia</label><input class="input" name="hoursPerDay" type="number" min=".5" max="12" step=".5" value="${state.user.profile.hoursPerDay}"></div></div><div class="form-row"><div class="form-group"><label>Nível atual</label><select class="select" name="level">${['Inicial','Básico','Intermediário','Avançado'].map(v=>`<option ${v===state.user.profile.level?'selected':''}>${v}</option>`).join('')}</select></div><div class="form-group"><label>Meta semanal de questões</label><input class="input" name="weeklyGoal" type="number" value="${state.user.profile.weeklyGoal}"></div></div><button class="btn btn-primary" type="submit">Salvar alterações</button></form><hr style="border:0;border-top:1px solid var(--line);margin:28px 0"><div class="card-title"><div><h3>Dados e privacidade</h3><p>Você controla seu histórico</p></div></div><div class="setting-row"><div><strong>Exportar meus dados</strong><p>Baixe perfil, respostas e progresso em formato JSON.</p></div><button class="btn btn-outline btn-sm" data-action="export-data">${icon('download','icon-sm')} Exportar</button></div><div class="setting-row"><div><strong class="red">Excluir conta e histórico</strong><p>A exclusão é permanente após a confirmação.</p></div><button class="btn btn-danger btn-sm" data-action="delete-account">Excluir conta</button></div></section></div>`);
}

function settingsPage() {
  const settings = [['Notificações do estudo do dia','Lembrete 30 minutos antes do horário preferido',true],['Revisões pendentes','Aviso quando uma revisão entra na fila',true],['Sequência em risco','Alerta ao final do dia se não houver atividade',true],['Relatório semanal','Resumo de desempenho todo domingo',true],['Novos simulados','Avisos de novos simulados da plataforma',false],['Ranking opcional','Compartilhar pontuação sem exibir nome completo',false]];
  return appShell('configuracoes', `${pageHeader('Configurações','Personalize notificações, aparência e acessibilidade.')}
    <div class="grid grid-2"><section class="card card-pad"><div class="card-title"><div><h2>Notificações</h2><p>Escolha quais avisos deseja receber</p></div>${icon('bell')}</div>${settings.map(([t,d,on])=>`<div class="setting-row"><div><strong>${t}</strong><p>${d}</p></div><button class="switch ${on?'on':''}" data-action="toggle-switch" aria-label="Alternar ${t}"></button></div>`).join('')}</section><section class="stack"><div class="card card-pad"><div class="card-title"><div><h2>Aparência</h2><p>Conforto em qualquer horário</p></div>${icon('moon')}</div><div class="setting-row"><div><strong>Modo escuro</strong><p>Reduz o brilho em ambientes pouco iluminados.</p></div><button class="switch ${state.dark?'on':''}" data-action="toggle-dark"></button></div><div class="setting-row"><div><strong>Texto ampliado</strong><p>Aumenta o tamanho base da interface.</p></div><button class="switch" data-action="toggle-large-text"></button></div><div class="setting-row"><div><strong>Reduzir animações</strong><p>Minimiza movimentos e transições.</p></div><button class="switch" data-action="toggle-switch"></button></div></div><div class="card card-pad"><div class="card-title"><div><h2>Conta</h2><p>Sessão e segurança</p></div>${icon('shield')}</div><button class="btn btn-outline" style="width:100%;margin-bottom:9px" data-action="change-password">Alterar senha</button><button class="btn btn-danger" style="width:100%" data-action="logout">${icon('logout','icon-sm')} Sair da conta</button></div></section></div>`);
}

function adminPage() {
  const pending = state.practiceQuestions.filter(q=>q.validation<85).slice(0,5);
  return appShell('admin', `${pageHeader('Painel administrativo','Gerencie o edital, conteúdos, questões e auditoria da plataforma.',`<button class="btn btn-outline" data-action="import-edital">${icon('upload','icon-sm')} Importar edital</button><button class="btn btn-primary" data-action="admin-create">${icon('plus','icon-sm')} Novo conteúdo</button>`)}
    <div class="admin-stat-grid" style="margin-bottom:18px">${[['users','Usuários ativos','1.284','+8,4% no mês'],['checkCircle','Questões publicadas','2.418','184 nesta semana'],['alert','Aguardando revisão','37','12 com baixa confiança'],['chart','Sessões hoje','4.892','76% de acertos']].map(([i,l,v,s])=>`<div class="card admin-stat"><span class="feature-icon">${icon(i)}</span><div><strong>${v}</strong><span>${l}<br>${s}</span></div></div>`).join('')}</div><div class="grid grid-3" style="margin-bottom:18px">${[['clipboard','Cargos e editais','2 cargos • 1 edital ativo'],['book','Disciplinas e tópicos',`${roleData().topics+112} objetos mapeados`],['scale','Leis e versões','18 normas monitoradas'],['timer','Modelos de prova','2 configurações ativas'],['bell','Notificações','3 campanhas agendadas'],['settings','Permissões','4 perfis administrativos']].map(([i,t,s])=>`<button class="card admin-stat" data-action="admin-section"><span class="feature-icon">${icon(i)}</span><div style="text-align:left"><strong style="font-size:14px">${t}</strong><span>${s}</span></div>${icon('chevronRight','icon-sm')}</button>`).join('')}</div><section class="card"><div class="card-title" style="padding:18px 18px 0"><div><h2>Fila de validação de questões</h2><p>Itens gerados por IA que exigem decisão humana</p></div><span class="badge badge-warning">${pending.length} nesta amostra</span></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>Questão</th><th>Disciplina</th><th>Confiança</th><th>Referência</th><th>Status</th><th>Ações</th></tr></thead><tbody>${pending.map(q=>`<tr><td><strong>${q.id}</strong><div class="small muted" style="max-width:290px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${q.text}</div></td><td>${q.subject}</td><td><span class="badge badge-warning">${q.validation}%</span></td><td><span class="small">${q.reference.slice(0,40)}…</span></td><td><span class="badge badge-warning">Revisão</span></td><td><div style="display:flex;gap:5px"><button class="btn btn-success btn-sm" data-action="approve-question">Aprovar</button><button class="btn btn-danger btn-sm" data-action="reject-question">Rejeitar</button></div></td></tr>`).join('')}</tbody></table></div><div class="pagination"><span>Mostrando ${pending.length} de 37 questões</span><div><button class="btn btn-outline btn-sm">Anterior</button> <button class="btn btn-outline btn-sm">Próxima</button></div></div></section>`);
}

function diagnosticPage() {
  return appShell('dashboard', `${pageHeader('Avaliação diagnóstica','Descubra seu nível por disciplina e receba um plano inicial em cerca de 35 minutos.')}
    <div class="card" style="max-width:850px;margin:auto;overflow:hidden"><div style="padding:34px;color:white;background:linear-gradient(120deg,#08213e,#0e579d)"><span class="badge badge-dark">Primeiro passo recomendado</span><h1 style="margin:16px 0 9px">Seu plano começa com dados reais.</h1><p style="color:#c2d7e9;max-width:660px;margin:0">O diagnóstico percorre todas as áreas do cargo ${roleData().code}, mede tempo de resposta e classifica assuntos fortes, médios e fracos.</p></div><div class="card-pad"><div class="grid grid-3">${[['checkCircle','30 questões','Amostra equilibrada do edital'],['timer','35 minutos','Cronômetro recomendado'],['bot','Plano automático','Prioridades geradas no final']].map(([i,t,s])=>`<div style="display:flex;gap:10px"><span class="feature-icon">${icon(i)}</span><div><strong class="small">${t}</strong><div class="small muted">${s}</div></div></div>`).join('')}</div><div class="notice notice-warning" style="margin:24px 0">${icon('info')} O resultado é formativo. Você poderá refazer o diagnóstico após 30 dias para comparar sua evolução.</div><div style="display:flex;justify-content:flex-end;gap:10px"><button class="btn btn-outline" data-route="dashboard">Fazer depois</button><button class="btn btn-primary btn-lg" data-action="start-diagnostic">Começar diagnóstico ${icon('arrowRight','icon-sm')}</button></div></div></div>`);
}

const protectedRoutes = new Set(['dashboard','plano','revisoes','disciplinas','edital','resumos','mapas-mentais','lei-seca','flashcards','questoes','simulados','simulado','resultado','discursiva','caderno-erros','estatisticas','assistente','perfil','configuracoes','assinatura','admin','diagnostico']);

function render() {
  const route = getRoute();
  clearInterval(state.examTimer);
  state.examTimer = null;
  if (protectedRoutes.has(route) && !state.auth) {
    state.routeAfterAuth = route;
    app.innerHTML = authPage('login');
    return;
  }
  const pages = {
    inicio: landingPage,
    login: () => authPage('login'),
    cadastro: () => authPage('cadastro'),
    'recuperar-senha': recoverPage,
    onboarding: onboardingPage,
    dashboard: dashboardPage,
    plano: planPage,
    revisoes: reviewsPage,
    disciplinas: disciplinesPage,
    edital: editalPage,
    resumos: summariesPage,
    'mapas-mentais': mindMapsPage,
    'lei-seca': lawPage,
    flashcards: flashcardsPage,
    questoes: questionsPage,
    simulados: simulationsPage,
    simulado: examPage,
    resultado: resultsPage,
    discursiva: essayPage,
    'caderno-erros': errorsPage,
    estatisticas: statsPage,
    assistente: assistantPage,
    perfil: profilePage,
    configuracoes: settingsPage,
    assinatura: subscriptionPage,
    admin: adminPage,
    diagnostico: diagnosticPage
  };
  app.innerHTML = (pages[route] || landingPage)();
  if (route === 'simulado' && state.exam) startTimer();
  if (route === 'assistente') requestAnimationFrame(()=>{const el=document.querySelector('#chat-messages');if(el)el.scrollTop=el.scrollHeight});
}

async function api(path, options = {}) {
  const headers = { 'Content-Type':'application/json', ...(options.headers || {}) };
  if (state.auth?.token && state.auth.token !== 'demo') headers.Authorization = `Bearer ${state.auth.token}`;
  const response = await fetch(path, { ...options, headers });
  const data = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir.');
  return data;
}

async function submitAuth(form) {
  const mode = form.dataset.mode;
  const data = Object.fromEntries(new FormData(form));
  const button = form.querySelector('button[type="submit"]');
  const error = document.querySelector('#auth-error');
  button.disabled = true; button.innerHTML = `<span class="spinner" style="width:20px;height:20px;border-width:2px"></span> Aguarde…`;
  try {
    if (hasCloudBackend()) {
      if (mode === 'cadastro') {
        const result = await signUpCloud(data);
        if (!result.session) {
          toast('Conta criada. Confira seu e-mail para confirmar o cadastro.');
          navigate('login');
          return;
        }
        await applyCloudSession(result.session);
        toast('Conta criada com sucesso!');
        navigate('onboarding');
      } else {
        const result = await signInCloud(data);
        await applyCloudSession(result.session);
        toast('Bem-vindo de volta!');
        navigate(state.routeAfterAuth || 'dashboard');
      }
    } else if (['localhost', '127.0.0.1'].includes(location.hostname)) {
      const result = await api(`/api/auth/${mode==='cadastro'?'register':'login'}`, { method:'POST', body:JSON.stringify(data) });
      state.auth = { token:result.token, provider:'local' };
      state.user = { ...defaultUser, ...result.user, profile:{...defaultUser.profile,...result.user.profile} };
      saveState({ syncCloud:false });
      toast(mode==='cadastro'?'Conta local criada com sucesso!':'Bem-vindo de volta!');
      navigate(mode==='cadastro'?'onboarding':(state.routeAfterAuth || 'dashboard'));
    } else {
      throw new Error('O cadastro online ainda não foi ativado. Use “Explorar com dados demonstrativos” por enquanto.');
    }
  } catch (err) {
    error.innerHTML = `<div class="form-error">${escapeHtml(err.message)}</div>`;
    button.disabled = false; button.innerHTML = `${mode==='cadastro'?'Criar minha conta':'Entrar na minha conta'} ${icon('arrowRight','icon-sm')}`;
  }
}

function cloudProfile(row = {}) {
  return {
    selectedRole: row.selected_role || defaultUser.profile.selectedRole,
    examDate: row.exam_date || defaultUser.profile.examDate,
    daysPerWeek: row.days_per_week || defaultUser.profile.daysPerWeek,
    hoursPerDay: Number(row.hours_per_day) || defaultUser.profile.hoursPerDay,
    level: row.current_level || defaultUser.profile.level,
    difficulties: Array.isArray(row.difficulties) ? row.difficulties : [],
    weeklyGoal: row.weekly_question_goal || defaultUser.profile.weeklyGoal,
    preferredTime: row.preferred_study_time || defaultUser.profile.preferredTime
  };
}

async function applyCloudSession(session) {
  if (!session?.user) return false;
  cloudSyncEnabled = false;
  activeCloudUserId = session.user.id;
  const cloud = await loadCloudData(session.user.id);
  const saved = cloud.progress?.state || {};
  const profile = cloudProfile(cloud.profile);
  state.auth = { token:session.access_token, provider:'supabase', userId:session.user.id };
  state.user = {
    id: session.user.id,
    name: cloud.profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Estudante',
    email: session.user.email || '',
    role: 'student',
    profile
  };
  if (saved.tasks) state.tasks = saved.tasks;
  if (saved.stats) state.stats = saved.stats;
  if (saved.favorites) state.practiceFavorites = saved.favorites;
  if (saved.chat) state.chat = saved.chat;
  if (saved.exam) state.exam = saved.exam;
  if (saved.lastResult) state.lastResult = saved.lastResult;
  if (saved.onboarding) state.onboarding = { ...state.onboarding, ...saved.onboarding };
  state.practiceQuestions = makeQuestionSet(profile.selectedRole, 24);
  saveState({ syncCloud:false });
  cloudSyncEnabled = true;
  return Boolean(cloud.profile?.selected_role || cloud.progress?.state);
}

async function startGoogleLogin() {
  try {
    if (!hasCloudBackend()) throw new Error('O login com Google será liberado assim que o banco online for ativado.');
    await signInGoogleCloud();
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function requestPasswordReset(form) {
  const error = form.querySelector('#auth-error');
  try {
    if (!hasCloudBackend()) throw new Error('A recuperação online ainda não foi ativada.');
    await sendPasswordResetCloud(form.elements.email.value);
    toast('Se o e-mail estiver cadastrado, as instruções serão enviadas.');
    setTimeout(()=>navigate('login'),800);
  } catch (err) {
    error.innerHTML = `<div class="form-error">${escapeHtml(err.message)}</div>`;
  }
}

async function submitNewPassword(form) {
  const error = form.querySelector('#auth-error');
  try {
    await updatePasswordCloud(form.elements.password.value);
    state.passwordRecovery = false;
    toast('Senha atualizada com sucesso.');
    navigate('dashboard');
  } catch (err) {
    error.innerHTML = `<div class="form-error">${escapeHtml(err.message)}</div>`;
  }
}

async function logoutCurrentUser() {
  try {
    if (state.auth?.provider === 'supabase') await signOutCloud();
  } catch (error) {
    toast(error.message, 'error');
  }
  clearTimeout(cloudSyncTimer);
  cloudSyncEnabled = false;
  activeCloudUserId = null;
  state.auth = null;
  saveState({ syncCloud:false });
  toast('Sessão encerrada.');
  navigate('inicio');
}

async function confirmAccountDeletion() {
  try {
    if (state.auth?.provider === 'supabase') await deleteCloudAccount();
    localStorage.clear();
    clearTimeout(cloudSyncTimer);
    cloudSyncEnabled = false;
    activeCloudUserId = null;
    state.auth = null;
    state.modal = null;
    toast('Conta e histórico removidos.');
    navigate('inicio');
  } catch (error) {
    toast(`Não foi possível excluir a conta: ${error.message}`, 'error');
  }
}

function demoLogin(target = 'dashboard') {
  clearTimeout(cloudSyncTimer);
  cloudSyncEnabled = false;
  activeCloudUserId = null;
  state.auth = { token:'demo' };
  state.user = readLocal('aprova_user', defaultUser);
  if (!state.user?.profile) state.user = structuredClone(defaultUser);
  saveState();
  toast('Demonstração iniciada. Seu progresso será salvo neste dispositivo.');
  navigate(target);
}

function recordPractice(q, chosen, correct) {
  const answer = {questionId:q.id,selected:chosen,correct,timeSpent:45,role:roleData().id,subject:q.subject,topic:q.topic,difficulty:q.difficulty,type:'multiple-choice',session:'practice'};
  if (state.auth?.provider === 'supabase') recordCloudAnswer(state.user.id, answer).catch(()=>{});
  else if (state.auth?.provider === 'local') api('/api/answers',{method:'POST',body:JSON.stringify(answer)}).catch(()=>{});
}

function startExam({ count = 60, seconds = 14400, diagnostic = false, mode = 'multiple' } = {}) {
  let questions = makeQuestionSet(roleData().id, count);
  if (mode === 'truefalse' || mode === 'mixed') {
    questions = questions.map((q, i) => {
      if (mode === 'mixed' && i % 2 === 0) return q;
      const shouldBeTrue = i % 2 === 0;
      const proposed = q.options[shouldBeTrue ? q.answer : (q.answer + 1) % q.options.length];
      return { ...q, type: 'true_false', text: `${q.text} Julgue a afirmação: a resposta adequada ao comando é “${proposed}”.`, options: ['Certo', 'Errado'], answer: shouldBeTrue ? 0 : 1, explanation: `${shouldBeTrue ? 'A afirmação está correta.' : 'A afirmação está errada.'} ${q.explanation}` };
    });
  }
  state.exam = { questions, answers:{}, current:0, flags:[], seconds, duration:seconds, startedAt:new Date().toISOString(), diagnostic };
  saveState();
  navigate('simulado');
}

function startTimer() {
  clearInterval(state.examTimer);
  state.examTimer = setInterval(()=>{
    if (!state.exam) return clearInterval(state.examTimer);
    state.exam.seconds = Math.max(0,state.exam.seconds-1);
    const el = document.querySelector('#exam-timer span'); if(el) el.textContent=formatTime(state.exam.seconds);
    if (state.exam.seconds % 10 === 0) saveState();
    if (state.exam.seconds <= 0) { clearInterval(state.examTimer); calculateResult(); }
  },1000);
}

function calculateResult() {
  const exam = state.exam;
  if (!exam) return;
  let correct=0, wrong=0, points=0, maxPoints=0;
  const subjectMap={};
  for (const q of exam.questions) {
    maxPoints += q.weight;
    const selected=exam.answers[q.id];
    subjectMap[q.subject] ||= {right:0,total:0};
    subjectMap[q.subject].total++;
    if (selected===q.answer) { correct++; points+=q.weight; subjectMap[q.subject].right++; }
    else if (selected!==undefined) wrong++;
  }
  const blank=exam.questions.length-correct-wrong;
  const elapsed=exam.duration-exam.seconds;
  const score=pct(points,maxPoints);
  const bySubject=Object.fromEntries(Object.entries(subjectMap).map(([s,v])=>[s,pct(v.right,v.total)]));
  state.lastResult={name:exam.diagnostic?'Avaliação diagnóstica':'Simulado completo',date:new Date().toLocaleDateString('pt-BR'),finishedAt:new Date().toISOString(),score,raw:points,correct,wrong,blank,elapsed,avg:Math.round(elapsed/exam.questions.length),bySubject,diagnostic:exam.diagnostic};
  state.stats.simulations += exam.diagnostic ? 0 : 1;
  state.stats.questions += exam.questions.length;
  state.stats.correct += correct;
  state.stats.accuracy = pct(state.stats.correct,state.stats.questions);
  state.exam=null; state.modal=null; saveState();
  navigate('resultado');
  toast('Resultado calculado e plano de recuperação atualizado.');
}

function assistantReply(input) {
  const text=input.toLowerCase();
  if(text.includes('hoje')) return 'Hoje, sua prioridade é LC nº 840/2011 por 35 minutos, seguida de 12 questões de NOB/SUAS e uma revisão curta de Arquivologia. O total previsto é 1h50.';
  if(text.includes('pior')||text.includes('mais erro')) return `Sua menor taxa recente está em ${roleData().id==='tecnico'?'Direito Administrativo (59%)':'Redução de Danos (55%)'}. O padrão principal é confusão entre conceitos próximos. Sugiro 20 questões comentadas antes de nova teoria.`;
  if(text.includes('quantas')||text.includes('questões devo')) return `Sua meta semanal é ${state.stats.weeklyGoal} questões. Você já fez ${state.stats.weeklyDone}; para concluir até domingo, resolva cerca de ${Math.ceil((state.stats.weeklyGoal-state.stats.weeklyDone)/4)} por dia.`;
  if(text.includes('reorganize')||text.includes('plano')) return 'Posso redistribuir as tarefas pendentes sem aumentar sua carga total. Minha sugestão é mover Lei seca para sábado e manter a revisão de NOB/SUAS hoje, pois ela está no limite do ciclo de 7 dias.';
  if(text.includes('resumo')) return 'Resumo rápido: o SUAS organiza a assistência social de forma descentralizada e participativa. A Proteção Social Básica atua preventivamente; a Especial atende situações de risco por violação de direitos. A assistência é não contributiva. Posso abrir o resumo completo para você.';
  if(text.includes('simulado')) return 'Recomendo um simulado rápido de 20 questões, com foco em 40% de conteúdos prioritários e 60% de cobertura geral. Isso cabe em aproximadamente 30 minutos.';
  return 'Com base no seu histórico, eu começaria pelo assunto de menor desempenho e fecharia a sessão com questões comentadas. Se quiser, diga a disciplina ou peça para eu reorganizar uma tarefa específica.';
}

function openSearchModal() {
  state.modal={title:'Buscar na plataforma',large:true,body:`<div class="filter-search">${icon('search','icon-sm')}<input class="input" id="global-search" autofocus placeholder="Busque disciplina, assunto, lei ou questão…"></div><div class="nav-label">Acessos rápidos</div><div class="grid grid-3">${[['book','Disciplinas','disciplinas'],['checkCircle','Questões','questoes'],['scale','Lei seca','lei-seca'],['timer','Simulados','simulados'],['archive','Caderno de erros','caderno-erros'],['bot','Assistente de IA','assistente']].map(([i,t,r])=>`<button class="quick-card" data-route="${r}"><span class="quick-icon">${icon(i)}</span><strong>${t}</strong></button>`).join('')}</div>`}; render(); setTimeout(()=>document.querySelector('#global-search')?.focus(),50);
}

function exportData() {
  const content=JSON.stringify({exportedAt:new Date().toISOString(),user:state.user,stats:state.stats,tasks:state.tasks,lastResult:state.lastResult,favorites:state.practiceFavorites},null,2);
  const url=URL.createObjectURL(new Blob([content],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='aprova-sedes-meus-dados.json';a.click();URL.revokeObjectURL(url);
  toast('Arquivo de dados preparado.');
}

document.addEventListener('click', (event) => {
  const routeEl = event.target.closest('[data-route]');
  if (routeEl) {
    event.preventDefault();
    navigate(routeEl.dataset.route);
    return;
  }
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;

  if (action === 'toggle-sidebar') { state.sidebar=!state.sidebar; render(); }
  else if (action === 'toggle-dark') { state.dark=!state.dark;document.body.classList.toggle('dark',state.dark);saveState();render(); }
  else if (action === 'toggle-large-text') { document.documentElement.style.fontSize=document.documentElement.style.fontSize?'':'18px';el.classList.toggle('on'); }
  else if (action === 'toggle-switch') el.classList.toggle('on');
  else if (action === 'search') openSearchModal();
  else if (action === 'close-modal' || (action === 'modal-backdrop' && event.target === el)) { state.modal=null;render(); }
  else if (action === 'demo-login') demoLogin('dashboard');
  else if (action === 'demo-diagnostic') demoLogin('diagnostico');
  else if (action === 'google-login') startGoogleLogin();
  else if (action === 'select-role') { state.onboarding.selectedRole=el.dataset.role;state.routeAfterAuth='onboarding';navigate('cadastro'); }
  else if (action === 'view-role') { state.onboarding.selectedRole=el.dataset.role;state.user.profile.selectedRole=el.dataset.role;demoLogin('edital'); }
  else if (action === 'onboard-role') { state.onboarding.selectedRole=el.dataset.role;render(); }
  else if (action === 'toggle-difficulty') { const v=el.dataset.value;const list=state.onboarding.difficulties;const i=list.indexOf(v);if(i>=0)list.splice(i,1);else list.push(v);render(); }
  else if (action === 'onboard-back') { state.onboardingStep=Math.max(1,state.onboardingStep-1);render(); }
  else if (action === 'onboard-next') {
    if(state.onboardingStep===2){state.onboarding.examDate=document.querySelector('#onboard-date')?.value||state.onboarding.examDate;state.onboarding.level=document.querySelector('#onboard-level')?.value;state.onboarding.daysPerWeek=Number(document.querySelector('#onboard-days')?.value);state.onboarding.hoursPerDay=Number(document.querySelector('#onboard-hours')?.value);state.onboarding.weeklyGoal=Number(document.querySelector('#onboard-goal')?.value);state.onboarding.preferredTime=document.querySelector('#onboard-time')?.value;}
    if(state.onboardingStep<3){state.onboardingStep++;render();}else{state.user.profile={...state.user.profile,...state.onboarding};state.stats.weeklyGoal=state.onboarding.weeklyGoal;state.practiceQuestions=makeQuestionSet(state.onboarding.selectedRole,24);saveState();toast('Seu plano inicial foi criado.');navigate('diagnostico');}
  }
  else if (action === 'toggle-task') { const t=state.tasks.find(x=>x.id===Number(el.dataset.id));if(t){t.done=!t.done;if(t.done){state.stats.hours=+(state.stats.hours+.5).toFixed(1);toast('Tarefa concluída. Seu plano foi atualizado.');}saveState();render();} }
  else if (action === 'select-answer') { const q=state.practiceQuestions[state.questionIndex];state.practiceAnswers[q.id]=Number(el.dataset.index);render(); }
  else if (action === 'confirm-answer') { const q=state.practiceQuestions[state.questionIndex];const selected=state.practiceAnswers[q.id];if(selected===undefined)return;const correct=selected===q.answer;state.practiceConfirmed[q.id]=correct;state.stats.questions++;if(correct)state.stats.correct++;state.stats.accuracy=pct(state.stats.correct,state.stats.questions);state.stats.weeklyDone++;saveState();recordPractice(q,selected,correct);render(); }
  else if (action === 'next-question') { state.questionIndex=(state.questionIndex+1)%state.practiceQuestions.length;render(); }
  else if (action === 'prev-question') { state.questionIndex=Math.max(0,state.questionIndex-1);render(); }
  else if (action === 'favorite-question') { const id=state.practiceQuestions[state.questionIndex].id;const i=state.practiceFavorites.indexOf(id);if(i>=0){state.practiceFavorites.splice(i,1);toast('Questão removida dos favoritos.');}else{state.practiceFavorites.push(id);toast('Questão adicionada aos favoritos.');}saveState();render(); }
  else if (action === 'report-question') { state.modal={title:'Reportar questão',body:`<p class="muted">Ajude a equipe a revisar este item.</p><div class="form-group"><label>Motivo</label><select class="select"><option>Possível ambiguidade</option><option>Gabarito ou explicação</option><option>Referência desatualizada</option><option>Fora do edital</option></select></div><div class="form-group"><label>Comentário opcional</label><textarea class="textarea" placeholder="Descreva o problema encontrado"></textarea></div>`,footer:`<button class="btn btn-outline" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="submit-report">Enviar análise</button>`};render(); }
  else if (action === 'submit-report') { state.modal=null;toast('Questão enviada para revisão administrativa.');render(); }
  else if (action === 'similar-question') { const source=state.practiceQuestions[state.questionIndex];const clone={...source,id:`${source.id}-S${Date.now()}`,text:`Em uma nova situação prática, ${source.text.charAt(0).toLowerCase()+source.text.slice(1)}`};state.practiceQuestions.splice(state.questionIndex+1,0,clone);toast('Questão semelhante criada com base no mesmo tópico.'); }
  else if (action === 'confidence') { el.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));el.classList.add('active');toast('Nível de confiança registrado.'); }
  else if (action === 'new-practice') { state.practiceQuestions=makeQuestionSet(roleData().id,24);state.practiceAnswers={};state.practiceConfirmed={};state.questionIndex=0;toast('Nova sessão com 24 questões criada.');render(); }
  else if (action === 'start-full-exam') startExam();
  else if (action === 'start-diagnostic') startExam({count:30,seconds:2100,diagnostic:true});
  else if (action === 'choose-simulation') {
    const type=el.dataset.type;
    if(type==='complete') startExam();
    else if(type==='quick') startExam({count:20,seconds:1800});
    else if(type==='truefalse') startExam({count:20,seconds:1800,mode:'truefalse'});
    else if(type==='mixed') startExam({count:40,seconds:5400,mode:'mixed'});
    else if(type==='errors') startExam({count:18,seconds:2100});
    else { state.modal={title:'Configurar simulado',body:`<form id="sim-config"><div class="form-row"><div class="form-group"><label>Quantidade</label><input class="input" name="count" type="number" min="5" max="60" value="30"></div><div class="form-group"><label>Duração (minutos)</label><input class="input" name="minutes" type="number" min="10" max="240" value="60"></div></div><div class="form-group"><label>Disciplina</label><select class="select"><option>Todas as disciplinas</option>${roleData().subjects.map(s=>`<option>${s}</option>`).join('')}</select></div><div class="form-group"><label>Dificuldade</label><select class="select"><option>Equilibrada</option><option>Fácil</option><option>Médio</option><option>Difícil</option></select></div></form>`,footer:`<button class="btn btn-outline" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="start-custom-exam">Gerar simulado</button>`};render(); }
  }
  else if (action === 'simulation-settings') { state.modal={title:'Regra do simulado completo',body:`<div class="notice">${icon('shield')} Configuração oficial ativa para o Edital nº 1/2026.</div><div class="setting-row"><div><strong>Conhecimentos gerais</strong><p>20 questões • 1 ponto por acerto</p></div><span class="badge">20 pts</span></div><div class="setting-row"><div><strong>Conhecimentos específicos</strong><p>40 questões • 2 pontos por acerto</p></div><span class="badge">80 pts</span></div><div class="setting-row"><div><strong>Erros e itens em branco</strong><p>Não pontuam e não geram desconto</p></div><span class="badge badge-success">0 pt</span></div>`,footer:`<button class="btn btn-primary" data-action="close-modal">Entendi</button>`};render(); }
  else if (action === 'start-custom-exam') { const f=document.querySelector('#sim-config');startExam({count:Number(f?.count?.value||30),seconds:Number(f?.minutes?.value||60)*60}); }
  else if (action === 'exam-answer') { const q=state.exam.questions[state.exam.current];state.exam.answers[q.id]=Number(el.dataset.index);saveState();render(); }
  else if (action === 'exam-prev') { state.exam.current=Math.max(0,state.exam.current-1);saveState();render(); }
  else if (action === 'exam-next') { if(state.exam.current<state.exam.questions.length-1)state.exam.current++;else state.exam.current=0;saveState();render(); }
  else if (action === 'exam-jump') { state.exam.current=Number(el.dataset.index);saveState();render(); }
  else if (action === 'flag-exam') { const id=state.exam.questions[state.exam.current].id;const i=state.exam.flags.indexOf(id);if(i>=0)state.exam.flags.splice(i,1);else state.exam.flags.push(id);saveState();render(); }
  else if (action === 'pause-exam') { saveState();toast('Simulado pausado. O tempo fica congelado neste protótipo.');navigate('simulados'); }
  else if (action === 'finish-exam') { const blank=state.exam.questions.length-Object.keys(state.exam.answers).length;if(blank>0){state.modal={title:'Existem questões em branco',body:`<div class="notice notice-warning">${icon('alert')} Você deixou <strong>${blank} questões em branco</strong>. Elas não pontuam, mas também não descontam pontos.</div><p class="muted" style="margin:17px 0 0">Deseja revisar o cartão de respostas antes de finalizar?</p>`,footer:`<button class="btn btn-outline" data-action="close-modal">Continuar respondendo</button><button class="btn btn-primary" data-action="confirm-finish">Finalizar mesmo assim</button>`};render();}else calculateResult(); }
  else if (action === 'confirm-finish') calculateResult();
  else if (action === 'repeat-exam') startExam();
  else if (action === 'view-result') navigate('resultado');
  else if (action === 'start-review'||action === 'open-review'||action === 'start-error-review') { state.practiceQuestions=makeQuestionSet(roleData().id,12);state.practiceAnswers={};state.practiceConfirmed={};state.questionIndex=0;navigate('questoes');toast('Sessão de revisão preparada.'); }
  else if (action === 'postpone-review') toast('Revisão adiada para amanhã sem quebrar o ciclo.');
  else if (action === 'calendar-sync') { const data='BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Estudo Aprova SEDES\nDTSTART:20260716T183000\nDTEND:20260716T193000\nEND:VEVENT\nEND:VCALENDAR';const u=URL.createObjectURL(new Blob([data],{type:'text/calendar'}));const a=document.createElement('a');a.href=u;a.download='plano-aprova-sedes.ics';a.click();URL.revokeObjectURL(u);toast('Calendário preparado para importação.'); }
  else if (action === 'add-study') { state.modal={title:'Adicionar estudo extra',body:`<div class="form-group"><label>Disciplina</label><select class="select" id="extra-subject">${roleData().subjects.map(s=>`<option>${s}</option>`).join('')}</select></div><div class="form-row"><div class="form-group"><label>Horário</label><input class="input" id="extra-time" type="time" value="20:30"></div><div class="form-group"><label>Duração</label><select class="select" id="extra-duration"><option>20 min</option><option>30 min</option><option>45 min</option><option>60 min</option></select></div></div>`,footer:`<button class="btn btn-outline" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-extra-study">Adicionar</button>`};render(); }
  else if (action === 'save-extra-study') { state.tasks.push({id:Date.now(),time:document.querySelector('#extra-time')?.value||'20:30',duration:document.querySelector('#extra-duration')?.value||'30 min',type:'Estudo extra',subject:document.querySelector('#extra-subject')?.value||'Revisão',topic:'Conteúdo personalizado',icon:'plus',done:false});state.modal=null;saveState();toast('Estudo extra adicionado ao plano.');render(); }
  else if (action === 'show-plan-reason') { state.modal={title:'Por que o plano mudou?',body:`<div class="stack"><div class="notice">${icon('brain')} <div><strong>Desempenho recente</strong><br>3 erros em LC nº 840 aumentaram a frequência do tema em 20%.</div></div><div class="notice">${icon('chart')} <div><strong>Domínio demonstrado</strong><br>Português chegou a 81%; a teoria caiu e as questões de manutenção aumentaram.</div></div><div class="notice">${icon('refresh')} <div><strong>Revisão espaçada</strong><br>NOB/SUAS atingiu hoje o ciclo de 7 dias.</div></div></div>`,footer:`<button class="btn btn-primary" data-action="close-modal">Entendi</button>`};render(); }
  else if (action === 'open-discipline') navigate('resumos');
  else if (['generate-summary','generate-law-question','make-flashcard'].includes(action)) toast(action==='generate-summary'?'Resumo adaptado gerado e salvo.':action==='make-flashcard'?'Flashcard criado para a próxima revisão.':'Questão gerada e enviada para validação automática.');
  else if (action === 'generate-mindmap') toast('Mapa mental gerado a partir do conteúdo validado do assunto.');
  else if (action === 'print-mindmap') window.print();
  else if (action === 'flip-card') { state.flashFlipped=!state.flashFlipped;render(); }
  else if (action === 'rate-flash') { state.flashIndex=(state.flashIndex+1)%flashcards.length;state.flashFlipped=false;toast('Próxima revisão agendada.');render(); }
  else if (action === 'error-note') { state.modal={title:'Anotação pessoal',body:`<div class="form-group"><label>Motivo do erro</label><select class="select"><option>Confusão entre conceitos</option><option>Falta de conhecimento</option><option>Desatenção</option><option>Interpretação</option><option>Esquecimento</option><option>Falta de tempo</option><option>Chute</option></select></div><div class="form-group"><label>Regra que preciso memorizar</label><textarea class="textarea" placeholder="Escreva com suas próprias palavras"></textarea></div>`,footer:`<button class="btn btn-outline" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-note">Salvar anotação</button>`};render(); }
  else if (action === 'save-note') { state.modal=null;toast('Anotação salva no caderno de erros.');render(); }
  else if (action === 'ask-suggestion') { state.chat.push({from:'user',text:el.dataset.text},{from:'ai',text:assistantReply(el.dataset.text)});saveState();render(); }
  else if (action === 'evaluate-essay') { const text=document.querySelector('#essay-text')?.value||'';const words=text.trim()?text.trim().split(/\s+/).length:0;const base=Math.min(88,Math.max(32,40+Math.floor(words/6)));state.modal={title:'Avaliação formativa da discursiva',large:true,body:`<div class="result-hero" style="grid-template-columns:auto 1fr;padding:20px"><div class="result-score" style="--p:${base};width:95px;height:95px"><div><strong>${base}</strong><small>/100</small></div></div><div class="result-copy"><h1 style="font-size:19px">Nota estimada de treinamento</h1><p>O texto apresenta direção argumentativa, mas ainda pode desenvolver melhor a articulação entre políticas públicas.</p></div></div><div class="grid grid-3" style="margin-top:16px"><div class="metric"><span>Conteúdo e comando</span><strong>${Math.round(base*.72)}/70</strong></div><div class="metric"><span>Organização textual</span><strong>${Math.round(base*.15)}/15</strong></div><div class="metric"><span>Domínio da língua</span><strong>${Math.round(base*.15)}/15</strong></div></div><div class="notice notice-warning" style="margin-top:16px">${icon('info')} Esta nota é apenas uma estimativa de treinamento e não corresponde a avaliação oficial da banca.</div><h3 style="margin-top:20px">Próximo ajuste</h3><p class="muted">Inclua um exemplo concreto de articulação intersetorial no Distrito Federal e conecte-o à tese no fechamento do segundo parágrafo.</p>`,footer:`<button class="btn btn-outline" data-action="close-modal">Voltar ao texto</button><button class="btn btn-primary" data-action="close-modal">Salvar avaliação</button>`};render(); }
  else if (action === 'notifications') { state.modal={title:'Notificações',body:`<div class="stack"><div class="review-card"><span class="review-priority"></span><div><h3>3 revisões prioritárias hoje</h3><p>Comece por NOB/SUAS • há 12 min</p></div></div><div class="review-card"><span class="review-priority low"></span><div><h3>Sua precisão melhorou 8%</h3><p>Ótimo avanço nas últimas quatro semanas • ontem</p></div></div><div class="review-card"><span class="review-priority medium"></span><div><h3>Meta semanal em 70%</h3><p>Faltam 54 questões • ontem</p></div></div></div>`};render(); }
  else if (action === 'export-data'||action === 'export-edital') exportData();
  else if (action === 'delete-account') { state.modal={title:'Excluir conta e histórico',body:`<div class="notice notice-danger">${icon('alert')} Esta ação removerá seus dados locais e não poderá ser desfeita.</div><p class="muted" style="margin:16px 0 0">Exporte seus dados antes de continuar, se desejar manter uma cópia.</p>`,footer:`<button class="btn btn-outline" data-action="close-modal">Cancelar</button><button class="btn btn-danger" data-action="confirm-delete">Excluir definitivamente</button>`};render(); }
  else if (action === 'confirm-delete') confirmAccountDeletion();
  else if (action === 'logout') logoutCurrentUser();
  else if (action === 'change-password') { if(state.user?.email) sendPasswordResetCloud(state.user.email).then(()=>toast('Um link de alteração de senha foi enviado ao seu e-mail.')).catch(error=>toast(error.message,'error')); }
  else if (action === 'edit-avatar') toast('Upload de foto disponível na configuração com armazenamento em nuvem.');
  else if (action === 'approve-question' || action === 'reject-question') { el.closest('tr')?.remove();toast(action==='approve-question'?'Questão aprovada e publicada.':'Questão rejeitada e registrada no log.'); }
  else if (action === 'import-edital') { state.modal={title:'Importar conteúdo programático',body:`<div class="notice">${icon('upload')} Envie um PDF ou cole o conteúdo. A importação cria uma nova versão para revisão antes da publicação.</div><div class="form-group" style="margin-top:16px"><label>Arquivo</label><input class="input" type="file" accept=".pdf,.txt,.docx"></div><div class="form-group"><label>Identificação da versão</label><input class="input" value="Edital nº 1/2026 — Retificação nº 3"></div>`,footer:`<button class="btn btn-outline" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="confirm-import">Importar versão</button>`};render(); }
  else if (action === 'confirm-import') { state.modal=null;toast('Nova versão importada e enviada para conferência.');render(); }
  else if (action === 'admin-create'||action === 'admin-section') { state.modal={title:'Cadastrar conteúdo',body:`<div class="form-row"><div class="form-group"><label>Tipo</label><select class="select"><option>Disciplina</option><option>Tópico</option><option>Lei</option><option>Cargo</option><option>Edital</option></select></div><div class="form-group"><label>Status</label><select class="select"><option>Rascunho</option><option>Em revisão</option></select></div></div><div class="form-group"><label>Título</label><input class="input" placeholder="Nome do conteúdo"></div><div class="form-group"><label>Descrição ou referência</label><textarea class="textarea"></textarea></div>`,footer:`<button class="btn btn-outline" data-action="close-modal">Cancelar</button><button class="btn btn-primary" data-action="save-admin-content">Salvar rascunho</button>`};render(); }
  else if (action === 'save-admin-content') { state.modal=null;toast('Conteúdo salvo com registro no log administrativo.');render(); }
});

document.addEventListener('submit', (event) => {
  event.preventDefault();
  const form=event.target;
  if(form.id==='auth-form') submitAuth(form);
  else if(form.id==='recover-form') requestPasswordReset(form);
  else if(form.id==='reset-password-form') submitNewPassword(form);
  else if(form.id==='profile-form') { const data=Object.fromEntries(new FormData(form));state.user.name=data.name;state.user.profile={...state.user.profile,...data,daysPerWeek:Number(data.daysPerWeek),hoursPerDay:Number(data.hoursPerDay),weeklyGoal:Number(data.weeklyGoal)};state.stats.weeklyGoal=Number(data.weeklyGoal);state.practiceQuestions=makeQuestionSet(data.selectedRole,24);saveState();if(state.auth?.provider==='local')api('/api/profile',{method:'PATCH',body:JSON.stringify({...state.user.profile,name:state.user.name})}).catch(()=>{});toast('Perfil e plano atualizados.');render(); }
  else if(form.id==='chat-form') { const input=form.elements.message;const text=input.value.trim();if(!text)return;state.chat.push({from:'user',text});state.chat.push({from:'ai',text:assistantReply(text)});saveState();render(); }
});

document.addEventListener('input', (event) => {
  if(event.target.id==='essay-text') { const text=event.target.value;localStorage.setItem('aprova_essay',JSON.stringify(text));const words=text.trim()?text.trim().split(/\s+/).length:0;const counter=document.querySelector('#word-count');if(counter)counter.textContent=words; }
  if(event.target.id==='onboard-days') { state.onboarding.daysPerWeek=Number(event.target.value);event.target.nextElementSibling.value=`${event.target.value} dias`; }
  if(event.target.id==='onboard-hours') { state.onboarding.hoursPerDay=Number(event.target.value);event.target.nextElementSibling.value=`${event.target.value}h`; }
});

document.addEventListener('keydown', (event) => {
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(state.auth)openSearchModal();}
  if(event.key==='Escape'&&state.modal){state.modal=null;render();}
});

window.addEventListener('hashchange', render);

async function bootstrap() {
  if (!hasCloudBackend()) {
    render();
    return;
  }
  try {
    const session = await getCloudSession();
    if (session) {
      const hasPlan = await applyCloudSession(session);
      if (['inicio','login','cadastro'].includes(getRoute())) navigate(hasPlan ? 'dashboard' : 'onboarding');
    } else if (state.auth?.provider === 'supabase') {
      state.auth = null;
      saveState({ syncCloud:false });
    }
    onCloudAuthStateChange(async (event, nextSession) => {
      if (event === 'PASSWORD_RECOVERY') {
        state.passwordRecovery = true;
        if (nextSession) await applyCloudSession(nextSession);
        navigate('recuperar-senha');
        return;
      }
      if (event === 'SIGNED_IN' && nextSession && nextSession.user.id !== activeCloudUserId) {
        const hasPlan = await applyCloudSession(nextSession);
        if (['inicio','login','cadastro'].includes(getRoute())) navigate(hasPlan ? 'dashboard' : 'onboarding');
      }
      if (event === 'SIGNED_OUT') {
        cloudSyncEnabled = false;
        activeCloudUserId = null;
        state.auth = null;
        saveState({ syncCloud:false });
      }
    });
  } catch (error) {
    console.error('Falha ao iniciar a conta online.', error);
    toast('Não foi possível sincronizar sua conta agora. Tente novamente em instantes.', 'error');
  }
  render();
}

bootstrap();
