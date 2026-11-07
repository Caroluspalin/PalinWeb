# Palin Web – julkaisuohje

Sivusto julkaistaan **GitHub → Cloudflare Pages** -ketjulla: kun pushaat `main`-haaraan,
Cloudflare julkaisee sivun automaattisesti osoitteeseen **palinweb.fi**.

```
portfolio/                      ← git-repo
├── JULKAISU.md                 ← tämä ohje (ei julkaista)
├── tyokalut/                   ← OG-kuvan pohja, kuvien paikkamerkkipohja (ei julkaista)
└── site/                       ← julkaistava sivusto (Cloudflaren "output directory")
    ├── index.html, styles.css, 404.html, favicon.svg
    ├── robots.txt, sitemap.xml
    ├── _headers                ← välimuisti, CSP ja muut tietoturvaotsakkeet
    ├── fonts/                  ← Schibsted Grotesk (SIL OFL)
    ├── esimerkit/
    │   ├── pikkupaahtimo/      ← esimerkkisivu: kahvila (palinweb.fi/esimerkit/pikkupaahtimo/)
    │   └── kaislaranta/        ← esimerkkisivu: kampaamo (palinweb.fi/esimerkit/kaislaranta/)
    └── kuvat/
        ├── og-kuva.png                     1200×630, somejaon kuva
        ├── kasvokuva.jpg                   1200×1500  ← VAIHDA omaan kuvaan
        └── esimerkit/
            ├── esimerkki-1.jpg             1200×800   ← VAIHDA: Royal Fade, tietokone
            ├── esimerkki-1-mobiili.jpg     780×1688   ← VAIHDA: Royal Fade, puhelin
            ├── esimerkki-2.jpg             1200×800   (Pikkupaahtimo, valmis)
            └── esimerkki-3.jpg             1200×800   (Kaislaranta, valmis)
```

---

## 1. Täytä viimeiset tiedot

Kolme paikkamerkkiä on vielä jäljellä. Tarkista, mitkä niistä löytyvät:

```sh
grep -rn "\[PUHELIN\]\|\[ESIMERKKI-1-LINKKI\]\|\[ANALYTICS-TOKEN\]" site/
```

**Puhelinnumero:** `tel:`-linkkiin tarvitaan kansainvälinen muoto ja näkyvään tekstiin
tavallinen muoto. Tiedostossa on molemmat muodossa `href="tel:[PUHELIN]">[PUHELIN]`.
Korvaa ne näin (vaihda oma numerosi):

```sh
sed -i '' 's/tel:\[PUHELIN\]/tel:+358401234567/g; s/\[PUHELIN\]/040 123 4567/g' site/index.html
```

**Royal Fade -linkki:**
```sh
sed -i '' 's#\[ESIMERKKI-1-LINKKI\]#https://osoite-royal-fadeen.fi/#' site/index.html
```

**Analytiikkatunnus:** ks. kohta 5.

**Kuvat:** korvaa yllä merkityt kuvat **samoilla tiedostonimillä ja mitoilla**.
- Royal Fade, tietokone: kuvakaappaus 1200×800-kokoisesta selainikkunasta.
- Royal Fade, puhelin: Chromen kehitystyökalut → laitetila → iPhone 12/13/14 (390×844)
  → *Capture screenshot*. Kuvasta tulee 2× tarkkuudella 780×1688.
- Kasvokuva: 1200×1500, luonnollinen valo.
- Pidä jokainen kuva alle ~200 kt (esim. squoosh.app → MozJPEG, laatu 75–80).

**Esimerkkisivujen kuvat päivitetään uudelleen**, jos muutat esimerkkisivuja. Aja ensin
paikallinen esikatselu (kohta 2), ja aja sitten toisessa ikkunassa:
```sh
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for d in pikkupaahtimo:2 kaislaranta:3; do n=${d%%:*}; i=${d##*:}
  "$CH" --headless=new --hide-scrollbars --window-size=1200,800 --virtual-time-budget=3000 \
    --screenshot=/tmp/$n.png http://localhost:8000/esimerkit/$n/
  sips -s format jpeg -s formatOptions 82 /tmp/$n.png --out site/kuvat/esimerkit/esimerkki-$i.jpg
done
```

**Somejaon kuva:** jos muutat tekstiä tiedostossa `tyokalut/og-kuva.html`, aja:
```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --hide-scrollbars --window-size=1200,630 --virtual-time-budget=2000 \
  --screenshot="$PWD/site/kuvat/og-kuva.png" "file://$PWD/tyokalut/og-kuva.html"
```

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

Repo on jo alustettu, ja ensimmäinen commit on tehty. Seuraavaksi:

1. Luo GitHubissa uusi repo: https://github.com/new
   - Nimi: **`palinweb`**
   - Yksityinen tai julkinen, kumpi vain. Cloudflare toimii molempien kanssa.
   - **Älä** lisää README-, .gitignore- tai lisenssitiedostoa, koska repo on jo olemassa
     koneellasi.
2. Kytke paikallinen repo GitHubiin ja pushaa (vaihda `KÄYTTÄJÄ` omaan GitHub-tunnukseesi):
   ```sh
   cd ~/portfolio
   git remote add origin https://github.com/KÄYTTÄJÄ/palinweb.git
   git push -u origin main
   ```
   Jos `gh`-komento on asennettu, kohdat 1 ja 2 hoituvat myös yhdellä komennolla:
   `gh repo create palinweb --private --source=. --push`

Jatkossa julkaiseminen tarkoittaa vain:
```sh
git add -A && git commit -m "Päivitä hinnat" && git push
```

---

## 4. Cloudflare Pages: kytkentä GitHubiin

> Jos teit aiemmin Pages-projektin raahaamalla tiedostot selaimeen, sitä projektia ei
> voi muuttaa GitHub-kytkentäiseksi. Tee uusi projekti alla olevalla tavalla ja poista
> vanha projekti, kun uusi toimii (poista ensin vanhan projektin custom domainit).

1. https://dash.cloudflare.com → **Workers & Pages** → **Create application** →
   **Pages**-välilehti → **Connect to Git** (tai *Import an existing Git repository*).
2. Valitse **GitHub** ja anna Cloudflarelle pääsy repoon `palinweb`. Voit rajata pääsyn
   vain tähän repoon.
3. Valitse repo `palinweb` → **Begin setup**.
4. Asetukset:
   | Kenttä | Arvo |
   |---|---|
   | Project name | `palinweb` (antaa osoitteen palinweb.pages.dev) |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | *(jätä tyhjäksi)* |
   | Build output directory | **`site`** |
5. **Save and Deploy**. Ensimmäinen julkaisu kestää alle minuutin. Tarkista
   https://palinweb.pages.dev.

Tästä eteenpäin jokainen push `main`-haaraan julkaistaan automaattisesti. Muihin
haaroihin pushatut muutokset saavat oman esikatseluosoitteen.

---

## 5. Cloudflare Web Analytics

Analytiikka ei käytä evästeitä, joten se ei vaadi evästebanneria. Skripti on valmiina
kaikilla sivuilla (etusivu, 404 ja molemmat esimerkkisivut), ja CSP sallii sen. Puuttuu
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
