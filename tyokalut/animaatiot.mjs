// Tekee heron puhelimen ruudulle animoidun WebP:n (ennen → jälkeen) esimerkkisivujen heroista.
//   npm run animaatiot
// Kuvaa demon heron (390×844, 1,5×) vaihe vaiheelta. Demon app.js:n requestAnimationFrame korvataan
// käsin ohjattavalla kellolla, joten kehykset ovat samoissa kohdissa joka ajolla.
// Tulos: site/kuvat/esimerkit/anim-<sivu>.webp, 585×1266 = ruutu-<sivu>.webp:n ylin osa (hero).
import { chromium } from "playwright";
import sharp from "sharp";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, "../site");
const types = { ".html": "text/html", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".js": "text/javascript" };
const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(site, p);
  if (!file.startsWith(site)) { res.writeHead(403).end(); return; }
  try { const data = await readFile(file); res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" }).end(data); }
  catch { res.writeHead(404).end(); }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const sivut = ["halkola", "hongisto"];
const QUALITY = Number(process.env.ANIM_LAATU || 50);
const KEHYKSIA = Number(process.env.ANIM_KEHYKSIA || 12); // siirtymän kehykset, ennen- ja jälkeen-kuva lisäksi
const DUR = 3000;                                          // sama kuin demon app.js:n DUR
const ENNEN_MS = 700, JALKEEN_MS = 2500;                   // pysähdys ennen-kuvassa ja jälkeen-kuvassa

const browser = await chromium.launch({ channel: "chrome" });
for (const slug of sivut) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5 });
  // Käsin ohjattava requestAnimationFrame: ajan kuluminen vain window.__askel(ms) -kutsuilla
  await page.addInitScript(() => {
    let T = 0, jono = [];
    window.requestAnimationFrame = (cb) => { jono.push(cb); return jono.length; };
    window.__askel = (ms) => { T += ms; const j = jono; jono = []; j.forEach((f) => f(T)); };
  });
  await page.goto(`${base}/esimerkit/${slug}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: ".mbar { display: none !important; }" });
  await page.waitForFunction(() => document.documentElement.classList.contains("js-play"));
  await page.waitForTimeout(1200); // frame-kuvien lataus ja demon oma start()
  await page.evaluate(() => window.__askel(16)); // ensimmäinen tick asettaa t0:n
  const nayta = async () => {
    await page.waitForTimeout(60);
    return await page.screenshot({ type: "png" });
  };
  const kehykset = [{ buf: await nayta(), ms: ENNEN_MS }];
  let edellinenTeksti = false;
  for (let k = 1; k <= KEHYKSIA; k++) {
    await page.evaluate((ms) => window.__askel(ms), DUR / KEHYKSIA);
    const teksti = await page.evaluate(() => document.querySelector(".scrub-copy").classList.contains("show"));
    if (teksti && !edellinenTeksti) await page.waitForTimeout(1300); // tekstin ja varjostuksen siirtymät
    edellinenTeksti = teksti;
    kehykset.push({ buf: await nayta(), ms: Math.round(DUR / KEHYKSIA) });
  }
  await page.evaluate(() => window.__askel(100)); // viimeinen tick näyttää Katso uudelleen -painikkeen
  await page.waitForSelector(".replay.on");
  await page.waitForTimeout(600);
  kehykset.push({ buf: await nayta(), ms: JALKEEN_MS });
  await page.close();

  const pngt = kehykset.map((k) => k.buf);
  const leveys = 585, korkeus = 1266;
  const out = path.join(site, "kuvat", "esimerkit", `anim-${slug}.webp`);
  const info = await sharp(pngt, { join: { animated: true } })
    .webp({ quality: QUALITY, effort: 6, loop: 0, delay: kehykset.map((k) => k.ms), mixed: false, minSize: true })
    .toFile(out);
  console.log(`anim-${slug}.webp  ${leveys}×${korkeus}  ${kehykset.length} kehystä  ${Math.round(info.size / 1024)} kt  (laatu ${QUALITY})`);
}
await browser.close();
server.close();
