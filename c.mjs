import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: process.env.CHROME });
const p = await b.newPage();
await p.setViewport({ width: 1100, height: 620, deviceScaleFactor: 2 });
await p.goto("http://localhost:3000/es", { waitUntil: "networkidle0" });
await p.evaluate(() => scrollTo(0, 3400));
await new Promise(r => setTimeout(r, 1000));
await p.screenshot({ path: "/tmp/glass-medir.png" });

// contraste REAL: se mide sobre el pixel compuesto, no sobre el token
const r = await p.evaluate(() => { const d=document.querySelector(".glass.fixed").getBoundingClientRect(); return {x:Math.round(d.x),y:Math.round(d.y),w:Math.round(d.width),h:Math.round(d.height)}; });
console.log(JSON.stringify(r));
