# Palin Web – julkaisuohje

Sivusto julkaistaan **GitHub → Cloudflare Pages** -ketjulla: kun pushaat `main`-haaraan,
Cloudflare julkaisee sivun automaattisesti osoitteeseen **palinweb.fi**.

```
portfolio/                      ← git-repo
├── JULKAISU.md                 ← tämä ohje (ei julkaista)
├── CREDITS.md                  ← kuvien lähteet, kuvaajat ja lisenssit (ei julkaista)
├── .env                        ← UNSPLASH_ACCESS_KEY (ei gitissä, ei julkaista)
├── tyokalut/                   ← kuvakaappaus- ja tarkistusskriptit, OG-kuvan pohja (ei julkaista)
└── site/                       ← julkaistava sivusto (Cloudflaren "output directory")
    ├── index.html, styles.css, 404.html, favicon.svg
    ├── alapalkki.js            ← html.js-luokka ja mobiilin kiinteä alapalkki (näkyy, kun hero on ohitettu)
    ├── liike.js                ← työpöydän vieritysefektit; lataa vendor-kirjastot vain ≥ 1024 px
    ├── vendor/                 ← GSAP 3.15.0, ScrollTrigger 3.15.0, Lenis 1.3.26 (lisenssit mukana)
    ├── robots.txt, sitemap.xml
    ├── _headers                ← välimuisti, CSP ja muut tietoturvaotsakkeet
    ├── fonts/                  ← Schibsted Grotesk ja Archivo (SIL OFL)
    ├── esimerkit/              ← esimerkkisivut (noindex), osoitteet palinweb.fi/esimerkit/…/
    │   ├── pikkupaahtimo/      ← kahvila
    │   ├── kaislaranta/        ← kampaamo
    │   └── kulmapaa/           ← parturi
    └── kuvat/
        ├── og-kuva.png                       1200×630, somejaon kuva (npm run kuvat)
        ├── kasvokuva.jpg                     1200×1500  ← VAIHDA omaan kuvaan
        └── esimerkit/
            ├── pikkupaahtimo.webp            1800×1200  korttikuva + hero (npm run kuvat)
            ├── ruutu-{pikkupaahtimo,kulmapaa,kaislaranta}.webp  585×3165  heron puhelinruudut (npm run kuvat)
            ├── kaislaranta.webp, kulmapaa.webp  1800×1200  korttikuvat (npm run kuvat)
            └── pikkupaahtimo/, kaislaranta/, kulmapaa/   ← esimerkkisivujen valokuvat (Unsplash)
```

---

## 1. Täytä viimeiset tiedot

Kaksi paikkamerkkiä on vielä jäljellä. Tarkista, mitkä niistä löytyvät:

```sh
grep -rn "\[PUHELIN\]\|\[ANALYTICS-TOKEN\]" site/
```

**Puhelinnumero:** `tel:`-linkkiin tarvitaan kansainvälinen muoto ja näkyvään tekstiin
tavallinen muoto. Tiedostossa on molemmat muodossa `href="tel:[PUHELIN]">[PUHELIN]`.
Korvaa ne näin (vaihda oma numerosi):

```sh
sed -i '' 's/tel:\[PUHELIN\]/tel:+358401234567/g; s/\[PUHELIN\]/040 123 4567/g' site/index.html
```

**Analytiikkatunnus:** ks. kohta 5.

**Kasvokuva:** korvaa `site/kuvat/kasvokuva.jpg` omalla kuvallasi. Käytä **samaa tiedostonimeä
ja kokoa 1200×1500** (pystykuva 4:5), luonnollista valoa ja pidä tiedosto alle ~200 kt
(esim. squoosh.app → MozJPEG, laatu 75–80).

---

## 1b. Työkalut: kuvakaappaukset ja tarkistus

Skriptit ovat kansiossa `tyokalut/`. Ne käyttävät Playwrightia koneelle asennetun Chromen kanssa
ja käynnistävät oman paikallisen palvelimen, joten erillistä esikatselua ei tarvita.
Asenna riippuvuudet kerran:

```sh
cd tyokalut && npm install
```

