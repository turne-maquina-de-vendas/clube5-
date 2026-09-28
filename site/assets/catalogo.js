/* Catálogo do Clube dos 5% — dados e capas compartilhados pelo acervo e pelas páginas de produto.
   BASE: caminho até a raiz do site ("" no acervo, "../" dentro da pasta de um produto). */
const BASE = document.documentElement.dataset.base || "";

/* Paletas das capas — cada uma evoca um material da capela */
const SKINS = {
  marmore:  {bg:"#e9e3d8", light:"#ffffff", vein:"#9a9084", fg:"#1b1917"},
  noite:    {bg:"#161514", light:"#4b4540", vein:"#6e655b", fg:"#eee8dd"},
  bronze:   {bg:"#2a2016", light:"#9b7d3e", vein:"#c4a45f", fg:"#f3e6c8"},
  sangue:   {bg:"#2c1311", light:"#7a2f28", vein:"#b0584c", fg:"#f4e3dc"},
  verdete:  {bg:"#17241f", light:"#3f6b5d", vein:"#7fa596", fg:"#e6efe9"},
  cinzel:   {bg:"#bfb6a8", light:"#f3eee6", vein:"#6f665b", fg:"#1b1917"},
};

/* Pastas de materiais no Drive (pasta JP 26) */
const DRIVE = id => `https://drive.google.com/drive/folders/${id}?usp=sharing`;

/* Trilhas do Clube dos 5% na Hotmart Club (id da trilha) */
const TRACK = id => `https://hotmart.com/pt-BR/club/jacobpetry/products/602766/track/${id}`;
const TRACKS = [
  ["3V4VrmMn42","Comece por aqui"],["v94JbJo04g","O Método"],["d64lyB0bej","Um Curso em Como se Libertar da Voz na Cabeça"],
  ["v94JbyN04g","Um Curso Prático em Realização Profissional"],["RE4z1pwQOl","Um Curso na Arte de Viver em Estado de Graça"],
  ["vROx6VxyeD","Mentoria: A Arte de Viver sua Essência"],["0r48NmPD7R","Um Curso em Corpo de Dor"],
  ["DPeAdWqJ4W","Desafio: Saúde Mental"],["8EOglkLP46","Desafio: Finanças e Trabalho"],["pRONbp6YOP","Desafio: Relacionamentos"],
  ["Go4EAaMj4z","Um Curso nas 7 Leis Universais para Realizar Sonhos"],["Zy4b3JyjeR","Um Curso em Elevação do Nível de Consciência"],
  ["qV7y1baM7J","Um Curso em Libertação"],["Zy4b3R8jeR","Um Curso nas 5 Linguagens do Amor"],
  ["2z7raRGxej","Desafio Clube dos 5%: Uma Nova Realidade em 30 Dias"],["n2OM68zn46","Um Curso Prático em Despertar"],
  ["Mk7QlbM5ey","Um Curso em Ensinamentos de Jesus"],["qV73ggJZ73","Um Curso em Autoconhecimento"],
  ["qV7y0r1eJn","Um Curso em Talento e Direcionamento Profissional"],["vROx02gODW","Um Curso em Estado de Presença"],
  ["Pk45Vwjel6","Um Curso em Aceitação"],["B146xYo7dA","Um Curso Prático em Criação Consciente"],
  ["qV7yrzMOJn","Um Curso em Propósito de Vida"],["ny4PY6yexV","Um Curso em Inteligência Emocional"],
  ["ZYOmg3XedE","A Base"],["x3ea1znegG","O Começo"],["Mk7QdMJeyb","Os 4 Acordos"],["Go4E62dezb","O Tempo"],
  ["xkOXDGoOWb","Tocando o Infinito"],["ny4PY0EexV","Jornada de Elevação do Nível de Consciência"],
  ["qV7yrwkOJn","16 Leis do Sucesso | Mentoria 2023: O Ano"],["8EOgjb076D","Os 7 Níveis da Evolução Pessoal"],
  ["RE4zoYleld","A Ciência do Sucesso"],["QLO0vWaeGM","Maestria Mental"],["DPeAj187WE","Viva da Essência"],
  ["mBOnKyb4R9","Jornada do Filho Pródigo: 1ª Temporada"],["ZNOwd914m3","Jornada do Filho Pródigo: 2ª Temporada"],
  ["Xm7YaBD765","Jornada do Filho Pródigo: 3ª Temporada"],["r37dZE64Lj","Guerreiro de Luz"],
  ["9M7Ggjw7wK","Construa sua Casa na Rocha"],["2z7rnKE7jw","A Filosofia do Martelo"],
  ["v94J0ya7gZ","Os 7 Princípios da Abundância"],["kgOp059OJP","O Fim do Falso Eu"],["zK4k6jJOYq","Série Genius"],
  ["qV73adZ43W","Talento & Propósito"],["x3ea18negG","Cabeça de Rico"],["vROxGWK7DW","Orientação e Direcionamento Profissional"],
  ["n2OM9XLO6b","As 16 Leis do Sucesso"],["W0OvY587jl","Como Deixar de Ser Alienado"],
  ["qoODyMv4Pg","O Despertar da Consciência"],["Mk7Qd5keyb","O Pensamento de Riqueza"],["3V4VvAx42m","Os Degraus"],
  ["0r48qGEeRB","Poder e Manipulação"],["EM7qAjy7xw","O Óbvio que Ignoramos"],
];
const SKIN_ORDER = ["noite","marmore","bronze","sangue","verdete","cinzel"];
const SMALL = /\b(da|de|do|das|dos|em|na|nas|no|nos|e|a|o|para|que|sua|seu|&amp;)\b/gi;
function trackType(t){
  if(/^Desafio/i.test(t)) return "Desafio";
  if(/^Mentoria|Mentoria/i.test(t)) return "Mentoria";
  if(/^Jornada|Temporada/i.test(t)) return "Jornada";
  if(/^Série/i.test(t)) return "Série";
  return "Curso";
}
function fromTrack([id,name], i){
  let kicker = trackType(name)==="Curso" ? "Trilha" : trackType(name), title = name, big = "";
  const m = name.match(/^(Um Curso(?: Prático)? (?:em|nas|na|nos|no))\s+(.*)$/i);
  if(m){ kicker = m[1]; title = m[2]; }
  const d = name.match(/:\s*(.*)$/); if(!m && d && /^(Desafio|Mentoria|Jornada|16 Leis)/.test(name)){ title = d[1]; kicker = name.split(":")[0].replace("|","·"); }
  const n = name.match(/\b(\d+)\b(?!%)/); if(n && !/Temporada|2023|Desafio/.test(name)) big = n[1];
  const t = name.match(/(\d)ª Temporada/); if(t){ big = ["I","II","III"][t[1]-1]; title = "Filho Pródigo"; kicker = "Jornada · " + t[1] + "ª temporada"; }
  if(big) title = title.replace(new RegExp("\\b"+big+"\\b\\s*"), "");
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return {id:"t-"+id, club:TRACK(id), plain:name, type:"Trilha · "+trackType(name), kind:trackType(name).toLowerCase(),
    title:title.replace(/^(\S+)(.*)$/, (_,first,rest)=> first + rest.replace(SMALL, w=>`<i>${w.toLowerCase()}</i>`)), skin:SKIN_ORDER[i % SKIN_ORDER.length], big, kicker, meta:"Clube dos 5%",
    facts:["Clube dos 5%", trackType(name), "Hotmart Club"],
    desc:`Trilha do Clube dos 5% na área de membros da Hotmart. Use “Acessar” para abrir a trilha.`};
}
const PORTAIS = ["Estado de Presença","Aceitação","A Quietude Interior","O Desapego","O Todo: o manifesto e o não-manifesto","Corpo Interior","O Corpo de Dor","Silenciar a Mente"];
const P = TRACKS.map(fromTrack);
const byTrack = id => P.find(p=>p.id==="t-"+id);

