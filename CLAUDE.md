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

Esimerkkikortit käyttävät kunkin esimerkkiyrityksen omia värejä (`.work-kulmapaa` jne.), eivät Palin Webin paletin värejä.

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

**Heron puhelin**: ruutukuvat `kuvat/esimerkit/ruutu-*.webp` tehdään komennolla `node tyokalut/kuvat.mjs --vain-ruudut`. Kuvat ovat 2,5 näkymän korkuisia, ja ajoitukset ovat `@keyframes rata` ja `ruutu-1…3` -avainkehyksissä. Ne olettavat juuri tämän korkeuden.
