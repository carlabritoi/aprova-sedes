import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const PORT = Number(process.env.PORT || 4173);
const ROOT = join(process.cwd(), 'public');
const DATA_DIR = join(process.cwd(), 'data');
const DB_FILE = join(DATA_DIR, 'database.json');
const sessions = new Map();

const initialDb = { users: [], answers: [], auditLogs: [] };

async function getDb() {
  await mkdir(DATA_DIR, { recursive: true });
  if (!existsSync(DB_FILE)) await writeFile(DB_FILE, JSON.stringify(initialDb, null, 2));
  try { return JSON.parse(await readFile(DB_FILE, 'utf8')); }
  catch { return structuredClone(initialDb); }
}

async function saveDb(db) {
  await writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

function verifyPassword(password, stored) {
  const [salt, key] = stored.split(':');
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(key, 'hex');
  return expected.length === candidate.length && timingSafeEqual(candidate, expected);
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

function tokenFrom(req) {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

async function handleApi(req, res, url) {
  const db = await getDb();
  if (req.method === 'GET' && url.pathname === '/api/health') return send(res, 200, { ok: true, service: 'Aprova SEDES API' });

  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    const { name, email, password } = await readJson(req);
    if (!name || !email || !password || password.length < 6) return send(res, 400, { error: 'Preencha os dados e use uma senha com pelo menos 6 caracteres.' });
    if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return send(res, 409, { error: 'Este e-mail já está cadastrado.' });
    const user = { id: randomBytes(10).toString('hex'), name, email: email.toLowerCase(), passwordHash: hashPassword(password), role: 'student', profile: {}, createdAt: new Date().toISOString() };
    db.users.push(user);
    db.auditLogs.push({ action: 'USER_REGISTERED', userId: user.id, at: new Date().toISOString() });
    await saveDb(db);
    const token = randomBytes(32).toString('hex'); sessions.set(token, user.id);
    return send(res, 201, { token, user: publicUser(user) });
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const { email, password } = await readJson(req);
    const user = db.users.find((u) => u.email === String(email || '').toLowerCase());
    if (!user || !verifyPassword(String(password || ''), user.passwordHash)) return send(res, 401, { error: 'E-mail ou senha incorretos.' });
    const token = randomBytes(32).toString('hex'); sessions.set(token, user.id);
    return send(res, 200, { token, user: publicUser(user) });
  }

  const userId = sessions.get(tokenFrom(req));
  const user = db.users.find((u) => u.id === userId);
  if (!user) return send(res, 401, { error: 'Sessão inválida ou expirada.' });

  if (req.method === 'PATCH' && url.pathname === '/api/profile') {
    const profile = await readJson(req);
    user.profile = { ...user.profile, ...profile };
    if (profile.name) user.name = profile.name;
    db.auditLogs.push({ action: 'PROFILE_UPDATED', userId, at: new Date().toISOString() });
    await saveDb(db);
    return send(res, 200, { user: publicUser(user) });
  }

  if (req.method === 'POST' && url.pathname === '/api/answers') {
    const answer = await readJson(req);
    db.answers.push({ id: randomBytes(8).toString('hex'), userId, ...answer, createdAt: new Date().toISOString() });
    await saveDb(db);
    return send(res, 201, { ok: true });
  }

  if (req.method === 'GET' && url.pathname === '/api/progress') {
    return send(res, 200, { answers: db.answers.filter((a) => a.userId === userId) });
  }

  return send(res, 404, { error: 'Rota não encontrada.' });
}

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res, url);
    const requested = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
    const file = normalize(join(ROOT, requested));
    if (!file.startsWith(ROOT) || !existsSync(file)) {
      res.writeHead(200, { 'Content-Type': mime['.html'] });
      return createReadStream(join(ROOT, 'index.html')).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    createReadStream(file).pipe(res);
  } catch (error) {
    send(res, 500, { error: 'Erro interno.', detail: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Aprova SEDES disponível em http://localhost:${PORT}`);
});
