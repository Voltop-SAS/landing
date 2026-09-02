import puppeteer from "puppeteer-core";
import fs from "node:fs";
const CHROME = process.env.CHROME;
const BASE = "http://localhost:3000";
const OUT = "/private/tmp/claude-501/-Users-siendo-kam-voltop-web-redesign/0edda7c3-d2da-4ca8-b633-7822e94469a1/scratchpad/qa";
const ROUTES = ["/es","/es/red","/es/empresas","/es/nosotros","/es/novedades","/es/legal/terminos","/es/legal/privacidad","/es/red/medellin","/es/red/estacion/san-fernando-plaza","/en","/pt"];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args:["--no-sandbox","--disable-gpu","--force-color-profile=srgb"] });
const out = { reducedMotion: {}, focus: {}, tokens: null };

// ---- prefers-reduced-motion: nada invisible ----
{
  const page = await browser.newPage();
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.setViewport({ width: 1280, height: 900 });
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise(x=>setTimeout(x,900));
    const bad = await page.evaluate(() => {
      const res = [];
      document.querySelectorAll("body *").forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const op = parseFloat(cs.opacity);
        const b = el.getBoundingClientRect();
        if (b.width===0 && b.height===0) return;
        const txt = (el.textContent||"").trim();
        const tr = cs.transform;
        let shifted = false;
        if (tr && tr !== "none") {
          const m = tr.match(/matrix\(([^)]+)\)/);
          if (m) { const p = m[1].split(",").map(Number); if (Math.abs(p[4])>2 || Math.abs(p[5])>2) shifted = true; }
          const m3 = tr.match(/matrix3d\(([^)]+)\)/);
          if (m3) { const p = m3[1].split(",").map(Number); if (Math.abs(p[12])>2||Math.abs(p[13])>2) shifted = true; }
        }
        if ((op < 0.99 && txt.length>0) || shifted) {
          res.push({ tag: el.tagName, op, transform: tr==="none"?null:tr,
            cls: String(el.className?.baseVal ?? el.className ?? "").slice(0,70),
            txt: txt.slice(0,45) });
        }
      });
      // dedupe by cls+txt
      const seen = new Set(); return res.filter(x=>{const k=x.cls+x.txt; if(seen.has(k))return false; seen.add(k); return true;}).slice(0,25);
    });
    // scroll a lo largo de la página para descubrir reveals no disparados
    const deep = await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y=0;y<h;y+=600) { window.scrollTo({top:y,behavior:"instant"}); await new Promise(r=>setTimeout(r,60)); }
      window.scrollTo({top:0,behavior:"instant"});
      await new Promise(r=>setTimeout(r,300));
      const res=[];
      document.querySelectorAll("body *").forEach(el=>{
        const cs=getComputedStyle(el); if(cs.display==="none"||cs.visibility==="hidden")return;
        const op=parseFloat(cs.opacity); const txt=(el.textContent||"").trim();
        if(op<0.99 && txt.length>0) res.push({op, cls:String(el.className?.baseVal??el.className??"").slice(0,70), txt:txt.slice(0,45)});
      });
      const seen=new Set(); return res.filter(x=>{const k=x.cls+x.txt;if(seen.has(k))return false;seen.add(k);return true;}).slice(0,25);
    });
    if (bad.length || deep.length) out.reducedMotion[r] = { initial: bad, afterScroll: deep };
  }
  await page.close();
}
console.log("== REDUCED MOTION (opacidad<1 o desplazado) ==");
console.log(JSON.stringify(out.reducedMotion, null, 1));

// ---- foco visible: recorrer con Tab ----
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  for (const r of ["/es","/es/red","/es/empresas","/es/legal/terminos"]) {
    await page.goto(BASE + r, { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise(x=>setTimeout(x,400));
    const bad = [];
    const seen = new Set();
    for (let i=0;i<120;i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        const ow = cs.outlineWidth, os = cs.outlineStyle, oc = cs.outlineColor;
        const bs = cs.boxShadow;
        const hasOutline = os !== "none" && parseFloat(ow) > 0 && !/rgba\(0,\s*0,\s*0,\s*0\)|transparent/.test(oc);
        const hasShadow = bs && bs !== "none";
        const id = el.tagName+"|"+String(el.className?.baseVal??el.className??"").slice(0,50)+"|"+(el.textContent||"").trim().slice(0,25);
        return { id, tag: el.tagName, outline: `${os} ${ow} ${oc}`, boxShadow: (bs||"").slice(0,80),
          hasOutline, hasShadow, visible: b.width>0&&b.height>0,
          inView: b.top >= -5 && b.bottom <= innerHeight+5,
          txt: (el.getAttribute("aria-label")||el.textContent||"").trim().slice(0,40) };
      });
      if (!info) break;
      if (seen.has(info.id)) break;
      seen.add(info.id);
      if (!info.hasOutline && !info.hasShadow) bad.push(info);
    }
    out.focus[r] = { tabbed: seen.size, noIndicator: bad };
  }
  await page.close();
}
console.log("== FOCO ==");
console.log(JSON.stringify(out.focus, null, 1));

fs.writeFileSync(OUT+"/results-2.json", JSON.stringify(out,null,1));
await browser.close();
