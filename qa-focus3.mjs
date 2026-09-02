import puppeteer from "puppeteer-core";
import fs from "node:fs";
const CHROME=process.env.CHROME, BASE="http://localhost:3000";
const OUT="/private/tmp/claude-501/-Users-siendo-kam-voltop-web-redesign/0edda7c3-d2da-4ca8-b633-7822e94469a1/scratchpad/qa";
const ROUTES=["/es","/es/red","/es/empresas","/es/nosotros","/es/novedades","/es/legal/terminos","/es/red/medellin","/es/red/estacion/san-fernando-plaza"];
const res={};
for(const r of ROUTES){
  const b=await puppeteer.launch({executablePath:CHROME,headless:"new",args:["--no-sandbox","--force-color-profile=srgb"]});
  const p=await b.newPage(); await p.setViewport({width:1280,height:900});
  await p.goto(BASE+r,{waitUntil:"domcontentloaded",timeout:60000});
  await new Promise(x=>setTimeout(x,1500));
  const seq=[],bad=[];let last=null,stuck=0;
  for(let i=0;i<250;i++){
    await p.keyboard.press("Tab");
    const info=await p.evaluate(()=>{
      const el=document.activeElement;
      if(!el||el===document.body)return{body:true};
      const cs=getComputedStyle(el),bb=el.getBoundingClientRect();
      const os=cs.outlineStyle,ow=parseFloat(cs.outlineWidth)||0,oc=cs.outlineColor;
      const transparent=/rgba\([^)]*,\s*0\)/.test(oc);
      const hasOutline=os!=="none"&&ow>0&&!transparent;
      const bs=cs.boxShadow||"none";
      return{body:false,tag:el.tagName,
        id:el.tagName+"|"+String(el.className?.baseVal??el.className??"").slice(0,60)+"|"+(el.textContent||"").trim().slice(0,30),
        txt:(el.getAttribute("aria-label")||el.textContent||"").trim().slice(0,45),
        outline:`${os} ${ow}px ${oc}`,boxShadow:bs.slice(0,80),hasOutline,hasShadow:bs!=="none",
        fv:el.matches(":focus-visible"),
        inV:bb.top>=-2&&bb.bottom<=innerHeight+2,top:Math.round(bb.top),sy:Math.round(scrollY),
        w:+bb.width.toFixed(1),h:+bb.height.toFixed(1)};
    });
    if(info.body){seq.push("END");break;}
    if(info.id===last){stuck++;if(stuck>2){seq.push("STUCK:"+info.id);break;}}else stuck=0;
    last=info.id; seq.push(info);
    if(!info.hasOutline&&!info.hasShadow)bad.push(info);
  }
  const objs=seq.filter(s=>typeof s==="object");
  res[r]={tabStops:objs.length,end:typeof seq.at(-1)==="string"?seq.at(-1):"maxed",
    noIndicator:bad.map(x=>({tag:x.tag,txt:x.txt,outline:x.outline,shadow:x.boxShadow})),
    offscreen:objs.filter(x=>!x.inV).map(x=>({txt:x.txt,top:x.top,sy:x.sy})).slice(0,6),
    outlineStyles:[...new Set(objs.map(o=>o.outline))],
    small:objs.filter(x=>x.w<24||x.h<24).map(x=>({txt:x.txt,w:x.w,h:x.h})).slice(0,8)};
  await b.close();
}
console.log(JSON.stringify(res,null,1));
fs.writeFileSync(OUT+"/focus.json",JSON.stringify(res,null,1));
