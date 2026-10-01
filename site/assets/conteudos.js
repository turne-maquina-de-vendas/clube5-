/* Conteúdos: painel de carrosséis, estáticos e capas de reels do Instagram do Clube dos 5%.
   Para incluir uma peça, adicione um item na lista do formato (imagens em img/conteudos/). */
const BASE = document.documentElement.dataset.base || "";
/* cada peça: pasta (dir) + arquivos. Tela usa img/conteudos/<dir>/<f>.jpg; download usa o original dl/<dir>/<f>.png */
const piece = (dir, title, files) => ({id: files.length>1 ? dir : `${dir}-${files[0]}`, title, zip: files.length>1 ? `dl/${dir}.zip` : null,
  slides: files.map(f=>({src:`img/conteudos/${dir}/${f}.jpg`, orig:`dl/${dir}/${f}.png`, name:`${dir}-${f}.png`}))});
const nums = n => Array.from({length:n}, (_,i)=>String(i+1));

const FORMATS = [
  {id:"carrosseis", title:"Carrosséis", one:"Carrossel", ratio:"4 / 5", size:"1080 × 1350", items:[
    piece("carrossel-falso-eu", "Como o falso eu é construído?", nums(9)),
    piece("carrossel-banho", "Você já entrou no banho e não lembrava do shampoo?", nums(9)),
    piece("carrossel-leao", "Um filhote de leão se perdeu do bando", nums(11)),
    piece("carrossel-exercicio", "Tente fazer esses 2 exercícios", nums(9)),
    piece("carrossel-necessidade", "A necessidade de validação", nums(3)),
    piece("carrossel-inseguranca", "A insegurança nas relações", nums(3))]},
  {id:"estaticos", title:"Estáticos", one:"Estático", ratio:"4 / 5", size:"1080 × 1350", items:[]},
  {id:"reels", title:"Capas de reels", one:"Capa de reels", ratio:"9 / 16", size:"1080 × 1920", zip:"dl/reels.zip", items:[
    ["a","É assim que surge a voz na cabeça"],["b","O que é o Clube dos 5%?"],["c","Esse é o ciclo do falso eu"],
    ["d","Você não é a sua história"],["e","1ª aula: a origem do nosso problema central"],["f","O que é a voz na cabeça?"],
    ["g","Uma decisão que transforma a vida inteira"],["h","É por isso que você sofre"],["i","Quem você é de verdade?"],
    ["j","Você acredita ser quem dizem que você é"],["k","2ª aula: a voz na cabeça e o despertar da presença"],["l","Não existe fórmula mágica para mudar a realidade"]]
    .map(([f,title])=>piece("reels", title, [f]))},
];
const IC_DL = `<svg viewBox="0 0 24 24"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>`;

const root = document.getElementById("conteudos");
let current = "todos";

