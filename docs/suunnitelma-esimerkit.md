# Esimerkkisivut: uudistuksen suunnitelma

Tila: **hyväksytty 7.11.2026** yhdellä tarkennuksella: tunnusmerkkien pitää yleistyä Lead-Generatorin demopohjiksi mille tahansa saman alan yritykselle (ks. kohdat "Miten tämä yleistyy demopohjaksi"). Pohjana on [referenssit-yritykset.md](referenssit-yritykset.md).

**Lisäpäätökset:** "Auki nyt" -tieto tulee kaikille kolmelle. Kuva-arkit tehdään kaikille kerralla, ja Kulmapäähän tulee 1–2 lisäkuvaa. Testaus tehdään sekä Chromiumilla että WebKitillä koko leveysalueella. CSS- ja JS-viittauksiin lisätään versiotunniste `?v=`.

**Tavoite:** jokainen sivu näyttää siltä, että studio on tehnyt sen oikealle yritykselle. Ilmeen voima tulee Barburyn ja Fabriquen hillinnästä (yksi iso kuva, yksi typografinen idea), ja sisältö Album Hairin tavasta kertoa asiakkaalle heti aukiolo, hinta ja varaustapa.

## Yhteiset periaatteet

- **Mobiilin ensimmäinen ruutu (390×844):** nimi, yksi lause, soita/varaa-nappi ja iso kuva. **Tänään-rivi** (aukiolo tänään ja osoite) alkaa heti heron alta, eli se on yhden vierityksen päässä.
- **"Auki nyt" -tila:** pieni skripti (`elava.js`, noin 1 kt, `defer`) laskee kellosta tekstin "Auki nyt, sulkeutuu klo 17" tai "Avataan huomenna klo 7.30". Ilman JavaScriptiä näkyy kiinteä viikkoaikataulu. Idea tulee Nowan kellonajan mukaisesta tervehdyksestä, mutta tässä tieto on asiakkaalle hyödyllinen. Jokainen sivu esittää tilan omalla tavallaan.
- **Mobiilin varauspalkki:** Kaislarannassa ja Kulmapäässä on alareunassa kiinteä palkki (Soita / Varaa aika) heron ohituksen jälkeen. Kahvilassa palkkia ei ole, koska kahvilaan ei varata aikaa.
- **Yksi ajoitettu liikehetki per sivu**, pelkällä CSS:llä, vain `transform` ja `opacity`. Muut osiot eivät liu'u sisään. `prefers-reduced-motion` poistaa liikkeen.
- **Pois:** versaalinimilaput otsikoiden yllä ("HIUSSTUDIO · HELSINKI"), pisteillä erotetut metarivit, Kulmapään sanaticker, kursiivilla korostettu yksittäinen sana (Kaislarannan "*hyvä olla*").
- **Ennallaan:** keksityt tiedot (040 000 0000, Esimerkkikatu, `.example`), `noindex`, footerin "Kuvitteellinen yritys" -rivi, kuvaajamaininnat, CSP (ei `style`-attribuutteja, ei ulkoisia fontteja).
- **Fontit:** kaikki SIL OFL -lisenssillä, hostattu sivun kansiossa, rajattu latin-merkistöön (ä, ö, å, €). Kirjataan CREDITS.md:hen.
- **Kuvat:** WebP 640/1280 ja JPG 960 kuten nyt. Hero `fetchpriority="high"`, muut `lazy`.

---

## 1. Kahvila Pikkupaahtimo: "Paahtoaste"

**Tunnusmerkki:** sivu tummuu vieritettäessä kuin kahvipapu paahdossa. Hero on raakapavun vaalean vihertävä, lounas vaalea paahto (kraft), menu keskipaahto (kaneli) ja yhteystiedot tumma paahto. Heron iso kuva on **pyöreä jäähdytysallas**: ympyrään rajattu paahtimon jäähdytysaltaan papukuva, niin iso, että se jatkuu ruudun reunan yli.

**Liikehetki:** sivun avautuessa jäähdytysallas kääntyy noin 140° ja pysähtyy, kuin sekoitusvarsi kääntäisi papuja (2,4 s, hidastuva). Otsikon rivit nousevat samaan aikaan.

**Paletti**
| Token | Arvo | Käyttö |
|---|---|---|
| `--raakapapu` | `#E3E4CF` | Hero ja Tänään-rivi |
| `--kraft` | `#D2B98E` | Lounas (teksti `--paahto` 8,8:1) |
| `--kaneli` | `#8A5530` | Kahvit ja leivonnaiset (valkoinen teksti 6,1:1) |
| `--paahto` | `#2A1A12` | Teksti, pavut ja yhteystiedot (raakapapu sen päällä 13:1) |
| `--kirsikka` | `#B3202C` | Kahvikirsikan punainen: napit, Auki nyt -piste (valkoinen 6,6:1) |

