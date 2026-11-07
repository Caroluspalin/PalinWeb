# Referenssit: tekninen analyysi

Tutkittu 7.11.2026. Selaimena oli Playwright koneen Chromella, leveyksillä 1440×900 ja 390×844. Jokainen sivu ladattiin, intron annettiin pyöriä, ja sivu vieritettiin hitaasti läpi 34 jaksossa (6 × 70 px, sen jälkeen 1,1 s tauko). Raaka-aineisto, joka ei ole gitissä:

```
docs/referenssit/<sivu>/<1440|390>/
  scroll-<leveys>.webm   vierityksen video
  00-latautuu.png, 00-intro.png, 01–17.png   kuvakaappaukset
  data.json              skriptit, fontit, kirjastotunnisteet, GSAP-tweenit, mittaukset, liikeloki
```

**Mittaustapa ja sen rajat**
- **Kirjastot:** ladattujen skriptien sisältö on haettu tunnistemerkkijonoilla, esim. `ScrollTrigger` ja `lenis`. Versionumerot ovat skripteistä löytyneitä merkkijonoja. Bundlatuissa sivuissa samassa tiedostossa voi olla useita numeroita.
- **Tarkat tween-tiedot:** kestot, easingit ja ScrollTrigger-asetukset saatiin luettua vain **Tegrasta**. Se on ainoa sivu, joka julkaisee GSAP:n `window`-olioon. Muut kolme bundlaavat GSAP:n moduulina, joten niiden tweenejä ei voi lukea suoraan.
- **Liikeloki:** muiden sivujen liike on mitattu tarkkailemalla, miten elementtien `style`-attribuutti muuttuu. Jokaisesta elementistä on kirjattu muuttuvat ominaisuudet ja niiden vaihteluväli sekä kesto.
  - "Aika": animaatio käynnistyy kerran ja kulkee omaa tahtiaan.
  - "Scrub": animaatio etenee vain silloin, kun sivua vieritetään.
  - Easing on arvioitu siitä, kuinka pitkällä animaatio on 25, 50 ja 75 %:n kohdalla kestosta. Esimerkiksi 0,81 / 0,96 / 1,00 tarkoittaa voimakasta loppuun hidastuvaa käyrää, joka vastaa suunnilleen `expo.out`- tai `power4.out`-käyrää.
- **Fontit:** kaikkien neljän sivun fontit on joko lisensoitu kaupallisesti tai ne kuuluvat sivuston brändiin. **Niitä ei käytetä**, vaan ne on kirjattu vain mittasuhteiden vertailua varten.

---

## Yhteenveto

| | Tegra | 'kin | Minh Pham | Iventions |
|---|---|---|---|---|
| Alusta | Webflow + jQuery | Next.js | Oma bundle (webpack) | Next.js |
| GSAP | 3.12.2 (CDN) | 3.12.5 | 3.11 | 3.11 |
| ScrollTrigger | ✓ | ✓ | ✓ | ✓ |
| Tekstin pilkkominen | SplitType 0.3.4 | oma (word + clone) | oma (`.char`, `.line--mask-element`) | GSAP SplitText |
| Pehmeä vieritys | – (natiivi) | Lenis 1.0.42 | Lenis 0.2.28 | Lenis 1.3.7 |
| WebGL | – | – | Three.js (3D-objektit) | Three.js (pistepallo) |
| Muuta | Lottie, Clarity | Swiper | ääni, oma kursori | Cookiebot |
| Etusivun korkeus 1440 px | 4 987 px | 900 px (ei vieritystä) | 9 777 px | 14 895 px |

**Yhteiset piirteet**
- Kaikilla neljällä on GSAP ja ScrollTrigger, ja kolmella on Lenis.
- Kaikkien tärkein tekstiefekti on rivien tai merkkien nousu maskin takaa. Kesto on 0,8–1,5 s, käyrä hidastuu voimakkaasti loppua kohti, ja rivien välinen viive on 0,05–0,1 s.
- Paletit ovat niukkoja: yksi neutraali pohja, yksi musta tai lähes musta ja **yksi** voimakas korostusväri. Iventionsilla on kaksi korostusväriä.
- Otsikot ovat isoja ja tiiviitä: kirjainväli −0,02…−0,05 em ja riviväli 0,84–1,15.
- Leipäteksti on pientä, 12–16 px.

---

## 1. Tegra (tegra.nyc)

Rakennusalan urakoitsija, New York. Selkein ja "kaupallisin" neljästä.

