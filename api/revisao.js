/* Revisão dos conteúdos na Vercel: status (aprovar/ajustar/reprovar/publicado) e anotações de cada peça.
   Mesma API da versão Netlify (netlify/functions/revisao.mjs), guardada no Postgres (Neon) conectado ao projeto.
   A Vercel injeta DATABASE_URL (ou POSTGRES_URL) ao conectar o Neon; a tabela é criada na primeira chamada.
   GET  /api/revisao                      → { <peça>: {status, by, at, notes:[{by,text,at}]} }
   POST /api/revisao {id, status, by}     → muda o status
   POST /api/revisao {id, note, by}       → adiciona uma anotação */
import { neon } from "@neondatabase/serverless";

const STATUS = ["aprovado", "ajuste", "reprovado", "publicado", ""];
const clean = (s, max) => String(s ?? "").trim().slice(0, max);
const json = (body, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });

/* query(texto, params) → linhas; no teste, trocado por um Postgres em memória */
let query, ready;
function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  if (!query) { const sql = neon(url); query = (text, params) => sql.query(text, params); }
  return query;
}
export function useQuery(q) { query = q; ready = null; }
const setup = q => ready ||= q(`create table if not exists revisao (
  id text primary key, data jsonb not null default '{"status":"","notes":[]}', updated_at timestamptz not null default now())`, []);

const NO_DB = () => json({ error: "banco da revisão não configurado (conecte o Neon/Postgres no projeto da Vercel)" }, 503);

export async function GET() {
  const q = db(); if (!q) return NO_DB();
  await setup(q);
  const rows = await q("select id, data from revisao", []);
  return json(Object.fromEntries(rows.map(r => [r.id, r.data])));
}

export async function POST(req) {
  const q = db(); if (!q) return NO_DB();
  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
  const id = clean(body.id, 80), by = clean(body.by, 40) || "Anônimo";
  if (!/^[a-z0-9-]+$/.test(id)) return json({ error: "peça inválida" }, 400);
  const at = new Date().toISOString();
  await setup(q);

  let rows;
  if ("status" in body) {
    if (!STATUS.includes(body.status)) return json({ error: "status inválido" }, 400);
    const patch = JSON.stringify({ status: body.status, by, at });
    rows = await q(`insert into revisao (id, data) values ($1, '{"status":"","notes":[]}'::jsonb || $2::jsonb)
      on conflict (id) do update set data = revisao.data || $2::jsonb, updated_at = now() returning data`, [id, patch]);
  } else if ("note" in body) {
    const text = clean(body.note, 2000);
    if (!text) return json({ error: "anotação vazia" }, 400);
    const note = JSON.stringify({ by, text, at });
    // acrescenta a nota de forma atômica (duas pessoas anotando ao mesmo tempo não se sobrescrevem)
    rows = await q(`insert into revisao (id, data) values ($1, jsonb_build_object('status', '', 'notes', jsonb_build_array($2::jsonb)))
      on conflict (id) do update set data = jsonb_set(revisao.data, '{notes}', coalesce(revisao.data->'notes', '[]'::jsonb) || jsonb_build_array($2::jsonb)),
      updated_at = now() returning data`, [id, note]);
  } else return json({ error: "nada para salvar" }, 400);

  return json(rows[0].data);
}