function card(it, f, fi, ii){
  const n = it.slides.length, s0 = it.slides[0];
  const dl = it.zip ? `<a class="ct-get" href="${BASE}${it.zip}" download>${IC_DL} Carrossel (.zip)</a>`
                    : `<a class="ct-get" href="${BASE}${s0.orig}" download="${s0.name}">${IC_DL} Baixar PNG</a>`;
  return `<figure class="ct-item">
    <button class="ct-card" style="--ratio:${f.ratio}" data-f="${fi}" data-i="${ii}" aria-label="Abrir ${it.title}">
      <img src="${BASE}${s0.src}" alt="" loading="lazy">
      ${n>1 ? `<span class="ct-count">${n} slides</span>` : ""}
    </button>
    <figcaption><span>${it.title}</span>${dl}</figcaption>
    <div class="rv" data-id="${it.id}" data-kind="${n>1 ? `${n} slides · ${f.one}` : f.one}">${reviewHTML(it.id)}</div>
  </figure>`;
}
/* ---------- revisão: status + anotações, salvos no Netlify (/api/revisao) ---------- */
const API = "/api/revisao";
const OPTS = [["aprovado","Aprovar","Aprovado"],["ajuste","Ajustar","Ajuste"],["reprovado","Reprovar","Reprovado"],["publicado","Publicado","Publicado"]];
let REV = {};
const openNotes = new Set();
const esc = t => String(t).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const when = iso => new Date(iso).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
function myName(){
  let n = ""; try{ n = localStorage.getItem("rv-name") || ""; }catch{}
  if(!n){ n = (prompt("Seu nome (aparece junto do status e das anotações):") || "").trim(); if(n) try{ localStorage.setItem("rv-name", n); }catch{} }
  return n;
}
function reviewHTML(id){
  const r = REV[id] || {status:"", notes:[]}, st = OPTS.find(o=>o[0]===r.status);
  const open = openNotes.has(id), notes = r.notes || [];
  return `<div class="rv-top"><span class="rv-kind"></span>${st ? `<span class="rv-chip ${st[0]}" title="${r.by ? esc(r.by)+" · "+when(r.at) : ""}">${st[2]}</span>` : `<span class="rv-chip">Em revisão</span>`}</div>
    <div class="rv-btns">${OPTS.map(([v,label])=>`<button class="${v}" data-st="${v}" aria-pressed="${r.status===v}">${label}</button>`).join("")}</div>
    <button class="rv-toggle" data-notes aria-expanded="${open}">✎ Anotar${notes.length ? ` <em>${notes.length}</em>` : ""}</button>
    ${open ? `<div class="rv-notes">
      ${notes.map(n=>`<p><b>${esc(n.by)}</b> <time>${when(n.at)}</time><br>${esc(n.text)}</p>`).join("")}
      <textarea rows="3" placeholder="Escreva o ajuste ou a observação…"></textarea>
      <button class="rv-save" data-save>Salvar anotação</button>
    </div>` : ""}`;
}
function paint(id){
  const el = root.querySelector(`.rv[data-id="${id}"]`);
  if(el){ el.innerHTML = reviewHTML(id); el.querySelector(".rv-kind").textContent = el.dataset.kind; }
  summary();
}
function summary(){
  const el = root.querySelector(".rv-sum"); if(!el) return;
  const c = {}; Object.values(REV).forEach(r=>{ if(r.status) c[r.status] = (c[r.status]||0)+1; });
  el.innerHTML = OPTS.filter(o=>c[o[0]]).map(o=>`<span class="rv-chip ${o[0]}">${c[o[0]]} ${o[2].toLowerCase()}</span>`).join("");
}
async function save(id, body){
  const by = myName(); if(!by) return false;
  try{
    const r = await fetch(API, {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({id, by, ...body})});
    if(!r.ok) throw new Error((await r.json()).error);
    REV[id] = await r.json(); paint(id); return true;
  }catch(err){ alert("Não foi possível salvar: " + err.message); paint(id); return false; }
}
root.addEventListener("click", async e=>{
  const rv = e.target.closest(".rv"); if(!rv) return;
  const id = rv.dataset.id, b = e.target.closest("button");
  if(!b) return;
  if(b.dataset.st){ const cur = (REV[id]||{}).status; save(id, {status: cur===b.dataset.st ? "" : b.dataset.st}); }
  else if("notes" in b.dataset){ openNotes.has(id) ? openNotes.delete(id) : openNotes.add(id); paint(id); if(openNotes.has(id)) rv.querySelector("textarea").focus(); }
  else if("save" in b.dataset){
    const ta = rv.querySelector("textarea"), text = ta.value.trim(); if(!text) return ta.focus();
    b.disabled = true; if(!(await save(id, {note:text}))) { b.disabled = false; }
  }
});
fetch(API).then(r=>r.ok ? r.json() : {}).then(d=>{ REV = d; root.querySelectorAll(".rv").forEach(el=>paint(el.dataset.id)); }).catch(()=>{});