**Tekniikka:** Webflow ja jQuery 3.5/3.6. GSAP 3.12.2 ja ScrollTrigger tulevat cdnjs:stä, ja ne ladataan sivulle kahdesti. SplitType 0.3.4 tulee unpkg:stä. Lisäksi on Lottie ja Microsoft Clarity. Lenistä ei ole, vaan vieritys on natiivi.

**Fontit**
- Otsikot: Geist (variable), paino 600.
- Leipäteksti ja käyttöliittymä: IBM Plex Sans 400/600/700.
- Fonttitiedostot ovat TTF-muodossa Webflow'n CDN:ssä.

**Paletti**
| Rooli | Arvo |
|---|---|
| Pohja | `#FFFFFF` |
| Teksti | `#1F1F1F` |
| Korostus (oranssinpunainen) | `#E43E1E` |
| Korostus, vaalea | `#FF7256` |
| Tumma osio | `#1F1F1F` / `#333333` |
| Viivat | `#D1D1D1` |

**Typografia**
| | 1440 px | 390 px |
|---|---|---|
| H1/H2 | 46 px / riviväli 1,0 / −0,05 em / 600 | 38 px / 1,1 / −0,05 em |
| Leipä | 16 px / 1,4 / −0,011 em | sama |
| Navigaatio | 12 px, VERSAALI, +0,057 em, 600, korostusvärillä | |
| Painike | 16 px, VERSAALI, +0,037 em, valkoinen korostusvärin päällä, kulmat suorat | |

Suurin mittasuhde on footerin logo: TEGRA-sana täyttää koko sisältöleveyden, noin 120 px korkeana.

**Välistykset**
- Sisältö on enintään 1 310 px leveä.
- Pienissä osioissa on 51 px pystytilaa, isoissa 80 px.
- Herossa on kaksi saraketta: kapea tekstisarake (noin 310 px) ja leveä kuva.

**Animaatiot** (luettu GSAP:sta suoraan)
| # | Mikä liikkuu | Mihin sidottu | Kesto / easing | Toteutus |
|---|---|---|---|---|
| T1 | Otsikoiden ja kappaleiden rivit (`span.line`, SplitType) nousevat ja kirkastuvat. | ScrollTrigger: `start: "top 85%"`, `toggleActions: "play none none reverse"`. Animaatio peruuntuu, kun elementti vieritetään takaisin näkymän alapuolelle. | 0,8–1,5 s, `power4.out`, rivien väli 0,1 s | `y`, `opacity` ja `filter` (blur) |
| T2 | Ison kappaleen sanat "täyttyvät": harmaa teksti muuttuu riveittäin valkoiseksi oranssin pohjan päällä. | ScrollTrigger scrub: `scrub: 1`, `start: "top 95%"`, `end: "bottom 30%"` | Aikajanalla 8 riviä, kukin kestää 1 yksikön, viive 1, `ease: "none"`. Kokonaispituus riippuu vierityksestä. | `mask-position`-gradientti `.line-overlay`-elementissä. **Ei transform/opacity.** |
| T3 | Palvelulista (Framing, Fire Stopping…): aktiivinen rivi vaihtuu oranssiksi, ja oikealla kuva vaihtuu ristiinhäivytyksellä. | Vieritys tai hover. Kuvan opacity muuttuu "aika"-tyyppisesti. | Kuvan häivytys noin 0,9–1,0 s | `opacity` |
| T4 | Projektikuvat vaakasuuntaisena nauhana. | Natiivi vaakavieritys tai drag | – | – |
| T5 | Footerin jättilogo. | Staattinen | – | – |

**Arvio:** tekniikka on yksinkertaista mutta toimii. Vaikutelma tulee kontrastista (valkoinen, musta ja yksi oranssi), suorista kulmista ja kurinalaisesta typografiasta. Ylimitoitettu logo on sivun tunnusmerkki. Heikkous: otsikot ovat vain 46 px, mikä on varovaista. Rivien sumennus (`filter: blur`) kuormittaa mobiilia.

---

## 2. 'kin (by-kin.com)

Sisustus- ja brändistudio, Lontoo.

**Tekniikka:** Next.js (app router). GSAP 3.12.5 ja ScrollTrigger, Lenis 1.0.42 sekä Swiper. Etusivulla ei voi vierittää, sillä se on yhden näkymän korkuinen (900 px). Kaikki liike syntyy introsta, sivunsiirroista ja hover-tiloista.

**Fontit:** Apercu Pro 400/500 ja Apercu Mono Pro (kaupallisia, Colophon). Lisäksi on kaksi Next.js:n optimoimaa woff2-fonttia.

