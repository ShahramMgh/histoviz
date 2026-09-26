/* ============================================================
   histoviz — "Map of Time": full-view serpentine timeline
   Winds horizontally then down (boustrophedon), one connected
   era-coloured path strung cleanly through every event's dot.
   Depends on window.HV.
   ============================================================ */
(function(){
"use strict";
const HV=window.HV; if(!HV)return;
const root=document.getElementById("mapoftime"); if(!root)return;
const esc=s=>(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let open=false, rt=null;

function show(){
  open=true; root.hidden=false; document.body.style.overflow="hidden";
  const eras=window.ERAS||[];
  const legend=eras.map(e=>'<span class="mot-key"><i style="--c:'+e.color+'"></i>'+esc(e.name)+'</span>').join("");
  root.innerHTML=
    '<div class="mot-bar">'+
      '<div class="mot-head">'+
        '<div class="mot-title">The Map of Time</div>'+
        '<div class="mot-sub">'+HV.events().length+' moments · oldest → newest</div>'+
      '</div>'+
      '<div class="mot-legend" aria-label="Era colours">'+legend+'</div>'+
      '<button class="fp-x" id="motClose" aria-label="Close">×</button>'+
    '</div>'+
    '<div class="mot-scroll" id="motScroll"><div class="mot-stage" id="motStage">'+
      '<svg class="mot-svg" id="motSvg" aria-hidden="true"></svg><div class="mot-flow" id="motFlow"></div>'+
    '</div></div>';
  root.querySelector("#motClose").onclick=hide;
  build();
}
function hide(){open=false;root.hidden=true;document.body.style.overflow="";root.innerHTML="";}

function build(){
  const flow=root.querySelector("#motFlow"), stage=root.querySelector("#motStage"), svg=root.querySelector("#motSvg");
  if(!flow)return;
  const evs=HV.events().slice().sort((a,b)=>a.y-b.y);
  const width=stage.clientWidth||root.clientWidth||1000;
  const K=Math.max(2,Math.floor(width/210));           // nodes per row
  flow.innerHTML="";
  const els=[];
  for(let i=0;i<evs.length;i+=K){
    const rowEvs=evs.slice(i,i+K), rev=((i/K)|0)%2===1;
    const row=document.createElement("div");
    row.className="mot-row"+(rev?" rev":"");
    rowEvs.forEach((v,j)=>{
      const er=HV.eraById(v.e), c=er?er.color:"var(--muted)";
      const b=document.createElement("button");
      b.className="mot-node"; b.dataset.id=v.id; b.style.setProperty("--c",c);
      b.style.animationDelay=Math.min((i+j)*4,560)+"ms";
      b.title=v.t+(er?" · "+er.name:"");
      b.innerHTML='<span class="mot-dot"></span>'+
        '<span class="mot-yr">'+esc(v.d)+'</span><span class="mot-ti">'+esc(v.t)+'</span>';
      b.onclick=()=>{hide();HV.openFull?HV.openFull(v.id):HV.selectEvent(v.id);};
      row.appendChild(b); els.push({el:b,c});
    });
    flow.appendChild(row);
  }
  // draw the connecting path once laid out — thread it through the dots (not the labels)
  requestAnimationFrame(()=>{
    const srect=stage.getBoundingClientRect();
    const pts=els.map(o=>{
      const d=o.el.querySelector(".mot-dot")||o.el;
      const r=d.getBoundingClientRect();
      return {x:r.left-srect.left+r.width/2, y:r.top-srect.top+r.height/2, c:o.c};
    });
    svg.setAttribute("width",stage.scrollWidth); svg.setAttribute("height",stage.scrollHeight);
    svg.setAttribute("viewBox","0 0 "+stage.scrollWidth+" "+stage.scrollHeight);
    let glow="", line="";
    for(let i=0;i<pts.length-1;i++){
      const a=pts[i],b=pts[i+1],mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
      const d='M '+a.x+' '+a.y+' Q '+a.x+' '+my+' '+mx+' '+my+' T '+b.x+' '+b.y;
      glow+='<path d="'+d+'" stroke="'+a.c+'" stroke-width="15" fill="none" stroke-linecap="round" opacity=".13"/>';
      line+='<path d="'+d+'" stroke="'+a.c+'" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".9"/>';
    }
    svg.innerHTML=glow+line;   // glow first, crisp line on top
  });
}

function onResize(){if(!open)return;clearTimeout(rt);rt=setTimeout(build,180);}
window.addEventListener("resize",onResize);
document.addEventListener("keydown",e=>{if(open&&e.key==="Escape")hide();});

const btn=document.getElementById("btnFullView");
if(btn)btn.onclick=()=>{try{show();}catch(e){HV.toast&&HV.toast("Could not open the Map of Time.");}};
})();
