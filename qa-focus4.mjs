import puppeteer from "puppeteer-core";
const CHROME=process.env.CHROME;
for(const r of ["/es/empresas","/es"]){
  const b=await puppeteer.launch({executablePath:CHROME,headless:"new",args:["--no-sandbox"]});
  const p=await b.newPage(); await p.setViewport({width:1280,height:900});
  await p.goto("http://localhost:3000"+r,{waitUntil:"domcontentloaded",timeout:60000});
  await new Promise(x=>setTimeout(x,1500));
  console.log("\n===== "+r+" =====");
  await p.evaluate(()=>{window.__seen=[];});
  for(let i=0;i<80;i++){
    await p.keyboard.press("Tab");
    const d=await p.evaluate((i)=>{
      const e=document.activeElement;
      if(!e||e===document.body)return"BODY";
      const cs=getComputedStyle(e);
      return `${e.tagName}${e.id?"#"+e.id:""}${e.name?"[name="+e.name+"]":""} type=${e.type||"-"} out="${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}" sh=${cs.boxShadow==="none"?"none":"yes"} txt="${(e.getAttribute("aria-label")||e.textContent||e.placeholder||"").trim().slice(0,35)}"`;
    },i);
    console.log(String(i).padStart(2),d);
    if(d==="BODY")break;
  }
  await b.close();
}
