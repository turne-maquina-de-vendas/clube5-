/* Lateral de Conteúdos: perfil e últimos 9 posts do Instagram (via /api/instagram), atualizando sozinha. */
(() => {
const box = document.getElementById("ig");
if (!box) return;
const PROFILE = "oclubedos5porcento", EVERY = 2 * 60 * 1000;
const esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const num = n => n == null ? "" : n >= 1e6 ? (n/1e6).toFixed(1).replace(".", ",") + " mi" : n >= 1e4 ? Math.round(n/1e3) + " mil" : n.toLocaleString("pt-BR");
const ago = iso => { const m = Math.round((Date.now() - new Date(iso)) / 60000);
  return m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m/60)} h` : `${Math.round(m/1440)} d`; };
const ICON = {
  CAROUSEL_ALBUM: `<svg viewBox="0 0 24 24"><rect x="7" y="7" width="13" height="13" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>`,
  VIDEO: `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
};
let data = null, err = "";

function paint(){
  const p = data?.profile || {};
  const head = `<header class="ig-head">
      ${p.picture ? `<img class="ig-pic" src="${esc(p.picture)}" alt="">` : `<span class="ig-pic"></span>`}
      <div><a class="ig-user" href="https://www.instagram.com/${esc(p.username || PROFILE)}/" target="_blank" rel="noopener">@${esc(p.username || PROFILE)}</a>
      ${data ? `<small>${num(p.posts)} posts · ${num(p.followers)} seguidores</small>` : ""}</div>
    </header>`;
  const live = data ? `<p class="ig-live"><i></i> Ao vivo · atualizado às ${new Date(data.fetchedAt).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</p>` : "";
  const grid = data ? `<div class="ig-grid">${data.posts.map(x => `
      <a href="${esc(x.link)}" target="_blank" rel="noopener" title="${esc(x.caption)}">
        <img src="${esc(x.img)}" alt="${esc(x.caption)}" loading="lazy">
        ${ICON[x.type] ? `<span class="ig-type">${ICON[x.type]}</span>` : ""}
        <span class="ig-ago">${ago(x.at)}</span>
      </a>`).join("")}</div>`
    : `<div class="ig-grid ig-empty">${Array.from({length:9}, () => "<span></span>").join("")}<p>${esc(err || "Carregando…")}</p></div>`;
  box.innerHTML = `<div class="ig-card">${head}${live}${grid}
    <a class="ig-open" href="https://www.instagram.com/${PROFILE}/" target="_blank" rel="noopener">Abrir no Instagram</a></div>`;
}
async function load(){
  try {
    const r = await fetch("/api/instagram");
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.posts) throw new Error(d.error || (r.status === 404 ? "Grade disponível só no site da Vercel" : "Instagram indisponível"));
    data = d; err = "";
  } catch (e) { if (!data) err = e.message; }
  paint();
}
paint(); load();
setInterval(() => { if (!document.hidden) load(); }, EVERY);
document.addEventListener("visibilitychange", () => { if (!document.hidden) load(); });
})();