**Paletti**
| Rooli | Arvo |
|---|---|
| Pohja (lämmin paperi) | `#F4F2ED` |
| Teksti | `#111214` |
| Korostus (koralli), logo | `#FF6542` |
| Toissijainen (oliivi) | `#4F4A3B` |

**Typografia**
| | 1440 px | 390 px |
|---|---|---|
| Logo | Noin 140 px, korallinvärinen, ruudun yläreunassa | |
| H1 (intron päällä) | 49,5 px / riviväli 1,15 / 500 | 46 px / 1,15 |
| Leipäteksti | 12 px / 1,1 | |
| Nimilaput | Apercu Mono 9 px, VERSAALI | |

Sivu perustuu kontrastiin: isoon logoon ja hyvin pieneen tekstiin.

**Välistykset:** asettelussa ei ole leveysrajaa, vaan elementit on sijoitettu absoluuttisesti näkymän reunoille. Ilmavuus syntyy tyhjistä alueista eikä marginaaleista.

**Animaatiot** (liikeloki)
| # | Mikä liikkuu | Mihin sidottu | Kesto / easing | Toteutus |
|---|---|---|---|---|
| K1 | Intro: koko ruudun valokuva paljastuu leikkauksella. | Lataus, ajastettu | 1,58 s | `clip-path: inset()`. **Ei transform/opacity.** |
| K2 | Intro-kuva skaalautuu hitaasti 1,11 → 1,00 ja tekstikerros nousee 24 → 0 px. | Lataus, ajastettu | Noin 1,3–1,9 s | `scale`, `translateY`, `opacity` |
| K3 | "Loading"-teksti ohuen viivan keskellä, ja kolme pistettä vilkkuu. | CSS-animaatio | 0,5 s, `linear`, toistuu | `opacity` |
| K4 | Sivunsiirto: koko näkymän kerros liukuu 0 → 180 px alas ja paljastaa uuden sivun. | Lataus tai linkki | 1,04 s, voimakas ease-out | `translateY` |
| K5 | Rullaava teksti: sanasta on kaksi kopiota (`.word` ja `.word__clone`), ja hover nostaa alkuperäisen ylös ja kopion tilalle. | Hover, intro | Noin 1,2 s | `translateY` |
| K6 | Valikon linkit ilmestyvät porrastetusti. | Lataus | 0,64 s, käyrä 0,07 / 0,60 / 0,97 eli `power2.inOut`-tyyppinen | `opacity`, `translate` |
| K7 | "Puhelin tärisee" -vihje mobiilissa. | CSS-animaatio | 3 s, toistuu | `transform` |

**Arvio:** vaikutelma syntyy brändistä, kuvituksesta ja mittasuhteista, ei tekniikasta. Opittavaa on, että yksi rohkea elementti (jättilogo) ja hiljainen ympäristö riittävät. Rullaava hover-teksti on hienovarainen ja helppo toteuttaa itse transformilla.

---

## 3. Minh Pham (minhpham.design)

Suunnittelijan portfolio. Neljästä teknisesti raskain ja teatraalisin.

**Tekniikka:** oma webpack-bundle (tunnisteena "DevHonTran@2023"). Mukana ovat GSAP 3.11, ScrollTrigger, Lenis 0.2.28 (`html.lenis-stopped` intron ajan) ja Three.js, joka piirtää 3D-objektit 1 640×1 100 px kankaalle. Lisäksi sivulla on ääni ("SOUND ON") ja oma kursori (`no-system-cursor`). Sivulle pääsee **vasta START-napin painamisen jälkeen**, eli sisältö on kokonaan lukittu latausnäkymän taakse.

**Fontit:** "Avant Garde" 600/700 (ITC Avant Garde Gothic, kaupallinen) ja Nunito Sans 200–1000 Google Fontsista.

**Paletti**
| Rooli | Arvo |
|---|---|
| Pohja | `#0D0D0D` |
| Teksti (lämmin harmaa) | `#B7AB98` |
| Korostus (punaoranssi) | `#EB5939` |
| Himmennetty teksti | `rgba(184,172,153,.5)` |
| Viivat | `#4D4D4D` |

**Typografia**
| | 1440 px | 390 px |
|---|---|---|
| H1/H2 | 116,7 px / riviväli 0,84 / −0,05 em / 700 / VERSAALI | 76,4 px / 0,84 / −0,05 em |
| Nimilaput | 11,7 px / 700 / +0,5 em / VERSAALI | |
| Leipäteksti | Noin 13 px | |

Otsikot ovat neljästä suurimmat ja tiiveimmät (riviväli alle 1), ja ne on keskitetty.

