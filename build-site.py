#!/usr/bin/env python3
"""Gera o site do acervo: index.html + uma subpasta por produto, e copia para INSTAGRAM 5% (+ zip)."""
import json, os, shutil, subprocess, zipfile, html
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, "site")
OUT = os.path.join(HERE, "dist")  # build local (usado no preview)
DEST = os.path.expanduser("~/Downloads/INSTAGRAM 5%/acervo-jacob-petry-netlify")
IDV_SRC = os.path.join(SITE, "arte-de-viver-id-visual.html")  # brandbook da imersão (original: ~/Downloads/arte-de-viver-id-visual_4.html)

# lista de produtos (id, slug, nome) direto do catálogo JS
probe = "globalThis.document={documentElement:{dataset:{}}};" + open(os.path.join(SITE,"assets/catalogo.js"),encoding="utf-8").read() + \
        ";console.log(JSON.stringify({items:P.map(p=>[p.id,p.slug,p.plain]),rows:ROWS.map(r=>[r.id,r.title])}))"
probed = json.loads(subprocess.run(["node","-e",probe],capture_output=True,text=True,check=True).stdout)
items, rows = probed["items"], probed["rows"]
assert len({s for _,s,_ in items}) == len(items), "slugs repetidos"

# versão dos assets (hash do conteúdo): força o navegador a baixar CSS/JS novos a cada publicação
import hashlib
VER = hashlib.sha1(b"".join(open(os.path.join(SITE,"assets",f),"rb").read() for f in sorted(os.listdir(os.path.join(SITE,"assets"))))).hexdigest()[:8]
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Cormorant:ital,wght@0,500;0,600;0,700;1,500&family=Hanken+Grotesk:wght@400;500;600&display=swap">'
SYMBOLS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><symbol id="kebab" viewBox="0 0 4 18"><circle cx="2" cy="2" r="1.7"/><circle cx="2" cy="9" r="1.7"/><circle cx="2" cy="16" r="1.7"/></symbol></svg>'
def header(base, left):
    return f'''<header class="top">
  {left}
  <a class="club-logo" href="{base or './'}" aria-label="Clube dos 5% — início">
    <img class="full" src="{base}img/logo-clube.png" alt="Clube dos 5%" width="720" height="163">
    <img class="mark" src="{base}img/logo-coruja.png" alt="Clube dos 5%" width="168" height="200">
  </a>
  <span class="brand-sep" aria-hidden="true"></span>
  <a class="brand" href="{base or './'}" aria-label="Jacob Petry — início">
    <small><b>Clube dos 5%</b> | Design &amp; Materiais</small>
    <span>JACOB PETRY</span>
  </a>
  <div class="spacer"></div>
  SEARCH
</header>'''
FOOT = "<footer>Clube dos 5% · Jacob Petry — “Acessar” abre a trilha na Hotmart Club (login de membro); “Materiais” abre a pasta no Drive.</footer>"
def page(base, product, title, body_class, left, search, main, scripts=(), foot=FOOT):
    prod = f' data-product="{product}"' if product else ""
    js = "\n".join(f'<script src="{base}assets/{x}?v={VER}"></script>' for x in scripts)
    return f'''<!doctype html>
<html lang="pt-BR" data-base="{base}"{prod}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{html.escape(title)}</title>
<meta name="description" content="Clube dos 5% · Jacob Petry — design e materiais dos produtos.">
{FONTS}
<link rel="stylesheet" href="{base}assets/style.css?v={VER}">
<link rel="icon" type="image/png" href="{base}favicon.png">
<link rel="icon" href="{base}favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="{base}apple-touch-icon.png">
</head>
<body class="{body_class}">
{header(base, left).replace("SEARCH", search)}
{main}
{foot}
{SYMBOLS}
{js}
</body>
</html>
'''
MENU = '<button class="icon-btn" id="menuBtn" aria-label="Abrir menu"><svg viewBox="0 0 24 24"><path d="M3 6.5h18M3 12h18M3 17.5h18"/></svg></button>'
SEARCH = '''<div class="search" id="search">
    <button class="icon-btn" id="searchBtn" aria-label="Buscar"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7"/><path d="M15.8 15.8 21 21"/></svg></button>
    <input id="q" type="search" placeholder="Buscar curso, imersão, desafio…" aria-label="Buscar no acervo">
  </div>'''
DRAWER = '<div class="drawer" id="drawer" aria-hidden="true">\n  <div class="veil" data-close></div>\n  <nav aria-label="Categorias">\n    <h3>Salas do acervo</h3>\n' + \
    "".join(f'    <a href="#{rid}" data-close>{html.escape(t)}</a>\n' for rid,t in rows) + '  </nav>\n</div>'
BACK = '<a class="icon-btn" href="../id-visual/" aria-label="Voltar para ID Visual"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></a>'

