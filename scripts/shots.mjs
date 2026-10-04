// Capturas de revisión visual: node scripts/shots.mjs <baseUrl> <outDir> [ruta...]
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const [base = "http://localhost:3100", out = "shots", ...paths] = process.argv.slice(2);
const routes = (paths.length ? paths : ["es"]).map((p) => "/" + p.replace(/^\/+/, ""));
fs.mkdirSync(out, { recursive: true });

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
];

const browser = await chromium.launch();
const errors = [];
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`[${vp.name}] pageerror ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`[${vp.name}] console ${m.text()}`));
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    await page.waitForSelector("#preloader", { state: "detached", timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1800);
    const name = r.replace(/\W+/g, "_") || "root";
    await page.screenshot({ path: path.join(out, `${name}-${vp.name}-top.png`) });
    // desplazar para disparar animaciones de entrada
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += Math.round(vp.height * 0.7)) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(220);
    }
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(out, `${name}-${vp.name}-full.png`), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) errors.push(`[${vp.name}] ${r} horizontal overflow ${overflow}px`);
  }
  await ctx.close();
}
await browser.close();
console.log(errors.length ? errors.join("\n") : "sin errores");
