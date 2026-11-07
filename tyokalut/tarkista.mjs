// Tarkistaa, ettei millään sivulla ole vaakavieritystä leveyksillä 320–1440 px.
//   npm run tarkista
import { chromium } from "playwright";
import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../site");
const types = { ".html": "text/html", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".js": "text/javascript" };
const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(site, p);
  try { res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" }).end(await readFile(file)); }
  catch { res.writeHead(404).end(); }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const pages = ["/", "/404.html", "/esimerkit/pikkupaahtimo/", "/esimerkit/kaislaranta/", "/esimerkit/kulmapaa/"];
const widths = [320, 360, 375, 390, 414, 768, 1024, 1280, 1440];
const browser = await chromium.launch({ channel: "chrome" });
let fails = 0;
for (const url of pages) {
  const row = [];
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.route("**/cloudflareinsights.com/**", (r) => r.abort());
    await page.goto(base + url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const off = [...document.querySelectorAll("body *")]
        .filter((e) => e.getBoundingClientRect().right > de.clientWidth + 0.5 && e.getBoundingClientRect().width > 0 && !e.closest("[style*=overflow],.ticker"))
        .slice(0, 3).map((e) => `${e.tagName.toLowerCase()}.${e.className}`);
      return { sw: de.scrollWidth, cw: de.clientWidth, off };
    });
    if (r.sw > r.cw) { fails++; row.push(`${w}: YLIVUOTO ${r.sw}>${r.cw} ${r.off.join(", ")}`); } else row.push(`${w} ok`);
    await page.close();
  }
  console.log(url.padEnd(28), row.join(" · "));
}
await browser.close(); server.close();
console.log(fails ? `\n${fails} ylivuotoa` : "\nEi vaakavieritystä.");
process.exit(fails ? 1 : 0);