/* Ajustes das trilhas com arte, materiais ou texto próprios */
Object.assign(byTrack("d64lyB0bej"), {slug:"voz-na-cabeca", wide:"img/voz-eu-verdadeiro.jpg",
  title:"Como se Libertar <i>da</i> Voz na Cabeça", type:"Trilha · Curso", tag:"Novo",
  img:"img/voz-poster.jpg", logo:"img/voz-logo.png", hero:"img/voz-hero.jpg",
  drive:DRIVE("1BRx16MsaOLxVg2C6Skw801mCRx96X0_P"),
  facts:["Clube dos 5%","Curso","Consciência","Eu verdadeiro × falso eu"],
  page:{
    accent:"#C34A01",
    hero:"img/voz/ilustracao-1.jpg", heroPos:"70% 35%", heroPosM:"50% 30%", heroAlt:"Ilustração: duas mãos desatam um nó de fios na cabeça de uma pessoa",
    quote:"Você não é essa voz.", quoteBy:"Arte do curso · Consciência × pensamento",
    pillarsTitle:["O que o curso","desata"],
    pillars:[
      {k:"Consciência × pensamento", v:"Acima, a consciência. Abaixo, o pensamento — que é a voz na cabeça."},
      {k:"Eu verdadeiro × falso eu", v:"Duas cabeças, uma mesma fala: aprender a distinguir quem fala de quem escuta."},
      {k:"O nó", v:"As mãos desatam o emaranhado de fios que a mente dá em si mesma."},
      {k:"O fio", v:"Uma figura pequena puxa o fio do rabisco mental até ele se desenrolar."}],
    paletteTitle:["Brasa","& papel"],
    palette:[
      {n:"Brasa", h:"#C34A01", u:"“Voz na Cabeça” no logo", dark:true},
      {n:"Fogo", h:"#CA3E09", u:"Fundos laranja das ilustrações", dark:true},
      {n:"Vinho", h:"#841C05", u:"Sombras e fundos profundos", dark:true},
      {n:"Tangerina", h:"#F7813D", u:"Ícone da cabeça com aspas"},
      {n:"Grafite", h:"#464645", u:"“Como se libertar” no logo claro", dark:true},
      {n:"Papel", h:"#F2EEE3", u:"Fundos claros e textura de papel"}],
    paletteNote:"Cores medidas nas ilustrações e nos logos da pasta do curso.",
    typeTitle:["Três","vozes"],
    type:[
      {role:"Título", sample:"COMO SE LIBERTAR", cls:"t-word", note:"Serifa clássica em caixa-alta, como no logo."},
      {role:"Destaque", sample:"Voz na Cabeça", cls:"t-italic", note:"Serifa itálica condensada — o nome do curso."},
      {role:"Lettering", sample:"Consciência", cls:"t-hand", note:"Letra desenhada à mão, em caixa-alta, dentro das ilustrações."}],
    logosTitle:["O ícone","das aspas"],
    logos:[
      {src:"img/voz/logo-3.png", label:"Com ícone · fundo escuro", bg:"night", wide:true},
      {src:"img/voz/logo-4.png", label:"Com ícone · fundo brasa", bg:"ember", wide:true},
      {src:"img/voz/logo-1.png", label:"Tipográfico · fundo claro", bg:"paper", wide:true},
      {src:"img/voz/logo-2.png", label:"Tipográfico · fundo escuro", bg:"night", wide:true}],
    appsTitle:["O universo","ilustrado"],
    apps:[1,2,3,4,5,6,7].map(i=>({src:`img/voz/ilustracao-${i}.jpg`, cap:[
      "O nó — mãos desatam os fios da mente","O fio — a figura puxa o rabisco da cabeça","Consciência × pensamento = voz na cabeça",
      "Eu verdadeiro × falso eu","Assinatura do curso sobre papel","Fundo de brasa com a silhueta da cabeça","Assinatura sobre paisagem — o caminhante"][i-1], strip:i===7})),
    folders:[{label:"Pasta do curso no Drive", href:DRIVE("1BRx16MsaOLxVg2C6Skw801mCRx96X0_P")}]
  },
  desc:"Você não é a voz na sua cabeça. Um curso para perceber a diferença entre consciência e pensamento, desatar o nó do diálogo interno e deixar de viver guiado pelo falso eu."});
Object.assign(byTrack("RE4zoYleld"), {skin:"bronze", big:"10", tag:"Clássico",
  desc:"O curso-mestre de Jacob Petry: os princípios que sustentam resultados extraordinários, em 10 módulos."});
Object.assign(byTrack("QLO0vWaeGM"), {skin:"marmore",
  desc:"Como a mente constrói — ou sabota — seus resultados, e como treiná-la para trabalhar a seu favor."});
