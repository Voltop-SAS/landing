import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: process.env.CHROME, headless:"new", args:["--no-sandbox"] });
for (const mode of ["reduce","no-preference"]) {
  const p = await b.newPage();
  await p.emulateMediaFeatures([{ name:"prefers-reduced-motion", value: mode }]);
  await p.setViewport({width:1280,height:900});
  await p.goto("http://localhost:3000/es",{waitUntil:"domcontentloaded",timeout:60000});
  await new Promise(r=>setTimeout(r,1200));
  const d = await p.evaluate(()=>{
    const mm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = [...document.querySelectorAll("[data-reveal]")];
    const zero = els.filter(e=>parseFloat(getComputedStyle(e).opacity)<0.99);
    return { mm, total: els.length, zero: zero.length,
      sample: zero.slice(0,3).map(e=>({op:getComputedStyle(e).opacity, inline:e.getAttribute("style"), tr:getComputedStyle(e).transform, txt:(e.textContent||"").trim().slice(0,40)})) };
  });
  console.log(mode, JSON.stringify(d,null,1));
  // check served HTML for reduced motion (no JS)
  await p.close();
}
// Sin JavaScript
const p2 = await b.newPage();
await p2.setJavaScriptEnabled(false);
await p2.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
await p2.setViewport({width:1280,height:900});
await p2.goto("http://localhost:3000/es",{waitUntil:"domcontentloaded",timeout:60000});
await new Promise(r=>setTimeout(r,800));
console.log("NOJS", JSON.stringify(await p2.evaluate(()=>{
  const els=[...document.querySelectorAll("[data-reveal]")];
  return {total:els.length, zero:els.filter(e=>parseFloat(getComputedStyle(e).opacity)<0.99).length};
})));
await b.close();