function render(){
  const tabs = [{id:"todos", title:"Todos", n:FORMATS.reduce((a,f)=>a+f.items.length,0)}, ...FORMATS.map(f=>({id:f.id, title:f.title, n:f.items.length}))];
  root.innerHTML = `
  <header class="ct-head">
    <span class="eyebrow">Instagram · Clube dos 5%</span>
    <h1>Conteúdos</h1>
    <div class="rv-sum"></div>
    <nav class="ct-tabs" role="tablist">${tabs.map(t=>
      `<button role="tab" aria-selected="${t.id===current}" data-tab="${t.id}">${t.title} <em>${t.n}</em></button>`).join("")}</nav>
  </header>
  ${FORMATS.map((f,fi)=> current!=="todos" && current!==f.id ? "" : `
  <section class="ct-sec" id="${f.id}">
    <h2>${f.title} <em>${f.size}</em>${f.zip ? `<a class="ct-all" href="${BASE}${f.zip}" download>${IC_DL} Baixar todas (.zip)</a>` : ""}</h2>
    <div class="ct-grid ${f.id}">${f.items.length ? f.items.map((it,ii)=>card(it,f,fi,ii)).join("")
      : `<p class="ct-empty" style="--ratio:${f.ratio}">Nenhum ${f.one.toLowerCase()} ainda</p>`}</div>
  </section>`).join("")}`;
}
root.addEventListener("click", e=>{
  const t = e.target.closest("[data-tab]");
  if(t){ current = t.dataset.tab; render(); root.querySelectorAll(".rv").forEach(el=>paint(el.dataset.id)); return; }
  const c = e.target.closest(".ct-card");
  if(c) openViewer(FORMATS[c.dataset.f], FORMATS[c.dataset.f].items[c.dataset.i]);
});

/* visualizador: slide a slide, com setas, teclado e arrastar */
const viewer = document.createElement("div");
viewer.className = "ct-viewer"; viewer.hidden = true;
viewer.innerHTML = `<div class="veil" data-x></div>
  <figure><img alt=""><figcaption></figcaption></figure>
  <button class="ct-nav prev" aria-label="Anterior"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
  <button class="ct-nav next" aria-label="Próximo"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
  <div class="ct-dls"><a class="ct-dl one" download>${IC_DL} Baixar este</a><a class="ct-dl all" download>${IC_DL} Carrossel inteiro (.zip)</a></div>
  <button class="ct-close" data-x aria-label="Fechar">×</button>`;
document.body.appendChild(viewer);
let open = null, idx = 0;
const vImg = viewer.querySelector("img"), vCap = viewer.querySelector("figcaption"), vDl = viewer.querySelector(".ct-dl.one"), vAll = viewer.querySelector(".ct-dl.all");
function show(){
  const n = open.item.slides.length, s = open.item.slides[idx];
  vImg.src = BASE + s.src; vImg.style.aspectRatio = open.f.ratio;
  vDl.href = BASE + s.orig; vDl.download = s.name;
  vAll.hidden = !open.item.zip; if(open.item.zip) vAll.href = BASE + open.item.zip;
  vCap.textContent = open.item.title + (n>1 ? ` · ${idx+1}/${n}` : "");
  viewer.querySelector(".prev").hidden = viewer.querySelector(".next").hidden = n<2;
}
function openViewer(f, item){ open = {f,item}; idx = 0; show(); viewer.hidden = false; document.body.style.overflow = "hidden"; }
function close(){ viewer.hidden = true; document.body.style.overflow = ""; }
const step = d => { const n = open.item.slides.length; idx = (idx + d + n) % n; show(); };
viewer.querySelector(".prev").onclick = ()=>step(-1);
viewer.querySelector(".next").onclick = ()=>step(1);
viewer.addEventListener("click", e=>{ if(e.target.closest("[data-x]")) close(); });
document.addEventListener("keydown", e=>{
  if(viewer.hidden) return;
  if(e.key==="Escape") close(); else if(e.key==="ArrowRight") step(1); else if(e.key==="ArrowLeft") step(-1);
});
let x0 = null;
vImg.addEventListener("touchstart", e=>{ x0 = e.touches[0].clientX; }, {passive:true});
vImg.addEventListener("touchend", e=>{ if(x0===null) return; const dx = e.changedTouches[0].clientX - x0; if(Math.abs(dx)>40 && open.item.slides.length>1) step(dx<0?1:-1); x0 = null; });

render();
root.querySelectorAll(".rv").forEach(el=>paint(el.dataset.id));
