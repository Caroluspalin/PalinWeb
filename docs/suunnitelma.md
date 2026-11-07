# Palin Web: ilmeen uudistus, suunnitelma

Tila: **hyväksytty 7.11.2026**. Vaiheet 1–2 (perusta ja hero) tehty, hero odottaa suunnan hyväksyntää.
Pohjana ovat referenssien analyysi ([referenssit.md](referenssit.md)) ja projektin säännöt.
frontend-design-skilliä ei ollut käytettävissä (`/plugin` ei toimi tässä ympäristössä), joten suunnitelma on tehty samoilla periaatteilla ilman sitä.

**Tavoite:** kävijä ajattelee "wow" ensimmäisen 3 sekunnin aikana, ja sivu toimii silti 10 sekunnin mobiilisilmäilyssä. Nykyiset tiivistetyt tekstit ja rakenne säilyvät: Hero → Esimerkit → Miten se toimii → Hinta → UKK → Yhteystiedot.

---

## Päätökset (7.11.2026)

1. **Hero koboltinsinisenä koko leveydeltä:** hyväksytty.
2. **Otsikkofontti Archivo Expanded:** hyväksytty. Pisimmät sanat mahtuvat 320 px:iin ilman katkoa tai vaakavieritystä.
3. **Liike rajataan (frontend-design-skillin ehdotus):** heron avausjakso on sivun ainoa ajoitettu hetki, ja desktopilla on yksi scrub-efekti, esimerkkikorttien pinoutuminen. Käyttäjän toimintoihin vastaava liike säilyy (UKK, napin rullaava hover-teksti). **Pois jätetään:** korttien nousu, kuvien parallaksi, viivojen piirtyminen, 01–03-rullaus, hintojen matkamittari, sähköpostin nousu ja footerin scrub-sana. Kohdan 5 taulukko on näiltä osin kumottu.
4. **Pohja `#F1F2F5` (viileä harmaa)** kermanvärisen `#F4F3EF`:n tilalle, muste `#121316`.
5. **Heron yläotsake poistetaan.** Footerin pisteillä erotettu metarivi muutetaan riveiksi, sanat säilyvät.

---

## 1. Paletti

Brändin sininen säilyy, mutta sitä käytetään rohkeammin.

| Token | Arvo | Käyttö | Kontrasti |
|---|---|---|---|
| `--koboltti` | `#1F3FD1` | Hero ja yhteystieto-osio koko leveydeltä, painikkeet, linkit | Valkoinen teksti sen päällä 7,8:1 |
| `--paperi` | `#F1F2F5` | Muiden osioiden pohja | – |
| `--muste` | `#121316` | Teksti ja viivat | Paperia vasten noin 17:1 |
| `--harmaa` | `#56565A` | Toissijainen teksti | Paperia vasten 7,0:1 |

Periaate referensseistä: yksi neutraali pohja, yksi lähes musta ja **yksi** voimakas korostusväri.

## 2. Fontit

Avoin lisenssi (SIL OFL), tiedostot sivuston omalla palvelimella.

| Rooli | Fontti | Asetukset |
|---|---|---|
| Isot otsikot | **Archivo** (variable) | Levennetty: `wdth` 125, `wght` 800. Kirjainväli −0,04…−0,05 em, riviväli 0,9–1,0. |
| Leipäteksti, käyttöliittymä | **Schibsted Grotesk** (variable) | Kuten nyt |

Levennetty ja raskas otsikkofontti erottuu selvästi Interistä ja pyöreistä serifeistä, ja se toimii myös suomen pitkissä sanoissa. Fonttitiedostot rajataan latin-merkistöön, ja niistä otetaan vain tarvittavat akselit.

## 3. Tunnusmerkki: "Elävä näyteikkuna"

Herossa on iso puhelin, jonka ruudulla esimerkkisivut vierivät itsestään: **Pikkupaahtimo, sitten Kulmapää, sitten Kaislaranta.** Sivut vaihtuvat pystysuuntaisella pyyhkäisyllä.