Object.assign(byTrack("v94JbJo04g"), {drive:DRIVE("1zsZg_yGfsQWQRLWfna6cztc63o3ayNr9"),
  img:"img/metodo-poster.jpg", wide:"img/metodo-wide.jpg", type:"Trilha · Curso",
  page:{
    accent:"#8D610C",
    hero:"img/metodo/mapa.jpg", heroPos:"70% center", heroPosM:"72% center", heroAlt:"Pergaminho com o mapa do método desenhado à mão: FE, eu verdadeiro, amor, paz interior, alegria, estado de ser",
    quote:"Oito portais entre o falso eu e o estado de ser.", quoteBy:"O Método · Clube dos 5%",
    pillarsTitle:["Os 8","portais"],
    pillars:PORTAIS.map((v,i)=>({k:`${["Primeiro","Segundo","Terceiro","Quarto","Quinto","Sexto","Sétimo","Oitavo"][i]} portal · aula ${String(i+2).padStart(2,"0")}`, v})),
    paletteTitle:["Pergaminho","& ouro"],
    palette:[
      {n:"Ouro velho", h:"#6E521A", u:"Logo sobre fundo claro", dark:true},
      {n:"Ouro claro", h:"#E7B04E", u:"Logo sobre fundo escuro"},
      {n:"Pergaminho", h:"#CCB991", u:"Fundo de papel envelhecido"},
      {n:"Areia", h:"#C5A666", u:"Manchas e bordas do pergaminho"},
      {n:"Marcador verde", h:"#50A090", u:"Anotações do mapa (inconsciente, corpo interior)"},
      {n:"Marcador vermelho", h:"#E05060", u:"Anotações do mapa (emoções, prazer)"}],
    paletteNote:"Cores medidas no logo, no fundo de pergaminho e no desenho do mapa do método.",
    typeTitle:["Malika","& Sole Serif"],
    type:[
      {role:"Display · Malika", img:"img/metodo/fonte-malika.png", note:"A fonte do logo e dos títulos em caixa-alta — com o M característico."},
      {role:"Títulos · Malika", img:"img/metodo/fonte-malika-2.png", note:"Nome de cada portal nas capas das aulas."},
      {role:"Itálico · Sole Serif Display", img:"img/metodo/fonte-sole.png", note:"A linha de apoio em itálico: “O Primeiro Portal”, “Apresentação do Método”."}],
    typeNote:"Amostras renderizadas com os arquivos de fonte da pasta FONTES do método.",
    logosTitle:["O","Método"],
    logos:[
      {src:"img/metodo/logo-escuro.png", label:"Ouro velho · fundo claro", bg:"parchment", wide:true},
      {src:"img/metodo/logo-claro.png", label:"Ouro claro · fundo escuro", bg:"night", wide:true}],
    appsEyebrow:"Banners do site", appsTitle:["Os portais","em imagem"], appsCols:4,
    apps:[1,2,3,4,5,6,7,8].map(i=>({src:`img/metodo/portal-${i}.jpg`, cap:`${i}º portal — ${PORTAIS[i-1]}`})),
    sections:[
      {eyebrow:"Aulas", title:["As 10","capas"], cols:5, items:[1,2,3,4,5,6,7,8,9,10].map(i=>({src:`img/metodo/aula-${i}.jpg`, cap:i===1?"Aula 01 · Apresentação do método":i===10?"Aula 10 · Fechamento e tira-dúvidas":`Aula ${String(i).padStart(2,"0")} · ${PORTAIS[i-2]}`}))},
      {eyebrow:"Hotmart", title:["Banners","da área de membros"], cols:3, items:[
        {src:"img/metodo/banner-metodo.jpg", cap:"Banner vertical · O Método"},
        {src:"img/metodo/banner-comece.jpg", cap:"Banner vertical · Comece por aqui"},
        {src:"img/metodo/desenho.png", cap:"O desenho do mapa, em camada transparente"}]}],
    folders:[
      {label:"Banners Hotmart", href:DRIVE("1vEvDunaKTfJ_GW_ui9h1HSr7JPMeG2Q7")},
      {label:"Banners do site", href:DRIVE("1akfZ6YBNfb5uUY8UeI63YYgvyXLw17DC")},
      {label:"Identidade visual", href:DRIVE("1uttw4wIVoqQU5pbYna5nadP7GC3wTau1")},
      {label:"Logos", href:DRIVE("1mAC2rTsaT69TnbOQ7L1okfO_544a1SAf")},
      {label:"Fontes", href:DRIVE("1ryDhAxdEgLrQtlJRswKjbujl4ukaK_n2")}]
  },
  facts:["Clube dos 5%","10 aulas","8 portais"],
  desc:"O caminho dos 8 portais: Estado de Presença, Aceitação, A Quietude Interior, O Desapego, O Todo — o manifesto e o não-manifesto, Corpo Interior, O Corpo de Dor e Silenciar a Mente. São 10 aulas, da apresentação do método ao fechamento e tira-dúvidas."});
/* Um Curso Prático em Realização Profissional — pasta REALIZACAO PROFISSIONAL */
Object.assign(byTrack("v94JbyN04g"), {slug:"realizacao-profissional", type:"Trilha · Curso", tag:"Novo",
  title:"Realização <i>Profissional</i>", img:"img/realizacao-poster.jpg",
  drive:DRIVE("1W4_vgBL4p4M4DcyhOxaav1nA-u-D4pd-"),
  facts:["Clube dos 5%","Curso prático","Luz com direção"],
  desc:"Um curso prático para encontrar a direção do próprio trabalho: a luz que já existe dentro de você, apontada para um caminho.",
  page:{
    accent:"#E4421E",
    motion:{src:"img/realizacao/motion.mp4", poster:"img/realizacao/motion-poster.jpg", vertical:true, bg:"#CF371A", eyebrow:"Motion · story", cap:"A lâmpada acende sobre a aquarela e o nome do curso aparece — o story animado do curso."},
    hero:"img/realizacao/hero.jpg", heroPos:"right center", heroPosM:"78% center",
    heroAlt:"Silhueta de uma cabeça de onde brota uma muda, sobre fundo laranja",
    quote:"Luz com direção.", quoteBy:"Conceito do curso",
    pillarsTitle:["Quatro","imagens"],
    pillars:[
      {k:"O sol", v:"O símbolo do curso: raios que partem de um ponto e apontam para fora — energia com direção."},
      {k:"A lâmpada", v:"A ideia acesa — às vezes dentro da cabeça, às vezes guardando um caminho e uma bandeira."},
      {k:"O caminho", v:"Uma figura caminha em direção à luz que está dentro da própria mente."},
      {k:"O broto", v:"Uma muda nasce no alto da cabeça: a realização como algo que cresce, não que se força."}],
    paletteTitle:["Vermelho","sol"],
    palette:[
      {n:"Vermelho sol", h:"#E4421E", u:"Símbolo e “Profissional” no logo", dark:true},
      {n:"Aquarela", h:"#E95125", u:"Fundos em aquarela das pranchetas", dark:true},
      {n:"Laranja", h:"#FE6D23", u:"Fundo liso das ilustrações"},
      {n:"Papel", h:"#E1D9CF", u:"Fundo de papel dos banners"},
      {n:"Luz", h:"#F1F3ED", u:"Fundo claro das pranchetas"},
      {n:"Sombra", h:"#13131A", u:"Silhuetas e “Realização” no logo", dark:true}],
    paletteNote:"Cores medidas no logo, nos banners e nas ilustrações da pasta do curso.",
    typeTitle:["Serifa","& pincel"],
    type:[
      {role:"Linha de apoio", sample:"UM CURSO PRÁTICO EM", cls:"t-word t-small", note:"Serifa em caixa-alta entre dois fios, acima do nome."},
      {role:"Título", sample:"Realização", cls:"t-serif-bold", note:"Serifa robusta, em caixa-alta e baixa."},
      {role:"Destaque", sample:"Profissional", cls:"t-brush t-red", note:"Pincel inclinado em vermelho, sublinhado — a energia do nome."}],
    typeNote:"A pasta não traz os arquivos de fonte; as amostras usam fontes parecidas só como referência.",
    logosTitle:["O sol","e o nome"],
    logos:[
      {src:"img/realizacao/logo-escuro.png", label:"Preto e vermelho · fundo claro", bg:"paper"},
      {src:"img/realizacao/logo-claro.png", label:"Branco · fundo vermelho", bg:"sun"}],
    appsEyebrow:"Pranchetas", appsTitle:["As","ilustrações"], appsCols:2,
    apps:[
      {src:"img/realizacao/prancheta-11.jpg", cap:"Aquarela — o broto na cabeça"},
      {src:"img/realizacao/prancheta-13.jpg", cap:"O caminho até a luz dentro da mente"},
      {src:"img/realizacao/prancheta-14.jpg", cap:"A lâmpada que guarda um caminho"},
      {src:"img/realizacao/prancheta-15.jpg", cap:"A lâmpada vermelha e a figura sentada"},
      {src:"img/realizacao/prancheta-12.jpg", cap:"O broto sobre fundo claro"},
      {src:"img/realizacao/luz-com-direcao.jpg", cap:"Assinatura: “Luz com direção”"}],
    sections:[
      {eyebrow:"Banners", title:["Banners","verticais"], cols:3, items:[
        {src:"img/realizacao/banner-1.jpg", cap:"Banner vertical · papel com o sol"},
        {src:"img/realizacao/banner-2.jpg", cap:"Banner vertical · o broto"},
        {src:"img/realizacao/banner-3.jpg", cap:"Banner vertical · a lâmpada em aquarela"}]},
      {eyebrow:"Aplicação", title:["A marca","no objeto"], cols:2, items:[
        {src:"img/realizacao/ecobag.jpg", cap:"Ecobag vermelha com o logo branco"}]}],
    stories:[1,2,3,4].map(i=>`img/realizacao/story-${i}.jpg`), storiesTitle:["Fundos","de stories"], storiesEyebrow:"Stories",
    folders:[{label:"Pasta do curso no Drive", href:DRIVE("1W4_vgBL4p4M4DcyhOxaav1nA-u-D4pd-")}]
  }});