Nykyinen kerma ja tomaatinpunainen jäävät pois: ne ovat lähellä geneeristä "kerma + terrakotta" -yhdistelmää.

**Typografia:** **Young Serif** otsikoihin (raskas, ystävällinen vanhan tyylin serif, kuin leipomon ikkunateksti). Iso, riviväli 1,0, kirjainväli −0,02 em. **Familjen Grotesk** leipätekstiin ja hintoihin (taulukkonumerot).

**Asettelu (mobiili)**
```
┌────────────────────────┐
│ Pikkupaahtimo   ● Auki │
│ Kahvia, joka           │  Young Serif ~44 px
│ paahdetaan kulman      │
│ takana.                │
│ [Soita] [Reitti]       │
│        ╭───────────────┤  jäähdytysallas ~120vw, leikkautuu
│      ╱  papuja ympyrä  │  oikeasta reunasta
│      ╲                 │
│        ╰───────────────┤
├────────────────────────┤
│ Tänään 7.30–17         │  Tänään-rivi (raakapapu)
│ Esimerkkikatu 12, Espoo│
├────── kraft ───────────┤  Viikon lounas: iso keittokuva + päivät
├────── kaneli ──────────┤  Kahvit | Leivonnaiset (hintasarakkeet)
├────── paahto ──────────┤  Pavut mukaan: "Erä 45, paahdettu to"
│                        │  Yhteystiedot, kartta (tumma versio)
└────────────────────────┘
```
Desktop: otsikko vasemmalla, jäähdytysallas oikealla puoliksi ruudun ulkopuolella. Teksti on tasattu vasemmalle.

**Kuvat:** nykyiset pavut (hero-ympyrä) ja lounas sopivat. Kahvilan sisäkuva on geneerinen (valkoinen ja rottinki), joten ehdotan uusia:
1. leivonnaisia pellillä tai tiskillä yläkulmasta (korvapuusteja tai kardemummasolmuja)
2. kahvin kaato tai barista lähikuvassa
3. rumpupaahdin (paahtimon koneisto) Pavut-osioon

**Miten tämä yleistyy demopohjaksi**
- **Tummuva rytmi on pelkkää väriä.** Osioiden järjestys on vaalea → kraft → keskitumma → tumma, eikä se vaadi tekstissä paahtoviittauksia. Kahvilalle, joka ei paahda itse, viimeinen tumma osio on "Mukaan" (lahjakortti, kahvit kotiin) tai pelkät yhteystiedot. Tokenien nimet ovat koodissa yleiset (`--savy-1…4`), ja kommentissa kerrotaan paahtovertaus.
- **Pyöreä kuva toimii mistä tahansa ylhäältä kuvatusta aiheesta:** jäähdytysallas, kahvikuppi ja latte-taide, leivonnaislautanen tai pöytä ylhäältä. Kääntymisliike sopii niihin kaikkiin. Rajaus on CSS:n `border-radius: 50%` + `object-fit: cover`, joten kuvaa ei tarvitse valmistella.
- **Luettavuus tummissa osioissa:** jokaiselle sävylle on määritelty oma teksti- ja toissijainen tekstiväri, ja niiden kontrastit on laskettu (AA, leipäteksti ≥ 4,5:1).
- **Nimen pituus:** logo on yhdellä rivillä, ja pitkä nimi rivittyy sanan kohdalta. Hero-otsikko on lause, ei nimi, joten nimen pituus ei riko sitä.
- **Testinimet:** lyhyt **"Kuppi"** ja pitkä **"Kahvila ja leipomo Vanha Postitalo"**.

## 2. Hiusstudio Kaislaranta: "Kaislikko"

**Tunnusmerkki:** kapeat pystysuorat rajaukset, kuin kaislat. Heron kuva on jaettu seitsemään pystysuikaleeseen, ja muissa kuvissa käytetään korkeita ja kapeita rajauksia (3:5). Kampaajat ovat kolme kapeaa pystykuvaa vierekkäin, kuin kaislat rannassa.

**Liikehetki:** heron suikaleet nousevat paikoilleen eri tahtiin (`translateY`, porrastus 60 ms, ei samassa järjestyksessä vaan aaltona) ja muodostavat yhden kuvan. Liike muistuttaa tuulta kaislikossa. Otsikko häivytetään sisään suikaleiden jälkeen.

**Paletti**
| Token | Arvo | Käyttö |
|---|---|---|
| `--usva` | `#E8EBE6` | Pohja (aamu-usva järvellä) |
| `--jarvi` | `#1D3A41` | Syvä petrooli: napit, varausosio, footer (valkoinen 12:1) |
| `--kaisla` | `#C4AC72` | Kuivan kaislan olki: ohuet viivat, numerot järven päällä (5,5:1) |
| `--muste` | `#162024` | Teksti (13,8:1) |
| `--harmaa` | `#4A5A5C` | Toissijainen teksti (6,0:1) |

