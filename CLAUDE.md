# Palin Web

Staattinen portfoliosivu (`site/`), julkaisu Cloudflare Pagesiin (ks. JULKAISU.md). Ei build-vaihetta.
Tarkistukset: `cd tyokalut && npm run tarkista` (vaakavieritys 320–1440 px), kuvat: `npm run kuvat`.

## Design system

**Paletti** (tokenit `site/styles.css` `:root`): yksi neutraali pohja, yksi musta, yksi korostus.

| Token | Arvo | Käyttö |
|---|---|---|
| `--koboltti` | `#1F3FD1` | Hero, yhteystiedot ja footer koko leveydeltä, painikkeet, linkit. Valkoinen päällä 7,8:1 |
| `--koboltti-teksti` | `#DCE2FA` | Toissijainen teksti koboltin päällä (6,0:1) |
| `--koboltti-viiva` | `#5068DC` | Ohuet viivat koboltin päällä |
| `--paperi` | `#F1F2F5` | Muiden osioiden pohja. Ei kermaa. |
| `--muste` | `#121316` | Teksti ja viivat |
| `--harmaa` | `#56565A` | Toissijainen teksti paperilla (6,5:1) |

Esimerkkikortit käyttävät kunkin esimerkkiyrityksen omia värejä (`.work-halkola`, `.work-hongisto`), eivät Palin Webin paletin värejä.

**Typografia**
- Otsikot: Archivo, `font-stretch: 125%`, paino 800, kirjainväli −0,045 em, riviväli 0,94–0,95. Fontti on rajattu leveyksiin 100–125 % ja painoihin 600–900.
- Leipäteksti ja käyttöliittymä: Schibsted Grotesk.
- Pitkät suomen sanat eivät saa katketa: otsikoissa on `overflow-wrap: normal`, ja koot mitoitetaan niin, että pisin sana mahtuu 320 px:iin. Tarkista uudet otsikot 320 px:n leveydellä.
- Ei versaalinimilappuja, ei pisteillä eroteltuja metarivejä, ei `→`-nuolia linkkien perässä.

**Liike**
- Sivulla on yksi ajoitettu hetki: heron avausjakso (pelkkä CSS, toimii ilman JavaScriptiä). Muut osiot eivät liu'u sisään.
- Työpöydällä (≥ 1024 px) on kaksi scrub-efektiä: puhelin suoristuu heron ohi vieritettäessä, ja esimerkkikortit pinoutuvat. Mukana on myös Lenis, jos käytössä on hiiri. `liike.js` lataa kirjastot vain näissä tapauksissa.
- Käyttäjän toimintoihin vastaava liike on sallittua: UKK:n plus-merkki ja vastauksen häivytys sekä painikkeiden rullaava hover-teksti (`.rulla`, tekstivarjo-kopio).
- Animoidaan vain `transform`- ja `opacity`-ominaisuuksia. Ei blur-, clip-path- tai mask-animaatioita.
- `prefers-reduced-motion: reduce` poistaa kaiken liikkeen, eikä kirjastoja silloin ladata.
- CSP on `style-src 'self'`, joten HTML:ssä ei saa olla `style`-attribuutteja. Porrastus tehdään `nth-child`-valitsimilla.

**Heron puhelin**: ruutukuvat `kuvat/esimerkit/ruutu-*.webp` tehdään komennolla `node tyokalut/kuvat.mjs --vain-ruudut`. Kuvat ovat 2,5 näkymän korkuisia, ja ajoitukset (kierros 7,5 s: Halkola, Hongisto, takaisin Halkolaan) ovat `@keyframes rata`, `ruutu-1` ja `ruutu-2` -avainkehyksissä. Ne olettavat juuri tämän korkeuden. Ruutukuvan päällä on animoitu WebP `anim-*.webp` (demon hero ennen → jälkeen, 585×1266, alle 300 kt), jonka tekee `npm run animaatiot`. Ilman liikettä (`prefers-reduced-motion`) näkyy vain ruutukuvan jälkeen-tila.

## Esimerkkisivut

Kaksi esimerkkisivua (`site/esimerkit/`): **Halkolan Märkätilat** (kylpyhuone- ja saunaremontit) ja **Hongiston Lämpö** (lämpöpumput, öljystä luopuminen). Ne ovat esimerkkejä eivätkä asiakastöitä, joten korteissa ja teksteissä ei saa antaa ymmärtää, että yritykset ovat oikeita asiakkaita. Ne korvasivat 18.11.2026 vanhat esimerkit (Pikkupaahtimo, Kaislaranta, Kulmapää). Lead-Generator (`agency-hunter`) ei lue näitä sivuja. Sen demopohjat ovat omia kopioita kansiossa `backend/app/templates/demo/`.

**Säilyvät**
- Kuvitteellinen yritys: keksityt tiedot (`.example`-osoitteet, "Numeronne tähän"), `noindex, nofollow`, demopalkki ("Esimerkkisivu. … kuvitteellinen yritys"), keltaiset laput (`.note`) ja footerin rivi "Kuvat: tekoälyllä tehty kuvitus."
- Demoja ei lisätä `sitemap.xml`:ään.
- Hero on `canvas`, joka toistaa 121 framea (`assets/f/` työpöytä, `assets/m/` mobiili ≤ 760 px) kerran latautuessa. Sen jälkeen näkyy "Katso uudelleen" -painike (`.replay.on`). `prefers-reduced-motion` näyttää valmiin kuvan.
- Jokaisella sivulla on oma `style.css`, `app.js` ja fontit sivun omassa kansiossa. Fontit ovat SIL OFL -lisenssillä (latin ja latin-ext), ja ne on kirjattu CREDITS.md:hen. `/esimerkit/*.woff2` on välimuistissa `immutable`, joten muuttunut fontti saa uuden tiedostonimen.
- CSP: ei inline-`<style>`- eikä `<script>`-elementtejä, ei `style`-attribuutteja HTML:ssä (JS:n asettamat tyylit ovat sallittuja) eikä Google Fonts -linkkejä. CSS- ja JS-viittauksissa on `?v=`. Päivitä se, kun tiedosto muuttuu.
- Portfolion kuvat tehdään komennolla `npm run kuvat`. Skripti odottaa, että hero on toistettu loppuun (`.replay.on`), ja piilottaa `.mbar`-palkin.

| | Halkolan Märkätilat | Hongiston Lämpö |
|---|---|---|
| Paletti | slate `#1F2B2A`, membrane `#157A74`, tile `#F6F7F5` | graphite `#1C2226`, copper `#B0602A`, frost `#F1F3F2` |
| Fontit | Archivo (leveys 62–125 %) | Barlow + Barlow Condensed |
| Erikoisuus | Ennen/jälkeen-liukusäädin, kotitalousvähennyslaskuri | Ennen/jälkeen-liukusäädin, laskuri korotetulla öljystä luopumisen vähennyksellä |