Object.assign(byTrack("3V4VrmMn42"), {skin:"bronze", tag:"Comece aqui", desc:"O ponto de partida no Clube dos 5%: como a área de membros funciona e por onde seguir."});

/* Imersão A Arte de Viver — uma página por edição, arte das pastas de ADS de cada edição */
const ARTE = byTrack("vROx6VxyeD");
const IDV_ARTE = "arte-de-viver/identidade-visual/";
[["1","I","27 e 28 de junho","1ldleEUKo08RV4G1lMEj9FnMafT5xtSnQ"],
 ["2","II","01 e 02 de agosto","14X3kt2LtEBwt8Q5EXxExQM9GpweWUiNa"],
 ["3","III","19 e 20 de setembro","1-TFBhk_NUiyIOhIZnOemgGI-LH3Ceeej"]]
  .forEach(([n,roman,dates,folder])=> P.push({...ARTE, id:"arte"+n, slug:"arte-de-viver-"+n,
    plain:`Imersão A Arte de Viver — ${n}ª edição`, type:`Imersão online · ${n}ª edição`, kind:"imersao",
    title:"A Arte <i>de</i> Viver", kicker:"Imersão", big:roman, meta:`${n}ª edição`, tag:`${n}ª edição`, skin:"marmore",
    img:`img/arte${n}-poster.jpg`, wide:`img/arte${n}-wide.jpg`,
    drive:DRIVE(folder), extra:[{label:"Brandbook da imersão", href:IDV_ARTE}],
    facts:["Imersão online","2 dias ao vivo",dates,`${n}ª edição`],
    desc:`Imersão online de 2 dias ao vivo com Jacob Petry — ${dates}. Um fim de semana trabalhando intensamente sobre seus sofrimentos para superar a ansiedade, o medo, a culpa e os traumas e passar a vencer na vida.`}));
P.splice(P.indexOf(ARTE),1);
/* Conteúdo comum às 3 edições (brandbook da imersão — arte-de-viver-id-visual) */
const ARTE_QUOTE = {quote:"Não é autoajuda. Não é motivação. Não é revelação. É a aprendizagem do mais básico e o mais esquecido — a arte de simplesmente estar vivo.", quoteBy:"Jacob Petry · declaração de posicionamento"};
const ARTE_AUTOR = [{k:"Exemplares vendidos", v:"+6 milhões"},{k:"Livros best-sellers", v:"5"},{k:"Anos de pesquisa", v:"20"},{k:"Alunos formados", v:"+25 mil"}];

