/* Lateral de Conteúdos: print da grade do Instagram @oclubedos5porcento (últimos 9 posts, 3 por fileira).
   Para atualizar: capturar os posts de novo em img/instagram/1..9.jpg e ajustar POSTS, PROFILE e CAPTURED abaixo. */
(() => {
const box = document.getElementById("ig");
if (!box) return;
const BASE = document.documentElement.dataset.base || "";
const PROFILE = {username:"oclubedos5porcento", name:"Clube dos 5% | Jacob Petry", posts:"603", followers:"64,3 mil"};
const CAPTURED = "28/09 às 20:56";
/* [tipo, link] na ordem da grade (os ícones de reel/fixado já vêm no print); pinned = fixado no perfil */
const POSTS = [
  ["reel","reel/DQKlTcZD1oM",true],["carrossel","p/DdohVzFlt9N"],["reel","reel/Dd18_d5q-Dy"],
  ["carrossel","p/Dd1BNANllNU"],["reel","reel/Ddz0R0wqZ0k"],["carrossel","p/DdwP1Dqlru6"],
  ["reel","reel/Ddtu64EBquS"],["reel","reel/DdtFITcK11q"],["reel","reel/Ddq35H4K5L0"]];
const url = p => `https://www.instagram.com/${PROFILE.username}/${p}/`;
box.innerHTML = `<div class="ig-card">
  <header class="ig-head">
    <img class="ig-pic" src="${BASE}img/instagram/perfil.jpg" alt="">
    <div><a class="ig-user" href="https://www.instagram.com/${PROFILE.username}/" target="_blank" rel="noopener">@${PROFILE.username}</a>
    <small>${PROFILE.posts} posts · ${PROFILE.followers} seguidores</small></div>
  </header>
  <p class="ig-live">Print da grade · ${CAPTURED}</p>
  <div class="ig-grid">${POSTS.map(([type, link, pinned], i) => `
    <a href="${url(link)}" target="_blank" rel="noopener" aria-label="Post ${i+1} (${type}) no Instagram">
      <img src="${BASE}img/instagram/${i+1}.jpg" alt="" loading="lazy">
    </a>`).join("")}</div>
  <a class="ig-open" href="https://www.instagram.com/${PROFILE.username}/" target="_blank" rel="noopener">Abrir no Instagram</a>
</div>`;
})();
