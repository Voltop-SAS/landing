import puppeteer from "puppeteer-core";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--force-prefers-reduced-motion"],
});

async function shot(name, url, w, h, id) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:3000${url}`, { waitUntil: "networkidle0" });
  if (id) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 88);
    }, id);
    await new Promise((r) => setTimeout(r, 450));
  }
  await page.screenshot({ path: `/tmp/v-${name}.png` });
  await page.close();
}

// Home beats (desktop)
await shot("home-hero", "/", 1440, 900, null);
await shot("home-medellin", "/", 1440, 900, "#infra-medellin");
await shot("home-redpreview", "/", 1440, 900, "#red-preview");
await shot("home-empresaspreview", "/", 1440, 900, "#empresas-preview");
await shot("home-ean", "/", 1440, 900, "#caso-ean");
await shot("home-vision", "/", 1440, 900, "#vision");
// Rutas internas (top)
await shot("red", "/red", 1440, 900, null);
await shot("estacion", "/red/san-fernando-plaza", 1440, 900, null);
await shot("empresas", "/empresas", 1440, 900, null);
await shot("nosotros", "/nosotros", 1440, 900, null);
// Móvil
await shot("m-home", "/", 390, 844, null);

await browser.close();
console.log("OK");