/* 1ª edição — o brandbook original (verde, arco lima) */
Object.assign(P.find(p=>p.id==="arte1"), {page:{
  accent:"#3D7A6A", ...ARTE_QUOTE,
  heroBg:"radial-gradient(ellipse at 70% 40%, #3D7A6A 0%, #2A5C4E 45%, #1F4D3E 100%)", heroLogo:"img/arte/ed1-logo-2.png", heroAlt:"Logo Imersão A Arte de Viver com Jacob Petry sobre verde-floresta",
  pillarsTitle:["A","imersão"],
  pillars:[
    {k:"Quando", v:"27 e 28 de junho — dois dias inteiros, ao vivo."},
    {k:"Onde", v:"Online, ao vivo no Zoom: 15 horas de imersão."},
    {k:"Para quê", v:"Superar a ansiedade, o medo, a culpa e os traumas e passar a vencer na vida."},
    {k:"Lote 1", v:"Ingresso por R$ 37 — “menos que uma pizza”."}],
  numbersTitle:["Quem é","Jacob Petry"],
  numbersText:"Escritor, filósofo e conferencista, considerado uma das maiores influências do Brasil quando o assunto é mente e consciência. Reúne filosofia, psicologia, sociologia e espiritualidade em técnicas que produzem transformações reais e perenes. Brasileiro naturalizado americano, vive há décadas nos Estados Unidos.",
  numbers:ARTE_AUTOR,
  anatomy:{img:"img/arte/ed1-anatomia.png", items:[
    {n:"①", k:"Pill “IMERSÃO”", v:"Contexto e categoria: fundo verde #3D7A6A, texto branco, cantos totalmente arredondados, centralizado acima do nome."},
    {n:"②", k:"Arco verde no “A”", v:"A vírgula em verde lima integrada à letra A — o elemento de reconhecimento imediato."},
    {n:"③", k:"“A ARTE” + “VIVER”", v:"Serifa display de contraste dramático, peso máximo, caixa-alta. Nunca em itálico: a força está no peso reto."},
    {n:"④", k:"“de” em script", v:"Manuscrito, com ~40% do corpo do display: a transição emocional que tira a rigidez sem perder autoridade."},
    {n:"⑤", k:"“COM JACOB PETRY”", v:"Mesma família do display, corpo reduzido, tracking generoso: âncora de autoria."}]},
  paletteTitle:["Verde","conquistado"],
  palette:[
    {n:"Névoa", h:"#EAF4EF", u:"Fundos de seção, cards"},
    {n:"Jade pálido", h:"#C8E6D8", u:"Bordas, divisores, hover"},
    {n:"Jade", h:"#6DB89A", u:"Acentos sobre escuro, eyebrows"},
    {n:"Teal", h:"#3D7A6A", u:"Pill “IMERSÃO”, hero, botões", dark:true},
    {n:"Floresta", h:"#2A5C4E", u:"Fundo escuro, CTAs, agenda", dark:true},
    {n:"Musgo", h:"#1F4D3E", u:"Fundo máximo, manifesto, rodapé", dark:true},
    {n:"Tinta", h:"#0F1F1A", u:"Texto sobre claro", dark:true},
    {n:"Lima ★", h:"#6FCF6A", u:"Exclusivo do arco do “A”"}],
  paletteNote:"Monocromático: a variação é de profundidade, do névoa ao musgo. O único elemento fora da família é o lima do arco. Valores do brandbook da imersão.",
  typeTitle:["Greenleaf","& Caliway"],
  type:[
    {role:"Display · Greenleaf Bold Pro", img:"img/arte/ed1-fonte-display.png", note:"O nome do evento, em caixa-alta e peso máximo."},
    {role:"Autoria · Greenleaf Bold Pro", img:"img/arte/ed1-fonte-apoio.png", note:"“COM JACOB PETRY”, corpo reduzido e tracking generoso."},
    {role:"Script · Caliway", img:"img/arte/ed1-fonte-script.png", note:"O “de” manuscrito entre os dois pesos."}],
  typeNote:"Logo em Greenleaf Bold Pro + Caliway (pasta FONTES). Na interface e nos textos corridos, o brandbook usa só Inter — hierarquia por pesos: 900 títulos, 700 subtítulos e labels, 300 corpo.",
  logosTitle:["Quatro versões,","uma identidade"],
  logos:[
    {src:"img/arte/ed1-logo-2.png", label:"Branco · fundo verde médio", bg:"teal", wide:true},
    {src:"img/arte/ed1-logo-4.png", label:"Branco · fundo verde escuro", bg:"moss", wide:true},
    {src:"img/arte/ed1-logo-1.png", label:"Verde · fundo branco", bg:"paper", wide:true},
    {src:"img/arte/ed1-logo-3.png", label:"Verde · fundo névoa", bg:"mist", wide:true}],
  stories:[1,2,3,4,5,6,7,8].map(i=>`img/arte/ed1-story-${i}.jpg`), storiesTitle:["Anúncios","da campanha"], storiesEyebrow:"ADS",
  rules:{
    avoid:["Inverter o logo manualmente — usar sempre os arquivos fornecidos.","Dourado, cobre ou tons quentes: remetem ao território de guru motivacional.","Modificar ou remover o arco verde do “A”."],
    do:["O pill “IMERSÃO” sempre acima do nome.","Verde lima #6FCF6A só no arco do logo — nunca em texto, botão ou fundo.","Abraçar o espaço vazio: fundo verde com apenas o logo já é uma peça completa."],
    note:"Regras do brandbook da imersão."},
  folders:[
    {label:"ADS da 1ª edição", href:DRIVE("1wpePPwVQlesEvLJEFIaxlZUaOlfLtAon")},
    {label:"Pasta ID visual no Drive", href:DRIVE("1_lquf1lqlpm6VUyrxT9lb1E6ZzF9I5uS")}]
}});

/* 2ª edição — verde esmeralda, “2ª edição” em pill */
Object.assign(P.find(p=>p.id==="arte2"), {page:{
  accent:"#00885A", ...ARTE_QUOTE,
  heroBg:"radial-gradient(ellipse at 70% 40%, #1E9A6E 0%, #0E7A55 45%, #0A4A36 100%)", heroLogo:"img/arte/ed2-logo-1.png", heroLogoTall:true, heroAlt:"Logo Imersão A Arte de Viver 2ª edição sobre verde-esmeralda",
  pillarsTitle:["A","imersão"],
  pillars:[
    {k:"Quando", v:"01 e 02 de agosto — dois dias inteiros, ao vivo."},
    {k:"Onde", v:"Online: um fim de semana trabalhando intensamente sobre seus sofrimentos."},
    {k:"Para quê", v:"Superar a ansiedade, o medo, a culpa e os traumas e passar a vencer na vida."},
    {k:"Lote 1", v:"De R$ 497,00 por R$ 47,00."}],
  numbersTitle:["Quem é","Jacob Petry"], numbers:ARTE_AUTOR,
  anatomy:{img:"img/arte/ed2-anatomia.png", items:[
    {n:"①", k:"“IMERSÃO”", v:"Caixa-alta com tracking largo, sem pill, acima do nome."},
    {n:"②", k:"Arco verde no “A”", v:"A vírgula verde integrada à letra A — a assinatura que atravessa todas as edições."},
    {n:"③", k:"“A ARTE” + “VIVER”", v:"Serifa display em peso máximo, caixa-alta, nunca em itálico."},
    {n:"④", k:"“de” em script", v:"O manuscrito entre os dois pesos, como na 1ª edição."},
    {n:"⑤", k:"Pill “2ª EDIÇÃO”", v:"O pill que na 1ª dizia “IMERSÃO” desce para baixo do nome e marca a edição."}]},
  paletteTitle:["Verde","esmeralda"],
  palette:[
    {n:"Abismo", h:"#0A2E20", u:"Fundo máximo escuro dos anúncios", dark:true},
    {n:"Painel", h:"#2E6D54", u:"Caixas de texto sobre foto", dark:true},
    {n:"Esmeralda", h:"#00885A", u:"Logo verde, pill “2ª EDIÇÃO”", dark:true},
    {n:"Folha", h:"#359570", u:"Fundo verde médio dos stories", dark:true},
    {n:"Menta", h:"#71B89D", u:"Degradês claros"},
    {n:"Névoa", h:"#E8F8F0", u:"Detalhes claros do logo"}],
  paletteNote:"Cores medidas no logo e nos anúncios da 2ª edição.",
  typeTitle:["Greenleaf","& Caliway"],
  type:[
    {role:"Display · Greenleaf Bold Pro", img:"img/arte/ed2-fonte-display.png", note:"O nome do evento, em caixa-alta e peso máximo."},
    {role:"Edição · Greenleaf Bold Pro", img:"img/arte/ed2-fonte-apoio.png", note:"“2ª EDIÇÃO” dentro do pill."},
    {role:"Script · Caliway", img:"img/arte/ed2-fonte-script.png", note:"O “de” manuscrito."}],
  typeNote:"Amostras renderizadas com os arquivos da pasta FONTES da imersão.",
  logosTitle:["Logo da","2ª edição"],
  logos:[
    {src:"img/arte/ed2-logo-1.png", label:"Vertical · branco sobre verde", bg:"emerald"},
    {src:"img/arte/ed2-logo-2.png", label:"Vertical · grafite sobre claro", bg:"paper"},
    {src:"img/arte/ed2-logo-3.png", label:"Horizontal · verde sobre claro", bg:"mist", wide:true}],
  stories:[1,2,3,4,5].map(i=>`img/arte/ed2-story-${i}.jpg`), storiesTitle:["Anúncios","da campanha"], storiesEyebrow:"ADS",
  rules:{
    avoid:["Inverter o logo manualmente — usar sempre os arquivos fornecidos.","Dourado, cobre ou tons quentes.","Modificar ou remover o arco do “A”."],
    do:["“IMERSÃO” sempre acima do nome.","O pill “2ª EDIÇÃO” sempre abaixo do nome.","Abraçar o espaço vazio."],
    note:"Regras do brandbook da imersão, aplicadas à 2ª edição."},
  folders:[
    {label:"ADS da 2ª edição", href:DRIVE("1Q2oX7VaYANchckmkYrVN-cVjShSoJU5X")},
    {label:"Logo da 2ª edição", href:DRIVE("1KJH1xGPhXbw9yGYl9WftQ4XJfkiWCzpF")}]
}});

