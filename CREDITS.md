# Kuvien lähteet

Esimerkkisivut (Halkolan Märkätilat ja Hongiston Lämpö) ovat kuvitteellisia yrityksiä. Niiden kuvat ovat tekoälyllä tehtyä
kuvitusta, eikä niissä ole kolmannen osapuolen valokuvia. Kuvitus mainitaan kummankin sivun alatunnisteessa
("Kuvat: tekoälyllä tehty kuvitus.") ja demopalkissa ("kuvat ovat kuvitusta").

## Halkolan Märkätilat (`/esimerkit/halkola/`)

Tiedostot `site/esimerkit/halkola/assets/`: `ennen`, `jalkeen`, `sauna`, `wc`, `eristys` ja `detalji` (WebP) sekä heron
121 framea kansioissa `f/` (työpöytä) ja `m/` (mobiili).

## Hongiston Lämpö (`/esimerkit/hongisto/`)

Tiedostot `site/esimerkit/hongisto/assets/`: `ennen`, `jalkeen`, `kaivo`, `ulko`, `sisa` ja `detalji` (WebP) sekä heron
121 framea kansioissa `f/` (työpöytä) ja `m/` (mobiili).

## Portfolion kuvakaappaukset

`site/kuvat/esimerkit/{halkola,hongisto}.webp` (ja `-900`-versiot) ja heron puhelinruudut `ruutu-{halkola,hongisto}.webp`
ovat kuvakaappauksia yllä mainituista esimerkkisivuista. Ne tehdään komennolla `cd tyokalut && npm run kuvat`.

## Fontit

| Fontti | Käyttö | Lisenssi |
|---|---|---|
| Schibsted Grotesk | Palin Web, leipäteksti | SIL Open Font License 1.1 |
| Archivo (rajattu: leveys 100–125 %, paino 600–900, latin) | Palin Web, otsikot | SIL Open Font License 1.1 (`site/fonts/OFL-archivo.txt`) |
| Archivo (variable, leveys 62–125 %, paino 300–800, latin ja latin-ext) | Halkolan Märkätilat | SIL Open Font License 1.1 (`site/esimerkit/halkola/OFL-archivo.txt`) |
| Barlow (paino 400–700, latin ja latin-ext) | Hongiston Lämpö, leipäteksti | SIL Open Font License 1.1 (`site/esimerkit/hongisto/OFL-barlow.txt`) |
| Barlow Condensed (paino 600–800, latin ja latin-ext) | Hongiston Lämpö, otsikot | SIL Open Font License 1.1 (`site/esimerkit/hongisto/OFL-barlow-condensed.txt`) |

## Kirjastot

| Kirjasto | Versio | Lisenssi |
|---|---|---|
| GSAP ja ScrollTrigger | 3.15.0 | GreenSock Standard "no charge" -lisenssi (`site/vendor/LICENSE-gsap.txt`) |
| Lenis | 1.3.26 | MIT (`site/vendor/LICENSE-lenis.txt`) |