**Typografia:** **Bodoni Moda** otsikoihin (muotilehden kontrastiserif, optinen koko, isossa koossa paino 400). Kokonaiset otsikot, ei yksittäisiä kursiivisanoja. **Albert Sans** leipätekstiin.

**Asettelu (mobiili)**
```
┌────────────────────────┐
│ Kaislaranta  [Varaa]   │
│ ┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃  │  kuva 7 suikaleena, ~62vh
│ ┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃  │
│ Hiukset, joiden kanssa │  Bodoni Moda ~42 px
│ on hyvä olla.          │
│ [Varaa aika]  Soita    │
├────────────────────────┤
│ Tänään 10–19 · ...     │  Tänään-rivi + osoite
├────────────────────────┤
│ Hinnasto               │  leikkaukset/värit/kampaukset, kesto + hinta
├────────────────────────┤
│ ┃Aino┃ ┃Mikael┃ ┃Sofia┃│  kolme kapeaa pystykuvaa
├──── järvi ─────────────┤  Varaa aika: soita tai maksuton konsultaatio
└────────────────────────┘
[ Soita ][ Varaa aika ]     kiinteä palkki heron jälkeen
```
Desktop: suikalekuva täyttää oikean 60 %, otsikko vasemmalla alhaalla.

**Kuvat:** nykyinen hero (tyhjä tuoli) on heikko. Värjäys- ja kiharruskuvat ovat hyviä kapeisiin rajauksiin. Ehdotan:
1. uusi hero: hiusten liike tai tekstuuri luonnonvalossa (pystykuva, rajautuu kapeisiin suikaleisiin)
2. salongin sisätila luonnonvalossa, rauhallinen
3. kaislikko järven rannalla (brändikuva, varausosion taustaksi)

**Miten tämä yleistyy demopohjaksi**
- **Suikaleet tehdään mistä tahansa hero-kuvasta.** Jokainen suikale on kapea ikkuna (`overflow: hidden`), jonka sisällä on sama `<img>`, siirrettynä `translateX`:llä suikaleen kohdalle. Selain lataa kuvan vain kerran. Kaislakuvaa ei tarvita, eikä kuvaa tarvitse leikata etukäteen.
- **Kaislakuva on valinnainen.** Varausosio toimii myös pelkällä `--jarvi`-värillä.
- **Kapeat pystyrajaukset** (kampaajat 3:5) toimivat minkä tahansa henkilö- tai työkuvan kanssa `object-fit: cover`- ja `object-position`-asetuksilla.
- **Nimen pituus:** logo on yläpalkissa ja rivittyy tarvittaessa. Hero-otsikko on lause.
- **Testinimet:** lyhyt **"Saga"** ja pitkä **"Kampaamo Hopeapaju & Kumppanit"**, sekä kaksi muuta hero-kuvaa (värjäys ja leikkaus).

## 3. Parturi Kulmapää: "Kulmakyltti"

**Tunnusmerkki:** liike on kadunkulmassa, ja nimi on kuin kulmaliikkeen kyltti kahdella seinällä. **KULMA** kulkee vaakasuoraan kuvan yläreunassa ja **PÄÄ** pystysuoraan oikeaa reunaa alas. Sanat kohtaavat kulmassa keltaisessa neliössä. Sama 90° kulma toistuu: jokainen osio alkaa keltaisesta kulmamerkistä, ja hinnasto on kuin liikkeen hintataulu.

**Liikehetki:** KULMA liukuu vasemmalta ja PÄÄ ylhäältä, ja ne kohtaavat kulmassa. Keltainen neliö syttyy (`scale` 0 → 1) juuri kohtaamishetkellä (1,4 s).

**Paletti:** nykyinen musta ja messinki ovat parturisivujen oletus, joten tilalle tulee valoisa katukyltti.
| Token | Arvo | Käyttö |
|---|---|---|
| `--liitu` | `#F2F1EC` | Pohja |
| `--betoni` | `#CFCCC4` | Toissijainen pinta (Tänään-rivi, hintataulun tausta) |
| `--musta` | `#0A0A0A` | Teksti, hintataulu, footer (17,5:1) |
| `--kyltti` | `#F4C21B` | Merkkikeltainen: kulmaneliö, napit, hinnat mustan päällä (11,9:1) |
| `--harmaa` | `#5B5A56` | Toissijainen teksti (6,1:1) |

**Typografia:** **Antonio** (kapea groteski, 700) nimeen ja otsikoihin, versaalina kuin kyltti. Kirjainväli 0, riviväli 0,9. **Public Sans** leipätekstiin ja hintoihin. Mustavalkokuvat säilyvät.

