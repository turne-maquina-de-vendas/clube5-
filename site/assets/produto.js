/* Página de produto — modelo "sala de museu" (referência: Museo Cappella Sansevero · Cristo Velato).
   Lê o id em <html data-product>. Seções de brand book aparecem quando o produto tem `page`. */
const p = byId[document.documentElement.dataset.product];
const root = document.getElementById("produto");
const img = src => BASE + src;

function actions(p, cls = ""){
  const hot = p.club ? `<a class="btn gold" href="${p.club}" target="_blank" rel="noopener">Acessar na Hotmart ${IC_GO}</a>` : "";
  const mat = p.drive ? `<a class="btn ghost ${cls}" href="${p.drive}" target="_blank" rel="noopener">${IC_DIR} Materiais no Drive</a>` : "";
  const extra = (p.extra||[]).map(x=>`<a class="btn ghost ${cls}" href="${BASE}${x.href}">${x.label} ${IC_GO}</a>`).join("");
  return hot + mat + extra;
}
const sectionHead = (n, eyebrow, title, em) =>
  `<header class="mx-head"><span class="mx-num">${n}</span><span class="mx-eyebrow">${eyebrow}</span>
   <h2>${title}${em?` <em>${em}</em>`:""}</h2></header>`;

function heroHTML(p){
  const pg = p.page || {};
  const pic = pg.hero || (!pg.heroBg && (p.wide || p.img));
  // fundo responsivo: imagem em cover ou degradê da identidade; logo solto por cima (nunca um quadro)
  const bg = pic ? `background-image:url('${img(pic)}');--pos:${pg.heroPos||"center"};--pos-m:${pg.heroPosM||pg.heroPos||"center"}` : `background:${pg.heroBg}`;
  const logo = pg.heroLogo ? `<div class="mx-hero-logo${pg.heroLogoTall?" tall":""}">
      <img src="${img(pg.heroLogo)}" alt="Logo ${p.plain}">${pg.heroLogo2?`<img class="second" src="${img(pg.heroLogo2)}" alt="">`:""}</div>` : "";
  return `
  <section class="mx-hero ${pic?"has-photo":"has-logo"}" style="${bg}" ${pic?`role="img" aria-label="${pg.heroAlt || p.plain}"`:""}>
    ${logo}
    <div class="mx-hero-text">
      <a class="pp-back" href="${BASE}id-visual/">← ID Visual</a>
      <span class="mx-eyebrow">${p.type}</span>
      <h1>${p.title}</h1>
      <div class="actions">${actions(p)}</div>
    </div>
  </section>`;
}
function quoteHTML(p){
  const pg = p.page || {};
  return `
  <section class="mx-quote">
    <blockquote>
      <p class="${(pg.quote||p.desc).length>90?"long":""}">“${pg.quote || p.desc}”</p>
      ${pg.quote ? `<footer>${pg.quoteBy}</footer>` : ""}
    </blockquote>
    ${pg.quote ? `<p class="mx-lead">${p.desc}</p>` : ""}
    <ul class="facts">${p.facts.map(f=>`<li>${f}</li>`).join("")}</ul>
  </section>`;
}
function stackHTML(p){
  // colagem com molduras deslocadas: capa + arte larga
  if(!p.img && !p.wide) return "";
  return `
  <section class="mx-stack">
    ${p.wide ? `<figure class="mx-frame mx-frame-a"><img src="${img(p.wide)}" alt="Arte de campanha — ${p.plain}" loading="lazy"></figure>` : ""}
    ${p.img ? `<figure class="mx-frame mx-frame-b"><img src="${img(p.img)}" alt="Capa — ${p.plain}" loading="lazy"></figure>` : ""}
  </section>`;
}

