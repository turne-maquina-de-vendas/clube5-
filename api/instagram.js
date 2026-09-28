/* Grade do Instagram na lateral de Conteúdos: perfil + últimos 9 posts de @oclubedos5porcento.
   Usa a API oficial (Instagram API com login do Instagram). Token: variável IG_ACCESS_TOKEN na Vercel.
   O token dura 60 dias; esta função o renova sozinha a cada 7 dias e guarda o novo no Postgres (Neon).
   A resposta fica em cache na CDN por 2 min, então a API do Instagram é chamada poucas vezes. */
import { neon } from "@neondatabase/serverless";

const IG = "https://graph.instagram.com";
const REFRESH_EVERY = 7 * 24 * 3600 * 1000;
const json = (body, status = 200, cache = "s-maxage=120, stale-while-revalidate=600") =>
  Response.json(body, { status, headers: { "cache-control": cache } });

let sql;
function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  sql ||= neon(url);
  return sql;
}

/* token mais novo: o renovado no banco; se IG_ACCESS_TOKEN mudar na Vercel, ele substitui o guardado */
async function token() {
  const env = process.env.IG_ACCESS_TOKEN;
  const q = db();
  if (!q) return env;
  await q.query(`create table if not exists ig_token (id int primary key default 1, token text not null, seed text not null, refreshed_at timestamptz not null default now())`);
  let [row] = await q.query(`select token, seed, refreshed_at from ig_token where id = 1`);
  if (env && (!row || row.seed !== env)) {
    [row] = await q.query(`insert into ig_token (id, token, seed, refreshed_at) values (1, $1, $1, now() - interval '8 days')
      on conflict (id) do update set token = $1, seed = $1, refreshed_at = now() - interval '8 days' returning token, seed, refreshed_at`, [env]);
  }
  if (!row) return env;
  if (Date.now() - new Date(row.refreshed_at).getTime() > REFRESH_EVERY) {
    const r = await fetch(`${IG}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(row.token)}`);
    const d = await r.json().catch(() => ({}));
    if (d.access_token) {
      await q.query(`update ig_token set token = $1, refreshed_at = now() where id = 1`, [d.access_token]);
      return d.access_token;
    }
  }
  return row.token;
}

export async function GET() {
  let t;
  try { t = await token(); } catch { t = process.env.IG_ACCESS_TOKEN; }
  if (!t) return json({ error: "Instagram não conectado (defina IG_ACCESS_TOKEN na Vercel)" }, 503, "no-store");

  const at = encodeURIComponent(t);
  const [pr, mr] = await Promise.all([
    fetch(`${IG}/me?fields=username,name,profile_picture_url,followers_count,media_count&access_token=${at}`),
    fetch(`${IG}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=9&access_token=${at}`),
  ]);
  const [p, m] = await Promise.all([pr.json(), mr.json()]);
  if (p.error || m.error) return json({ error: (p.error || m.error).message || "erro na API do Instagram" }, 502, "s-maxage=30");

  return json({
    profile: { username: p.username, name: p.name, picture: p.profile_picture_url, followers: p.followers_count, posts: p.media_count },
    posts: (m.data || []).slice(0, 9).map(x => ({
      id: x.id, type: x.media_type, link: x.permalink, at: x.timestamp,
      img: x.media_type === "VIDEO" ? x.thumbnail_url : x.media_url,
      caption: (x.caption || "").slice(0, 140),
    })),
    fetchedAt: new Date().toISOString(),
  });
}