| Komento | Mitä tekee |
|---|---|
| `npm run kuvat` | Ottaa esimerkkisivuista uudet kuvakaappaukset (korttikuvat ja heron tietokone- ja puhelinkuvan) ja tekee somejaon kuvan `tyokalut/og-kuva.html`-pohjasta. Aja tämä aina, kun muutat esimerkkisivuja. |
| `npm run tarkista` | Tarkistaa, ettei millään sivulla ole vaakavieritystä leveyksillä 320–1440 px. |
| `npm run kasvokuva-paikkamerkki` | Palauttaa harmaan CP-paikkamerkin. **Ylikirjoittaa `kasvokuva.jpg`:n**, joten älä aja tätä, kun oma kuvasi on paikallaan. |

**Esimerkkisivujen valokuvat** ovat Unsplashista. Kuvaajat ja lisenssit on kirjattu
tiedostoon `CREDITS.md` ja kunkin esimerkkisivun alatunnisteeseen. Jos vaihdat kuvan,
päivitä molemmat. Kuvat ovat muodossa `<nimi>-640.webp`, `<nimi>-1280.webp` ja
`<nimi>-960.jpg`. Ne on valmiiksi rajattu käyttöpaikan muotoon, joten pidä uusissa
kuvissa sama rajaus ja samat nimet.

**Aloitustarjouksen poisto:** poista tiedostosta `site/index.html` rivit kommenttien
`<!-- ALOITUSTARJOUS ... -->` ja `<!-- /ALOITUSTARJOUS -->` välistä, kommentit mukaan lukien.

---

## 2. Esikatselu omalla koneella

```sh
cd site && python3 -m http.server 8000
```
Avaa http://localhost:8000. Polut alkavat `/`-merkillä, joten sivu ei näy oikein,
jos `index.html` avataan suoraan tiedostona.

---

## 3. GitHub

Repo on **https://github.com/Caroluspalin/PalinWeb**. Paikallinen `~/portfolio` on
ainoa git-repo, ja `site/` on sen tavallinen kansio, ei erillinen repo.
Jos remote puuttuu, lisää se:

```sh
cd ~/portfolio
git remote add origin https://github.com/Caroluspalin/PalinWeb.git
git push -u origin main
```

Jatkossa julkaiseminen tarkoittaa vain:
```sh
git add -A && git commit -m "Päivitä hinnat" && git push
```

> Älä aja `git init` kansiossa `site/`. Sisäkkäinen repo sotkee commitit ja julkaisun.

---

## 4. Cloudflare Pages: kytkentä GitHubiin

> Jos teit aiemmin Pages-projektin raahaamalla tiedostot selaimeen, sitä projektia ei
> voi muuttaa GitHub-kytkentäiseksi. Tee uusi projekti alla olevalla tavalla ja poista
> vanha projekti, kun uusi toimii (poista ensin vanhan projektin custom domainit).

1. https://dash.cloudflare.com → **Workers & Pages** → **Create application** →
   **Pages**-välilehti → **Connect to Git** (tai *Import an existing Git repository*).
2. Valitse **GitHub** ja anna Cloudflarelle pääsy repoon `PalinWeb`. Voit rajata pääsyn
   vain tähän repoon.
3. Valitse repo `PalinWeb` → **Begin setup**.
4. Asetukset:
   | Kenttä | Arvo |
   |---|---|
   | Project name | `palinweb` (antaa osoitteen palinweb.pages.dev) |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | *(jätä tyhjäksi)* |
   | Build output directory | **`site`** |
   Jos Pages-projekti on jo kytketty `PalinWeb`-repoon, tarkista samat arvot kohdassa
   **Settings → Builds & deployments**. Output directoryn pitää olla `site`. Muuten
   julkaisuun päätyvät myös `CLAUDE.md`, `docs/` ja `tyokalut/`.
5. **Save and Deploy**. Ensimmäinen julkaisu kestää alle minuutin. Tarkista
   https://palinweb.pages.dev.

Tästä eteenpäin jokainen push `main`-haaraan julkaistaan automaattisesti. Muihin
haaroihin pushatut muutokset saavat oman esikatseluosoitteen.

---

## 5. Cloudflare Web Analytics

Analytiikka ei käytä evästeitä, joten se ei vaadi evästebanneria. Skripti on valmiina
kaikilla sivuilla (etusivu, 404 ja kolme esimerkkisivua), ja CSP sallii sen. Puuttuu
vain tunnus.

1. https://dash.cloudflare.com → **Analytics & Logs** → **Web Analytics** →
   **Add a site**.
2. Kirjoita `palinweb.fi`. Jos Cloudflare tarjoaa automaattista asennusta, valitse
   **manuaalinen asennus** (*Manage site* / *JS snippet*).
