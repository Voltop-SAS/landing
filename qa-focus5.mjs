import puppeteer from "puppeteer-core";
const b=await puppeteer.launch({executablePath:process.env.CHROME,headless:"new",args:["--no-sandbox"]});
const p=await b.newPage(); await p.setViewport({width:1280,height:900});
await p.goto("http://localhost:3000/es",{waitUntil:"domcontentloaded",timeout:60000});
await new Promise(x=>setTimeout(x,1500));
const bad=[];
for(let i=0;i<50;i++){
  await p.keyboard.press("Tab");
  await new Promise(x=>setTimeout(x,450)); // dejar terminar transition-colors
  const d=await p.evaluate(()=>{
    const e=document.activeElement; if(!e||e===document.body)return null;
    const cs=getComputedStyle(e);
    return {tag:e.tagName, txt:(e.getAttribute("aria-label")||e.textContent||"").trim().slice(0,38),
      style:cs.outlineStyle,width:cs.outlineWidth,color:cs.outlineColor,offset:cs.outlineOffset,
      shadow:cs.boxShadow==="none"?"none":"yes"};
  });
  if(!d){console.log(i,"BODY");break;}
  const ok = d.style!=="none" && parseFloat(d.width)>0;
  if(!ok) bad.push({i,...d});
  console.log(String(i).padStart(2), ok?"OK ":"FAIL", d.style, d.width, d.color, "|", d.tag, d.txt);
}
console.log("\nFAILS:", JSON.stringify(bad,null,1));
await b.close();