**Välistykset:** osiot ovat ruudun korkuisia "näyttämöitä", ja sisältö on keskitetty kapeaksi sarakkeeksi. Vasemmassa reunassa on kiinteä kuvakepalkki ja oikeassa navigaatio. Kerroksia on kaksi koko sivun kokoista (`.layer__dark` ja `.layer__red`).

**Animaatiot** (liikeloki)
| # | Mikä liikkuu | Mihin sidottu | Kesto / easing | Toteutus |
|---|---|---|---|---|
| M1 | Latausrengas piirtyy, prosentit juoksevat, ja START-nappi nousee näkyviin. | Lataus | Napin opacity 0,6 s, käyrä 0,81 / 0,96 / 1,0 eli noin `expo.out` | SVG-viiva ja `opacity` |
| M2 | Latausnäkymä katoaa START-napin painalluksesta. | Klikkaus | Rengas ja teksti 0,57 s, `expo.out`. Koko kerros 0,17 s. | `opacity` |
| M3 | Hero-taustakuva tarkentuu: skaala 1,36 → 1,0 ja opacity 0 → 1, kolmessa kerroksessa porrastetusti. | START-klikkauksen jälkeen | 0,4–0,67 s per kerros, ease-out | `scale`, `opacity` |
| M4 | Hero-otsikon merkit (`div.char`) lentävät paikoilleen. | START-klikkauksen jälkeen, ajastettu | Noin 1,3–1,6 s rivin merkit yhteensä, porrastettuina | `transform` (translate/rotate) |
| M5 | **Tunnusmerkki:** punainen ympyrä. Sivulla on kaksi identtistä kerrosta, tumma ja punainen. Punainen kerros näkyy vain ympyrän muotoisen leikkauksen läpi, joten ympyrän kohdalla teksti näkyy käänteisvärein, ja siinä on jopa eri sanoja ("GOOD" / "BAD"). | Kursori ja vieritys | Seuraa kursoria jatkuvasti | Kahdennettu DOM ja leikkausmaski |
| M6 | Osioiden rivit nousevat maskin takaa (`.line--mask-element`). | Herossa ajastettu (0,65 s), alempana scrub | 0,65–0,8 s | `translateY` |
| M7 | Kirjoituskursori vilkkuu tekstien perässä (`.vj-cursor`). | Scrub, eli vain vieritettäessä | Noin 0,9–1,3 s | `opacity` |
| M8 | Asiakaslista (FORD, UFC, LINCOLN…): aktiivinen rivi saa punaisen palkin taustalle, ja Three.js-maapallo pyörii taustalla. | Vieritys | – | DOM ja WebGL |
| M9 | Suosittelijoiden pikkukuvat liukuvat. | Ajastettu karuselli | – | `transform` |
| M10 | Lopun motto ("GOOD DESIGN IS HONEST") rakentuu merkki kerrallaan. | **Scrub** | Noin 1,1–1,65 s vierityksen aikana | `transform` |

**Arvio:** näyttävä ja tunnistettava. Siitä kannattaa ottaa käänteisväriperiaate (M5) ja merkkien rakentuminen vierityksen mukaan (M10). Pienyrityksen sivulle sivu on kuitenkin väärä esimerkki: sisältö on lukittu START-napin taakse, sivulla on ääntä, ja se on raskas mobiilissa. Yhtäkään tällaista ratkaisua ei kannata ottaa käyttöön.

---

## 4. Iventions (iventions.com)

Kansainvälinen tapahtumatoimisto. Laajin ja rikkain liikkeen määrä.

**Tekniikka:** Next.js. GSAP 3.11, ScrollTrigger ja **SplitText** (maksullinen versioissa ennen 3.13), Lenis 1.3.7 (`html.lenis`), Three.js (pistepallokartta) ja Cookiebot.

**Fontit:** Söhne 300/400 (Klim, kaupallinen) ja ABC Arizona Mix 300 (Dinamo, kaupallinen). Sivulla yhdistyvät groteski ja serifi.

**Paletti**
| Rooli | Arvo |
|---|---|
| Pohja (lämmin harmaa) | `#F3EFEB` / `#F3EFE9` |
| Teksti | `#1E1E1E` |
| Korostus 1 (laventeli) | `#9C93E8` |
| Korostus 2 (limenvihreä) | `#E0FF98` |
| Tumma osio | `#141414` |

**Typografia**
| | 1440 px | 390 px |
|---|---|---|
| H1 | 36 px / riviväli 1,1 / −0,02 em / 500 | 49,9 px (mobiilissa isompi!) |
| H3 (palvelukortit) | 60 px / 0,9 / −0,03 em / 500 | |
| Väliotsikot | 18 px / 1,4 / 300 | |
| Leipäteksti | 12 px | |
| Iso brändisana herossa | Noin 280 px | |

