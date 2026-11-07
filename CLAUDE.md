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

## Esimerkkipohjat

Kolme esimerkkisivua (`site/esimerkit/`) ovat myös Lead-Generatorin demopohjia. Tunnusmerkin pitää toimia minkä tahansa saman alan yrityksen nimellä ja kuvilla. Testaa muutokset lyhyellä ja pitkällä keksityllä nimellä. Suunnitelma ja perustelut: `docs/suunnitelma-esimerkit.md`.

**Yhteistä**
- Keksityt tiedot (040/050 000 0000, Esimerkkikatu, `.example`), `noindex` ja footerin rivi "Kuvitteellinen yritys, esimerkkisivu" säilyvät.
- Fontit ovat SIL OFL -lisenssillä, rajattu latin-merkistöön, hostattu sivun omassa kansiossa ja kirjattu CREDITS.md:hen. `/esimerkit/*.woff2` on välimuistissa `immutable`, joten muuttunut fontti saa uuden tiedostonimen.
- `aukiolo.js` on kaikilla sivuilla sama tiedosto. Se lukee ajat elementistä `#aukiolo` (`data-ma` … `data-su`) ja täyttää kentät `[data-tila]` (lyhyt tila), `[data-tanaan]` (pitkä tila) ja `[data-paiva="1–7"]` (tämän päivän rivi). Testihetken voi asettaa osoitteella `?aika=2026-11-10T12:00`. Ilman JavaScriptiä näkyy HTML:n kiinteä aikataulu.
- Heron alla on Tänään-rivi (tila, osoite, puhelin). Sivulla on yksi CSS-avausjakso, ja liike käyttää vain `transform`- ja `opacity`-ominaisuuksia.
- CSS- ja JS-viittauksissa on `?v=`. Päivitä se, kun tiedosto muuttuu.
- Mobiilin kiinteä palkki (Kaislaranta, Kulmapää) on pelkkää CSS:ää. `.palkki` on `position: sticky; bottom: 0` ja `.jatko`-kääreen viimeinen lapsi, joten se tulee näkyviin vasta, kun kääre alkaa.
- Kuvat ovat WebP 640/1280 ja JPG 960 (LCP-kuvasta myös WebP 960). Portfolion kuvat tehdään komennolla `npm run kuvat`. Skripti odottaa avausjakson loppuun, asettaa kellonajan tiistaille klo 12 ja piilottaa `.palkki`-elementin.

| | Pikkupaahtimo (kahvila) | Kaislaranta (kampaamo) | Kulmapää (parturi) |
|---|---|---|---|
| Tunnusmerkki | **Paahtoaste**: osiot tummuvat sävyistä 1–4 (`.savy-1…4`, kullakin oma AA-tekstiväri). Herossa on iso pyöreä kuva ruudun reunan yli. | **Kaislikko**: hero-kuva näkyy seitsemän kapean ikkunan läpi. Ikkunoiden yläreunat ovat eri korkeuksilla (`--a`), mutta kuva on yhtenäinen (`--i` siirtää kuvaa). | **Kulmakyltti**: nimi kahdella mustalla seinällä, jotka kohtaavat keltaisessa kulmassa. Koko lasketaan `data-vaaka`- ja `data-pysty`-merkkimääristä (2–16) `cqw`-yksiköillä. |
| Liike | Pyöreä kuva kääntyy −140° → 0 (2,6 s), teksti nousee | Suikaleet nousevat aaltona (eri viive ja kesto), sitten teksti | Vaakasana liukuu vasemmalta ja pystysana ylhäältä, kulma syttyy (`scale`) 1,2 s kohdalla |
| Paletti | `#E3E4CF` → `#D2B98E` → `#7A4627` → `#2A1A12`, korostus `#B3202C` | usva `#E8EBE6`, järvi `#1D3A41`, kaisla `#C4AC72`, muste `#162024` | liitu `#F2F1EC`, betoni `#CFCCC4`, musta `#0A0A0A`, kyltti `#F4C21B` |
| Fontit | Young Serif + Familjen Grotesk | Bodoni Moda + Albert Sans | Antonio 700 (versaali) + Public Sans |
| Yleistyy | Toimii myös kahvilalle, joka ei paahda itse: vaihda Pavut-osion teksti (esim. lahjakortti). | Suikaleet syntyvät mistä tahansa kuvasta, ja selain lataa kuvan vain kerran. | Jaa nimi sanan kohdalta tai yhdyssanan liitoksesta. Jos nimessä on enintään 5 merkkiä tai jakokohtaa ei ole, koko nimi menee vaakaan ja "Parturi" pystyyn. Nimi näkyy myös yläpalkissa tavallisena tekstinä. |
