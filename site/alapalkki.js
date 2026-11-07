// Mobiilin alapalkki: näytetään vasta, kun hero on vieritetty ohi.
// CSS piilottaa palkin @media (scripting: enabled) -kyselyllä; ilman JavaScriptiä palkki näkyy mobiilissa koko ajan.
// Ladataan defer-attribuutilla, joten DOM on valmis.
document.documentElement.classList.add("js");
(() => {
  const hero = document.getElementById("hero");
  const bar = document.querySelector(".mobile-bar");
  if (!hero || !bar || !("IntersectionObserver" in window)) { bar && bar.classList.add("is-visible"); return; }
  new IntersectionObserver(([e]) => bar.classList.toggle("is-visible", !e.isIntersecting)).observe(hero);
})();