/* Página completa da 3ª edição — conteúdo do brandbook da imersão (arte-de-viver-id-visual) + pasta da 3ª edição */
Object.assign(P.find(p=>p.id==="arte3"), {page:{
  accent:"#3474A4",
  heroBg:"radial-gradient(ellipse at 70% 40%, #3474A4 0%, #195C90 40%, #0A122E 100%)", heroLogo:"img/arte/ed3-logo-claro.png", heroAlt:"Logo Imersão A Arte de Viver 3ª edição com a data 19 e 20 de setembro, sobre azul-noite",
  ...ARTE_QUOTE, numbersTitle:["Quem é","Jacob Petry"], numbers:ARTE_AUTOR,
  pillarsTitle:["A","imersão"],
  pillars:[
    {k:"Quando", v:"19 e 20 de setembro — dois dias inteiros, ao vivo."},
    {k:"Onde", v:"Online: uma imersão para fazer de casa, com Jacob Petry."},
    {k:"Para quê", v:"Superar a ansiedade, o medo, a culpa e os traumas e passar a vencer na vida."},
    {k:"Lote 1", v:"De R$ 497,00 por R$ 19,90 — “menos que uma pizza”."}],
  anatomy:{img:"img/arte/ed3-anatomia.png", items:[
    {n:"①", k:"“IMERSÃO”", v:"Caixa-alta espaçada, centralizada acima do nome. Nunca some das peças do evento."},
    {n:"②", k:"O arco no “A”", v:"A vírgula integrada à letra A — nesta edição, em azul. É a assinatura que diferencia o logo."},
    {n:"③", k:"“A ARTE” + “VIVER”", v:"Serifa display de alto contraste, peso máximo, caixa-alta. Nunca em itálico."},
    {n:"④", k:"“DE”", v:"Versalete sublinhado entre os dois pesos — a respiração do nome."},
    {n:"⑤", k:"“3ª edição”", v:"Script cursivo em azul: a marca da edição, leve sob o peso do nome."}]},
  paletteTitle:["Azul","da 3ª edição"],
  palette:[
    {n:"Noite", h:"#0A122E", u:"Fundo máximo escuro dos anúncios", dark:true},
    {n:"Oceano", h:"#195C90", u:"Painéis e caixas de texto", dark:true},
    {n:"Azul arco", h:"#3474A4", u:"“3ª edição” e arco do A no logo claro", dark:true},
    {n:"Céu", h:"#58B8E8", u:"A data “19 e 20”"},
    {n:"Névoa", h:"#D5DBE3", u:"Topo claro dos stories"},
    {n:"Branco", h:"#FFFFFF", u:"Logo sobre fundo escuro"}],
  paletteNote:"A 1ª e a 2ª edição são verdes; a 3ª troca o verde pelo azul. Cores medidas no logo, na data e nos anúncios da 3ª edição.",
  typeTitle:["Greenleaf","& Caliway"],
  type:[
    {role:"Display · Greenleaf Bold Pro", img:"img/arte/fonte-greenleaf.png", note:"O nome do evento: serifa de contraste dramático, peso máximo."},
    {role:"Apoio · Greenleaf Bold Pro", img:"img/arte/fonte-greenleaf-2.png", note:"“IMERSÃO” em caixa-alta com tracking generoso."},
    {role:"Script · Caliway", img:"img/arte/fonte-caliway.png", note:"A edição e a data por extenso — “de Setembro”."}],
  typeNote:"Amostras renderizadas com os arquivos da pasta FONTES da imersão. Nos textos corridos, o brandbook usa Inter.",
  logosTitle:["Logo","& data"],
  logos:[
    {src:"img/arte/ed3-logo-claro.png", label:"Branco · fundo noite", bg:"navy", wide:true},
    {src:"img/arte/ed3-logo-escuro.png", label:"Grafite e azul · fundo claro", bg:"paper", wide:true},
    {src:"img/arte/ed3-data.png", label:"Data · 19 e 20 de setembro", bg:"navy", wide:true}],
  stories:[1,2,3,4,5,6].map(i=>`img/arte/ed3-story-${i}.jpg`), storiesTitle:["Anúncios","da campanha"], storiesEyebrow:"ADS · Remessa 1",
  rules:{
    avoid:["Inverter o logo manualmente — usar sempre os arquivos fornecidos.","Dourado, cobre ou tons quentes: remetem ao território de guru motivacional.","Modificar ou remover o arco do “A”."],
    do:["“IMERSÃO” sempre acima do nome nas peças do evento.","A cor do arco fica só no arco — nunca como texto, botão ou fundo.","Abraçar o espaço vazio: fundo com apenas o logo já é uma peça completa."],
    note:"Regras do brandbook da imersão."},
  folders:[
    {label:"ADS da 3ª edição", href:DRIVE("1EntCNE4nVxYY8lVRjVFLmvjxF7Z86z8s")},
    {label:"Pasta ID visual da 3ª edição", href:DRIVE("1sApPZJ9Tw_aZitn-GlutJeZ1Xpf4Kgsy")}]
}});