**Asettelu (mobiili)**
```
┌────────────────────────┐
│ K U L M A ─────────── ■│  ■ = keltainen kulma
│┌─────────────────────┐P│
││ mv-kuva ~58vh       │Ä│
││                     │Ä│
│└─────────────────────┘ │
│ Tarkka leikkaus.       │
│ Ei turhaa jutustelua.  │
│ [Soita 040…] Drop-in   │  Drop-in tänään 10–14 (live)
├────────────────────────┤
│ Tänään 10–19 ...       │  Tänään-rivi (betoni)
├──── hintataulu ────────┤  musta, hinnat keltaisella, kesto
├────────────────────────┤  Parturit: 2 isoa mv-rajausta
├────────────────────────┤  "Kulmassa, katutasossa": kuva + yhteystiedot
└────────────────────────┘
[ Soita ][ Drop-in tänään ]  kiinteä palkki
```
Desktop: KULMA koko leveydeltä noin 22vw ja PÄÄ pystysuoraan oikeassa reunassa. Otsikko ja napit ovat vasemmassa alakulmassa.

**Kuvat:** nykyiset leikkaus- ja partakuvat ovat hyviä isoihin rajauksiin. Ehdotan:
1. kulmaliike kadulta tai näyteikkuna (osioon "Kulmassa, katutasossa")
2. kuumapyyhe-parranajo
3. työkalut tasolla ylhäältä kuvattuna (hintataulun viereen desktopilla)

Hyväksytty laajuus: 1–2 lisäkuvaa (kulmaliike ja kuumapyyhe).

**Miten tämä yleistyy demopohjaksi**
- **Nimi jaetaan kahdelle seinälle generaattorin säännöllä:**
  1. Monisanainen nimi jaetaan sanan kohdalta ("Parturi Salo" → PARTURI | SALO). Jos sanoja on yli kaksi, jako tehdään kohdasta, jossa osat ovat lähimpänä samanpituisia.
  2. Yhdyssana jaetaan sanaliitoksen kohdalta (Kulma|pää).
  3. **Varaversio**, jos nimessä on enintään 5 merkkiä tai luontevaa jakokohtaa ei ole: koko nimi vaakaseinälle ja pystyseinälle alan sana **PARTURI**.
- **Koko mitoitetaan ilman JavaScriptiä.** HTML:ssä on `data-merkit="N"` (merkkien määrä), ja CSS laskee siitä fonttikoon niin, että sana täyttää seinän. Arvot 2–16 on määritelty CSS:ssä, koska CSP ei salli `style`-attribuuttia.
- **Nimi näkyy myös tavallisesti luettavana:** yläpalkissa ja heron otsikon yläpuolella on koko nimi vaakasuoraan. Kulmakyltti on koriste (`aria-hidden`).
- **Testinimet:** lyhyt **"Ässä"** (varaversio) ja pitkä **"Herrasmiesten Parturi"** (jako sanan kohdalta).

---

## Tarkistus: onko jokin oletusratkaisu?

| Riski | Muutos |
|---|---|
| Pikkupaahtimo: vaalea pohja + serif + punainen on lähellä kerma + serif + terrakotta -oletusta | Pohja on vihertävä raakapapu (ei kermaa) ja korostus kirsikanpunainen (ei savenpunainen). Pääväline on tummuva paahtoaste, ei serif. |
| Kulmapää: musta + messinki on parturisivujen oletus | Valoisa liitu + merkkikeltainen. Musta jää hintatauluun. |
| Kaislaranta: nykyinen korostettu kursiivisana ja versaalinimilappu | Poistetaan. Bodoni kokonaisina otsikoina. |
| Kolme samaa pohjaa? | Kolme erilaista asetteluideaa (ympyrä ruudun yli / pystysuikaleet / kulma), kolme fonttiparia ja kolme eri vaaleaa pohjaa (vihertävä / harmaa-vihreä usva / liitu). |
| Portfolio (koboltti, Archivo Expanded) | Mikään sivu ei käytä sinistä eikä leveää groteskia. |

## Rakennusjärjestys

1. Pikkupaahtimo, 2. Kaislaranta, 3. Kulmapää. Jokaisen jälkeen tehdään seuraavat:
   - kuvakaappaukset 390 ja 1440 px ja video
   - vertailu referensseihin
   - `npm run tarkista`
   - Lighthouse mobiili ≥ 95
   - testi ilman JavaScriptiä ja reduced-motion-testi
   - commit
2. Portfolion korttikuvat ja heron ruutukuvat (`npm run kuvat`). Heron ruutuajoitukset tarkistetaan uusia sivuja vasten.
3. CLAUDE.md:hen osio "Esimerkkipohjat".
