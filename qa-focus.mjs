import puppeteer from "puppeteer-core";
import fs from "node:fs";
const CHROME=process.env.CHROME, BASE="http://localhost:3000";
const OUT="/private/tmp/claude-501/-Users-siendo-kam-voltop-web-redesign/0edda7c3-d2da-4ca8-b633-7822e94469a1/scratchpad/qa";
const b = await puppeteer.launch({executablePath:CHROME, headless:"new", args:["--no-sandbox","--force-color-profile=srgb"]});
const ROUTES=["/es","/es/red","/es/empresas","/es/nosotros","/es/legal/terminos","/es/red/estacion/san-fernando-plaza"];
const res={};
for (const r of ROUTES){
  const p=await b.newPage();
  await p.setViewport({width:1280,height:900});
  await p.goto(BASE+r,{waitUntil:"domcontentloaded",timeout:60000});
  await p.bringToFront(); await new Promise(x=>setTimeout(x,1800));
  
  const seq=[]; const bad=[]; let stuck=0; let lastId=null;
  for(let i=0;i<200;i++){
    await p.keyboard.press("Tab");
    const info=await p.evaluate(()=>{
      const el=document.activeElement;
      if(!el||el===document.body) return {body:true};
      const cs=getComputedStyle(el), bb=el.getBoundingClientRect();
      const os=cs.outlineStyle, ow=parseFloat(cs.outlineWidth)||0, oc=cs.outlineColor, oo=parseFloat(cs.outlineOffset)||0;
      const bs=cs.boxShadow||"none";
      const transparent=/rgba\([^)]*,\s*0\)/.test(oc);
      const hasOutline= os!=="none" && ow>0 && !transparent;
      const hasShadow= bs!=="none";
      const clipped = (()=>{ let n=el.parentElement; while(n&&n!==document.body){const c=getComputedStyle(n); if(c.overflow!=="visible"&&c.overflow!=="") {const pb=n.getBoundingClientRect(); if(bb.top<pb.top-1||bb.bottom>pb.bottom+1||bb.left<pb.left-1||bb.right>pb.right+1) return n.tagName+"."+String(n.className?.baseVal??n.className??"").slice(0,40);} n=n.parentElement;} return null;})();
      return {body:false, tag:el.tagName,
        id: el.tagName+"|"+String(el.className?.baseVal??el.className??"").slice(0,60)+"|"+(el.textContent||"").trim().slice(0,30),
        txt:(el.getAttribute("aria-label")||el.textContent||"").trim().slice(0,45),
        outline:`${os} ${ow}px ${oc} off:${oo}`, boxShadow:bs.slice(0,90), hasOutline, hasShadow,
        w:+bb.width.toFixed(1), h:+bb.height.toFixed(1),
        inViewport: bb.top>=-2 && bb.bottom<=innerHeight+2,
        top:Math.round(bb.top), scrollY:Math.round(window.scrollY), clipped};
    });
    if(info.body){ seq.push("<body/end>"); break; }
    if(info.id===lastId){ stuck++; if(stuck>2) { seq.push("STUCK on "+info.id); break; } } else stuck=0;
    lastId=info.id;
    seq.push(info);
    if(!info.hasOutline && !info.hasShadow) bad.push(info);
  }
  const offscreen = seq.filter(s=>typeof s==="object" && !s.inViewport);
  const clipped = seq.filter(s=>typeof s==="object" && s.clipped);
  res[r]={count:seq.length, noIndicator:bad.map(x=>({txt:x.txt,tag:x.tag,outline:x.outline,boxShadow:x.boxShadow})),
    offscreenCount:offscreen.length, offscreenSample:offscreen.slice(0,5).map(x=>({txt:x.txt,top:x.top,scrollY:x.scrollY})),
    clipped: clipped.slice(0,5).map(x=>({txt:x.txt,by:x.clipped})),
    outlineStyles:[...new Set(seq.filter(s=>typeof s==="object").map(s=>s.outline))].slice(0,8),
    last: typeof seq[seq.length-1]==="string"?seq[seq.length-1]:"ok"};
  await p.close();
}
console.log(JSON.stringify(res,null,1));
fs.writeFileSync(OUT+"/focus.json",JSON.stringify(res,null,1));
await b.close();
