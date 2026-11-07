// Ottaa esimerkkisivuista kuvakaappaukset ja tekee somejaon kuvan.
//   npm run kuvat                     → esimerkkikuvat + og-kuva
//   npm run kasvokuva-paikkamerkki    → myös kasvokuvan paikkamerkki (YLIKIRJOITTAA kasvokuva.jpg:n!)
//   node kuvat.mjs --vain-ruudut      → vain heron puhelinruudut
import { chromium } from "playwright";
import sharp from "sharp";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, "../site");
const out = (p) => path.join(site, "kuvat", p);
const types = { ".html": "text/html", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".js": "text/javascript" };

// Pieni staattinen palvelin site-kansiolle
const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(site, p);
  if (!file.startsWith(site)) { res.writeHead(403).end(); return; }
  try { res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" }).end(await readFile(file)); }
  catch { res.writeHead(404).end(); }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;
// Kuvissa näytetään auki-tila: kello asetetaan tiistaille klo 12 (aukiolo.js lukee ?aika=)
const aika = "?aika=2026-11-10T12:00";

// Käyttää koneelle asennettua Chromea (ei erillistä selainlatausta)
const browser = await chromium.launch({ channel: "chrome" });

async function shot(url, { width, height, scale, clipHeight }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.route("**/cloudflareinsights.com/**", (r) => r.abort());
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Mobiilin kiinteä palkki piiloon: koko sivun kaappauksessa se jäisi keskelle sivua
  await page.addStyleTag({ content: ".palkki { display: none !important; }" });
  // Laiskat kuvat ladataan heti, koska puhelinruutu kattaa 2,5 näkymää
  await page.evaluate(() => Promise.all([...document.images].map((i) => {
    i.loading = "eager";
    return i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; });
  })));
  // Odotetaan avausanimaatioiden loppuminen (pisin noin 2,7 s, Pikkupaahtimon allas)
  await page.waitForTimeout(3500);
  const buf = clipHeight
    ? await page.screenshot({ type: "png", fullPage: true, clip: { x: 0, y: 0, width, height: clipHeight } })
    : await page.screenshot({ type: "png" });
  await page.close();
  return buf;
}
async function webp(buf, file, w, h) {
  const info = await sharp(buf).resize(w, h).webp({ quality: 80, effort: 6 }).toFile(out(file));
  console.log(`${file}  ${w}×${h}  ${Math.round(info.size / 1024)} kt`);
}

// Heron "Elävä näyteikkuna": puhelinruudun pitkät kuvat 585×3165
// (näkymä 390×844, 1,5× tarkkuus, rajattu 2,5 näkymän korkuiseksi)
for (const slug of ["pikkupaahtimo", "kulmapaa", "kaislaranta"]) {
  await webp(await shot(`${base}/esimerkit/${slug}/${aika}`, { width: 390, height: 844, scale: 1.5, clipHeight: 2110 }), `esimerkit/ruutu-${slug}.webp`, 585, 3165);
}
if (process.argv.includes("--vain-ruudut")) { await browser.close(); server.close(); process.exit(0); }

// Esimerkkien työpöytäkuvat 1800×1200 ja 900×600 (näkymä 1200×800, 1,5× tarkkuus)
for (const slug of ["pikkupaahtimo", "kaislaranta", "kulmapaa"]) {
  const buf = await shot(`${base}/esimerkit/${slug}/${aika}`, { width: 1200, height: 800, scale: 1.5 });
  await webp(buf, `esimerkit/${slug}.webp`, 1800, 1200);
  await webp(buf, `esimerkit/${slug}-900.webp`, 900, 600); // mobiilin srcset
}

// Somejaon kuva 1200×630
{
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto("file://" + path.join(here, "og-kuva.html"));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out("og-kuva.png") });
  await page.close();
  console.log("og-kuva.png  1200×630");
}

// Kasvokuvan paikkamerkki vain erikseen pyydettäessä
if (process.argv.includes("--kasvokuva-paikkamerkki")) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1500 } });
  await page.goto("file://" + path.join(here, "kasvokuva-paikkamerkki.html"));
  await page.evaluate(() => document.fonts.ready);
  await sharp(await page.screenshot()).jpeg({ quality: 82, mozjpeg: true }).toFile(out("kasvokuva.jpg"));
  await page.close();
  console.log("kasvokuva.jpg  1200×1500 (paikkamerkki)");
}

await browser.close();
server.close();
