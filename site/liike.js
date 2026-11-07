// Liike, joka tarvitsee JavaScriptiä. Heron avausjakso on puhdasta CSS:ää (styles.css).
// Kirjastot ladataan vain työpöydällä (≥ 1024 px) ja vain, jos käyttäjä ei ole rajoittanut liikettä.
// Mobiili ei lataa yhtään kirjastoa.
(() => {
  const vahennetty = matchMedia("(prefers-reduced-motion: reduce)");
  const tyopoyta = matchMedia("(min-width: 64rem)");
  const hiiri = matchMedia("(pointer: fine)");
  if (vahennetty.matches || !tyopoyta.matches) return;

  const lataa = (src) => new Promise((ok, virhe) => {
    const s = document.createElement("script");
    s.src = src; s.onload = ok; s.onerror = virhe;
    document.head.appendChild(s);
  });

  const kirjastot = [lataa("/vendor/gsap-3.15.0.min.js").then(() => lataa("/vendor/ScrollTrigger-3.15.0.min.js"))];
  if (hiiri.matches) kirjastot.push(lataa("/vendor/lenis-1.3.26.min.js"));

  Promise.all(kirjastot)
    .then(() => {
      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);

      // Pehmeä vieritys hiirelle, synkronoitu ScrollTriggerin kanssa
      if (window.Lenis) {
        const lenis = new window.Lenis({ anchors: { offset: -72 } });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      // Hero: puhelin suoristuu ja pienenee, kun heroa vieritetään ohi
      gsap.to(".phone-scrub", {
        rotate: 4, scale: 0.86, yPercent: 6, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });

      // Esimerkit: kun seuraava kortti liukuu päälle, edellinen pienenee ja himmenee
      const kortit = gsap.utils.toArray(".work");
      kortit.slice(0, -1).forEach((kortti, i) => {
        const seuraava = kortit[i + 1];
        gsap.timeline({
          scrollTrigger: {
            trigger: seuraava,
            start: "top bottom",
            end: () => `top ${parseFloat(getComputedStyle(seuraava).top) + 1}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
          .to(kortti, { scale: 0.92, ease: "none" }, 0)
          .to(kortti.querySelector(".work-himmennys"), { opacity: 0.55, ease: "none" }, 0);
      });
    })
    .catch(() => { /* Ilman kirjastoja sivu toimii ilman scrub-efektejä ja natiivilla vierityksellä */ });
})();
