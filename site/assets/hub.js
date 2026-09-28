/* Acervo (página inicial): destaque, fileiras, busca e menu */
const main = document.getElementById("topo");
const qEl = document.getElementById("q");
function norm(s){return s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()}

function render(){
  const q = norm(qEl.value.trim());
  let html = "";
  if(q){
    const hits = P.filter(p => norm(p.plain+" "+p.type+" "+p.desc).includes(q));
    html += section({id:"busca", title:`Resultados para “${qEl.value.trim()}”`, ids:hits.map(p=>p.id)});
  } else {
    const f = byId[FEATURED];
    html += `<section class="hero" aria-label="Destaque">
      <img class="bg" src="${BASE}${f.hero}" alt="Ilustração: duas mãos desatam um nó de fios na cabeça de uma pessoa">
      <div class="copy">
        <span class="eyebrow">Novo no Clube dos 5% · ${f.type}</span>
        <img class="logo" src="${BASE}${f.logo}" alt="${f.plain}">
        <p>${f.desc}</p>
        <div class="actions">
          <a class="btn gold" href="${BASE}${f.slug}/">Ver página ${IC_GO}</a>
          <a class="btn ghost" href="${f.club}" target="_blank" rel="noopener">Acessar curso</a>
        </div>
      </div>
    </section>`;
    ROWS.forEach(r=> html += section(r));
  }
  main.innerHTML = html;
  main.querySelectorAll(".rail-wrap").forEach(setupRail);
}
function section(r){
  const items = r.ids.map(id=>byId[id]);
  return `<section class="row" id="${r.id}">
    <h2>${r.title}${r.note?` <em>${r.note}</em>`:""}</h2>
    ${items.length ? railHTML(items) : `<p class="empty">Nada encontrado no acervo.</p>`}
  </section>`;
}

const search = document.getElementById("search");
document.getElementById("searchBtn").onclick = ()=>{
  const open = search.classList.toggle("open");
  if(open) qEl.focus(); else { qEl.value=""; render(); }
};
qEl.addEventListener("input", render);
const drawer = document.getElementById("drawer");
document.getElementById("menuBtn").onclick = ()=>{ drawer.classList.add("open"); drawer.setAttribute("aria-hidden","false"); };
drawer.addEventListener("click", e=>{ if(e.target.closest("[data-close]")){ drawer.classList.remove("open"); drawer.setAttribute("aria-hidden","true"); if(qEl.value){qEl.value="";render();} } });
document.addEventListener("keydown", e=>{ if(e.key==="Escape") drawer.classList.remove("open"); });

render();
