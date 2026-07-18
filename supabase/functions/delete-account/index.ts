import { createClient } from 'npm:@supabase/supabase-js@2';

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || 'https://carlabritoi.github.io';

function cors(origin: string | null) {
  const safeOrigin = origin === allowedOrigin ? origin : allowedOrigin;
  return {
    'Access-Control-Allow-Origin': safeOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
}

Deno.serve(async (request) => {
  const origin = request.headers.get('Origin');
  const headers = cors(origin);

  if (request.method === 'OPTIONS') return new Response('ok', { headers });
  if (request.method !== 'POST') return Response.json({ error: 'Método não permitido.' }, { status: 405, headers });
  if (origin && origin !== allowedOrigin) return Response.json({ error: 'Origem não autorizada.' }, { status: 403, headers });

  const authorization = request.headers.get('Authorization');
  if (!authorization) return Response.json({ error: 'Sessão necessária.' }, { status: 401, headers });

  const url = Deno.env.get('SUPABASE_URL');
  const publishableKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !publishableKey || !serviceRoleKey) {
    return Response.json({ error: 'Serviço indisponível.' }, { status: 503, headers });
  }

  const userClient = createClient(url, publishableKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) return Response.json({ error: 'Sessão inválida.' }, { status: 401, headers });

  const admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const { error } = await admin.auth.admin.deleteUser(userData.user.id);
  if (error) return Response.json({ error: 'Não foi possível excluir a conta.' }, { status: 500, headers });

  return Response.json({ ok: true }, { headers });
});