/* ---------- seções de brand book (produtos com `page`) ---------- */
function brandHTML(p){
  const g = p.page; if(!g) return "";
  let n = 0; const num = () => String(++n).padStart(2,"0");
  let h = `<div class="mx-paper">`;
  if(g.pillars) h += `<section class="mx-sec">${sectionHead(num(),"Posicionamento",...(g.pillarsTitle||["O que o Clube","entrega"]))}
    <div class="mx-grid4${g.pillars.length>4?" many":""}">${g.pillars.map(x=>`<div class="mx-cell"><span class="mx-k">${x.k}</span><p>${x.v}</p></div>`).join("")}</div></section>`;
  if(g.numbers) h += `<section class="mx-sec">${sectionHead(num(),"Autor",...g.numbersTitle)}
    ${g.numbersText?`<p class="mx-lead-dark">${g.numbersText}</p>`:""}
    <div class="mx-numbers">${g.numbers.map(x=>`<div><b>${x.v}</b><span>${x.k}</span></div>`).join("")}</div></section>`;
  if(g.anatomy) h += `<section class="mx-sec">${sectionHead(num(),"Anatomia do logotipo","Cada elemento","tem uma função")}
    <div class="mx-anatomy"><figure><img src="${img(g.anatomy.img)}" alt="Logotipo — ${p.plain}"></figure>
    <ol>${g.anatomy.items.map(x=>`<li><span class="ag-roman">${x.n}</span><div><span class="mx-k">${x.k}</span><p>${x.v}</p></div></li>`).join("")}</ol></div></section>`;
  if(g.palette) h += `<section class="mx-sec">${sectionHead(num(),"Paleta de cores",...(g.paletteTitle||["Ouro","& noite"]))}
    <div class="mx-swatches">${g.palette.map(c=>`<div class="mx-sw${c.dark?" dark":""}" style="--c:${c.h}">
      <span class="chip"></span><b>${c.n}</b><code>${c.h}</code><small>${c.u}</small></div>`).join("")}</div>
    <p class="mx-note">${g.paletteNote||"Cores medidas nas artes originais da pasta do Clube (logo, caderno, fundos de stories)."}</p></section>`;
  if(g.type) h += `<section class="mx-sec">${sectionHead(num(),"Tipografia",...(g.typeTitle||["Três","vozes"]))}
    <div class="mx-types">${g.type.map(t=>`<div class="mx-type"><span class="mx-k">${t.role}</span>
      <div class="sample ${t.cls||""}">${t.img?`<img src="${img(t.img)}" alt="${t.role}">`:t.sample}</div><p>${t.note}</p></div>`).join("")}</div>
    ${g.typeNote?`<p class="mx-note">${g.typeNote}</p>`:""}</section>`;
  if(g.logos) h += `<section class="mx-sec">${sectionHead(num(),"Marca",...(g.logosTitle||["Coruja","coroada"]))}
    <div class="mx-logos${g.logos.every(l=>l.wide)?" all-wide":g.logos.every(l=>!l.wide)?" all-square":""}">${g.logos.map(l=>`<figure class="mx-logo ${l.bg}${l.wide?" wide":""}"><img src="${img(l.src)}" alt="Logo ${p.plain} — ${l.label}"><figcaption>${l.label}</figcaption></figure>`).join("")}</div></section>`;
  if(g.apps) h += `<section class="mx-sec">${sectionHead(num(),g.appsEyebrow||"Aplicações",...(g.appsTitle||["A marca","no mundo real"]))}
    <div class="mx-apps${g.appsCols?" cols-"+g.appsCols:""}">${g.apps.map(a=>`<figure class="mx-app${a.tall?" tall":""}${a.strip?" strip":""}"><img src="${img(a.src)}" alt="${a.cap}" loading="lazy"><figcaption>${a.cap}</figcaption></figure>`).join("")}</div></section>`;
  (g.sections||[]).forEach(sec=>{ h += `<section class="mx-sec">${sectionHead(num(),sec.eyebrow,...sec.title)}
    <div class="mx-apps cols-${sec.cols||3}">${sec.items.map(a=>`<figure class="mx-app"><img src="${img(a.src)}" alt="${a.cap}" loading="lazy"><figcaption>${a.cap}</figcaption></figure>`).join("")}</div></section>`; });
  if(g.agora) h += agoraHTML(g.agora, num());
  if(g.stories) h += `<section class="mx-sec">${sectionHead(num(),g.storiesEyebrow||"Stories",...(g.storiesTitle||["Fundos","da semana"]))}
    <div class="mx-stories">${g.stories.map((s,i)=>`<img src="${img(s)}" alt="Fundo de story ${i+1} — ${p.plain}" loading="lazy">`).join("")}</div></section>`;
  if(g.checkout) h += `<section class="mx-sec">${sectionHead(num(),"Checkout","Página","de compra")}
    <div class="mx-apps two">${g.checkout.map(a=>`<figure class="mx-app"><img src="${img(a.src)}" alt="${a.cap}" loading="lazy"><figcaption>${a.cap}</figcaption></figure>`).join("")}</div></section>`;
  if(g.rules) h += `<section class="mx-sec">${sectionHead(num(),"Regras de uso","O que a identidade","não tolera")}
    <div class="mx-rules"><div class="avoid"><span class="mx-k">✕ Evitar</span><ul>${g.rules.avoid.map(r=>`<li>${r}</li>`).join("")}</ul></div>
    <div class="do"><span class="mx-k">✓ Fazer</span><ul>${g.rules.do.map(r=>`<li>${r}</li>`).join("")}</ul></div></div>
    ${g.rules.note?`<p class="mx-note">${g.rules.note}</p>`:""}</section>`;
  h += `</div>`;
  return h;
}

/* Instagram como ágora: praça pública do saber */
const MEANDER = `<svg class="mx-meander" aria-hidden="true"><defs><pattern id="meander" width="40" height="20" patternUnits="userSpaceOnUse">
  <path d="M0 19h10V5h16v10h-8v-4h4V9h-8v8h20V1H2" fill="none" stroke="currentColor" stroke-width="1.4"/></pattern></defs>
  <rect width="100%" height="20" fill="url(#meander)"/></svg>`;
