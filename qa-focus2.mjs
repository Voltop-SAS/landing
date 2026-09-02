import puppeteer from "puppeteer-core";
const b=await puppeteer.launch({executablePath:process.env.CHROME,headless:"new",args:["--no-sandbox"]});
const p=await b.newPage(); await p.setViewport({width:1280,height:900});
await p.goto("http://localhost:3000/es/red",{waitUntil:"domcontentloaded",timeout:60000});
await new Promise(x=>setTimeout(x,1500));
await p.bringToFront();
for(let i=0;i<12;i++){
  await p.keyboard.press("Tab");
  const d=await p.evaluate(()=>{const e=document.activeElement; return e?e.tagName+" :: "+(e.getAttribute("aria-label")||e.textContent||"").trim().slice(0,40)+" :: tabindex="+e.getAttribute("tabindex")+" :: focusVisible="+(e.matches(":focus-visible")):"NULL";});
  console.log(i,d);
}
console.log("--- focusables count ---", await p.evaluate(()=>document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"]),summary,video[controls]').length));
console.log("--- inert ancestors? ---", await p.evaluate(()=>[...document.querySelectorAll("[inert]")].map(e=>e.tagName+"."+String(e.className||"").slice(0,40))));
await b.close();
