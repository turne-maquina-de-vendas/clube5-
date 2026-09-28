/* Revisão dos conteúdos na Vercel: status (aprovar/ajustar/reprovar/publicado) e anotações de cada peça.
   Mesma API da versão Netlify (netlify/functions/revisao.mjs), guardada num hash Redis "revisao".
   Requer um banco Upstash Redis conectado ao projeto (Vercel → Storage → Upstash for Redis),
   que cria KV_REST_API_URL/KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN).
   GET  /api/revisao                      → { <peça>: {status, by, at, notes:[{by,text,at}]} }
   POST /api/revisao {id, status, by}     → muda o status
   POST /api/revisao {id, note, by}       → adiciona uma anotação */
import { Redis } from "@upstash/redis";

const STATUS = ["aprovado", "ajuste", "reprovado", "publicado", ""];
const clean = (s, max) => String(s ?? "").trim().slice(0, max);
const json = (body, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });

let redis;
function store() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis ||= new Redis({ url, token });
  return {
    all: async () => (await redis.hgetall("revisao")) || {},
    get: id => redis.hget("revisao", id),
    set: (id, v) => redis.hset("revisao", { [id]: v }),
  };
}
const NO_DB = () => json({ error: "banco da revisão não configurado (conecte o Upstash Redis no projeto da Vercel)" }, 503);

export async function GET(_req, db = store()) {
  if (!db) return NO_DB();
  return json(await db.all());
}

export async function POST(req, db = store()) {
  if (!db) return NO_DB();
  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
  const id = clean(body.id, 80), by = clean(body.by, 40) || "Anônimo";
  if (!/^[a-z0-9-]+$/.test(id)) return json({ error: "peça inválida" }, 400);

  const cur = (await db.get(id)) || { status: "", notes: [] };
  const at = new Date().toISOString();
  if ("status" in body) {
    if (!STATUS.includes(body.status)) return json({ error: "status inválido" }, 400);
    Object.assign(cur, { status: body.status, by, at });
  } else if ("note" in body) {
    const text = clean(body.note, 2000);
    if (!text) return json({ error: "anotação vazia" }, 400);
    cur.notes.push({ by, text, at });
  } else return json({ error: "nada para salvar" }, 400);

  await db.set(id, cur);
  return json(cur);
}