function agoraHTML(a, n){
  return `<section class="mx-sec mx-agora">
    ${sectionHead(n, "Instagram", "A Ágora", "do Saber")}
    ${MEANDER}
    <div class="ag-thesis">
      <p class="ag-lead">${a.thesis}</p>
      <p class="ag-maxim">${a.maxim}</p>
    </div>
    <div class="ag-columns">${a.voices.map(v=>`<div class="ag-col">
      <span class="ag-roman">${v.n}</span><span class="mx-k">${v.k}</span><p>${v.v}</p>
      <span class="ag-refs">${v.posts.map(i=>`post ${i}`).join(" · ")}</span></div>`).join("")}</div>
    <div class="ag-feed">${a.posts.map((p,i)=>`<figure><img src="${img(p.src)}" alt="${p.cap}" loading="lazy"><figcaption><b>${i+1}</b> ${p.cap}</figcaption></figure>`).join("")}</div>
    <div class="ag-rules"><span class="mx-k">Regras da praça</span><ol>${a.rules.map(r=>`<li>${r}</li>`).join("")}</ol></div>
    ${MEANDER}
  </section>`;
}

/* motion: vídeo em faixa de largura total, mudo e em loop (pausa respeitando “reduzir movimento”) */
function motionHTML(p){
  const m = p.page?.motion; if(!m) return "";
  return `<section class="mx-motion${m.vertical?" vertical":""}" style="--mbg:${m.bg||"#000"}">
    <video class="mx-video" src="${img(m.src)}" poster="${img(m.poster)}" muted loop playsinline preload="metadata" aria-label="${m.cap}"></video>
    <div class="mx-motion-cap"><span class="mx-eyebrow">${m.eyebrow||"Motion"}</span><p>${m.cap}</p>
      <button class="mx-play" type="button" aria-pressed="false">Pausar</button></div>
  </section>`;
}
function setupMotion(){
  const sec = root.querySelector(".mx-motion"); if(!sec) return;
  const v = sec.querySelector("video"), b = sec.querySelector(".mx-play");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sync = () => { b.textContent = v.paused ? "Reproduzir" : "Pausar"; b.setAttribute("aria-pressed", String(v.paused)); };
  b.onclick = () => { v.paused ? v.play() : v.pause(); };
  v.addEventListener("play", sync); v.addEventListener("pause", sync);
  if(reduce){ sync(); return; }
  new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) v.play().catch(()=>{}); else v.pause(); }), {threshold:.25}).observe(v);
}

function ctaHTML(p){
  const folders = p.page?.folders || [];
  return `
  <section class="mx-cta">
    <svg class="mx-pattern" aria-hidden="true"><defs><pattern id="cubes" width="120" height="104" patternUnits="userSpaceOnUse">
      <path d="M60 0 120 26v52L60 104 0 78V26Z M60 0v52 M0 26l60 26 60-26" fill="none" stroke="currentColor" stroke-width="1"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#cubes)"/></svg>
    <div class="mx-cta-inner">
      <span class="mx-eyebrow">Design &amp; materiais</span>
      <h2>${p.plain}</h2>
      <div class="mx-pills">
        ${p.club ? `<a class="pill" href="${p.club}" target="_blank" rel="noopener">Acessar na Hotmart <i>→</i></a>` : ""}
        ${p.drive ? `<a class="pill" href="${p.drive}" target="_blank" rel="noopener">Todos os materiais <i>→</i></a>` : ""}
        ${folders.map(f=>`<a class="pill" href="${f.href}" target="_blank" rel="noopener">${f.label} <i>→</i></a>`).join("")}
        ${(p.extra||[]).map(x=>`<a class="pill" href="${BASE}${x.href}">${x.label} <i>→</i></a>`).join("")}
      </div>
    </div>
  </section>`;
}
function moreHTML(p){
  const row = ROWS.find(r=>r.id!=="destaques" && r.ids.includes(p.id)) || ROWS[0];
  const sib = row.ids.filter(id=>id!==p.id).map(id=>byId[id]);
  const others = sib.length ? sib : P.filter(x=>x.id!==p.id);
  return others.length ? `<section class="row mx-more"><h2>Mais do acervo</h2>${railHTML(others)}</section>` : "";
}

if(p){
  if(p.page?.accent) root.style.setProperty("--acc", p.page.accent);
  document.title = `${p.plain} · Clube dos 5%`;
  root.innerHTML = heroHTML(p) + quoteHTML(p) + motionHTML(p) + (p.page ? "" : stackHTML(p)) + brandHTML(p) + ctaHTML(p) + moreHTML(p) +
    (p.club ? `<a class="mx-sticky" href="${p.club}" target="_blank" rel="noopener">Acessar na Hotmart ${IC_GO}</a>` : "");
  root.querySelectorAll(".rail-wrap").forEach(setupRail);
  setupMotion();
} else {
  root.innerHTML = `<p class="empty">Produto não encontrado. <a href="${BASE}id-visual/">Voltar para ID Visual</a></p>`;
}