- **Miksi juuri tämä:** kävijä näkee heti sen, mitä myyn, eli oikealta näyttävän sivun puhelimessa. Tunnusmerkki näyttää tuotteen eikä pelkkää koristetta.
- **Kuvat:** ruutukuvat ovat kokosivukaappauksia omista esimerkkisivuista (390 px leveä näkymä, 2× tarkkuus, WebP). Ne tehdään `tyokalut/kuvat.mjs`-skriptillä. Ensimmäinen kuva ladataan heti, kaksi muuta laiskasti.
- **Toteutus:** pelkkää transformia. Pitkä ruutukuva liikkuu `translateY`:llä puhelimen kehyksen sisällä, ja sivujen vaihto on paneelien `translateY`-pyyhkäisy. Toteutetaan CSS-animaationa, joten se toimii ilman JavaScriptiä.
- **Saavutettavuus:** jos `prefers-reduced-motion` on päällä, ruutu näyttää vain Pikkupaahtimon yläosan paikallaan. Puhelin on koriste (`aria-hidden`), ja esimerkkisivujen linkit ovat Esimerkit-osiossa.

## 4. Ensimmäiset 3 sekuntia

| Aika | Tapahtuma | Tekniikka |
|---|---|---|
| 0,0 s | Koboltinsininen hero on näkyvissä heti | CSS |
| 0,0–0,9 s | Otsikon rivit nousevat maskin takaa, 80 ms välein | CSS-avainkehykset: `translateY(105%)` → 0, `cubic-bezier(.16,1,.3,1)` |
| 0,4–1,5 s | Puhelin nousee alhaalta ja kääntyy kallistuksesta −4°:een | CSS: `translateY` ja `rotate` |
| 1,0 s | Faktat ja napit tulevat näkyviin. Puhelimen ruutu alkaa vieriä. | CSS: `opacity` ja `translateY` |
| noin 2,6 s | Ruutu pyyhkäisee vaalean kahvilan tilalle tumman parturin. Iso kontrastinvaihto syntyy ennen kolmen sekunnin rajaa. | CSS: `translateY` |

Herossa ei käytetä GSAP:ia. Otsikko piirtyy ilman JavaScriptiä, eikä LCP joudu odottamaan kirjastoja.

## 5. Tekniikat osioittain

| Osio | Mobiili (ensisijainen) | Desktop ≥ 1024 px |
|---|---|---|
| **Hero** | CSS-animaatiot (kohta 4) ja automaattisesti vierivä ruutu | Sama. Lisäksi vieritettäessä puhelin suoristuu ja pienenee (ScrollTrigger scrub, `rotate`/`scale`). |
| **Esimerkit** | Kortit nousevat näkyviin kerran (ScrollTrigger, `translateY` ja `opacity`). Kuvissa on kevyt parallaksi (`yPercent`, scrub). | Kortit pinoutuvat: `position: sticky`, ja edellinen kortti pienenee 1 → 0,92 ja himmenee (scrub). Ilman JavaScriptiä kortit ovat tavallisessa pinossa. |
| **Miten se toimii** | Viiva piirtyy (`scaleX` 0 → 1, origo vasemmalla), numero 01–03 rullaa (`translateY` maskin sisällä) ja teksti nousee. Käynnistyy kerran. | Sama |
| **Hinta** | Hintanumerot rullaavat kuin matkamittari: jokainen numero on oma sarakkeensa, joka liikkuu `translateY`:llä maskin sisällä. Käynnistyy kerran. Aloitustarjous nousee viimeisenä. | Sama |
| **UKK** | Natiivi `<details>`. Plus-merkki kääntyy (`rotate`), ja vastaus häivytetään sisään CSS-avainkehyksillä (`opacity` ja `translateY`). | Sama |
| **Yhteystiedot** | Koboltinsininen pohja kehystää sivun samoin kuin hero. Iso sähköpostiosoite nousee riveittäin. Napeissa ja linkeissä on rullaava hover-teksti (kaksi kopiota, `translateY`). | Lisäksi footerin iso `palinweb.fi`-sana nousee esiin vieritettäessä (scrub, `translateY`) |
| **Mobiilin alapalkki** | Säilyy ennallaan: näkyy, kun hero on vieritetty ohi | Ei näytetä |
| **Koko sivu** | Natiivi vieritys | Lenis-pehmeävieritys, vain hiirellä (`pointer: fine`) ja vain jos reduced-motion ei ole päällä. Synkronoidaan ScrollTriggerin kanssa. |

Yhteiset apufunktiot:
- **Rivijako:** oma pieni funktio korvaa SplitTextin. Se jakaa otsikot riveihin ja laskee jaon uudelleen, kun ikkunan koko muuttuu.
- **Rivien nousu:** `y` 105 % → 0, `power4.out`, 0,9–1,1 s, rivien väli 0,08 s. Blur-suodatinta ei käytetä.

## 6. Kirjastot ja versiot

