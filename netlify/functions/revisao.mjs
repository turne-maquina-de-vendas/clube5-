/* Revisão dos conteúdos: status (aprovar/ajustar/reprovar/publicado) e anotações de cada peça.
   GET  /api/revisao                      → { <peça>: {status, by, at, notes:[{by,text,at}]} }
   POST /api/revisao {id, status, by}     → muda o status
   POST /api/revisao {id, note, by}       → adiciona uma anotação */
import { getStore } from "@netlify/blobs";

const STATUS = ["aprovado", "ajuste", "reprovado", "publicado", ""];
const clean = (s, max) => String(s ?? "").trim().slice(0, max);
const json = (body, status = 200) => Response.json(body, { status, headers: { "cache-control": "no-store" } });

export default async (req) => {
  const store = getStore({ name: "revisao", consistency: "strong" });

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const all = await Promise.all(blobs.map(async b => [b.key, await store.get(b.key, { type: "json" })]));
    return json(Object.fromEntries(all.filter(([, v]) => v)));
  }
  if (req.method !== "POST") return json({ error: "método não suportado" }, 405);

  let body;
  try { body = await req.json(); } catch { return json({ error: "JSON inválido" }, 400); }
  const id = clean(body.id, 80), by = clean(body.by, 40) || "Anônimo";
  if (!/^[a-z0-9-]+$/.test(id)) return json({ error: "peça inválida" }, 400);

  const cur = (await store.get(id, { type: "json" })) || { status: "", notes: [] };
  const at = new Date().toISOString();
  if ("status" in body) {
    if (!STATUS.includes(body.status)) return json({ error: "status inválido" }, 400);
    Object.assign(cur, { status: body.status, by, at });
  } else if ("note" in body) {
    const text = clean(body.note, 2000);
    if (!text) return json({ error: "anotação vazia" }, 400);
    cur.notes.push({ by, text, at });
  } else return json({ error: "nada para salvar" }, 400);

  await store.setJSON(id, cur);
  return json(cur);
};

export const config = { path: "/api/revisao" };
