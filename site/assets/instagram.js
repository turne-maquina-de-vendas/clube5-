/* Lateral de Conteúdos: print da grade do Instagram @oclubedos5porcento (últimos 9 posts, 3 por fileira).
   Para atualizar: capturar os posts de novo em img/instagram/1..9.jpg e ajustar POSTS, PROFILE e CAPTURED abaixo. */
(() => {
const box = document.getElementById("ig");
if (!box) return;
const BASE = document.documentElement.dataset.base || "";
const PROFILE = {username:"oclubedos5porcento", name:"Clube dos 5% | Jacob Petry", posts:"607", followers:"64,3 mil"};
const CAPTURED = "30/09 às 19:52";
/* [tipo, link] na ordem da grade (os ícones de reel/fixado já vêm no print); pinned = fixado no perfil */
const POSTS = [
  ["reel","reel/DdhfcgvqpuO",true],["reel","reel/DQKlTcZD1oM",true],["carrossel","p/DdohVzFlt9N",true],
  ["carrossel","p/Dd63Ec0mu_f"],["reel","reel/Dd49MiMqNi_"],["reel","reel/Dd4aSYyKQY1"],
  ["reel","reel/Dd3fvyGSIZ-"],["reel","reel/Dd18_d5q-Dy"],["carrossel","p/Dd1BNANllNU"]];
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