if os.path.exists(OUT): shutil.rmtree(OUT)
shutil.copytree(os.path.join(SITE,"assets"), os.path.join(OUT,"assets"))
shutil.copytree(os.path.join(SITE,"img"), os.path.join(OUT,"img"))
# downloads: originais em PNG + um .zip por pasta (carrossel inteiro, todas as capas)
shutil.copytree(os.path.join(SITE,"dl"), os.path.join(OUT,"dl"))
for d in sorted(os.listdir(os.path.join(OUT,"dl"))):
    full = os.path.join(OUT,"dl",d)
    if not os.path.isdir(full): continue
    with zipfile.ZipFile(full + ".zip","w",zipfile.ZIP_STORED) as zf:
        for f in sorted(os.listdir(full)): zf.write(os.path.join(full,f), f"{d}/{d}-{f}")
for fav in ("favicon.png","favicon.ico","apple-touch-icon.png"): shutil.copy(os.path.join(SITE,fav), os.path.join(OUT,fav))
HOME = '<a class="icon-btn" href="../" aria-label="Voltar ao início"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></a>'
GO = '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>'
def door(n, title, text, img, href=None):
    inner = f'''<img src="{img}" alt="">
      <span class="door-num">{n}</span>
      <span class="door-copy"><strong>{title}</strong><span>{text}</span><span class="door-cta">{"Entrar " + GO if href else "Em breve"}</span></span>'''
    return f'\n    <a class="door" href="{href}">{inner}</a>' if href else f'\n    <div class="door soon">{inner}</div>'
# tela inicial: Conteúdos · ID Visual · Resumos
DOORS = ('<main class="inicio">\n  <header class="inicio-head"><span class="eyebrow">Clube dos 5% · Design &amp; Materiais</span>'
         '<h1>O que você <em>procura?</em></h1></header>\n  <nav class="doors" aria-label="Seções">'
         + door("I", "Conteúdos", "Carrosséis, estáticos e capas de reels.", "img/conteudos/reels/f.jpg", "conteudos/")
         + door("II", "ID Visual", "Identidade, capas e materiais de cada produto.", "img/voz-hero.jpg", "id-visual/")
         + door("III", "Resumos", "Resumos e atividades de cada ciclo.", "img/metodo-wide.jpg")
         + '\n  </nav>\n</main>')
open(os.path.join(OUT,"index.html"),"w",encoding="utf-8").write(
    page("", None, "Acervo Jacob Petry · Clube dos 5%", "page-inicio", "", "", DOORS, foot=""))
# ID Visual: o acervo de produtos (antiga página inicial)
os.makedirs(os.path.join(OUT,"id-visual"), exist_ok=True)
open(os.path.join(OUT,"id-visual","index.html"),"w",encoding="utf-8").write(
    page("../", None, "ID Visual · Clube dos 5%", "page-hub", MENU, SEARCH, DRAWER + '\n<main id="topo"></main>', ("catalogo.js","hub.js")))
# Conteúdos: painel de carrosséis, estáticos e capas de reels (dados em assets/conteudos.js)
os.makedirs(os.path.join(OUT,"conteudos"), exist_ok=True)
open(os.path.join(OUT,"conteudos","index.html"),"w",encoding="utf-8").write(
    page("../", None, "Conteúdos · Clube dos 5%", "page-conteudos", HOME, "",
         '<div class="ct-layout">\n<main id="conteudos"></main>\n<aside class="ig" id="ig" aria-label="Instagram @oclubedos5porcento"></aside>\n</div>',
         ("conteudos.js","instagram.js"), foot=""))
for pid, slug, name in items:
    os.makedirs(os.path.join(OUT,slug), exist_ok=True)
    open(os.path.join(OUT,slug,"index.html"),"w",encoding="utf-8").write(
        page("../", pid, f"{name} · Clube dos 5%", "page-produto", BACK, "", '<main id="produto"></main>', ("catalogo.js","produto.js")))
# identidade visual da Imersão A Arte de Viver (página própria enviada pelo Lucas)
idv = os.path.join(OUT,"arte-de-viver","identidade-visual"); os.makedirs(idv, exist_ok=True)
shutil.copy(IDV_SRC, os.path.join(idv,"index.html"))
# copia para INSTAGRAM 5% + zip (só na máquina do Lucas, onde a pasta existe)
if not os.path.isdir(os.path.dirname(DEST)):
    print(len(items),"páginas de produto →",OUT); raise SystemExit
if os.path.exists(DEST): shutil.rmtree(DEST)
shutil.copytree(OUT, DEST)
z = DEST + ".zip"
if os.path.exists(z): os.remove(z)
with zipfile.ZipFile(z,"w",zipfile.ZIP_DEFLATED) as zf:
    for d,_,fs in os.walk(OUT):
        for f in fs:
            full=os.path.join(d,f); zf.write(full, os.path.relpath(full,OUT))
print(len(items),"páginas de produto →",DEST)