3. Cloudflare näyttää koodinpätkän, jossa lukee `data-cf-beacon='{"token": "abc123…"}'`.
   Kopioi lainausmerkkien välissä oleva tunnus.
4. Korvaa tunnus kaikkiin tiedostoihin ja julkaise:
   ```sh
   grep -rl "\[ANALYTICS-TOKEN\]" site | xargs sed -i '' 's/\[ANALYTICS-TOKEN\]/abc123.../g'
   git commit -am "Lisää analytiikkatunnus" && git push
   ```

> **Älä käytä kahta asennustapaa yhtä aikaa.** Pages-projektissa on myös asetus
> *Metrics → Web Analytics → Enable*, joka lisää skriptin automaattisesti. Jos käytät
> sitä, poista käsin lisätyt `<script … cloudflareinsights …>`-rivit, ettei käyntejä
> lasketa kahteen kertaan.

---

## 6. Oma domain: palinweb.fi

### 6.1 Siirrä palinweb.fi:n DNS Cloudflareen
Pelkkä päädomain (`palinweb.fi` ilman www:tä) toimii Pagesissa vain, jos domainin DNS on Cloudflaressa.
1. Cloudflaren hallintapaneeli → **Add a domain** → `palinweb.fi` → **Free**-paketti.
2. **Sähköposti:** palin@palinweb.fi toimii nykyisen palveluntarjoajan kautta. Tarkista,
   että Cloudflare toi mukanaan **MX**-tietueet sekä SPF-, DKIM- ja DMARC-tietueet
   (TXT/CNAME). Lisää puuttuvat käsin vanhan DNS:n mukaisesti **ennen** nimipalvelimien
   vaihtoa. Muuten sähköposti lakkaa toimimasta.
3. Vaihda domainin rekisteröijän hallintapaneelissa nimipalvelimiksi ne kaksi
   `*.ns.cloudflare.com`-osoitetta, jotka Cloudflare näyttää.
4. Odota, kunnes Cloudflare ilmoittaa domainin olevan **Active**. Yleensä se kestää
   muutaman tunnin, enintään vuorokauden.

### 6.2 Kytke domainit Pages-projektiin
1. **Workers & Pages** → `palinweb` → **Custom domains** → **Set up a custom domain**.
2. Lisää `palinweb.fi` → **Activate domain**.
3. Lisää samalla tavalla `www.palinweb.fi`.
4. Molempien tilaksi pitää tulla **Active**. HTTPS-sertifikaatti syntyy automaattisesti.

### 6.3 Ohjaa www.palinweb.fi → palinweb.fi
1. Domain `palinweb.fi` → **Rules** → **Redirect Rules** → **Create rule**. Valmis pohja
   löytyy usein nimellä *"Redirect from WWW to root"*.
2. Jos pohjaa ei ole:
   - Ehto: *Hostname* equals `www.palinweb.fi`
   - Toiminto: *Dynamic redirect*, lauseke
     `concat("https://palinweb.fi", http.request.uri.path)`
   - Tilakoodi **301**, *Preserve query string* päälle.

### 6.4 Lopuksi
- **SSL/TLS** → **Edge Certificates** → **Always Use HTTPS** päälle.
- Kokeile osoitteita `http://palinweb.fi`, `https://www.palinweb.fi` ja
  `https://www.palinweb.fi/esimerkit/kaislaranta/`. Kaikkien pitää ohjautua
  `https://palinweb.fi/…`-alkuiseen osoitteeseen.
- Somejaon esikatselu: https://www.opengraph.xyz/url/https%3A%2F%2Fpalinweb.fi
- Google Search Console: lisää `palinweb.fi` ja lähetä `https://palinweb.fi/sitemap.xml`.
  Esimerkkisivuilla on `noindex`, joten ne eivät näy Googlessa kuvitteellisina yrityksinä.

---

## Tietoturvaotsakkeet (`site/_headers`)

CSP sallii vain sivuston omat tiedostot sekä Cloudflare Web Analyticsin osoitteet
`static.cloudflareinsights.com` (skripti) ja `cloudflareinsights.com` (tietojen lähetys).
Jos lisäät myöhemmin ulkoisen palvelun, esimerkiksi upotetun kartan tai ajanvarauswidgetin,
sen osoite pitää lisätä CSP:hen. Muuten selain estää sen.
Tarkista rikkomukset selaimen kehitystyökalujen Console-välilehdeltä.
