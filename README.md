# Acervo Clube dos 5% · Jacob Petry

Site estático publicado em **https://acervoclube5.netlify.app**.

## Seções
- **/** — tela inicial: Conteúdos · ID Visual · Resumos (em breve)
- **/conteudos/** — carrosséis, estáticos e capas de reels, com download dos PNG originais e revisão (Aprovar · Ajustar · Reprovar · Publicado + anotações)
- **/id-visual/** — acervo de produtos; cada produto tem sua página (`/voz-na-cabeca/`, `/o-metodo/`…)

## Estrutura
```
site/
  assets/catalogo.js    dados dos produtos (ID Visual)
  assets/conteudos.js   lista de peças do painel Conteúdos
  assets/hub.js         página ID Visual
  assets/produto.js     página de cada produto
  assets/style.css
  img/                  imagens exibidas (JPG)
  dl/                   originais para download (PNG) — o build gera um .zip por pasta
netlify/functions/revisao.mjs   API de status/anotações (Netlify Blobs, store "revisao")
build-site.py           gera dist/ a partir de site/
publicar.sh             build + deploy em produção
```

## Adicionar conteúdo
1. Imagens para a tela em `site/img/conteudos/<pasta>/` (JPG) e originais em `site/dl/<pasta>/` (PNG, mesmos nomes).
2. Registre a peça em `site/assets/conteudos.js` com `piece("<pasta>", "Título", [arquivos])`.

## Rodar e publicar
```bash
npm install                 # @netlify/blobs (usado pela function)
python3 build-site.py       # gera dist/  (requer node para ler o catálogo)
python3 -m http.server 8781 --directory dist
./publicar.sh "mensagem"    # build + netlify deploy --prod (requer netlify login com acesso ao site)
```
A revisão (`/api/revisao`) só funciona no Netlify, não no servidor local.