/* Clube dos 5% — o produto principal, que reúne todas as trilhas */
P.unshift({id:"clube", plain:"Clube dos 5%", type:"Comunidade · Produto principal", kind:"clube",
  slug:"clube-dos-5", img:"img/clube-poster.jpg", wide:"img/clube/p5-estatua.jpg", caption:"CLUBE DOS 5%",
  title:"Clube <i>dos</i> 5%", kicker:"Jacob Petry", big:"5%", meta:"Liberte-se do falso eu", tag:"Produto principal", skin:"bronze",
  club:"https://hotmart.com/pt-BR/club/jacobpetry/products/602766", drive:DRIVE("1wd6ZJySetFDkVNL9GGR8rAMZR1rPsL7u"),
  facts:["Mentoria ao vivo toda segunda","15 ciclos de estudos","Apostilas de todos os cursos","Resumos e atividades"],
  page:{
    motion:{src:"img/clube/coruja.mp4", poster:"img/clube/coruja-poster.jpg", bg:"#000000", eyebrow:"Motion", cap:"A coruja coroada se desenha e o nome surge — a vinheta do Clube dos 5%."},
    hero:"img/clube/botticelli.jpg", heroPos:"8% center", heroPosM:"41% center", heroAlt:"Coruja coroada do Clube dos 5% sobre O Nascimento de Vênus, de Botticelli",
    quote:"Liberte-se do falso eu e viva da essência.", quoteBy:"Manifesto do Clube dos 5%",
    pillars:[
      {k:"A promessa", v:"Se libertar dos sofrimentos causados pela mente e viver com paz, leveza e plenitude."},
      {k:"O caminho", v:"8 pilares internos que, praticados com consistência, te libertam do falso eu."},
      {k:"O ritmo", v:"Mentoria ao vivo toda segunda-feira com Jacob Petry."},
      {k:"O acervo", v:"15 ciclos de estudos completos, apostilas de todos os cursos, resumos e atividades de cada ciclo."}],
    palette:[
      {n:"Ouro coruja", h:"#ECBE73", u:"Emblema, coroa e louros"},
      {n:"Ouro lettering", h:"#CF9852", u:"Frases e detalhes impressos"},
      {n:"Noite", h:"#090503", u:"Fundos escuros de stories e caderno", dark:true},
      {n:"Couro", h:"#48423B", u:"Encadernação e texturas nobres", dark:true},
      {n:"Pergaminho", h:"#F2ECE0", u:"Fundos claros de stories"},
      {n:"Branco", h:"#FFFFFF", u:"Wordmark sobre fundo escuro"}],
    type:[
      {role:"Wordmark", sample:"CLUBE DOS 5%", cls:"t-word", note:"Serifa clássica de alto contraste, sempre em caixa-alta."},
      {role:"Títulos de semana", sample:"Semana da Aceitação", cls:"t-italic", note:"Serifa itálica dentro de uma pílula com brilho dourado, nos stories."},
      {role:"Frases de impacto", sample:"Não se distraia!", cls:"t-brush", note:"Lettering de pincel em ouro, como no caderno do Clube."}],
    logos:[
      {src:"img/clube/logo-vertical-ouro.png", label:"Vertical · fundo claro", bg:"paper"},
      {src:"img/clube/logo-vertical-claro.png", label:"Vertical · fundo escuro", bg:"night"},
      {src:"img/clube/logo-horizontal-escuro.png", label:"Horizontal · fundo claro", bg:"paper", wide:true},
      {src:"img/clube/logo-horizontal-claro.png", label:"Horizontal · fundo escuro", bg:"night", wide:true}],
    apps:[
      {src:"img/clube/p5-estatua.jpg", cap:"Monograma 5 coroado sobre escultura clássica"},
      {src:"img/clube/teto-livro.jpg", cap:"Monograma sobre afresco e coruja gravada em couro"},
      {src:"img/clube/p5-canecas.jpg", cap:"Canecas com a coruja e o monograma"},
      {src:"img/clube/caderno.jpg", cap:"Caderno do Clube: “Não se distraia!”", tall:true},
      {src:"img/clube/caneca.jpg", cap:"Arte da caneca: padrão com os desenhos do método"},
      {src:"img/clube/pulseira.jpg", cap:"Pulseira do 2º Encontro Anual Clube dos 5%", strip:true}],
    agora:{
      thesis:"Na Grécia antiga, a ágora era a praça aberta da cidade: ali o saber circulava entre todos, em voz alta, à vista de quem passasse. O Instagram do Clube dos 5% é a nossa ágora — o lugar público onde as ideias são lançadas à cidade. A escola, o estudo em profundidade, acontece dentro do Clube; a ágora é onde a conversa começa e de onde parte o convite.",
      maxim:"A ágora ensina em público. O Clube aprofunda em silêncio.",
      voices:[
        {n:"I", k:"O diálogo", v:"Ilustrações do falso eu falando em balões: a voz na cabeça exposta em praça pública.", posts:[1,2]},
        {n:"II", k:"A tese", v:"Capas de carrossel: título em serifa caixa-alta + itálico dourado sublinhado, sobre papel ou pintura clássica, com “arraste para o lado”.", posts:[4,5,7]},
        {n:"III", k:"A aula", v:"Jacob com o bloco de desenho, em vídeo: o conceito desenhado à mão, na hora.", posts:[6,8]},
        {n:"IV", k:"O aforismo", v:"Uma frase datilografada em papel kraft, assinada Jacob Petry.", posts:[9]},
        {n:"V", k:"O convite", v:"A chamada para dentro: o curso já está no Clube — comente EU QUERO.", posts:[3]}],
      posts:[
        "A busca interminável — diálogo do falso eu","A insegurança nas relações — diálogo do falso eu","Convite: o curso já está no Clube dos 5%",
        "A insegurança nas relações — tese sobre pintura clássica","O sentimento do falso eu — tese em papel","O sentimento do falso eu — aula em vídeo",
        "As 5 linguagens do amor — tese em papel","A tua realidade nunca cria sofrimento — aula em vídeo","A última coisa que nasce em um pé de fruta é a fruta — aforismo"
      ].map((cap,i)=>({src:`img/clube/feed/post-${i+1}.jpg`, cap})),
      rules:[
        "Título em serifa caixa-alta com a segunda linha em itálico dourado sublinhado",
        "Selo da coruja (ou coruja + nome do curso) em todo post",
        "Alternar papel claro, pintura clássica escura e vídeo do Jacob no grid",
        "Carrosséis sempre com “arraste para o lado” e seta fina",
        "Uma chamada para o Clube a cada linha do grid, no máximo"]
    },
    stories:[1,2,3,4,5,6,7,8,10,11,12].map(i=>`img/clube/story-${i}.jpg`),
    checkout:[{src:"img/clube/checkout-topo.jpg", cap:"Banner do topo do checkout"},{src:"img/clube/checkout-fundo.jpg", cap:"Imagem de fundo do checkout"}],
    folders:[
      {label:"Logos", href:DRIVE("1H8YcJqLkWIttdM6bSDaYVlnfBV-X5ZDs")},
      {label:"Fundos de stories", href:DRIVE("1KefTUAlwVWiIS6C4jjNFU_U5NPTm292d")},
      {label:"Materiais impressos", href:DRIVE("1ih2KDVdhuN_Ih8YAQNrA5wHALA0Z-Wdj")},
      {label:"Checkout", href:DRIVE("171ma-XNehGesV93h22KhfXw3Uj8Ldg_c")},
      {label:"Perfil e PSDs", href:DRIVE("1_2l8yiyhCafb6RFrgug9aaDXGBbKsnyH")}]
  },
  desc:"Liberte-se do falso eu e viva da essência. O Clube reúne os 8 pilares internos que, praticados com consistência, te libertam do falso eu — com mentoria ao vivo toda segunda com Jacob Petry, 15 ciclos de estudos completos, apostilas de todos os cursos e resumos e atividades de cada ciclo."});