Kaikki kirjastot ovat paikallisesti kansiossa `site/vendor/`, ja versiot on lukittu. CDN-kirjastoja ei käytetä.

| Kirjasto | Versio | Huomio |
|---|---|---|
| GSAP (core) | **3.15.0** | Julkaistu 13.4.2026. Uusin on 3.15.1 (4.11.2026), mutta se on vasta 2 päivää vanha. |
| ScrollTrigger | **3.15.0** | Sama paketti kuin core |
| Lenis | **1.3.26** | Julkaistu 5.8.2026 |

- Kaikki ladataan `defer`-attribuutilla. Yhteensä noin 50 kt gzipattuna.
- SplitTextiä ei käytetä, vaan rivijako on oma funktio.
- GSAP:n lisenssi sallii ilmaisen käytön. Lisenssitiedostot kopioidaan `site/vendor/`-kansioon.
- CSP pysyy ennallaan (`script-src 'self'`), koska kirjastot ovat sivuston omia tiedostoja. GSAP ja Lenis asettavat tyylit CSSOM:n kautta, mikä toimii `style-src 'self'`-säännön kanssa.

## 7. Laatuvaatimukset

| Vaatimus | Toteutus | Tarkistus |
|---|---|---|
| Mobiili ensin | Tyylit kirjoitetaan ensin 320–414 px leveyksille, ja desktopin lisäykset tulevat `min-width`-mediakyselyihin | Kuvakaappaukset 390 px ja 1440 px |
| Lighthouse mobiili ≥ 90, LCP < 2,5 s | LCP-elementti on hero-otsikon teksti. Fontit esiladataan, kirjastot ladataan `defer`-attribuutilla ja vain ensimmäinen ruutukuva ladataan heti. | Lighthouse (mobiili) jokaisen osion jälkeen |
| Toimii ilman JavaScriptiä | Kaikki sisältö näkyy. GSAP-animaatioiden alkutilat ovat vain `html.js`-luokan alla, ja luokan asettaa pieni ulkoinen skripti. Herossa käytetään pelkkiä CSS-animaatioita. | Playwright JavaScript pois päältä |
| `prefers-reduced-motion` poistaa animaatiot | CSS-animaatiot poistetaan, GSAP-ajastuksia ei luoda eikä Lenistä käynnistetä | Playwright `reducedMotion: "reduce"` |
| Vain transform ja opacity animoituna | Ei clip-path-, mask-, blur-, width- tai height-animaatioita | Koodikatselmointi ja Performance-paneeli |
| Ei vaakavieritystä 320–1440 px | – | `npm run tarkista` |
| Saavutettavuus WCAG AA | Kontrastit (kohta 1), näkyvä kohdistuskehys, koristeelliset elementit `aria-hidden`, rivijaon jälkeen otsikon teksti säilyy ruudunlukijalle (`aria-label`) | Kontrastilaskenta, axe-tarkistus |
| Ei referenssien kopiointia | Tekniikat toteutetaan itse. Koodia, CSS:ää, kuvia tai fontteja ei kopioida. | – |
| Tekstit ja rakenne säilyvät | Tekstisisältöön ei kosketa | Sanamäärä ennen ja jälkeen (nyt 275) |

## 8. Rakennusjärjestys

Jokaisen vaiheen jälkeen otan kuvakaappaukset (390 ja 1440 px) ja lyhyen videon. Vertaan tulosta referensseihin ja arvioin rehellisesti, onko se premium vai geneerinen. Korjaan ongelmat ennen seuraavaa vaihetta.

1. **Perusta:** tokenit, fontit (Archivo ja Schibsted Grotesk), vendor-kirjastot, `html.js`-skripti, rivijako- ja nousufunktiot, reduced-motion-käsittely
2. **Hero ja "Elävä näyteikkuna":** ruutukuvien kaappaus, puhelimen kehys, 3 sekunnin aikajana, desktopin scrub
3. **Esimerkit:** korttien pinoutuminen desktopilla ja parallaksi
4. **Miten se toimii:** viivat, numerot ja tekstin nousu
5. **Hinta:** matkamittarinumerot ja aloitustarjous
6. **UKK:** plus-merkki ja vastauksen häivytys
7. **Yhteystiedot ja footer:** koboltinsininen osio, rullaava hover-teksti, footerin iso sana ja Lenis
8. **Viimeistely:**
   - koko sivun vieritysvideo
   - Lighthouse-raportti
   - vaakavieritys- ja reduced-motion-testit
   - "Design system" -osio tiedostoon `CLAUDE.md`
