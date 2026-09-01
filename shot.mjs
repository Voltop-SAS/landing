import puppeteer from "puppeteer-core";

/**
 * CAPTURAS PARA REVISIÓN VISUAL
 *
 * Estaba obsoleto y por tanto no verificaba nada: apuntaba a anclas que ya no
 * existen (`#infra-medellin`, `#red-preview`, `#empresas-preview`, `#caso-ean`),
 * a `/red/san-fernando-plaza` cuando la ruta real es `/red/estacion/<slug>`, y a
 * URLs sin prefijo de idioma. Ahora recorre las rutas y anclas reales, cubre los
 * cuatro contextos que §22 exige diseñar y comprueba overflow horizontal.
 *
 *   node shot.mjs            # asume un servidor en :3000
 *   PORT=3131 node shot.mjs
 *
 * Las capturas van a /tmp/v-*.png. Requiere el sitio ya servido
 * (`npm run build && npm start`), porque el objetivo es revisar producción.
 */

const PORT = process.env.PORT ?? "3000";
const BASE = `http://localhost:${PORT}`;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

/** @param {string} name @param {string} path @param {number} w @param {number} h @param {string|null} anchor */
async function shot(name, path, w, h, anchor = null) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto(BASE + path, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 500));

  if (anchor) {
    /* Lenis controla el scroll, así que `scrollIntoView` es más fiable que
       `window.scrollTo`, y hace falta esperar a que el suavizado termine. */
    await page.evaluate((sel) => {
      document.querySelector(sel)?.scrollIntoView({ behavior: "instant", block: "start" });
    }, anchor);
    await new Promise((r) => setTimeout(r, 900));
  }

  await page.screenshot({ path: `/tmp/v-${name}.png` });
  await page.close();
}

/* Los beats de la Home, por su ancla real. */
const HOME_BEATS = [
  ["1-hero", null],
  ["2-infraestructura", "#infraestructura"],
  ["3-red", "#red"],
  ["4-empresas", "#empresas"],
  ["5-caso", "#caso"],
  ["6-novedades", "#novedades"],
  ["7-vision", "#vision"],
];

const ROUTES = [
  ["red", "/es/red"],
  ["red-como-cargar", "/es/red#como-cargar"],
  ["ciudad", "/es/red/medellin"],
  ["estacion", "/es/red/estacion/san-fernando-plaza"],
  ["empresas", "/es/empresas"],
  ["empresas-contacto", "/es/empresas#contacto"],
  ["nosotros", "/es/nosotros"],
  ["novedades", "/es/novedades"],
  ["novedad", "/es/novedades/apertura-universidad-ean"],
  ["privacidad", "/es/legal/privacidad"],
  ["404", "/es/ruta-inexistente"],
  ["home-en", "/en"],
  /* El portugués se revisa aparte y no por completismo: es sistemáticamente
     MÁS LARGO que el español —"Infraestrutura de carregamento" frente a
     "Infraestructura de carga"— así que es el idioma con más probabilidad de
     desbordar un titular, un botón o una celda. Si una composición se rompe
     por longitud de texto, se rompe aquí primero. */
  ["pt-home", "/pt"],
  ["pt-red", "/pt/red"],
  ["pt-empresas", "/pt/empresas"],
  ["pt-nosotros", "/pt/nosotros"],
  ["pt-novedades", "/pt/novedades"],
  ["pt-estacion", "/pt/red/estacion/san-fernando-plaza"],
];

/* §22 exige composición propia en cuatro contextos, así que se revisan los cuatro. */
const VIEWPORTS = [
  ["m", 390, 844],
  ["t", 768, 1024],
  ["l", 1280, 800],
  ["d", 1440, 900],
];

for (const [vp, w, h] of VIEWPORTS) {
  for (const [name, anchor] of HOME_BEATS) await shot(`${vp}-home-${name}`, "/es", w, h, anchor);
  for (const [name, path] of ROUTES) await shot(`${vp}-${name}`, path, w, h, null);
}

/* Overflow horizontal: umbral cero, no criterio. */
const OVERFLOW_WIDTHS = [320, 360, 390, 480, 640, 768, 834, 1024, 1280, 1440, 1920];
let overflows = 0;
for (const w of OVERFLOW_WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900 });
  for (const [, path] of ROUTES) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    if (sw > cw + 1) {
      console.error(`OVERFLOW ${w}px ${path}: ${sw} > ${cw}`);
      overflows += 1;
    }
  }
  await page.close();
}

await browser.close();
console.log(
  overflows === 0
    ? `OK · capturas en /tmp/v-*.png · sin overflow en ${OVERFLOW_WIDTHS.length} anchos × ${ROUTES.length} rutas`
    : `${overflows} overflow(s) detectado(s)`
);
process.exit(overflows === 0 ? 0 : 1);