**Välistykset:** sisältö on enintään 1 440–1 600 px leveä. Osioissa on hyvin paljon pystytilaa (240 px ylä- ja alapuolella), ja moni näkymä on kiinnitetty paikalleen 2–5 näkymän korkeudelle.

**Animaatiot** (liikeloki)
| # | Mikä liikkuu | Mihin sidottu | Kesto / easing | Toteutus |
|---|---|---|---|---|
| I1 | Hero: laventelinväriset kulmikkaat muodot ja jättimäinen IVENTIONS-sana. Musta "laite" kasvaa ruudun keskeltä showreel-videoksi koko näkymän kokoiseksi. | **Scrub** ja kiinnitys | Skaala 0,25 → 1,29. Kestää noin 2 näkymän korkeuden vierityksen. | `scale`, `translate` |
| I2 | "Designed to be remembered…": tekstin läpi näkyy liikkuva kuva/video limenvihreällä pohjalla. | Vieritys | – | `background-clip: text` tai maski |
| I3 | Rivit nousevat maskin takaa (`div.line`, `.fix-clip`). | Herossa ajastettu, alempana osin scrub | Noin 0,95–1,15 s | `translateY` (SplitText lines) |
| I4 | Asiakaslista pystynauhana: aktiivinen nimi on limenvihreä, ja oikealla vaihtuu vastaava logo. | Scrub | – | `translateY` ja väri |
| I5 | Palvelukortit (Events / Exhibits / Congresses) pinoutuvat. Jokainen kortti on kiinnitetty, seuraava liukuu päälle hieman kallistuneena, ja edellinen skaalautuu pienemmäksi. | **Scrub** ja kiinnitys | Noin 5,5 s näkymän korkeutta per kortti | `translate`, `scale`, `rotate` |
| I6 | Palvelukorttien ikonit ja pienet elementit ponnahtavat esiin. | Scrub | 0,4–1,2 s | `scale` 0 → 1, `opacity` |
| I7 | Diagonaaliset laventelikiilat pyyhkivät osioiden välillä. | Scrub | – | `transform` |
| I8 | Numerot (270+, 31, 90 %, 1,2K) rullaavat pystysuunnassa, ja arvon taakse ilmestyy kuvakortti. | Scrub | – | `translateY` |
| I9 | Kaupunkilista (Paris, Barcelona…) liukuu, ja taustalla pyörii pistepallo. | Scrub ja WebGL | – | `translateY` ja Three.js |
| I10 | Footer: isot sanat "Quote" ja "Contact" videon päällä. | – | – | – |

**Arvio:** neljästä teknisesti kunnianhimoisin, ja kiinnitetyt, toisiinsa ketjutetut näkymät tekevät siitä elokuvamaisen. Siitä kannattaa ottaa korttien pinoutuminen (I5) ja rullaavat numerot (I8). Koko sivu on kuitenkin 14 900 px pitkä ja täynnä kiinnitettyjä osioita, mikä sopii huonosti 10 sekunnin mobiililukemiseen. Myös SplitText ja Three.js maksavat suorituskyvyssä.

---

## Mitä tästä opittiin Palin Webiä varten

1. **Yksi tunnusmerkki riittää.** Tegran logo, 'kinin logo, Minh Phamin punainen ympyrä ja Iventionsin kasvava laite: jokaisella sivulla on yksi asia, joka jää mieleen.
2. **Rivien nousu maskin takaa on alan perustaso.** Kesto 0,8–1,2 s, `power4.out`/`expo.out` ja rivien väli 0,06–0,1 s. Se toteutetaan transformilla ilman blur-suodatinta.
3. **Ylimitoitettu typografia ja hiljainen ympäristö.** Riviväli 0,85–1,0 ja kirjainväli −0,04…−0,05 em. Leipäteksti saa olla pientä, kunhan kontrasti on kunnossa.
4. **Scrub-efektit kannattaa varata yhteen tai kahteen kohtaan.** Iventions näyttää, että pitkät kiinnitetyt ketjut ovat raskaita. Mobiilissa ne kannattaa korvata kerran käynnistyvillä animaatioilla.
5. **Vältettävää:** sisällön lukitseminen intron taakse (Minh Pham), ääni, raskas WebGL, `filter: blur` -animaatiot ja `clip-path`- tai `mask-position`-animaatiot. Viimeiset eivät ole sallittuja tämän projektin säännöissä.
6. **Lenis** on kolmella neljästä. Desktopilla se tuo vierityksen "painon", mutta kosketusnäytöillä se kannattaa jättää pois.
