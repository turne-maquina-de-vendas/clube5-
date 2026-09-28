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
api/revisao.js          API de status/anotações na Vercel (Postgres/Neon, tabela "revisao")
netlify/functions/revisao.mjs   a mesma API no Netlify (Netlify Blobs, store "revisao")
api/instagram.js        grade do Instagram na lateral de Conteúdos (últimos 9 posts)
vercel.json             configuração da Vercel (build, pasta dist, barra final nas URLs)
build-site.py           gera dist/ a partir de site/
publicar.sh             build + deploy em produção
```

## Adicionar conteúdo
1. Imagens para a tela em `site/img/conteudos/<pasta>/` (JPG) e originais em `site/dl/<pasta>/` (PNG, mesmos nomes).
2. Registre a peça em `site/assets/conteudos.js` com `piece("<pasta>", "Título", [arquivos])`.

## Deploy na Vercel
1. **Add New → Project** → importar `lucasfigueiredoart/clube5-`. O `vercel.json` já define tudo:
   instala com `npm install`, builda com `python3 build-site.py` e publica a pasta `dist`.
   Framework Preset: **Other** (não precisa mudar nada nas configurações de build).
2. **Storage → Neon (Postgres)** conectado ao projeto. A Vercel cria `DATABASE_URL`/`POSTGRES_URL`,
   que `api/revisao.js` usa; a tabela `revisao` é criada sozinha na primeira chamada.
   **Nunca** coloque a URL do banco no código — o repositório é público.
3. **Redeploy** depois de conectar o banco (as variáveis só entram em deploys novos).
4. Conferir: `https://<domínio>/api/revisao` deve responder `{}`.
   Se responder erro 503, o banco ainda não está conectado.

> `trailingSlash: true` é necessário: as páginas usam caminhos relativos (`../assets/...`),
> então `/conteudos` precisa virar `/conteudos/`.

## Grade do Instagram (lateral de Conteúdos)
Mostra perfil + últimos 9 posts de @oclubedos5porcento, atualizando a cada ~2 min (cache de 2 min na CDN).
Usa a API oficial; precisa de um token da conta:
1. A conta @oclubedos5porcento precisa ser **profissional** (Criador ou Empresa).
2. [developers.facebook.com](https://developers.facebook.com/apps) → **Criar app** (tipo Empresa) →
   adicionar o produto **Instagram** → **Configuração da API com login do Instagram**.
3. Em **Gerar tokens de acesso**, adicionar a conta @oclubedos5porcento e gerar o token
   (permissão `instagram_business_basic`).
4. Na Vercel: **Settings → Environment Variables** → `IG_ACCESS_TOKEN` = token → **Redeploy**.
5. Conferir: `https://<domínio>/api/instagram` deve listar os posts.

O token vale 60 dias; `api/instagram.js` renova sozinho a cada 7 dias e guarda o novo no Neon
(tabela `ig_token`). Se trocar `IG_ACCESS_TOKEN`, o novo substitui o guardado.

## Rodar e publicar (Netlify / local)
```bash
npm install                 # @netlify/blobs (usado pela function)
python3 build-site.py       # gera dist/  (requer node para ler o catálogo)
python3 -m http.server 8781 --directory dist
./publicar.sh "mensagem"    # build + netlify deploy --prod (requer netlify login com acesso ao site)
```
A revisão (`/api/revisao`) só funciona no Netlify, não no servidor local.
