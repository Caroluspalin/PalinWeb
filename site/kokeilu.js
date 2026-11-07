// Esimerkkisivujen kokeilu portfolion korteissa.
// - Työpöytä (≥ 1024 px): puhelinkehyksen kuvakaappaus vaihtuu oikeaan sivuun (iframe),
//   kun kortti on lähellä näkymää. Iframe ladataan vain kerran.
// - Alle 1024 px: "Kokeile sivua" avaa sivun koko ruudun <dialog>-näkymään (Sulje-nappi tai Esc).
// Ilman JavaScriptiä kortissa on kuvakaappaus, ja "Kokeile sivua" on tavallinen linkki.
(() => {
  const tyopoyta = matchMedia("(min-width: 64rem)");

  // --- Työpöytä: iframe vasta, kun kortti on lähellä ---
  const puhelimet = [...document.querySelectorAll(".work-puhelin[data-sivu]")];
  const lataaSivu = (puhelin) => {
    if (puhelin.querySelector("iframe")) return;
    const f = document.createElement("iframe");
    f.src = puhelin.dataset.sivu;
    f.title = puhelin.dataset.otsikko || "Esimerkkisivu";
    f.addEventListener("load", () => f.classList.add("on-ladattu"), { once: true });
    puhelin.appendChild(f);
  };
  let tarkkailija = null;
  const kaynnista = () => {
    if (tarkkailija || !tyopoyta.matches || !puhelimet.length) return;
    if (!("IntersectionObserver" in window)) { puhelimet.forEach(lataaSivu); return; }
    tarkkailija = new IntersectionObserver((rivit) => {
      rivit.forEach((r) => {
        if (!r.isIntersecting) return;
        lataaSivu(r.target);
        tarkkailija.unobserve(r.target);
      });
    }, { rootMargin: "600px 0px" });
    puhelimet.forEach((p) => tarkkailija.observe(p));
  };
  kaynnista();
  tyopoyta.addEventListener("change", kaynnista);

  // --- Mobiili: kokeilu koko ruudulla ---
  const dialogi = document.querySelector("dialog.kokeilu");
  if (!dialogi || typeof dialogi.showModal !== "function") return;
  const otsikko = dialogi.querySelector(".kokeilu-otsikko");
  const uusi = dialogi.querySelector(".kokeilu-uusi");
  const sulje = dialogi.querySelector(".kokeilu-sulje");
  let avaaja = null;

  document.addEventListener("click", (e) => {
    const linkki = e.target.closest("a[data-kokeile]");
    if (!linkki || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    avaaja = linkki;
    const nimi = linkki.dataset.otsikko || "Esimerkkisivu";
    otsikko.textContent = nimi;
    uusi.href = linkki.getAttribute("href");
    const f = document.createElement("iframe");
    f.src = linkki.getAttribute("href");
    f.title = nimi + ", esimerkkisivu";
    dialogi.appendChild(f);
    document.documentElement.classList.add("on-kokeilu");
    dialogi.showModal();
    sulje.focus();
  });

  sulje.addEventListener("click", () => dialogi.close());
  // Esc sulkee dialogin natiivisti; close-tapahtuma siivoaa molemmissa tapauksissa
  dialogi.addEventListener("close", () => {
    dialogi.querySelectorAll("iframe").forEach((f) => f.remove());
    document.documentElement.classList.remove("on-kokeilu");
    if (avaaja) avaaja.focus();
  });
})();