function slugify(t){return t.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/%/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").replace(/^um-curso-(pratico-)?(em|nas|na|nos|no)-/,"")}
P.forEach(p=>{ p.slug = p.slug || slugify(p.plain); });
/* O acervo mostra só produtos com pasta de materiais no Drive */
for(let i=P.length-1;i>=0;i--) if(!P[i].drive) P.splice(i,1);
const byId = Object.fromEntries(P.map(p=>[p.id,p]));
const T = (...ids) => ids.map(id=>"t-"+id);

const FEATURED = "t-d64lyB0bej";
const ROWS = [
  {id:"destaques", title:"Os imperdíveis do Clube", ids:["clube",...T("d64lyB0bej","v94JbyN04g"),"arte3",...T("v94JbJo04g")]},
  {id:"arte", title:"Imersão A Arte de Viver", note:"todas as edições", ids:["arte3","arte2","arte1"]},
];
for(let i=ROWS.length-1;i>=0;i--){ ROWS[i].ids = ROWS[i].ids.filter(id=>byId[id]); if(!ROWS[i].ids.length) ROWS.splice(i,1); }


/* ---------- capa gerada ---------- */
function hash(s){let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h}
function art(p){
  const s = SKINS[p.skin], h = hash(p.id), seed = h%97, fx = (h%5)/1000;
  const uid = "f"+p.id+Math.random().toString(36).slice(2,6);
  const lx = 30+(h%40), ly = 18+(h%22);
  return `<svg class="art" viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <radialGradient id="${uid}l" cx="${lx}%" cy="${ly}%" r="85%">
        <stop offset="0" stop-color="${s.light}" stop-opacity=".95"/>
        <stop offset=".55" stop-color="${s.bg}" stop-opacity=".2"/>
        <stop offset="1" stop-color="#000" stop-opacity=".55"/>
      </radialGradient>
      <filter id="${uid}v" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="${.006+fx} ${.022+fx*2}" numOctaves="5" seed="${seed}"/>
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -9 0 0 0 4.6"/>
        <feComposite in2="SourceGraphic" operator="in"/>
      </filter>
    </defs>
    <rect width="200" height="300" fill="${s.bg}"/>
    <rect width="200" height="300" fill="${s.vein}" filter="url(#${uid}v)" opacity=".35"/>
    <rect width="200" height="300" fill="url(#${uid}l)"/>
  </svg>`;
}
function cardHTML(p, link = true){
  const s = SKINS[p.skin];
  const tag = link ? `a href="${BASE}${p.slug}/"` : "div", end = link ? "a" : "div";
  if(p.img) return `<${tag} class="card" data-id="${p.id}" aria-label="${p.plain} — ${p.type}">
    <img class="art" src="${BASE}${p.img}" alt="" loading="lazy">
    ${p.logo||p.caption?`<span class="shade"></span>`:""}
    ${p.logo?`<img class="logo" src="${BASE}${p.logo}" alt="">`:""}
    ${p.caption?`<span class="caption">${p.caption}</span>`:""}
    ${p.tag?`<span class="tag">${p.tag}</span>`:""}
    <span class="kebab" aria-hidden="true"><svg><use href="#kebab"/></svg></span>
  </${end}>`;
  return `<${tag} class="card" data-id="${p.id}" style="color:${s.fg}" aria-label="${p.plain} — ${p.type}">
    ${art(p)}
    ${p.tag?`<span class="tag">${p.tag}</span>`:""}
    <span class="kebab" aria-hidden="true"><svg><use href="#kebab"/></svg></span>
    <span class="face">
      <span class="kicker">${p.kicker}</span>
      <span>
        ${p.big?`<span class="big" style="display:block">${p.big}</span>`:""}
        <span class="title" style="display:block">${p.title}</span>
        <span class="rule" style="display:block"></span>
        <span class="meta">${p.meta}</span>
      </span>
    </span>
  </${end}>`;
}

/* ---------- botões de acesso (Hotmart + Drive) ---------- */
const IC_GO = `<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>`;
const IC_DIR = `<svg viewBox="0 0 24 24"><path d="M4 7.5h6l2 2h8v9H4z"/></svg>`;
function accessHTML(p){
  const mat = p.drive ? `<a class="mat" href="${p.drive}" target="_blank" rel="noopener">${IC_DIR} Materiais</a>` : "";
  const hot = p.club ? `<a class="mat" href="${p.club}" target="_blank" rel="noopener">Acessar na Hotmart</a>` : "";
  return `<div class="access"><a class="go" href="${BASE}${p.slug}/">Acessar ${IC_GO}</a>${mat}${hot}</div>`;
}
function itemHTML(p){ return `<div class="item">${cardHTML(p)}${accessHTML(p)}</div>`; }
function railHTML(items){
  return `<div class="rail-wrap">
      <button class="arrow prev" aria-label="Anterior"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
      <div class="rail">${items.map(itemHTML).join("")}</div>
      <button class="arrow next" aria-label="Próximo"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
    </div>`;
}
function setupRail(wrap){
  const rail = wrap.querySelector(".rail"), prev = wrap.querySelector(".prev"), next = wrap.querySelector(".next");
  const upd = ()=>{ prev.disabled = rail.scrollLeft < 8; next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 8; };
  prev.onclick = ()=> rail.scrollBy({left:-rail.clientWidth*.85, behavior:"smooth"});
  next.onclick = ()=> rail.scrollBy({left: rail.clientWidth*.85, behavior:"smooth"});
  rail.addEventListener("scroll", upd, {passive:true}); upd();
}
