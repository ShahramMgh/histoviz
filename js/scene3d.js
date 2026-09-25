/* ============================================================
   histoviz — "Constellation of Time": a 3D fly-through.
   Every event is a star on a time-helix; click one and the
   camera flies to it. Drag to orbit, scroll to zoom, ▶ auto-tour.
   Three.js is loaded lazily the first time this view opens.
   ============================================================ */
(function(){
"use strict";
const HV=window.HV; if(!HV)return;
const root=document.getElementById("scene3d"); if(!root)return;
const esc=s=>(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

let THREE=null, loaded=false, running=false, raf=null;
let scene,camera,renderer,controls,points,ray,mouse;
let evs=[],pos=[],focus=-1,flying=false,tour=false,tourT=0;
const camTarget={}, ctrlTarget={};

function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("load "+src));document.head.appendChild(s);});}
async function ensureThree(){
  if(window.THREE)return true;
  try{
    await loadScript("https://unpkg.com/three@0.128.0/build/three.min.js");
    await loadScript("https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js");
    return !!window.THREE;
  }catch(e){return false;}
}

function open(){
  root.hidden=false; document.body.style.overflow="hidden";
  root.innerHTML='<div class="s3-bar"><div class="s3-title">Constellation of Time</div>'+
    '<div class="s3-actions"><button class="btn" id="s3Tour">▶ Auto-tour</button>'+
    '<button class="fp-x" id="s3Close" aria-label="Close">×</button></div></div>'+
    '<div class="s3-hint">Drag to look · scroll to zoom · click a star to fly to it</div>'+
    '<div class="s3-canvas" id="s3Canvas"></div>'+
    '<div class="s3-tip" id="s3Tip" hidden></div>'+
    '<div class="s3-card" id="s3Card" hidden></div>';
  root.querySelector("#s3Close").onclick=close;
  root.querySelector("#s3Tour").onclick=toggleTour;
  ensureThree().then(ok=>{
    if(!ok){root.querySelector("#s3Canvas").innerHTML='<div class="s3-fail">Couldn’t load the 3D engine (offline?). The timeline and map still work.</div>';return;}
    THREE=window.THREE; init(); animate();
  });
}
function close(){
  running=false; if(raf)cancelAnimationFrame(raf);
  window.removeEventListener("resize",onResize);
  if(renderer){try{renderer.dispose();}catch(e){}}
  root.hidden=true; root.innerHTML=""; document.body.style.overflow="";
  scene=camera=renderer=controls=points=null;
}

function starTexture(){
  const c=document.createElement("canvas");c.width=c.height=64;const g=c.getContext("2d");
  const rad=g.createRadialGradient(32,32,0,32,32,32);
  rad.addColorStop(0,"rgba(255,255,255,1)");rad.addColorStop(.35,"rgba(255,255,255,.9)");
  rad.addColorStop(.7,"rgba(255,255,255,.25)");rad.addColorStop(1,"rgba(255,255,255,0)");
  g.fillStyle=rad;g.beginPath();g.arc(32,32,32,0,Math.PI*2);g.fill();
  const t=new THREE.Texture(c);t.needsUpdate=true;return t;
}

function init(){
  const host=root.querySelector("#s3Canvas");
  const W=host.clientWidth,H=host.clientHeight;
  scene=new THREE.Scene();
  const dark=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim()||"#0f1522";
  scene.fog=new THREE.FogExp2(0x0b0f18,0.0016);
  camera=new THREE.PerspectiveCamera(55,W/H,1,2000);camera.position.set(0,20,240);
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(W,H);
  host.appendChild(renderer.domElement);
  controls=new THREE.OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=20;controls.maxDistance=700;
  controls.autoRotate=true;controls.autoRotateSpeed=.35;

  // helix of events by time
  evs=HV.events().slice().sort((a,b)=>a.y-b.y);
  const n=evs.length,turns=4.2,R=70,Hh=260;
  const gpos=new Float32Array(n*3),gcol=new Float32Array(n*3),col=new THREE.Color();
  pos=[];
  for(let i=0;i<n;i++){
    const t=n>1?i/(n-1):0, a=t*turns*Math.PI*2, r=R*(0.55+0.45*Math.sin(t*Math.PI));
    const x=Math.cos(a)*r, y=(t-0.5)*Hh, z=Math.sin(a)*r;
    gpos[i*3]=x;gpos[i*3+1]=y;gpos[i*3+2]=z;pos.push(new THREE.Vector3(x,y,z));
    const er=HV.eraById(evs[i].e); col.set((er&&er.color)||"#cccccc");
    gcol[i*3]=col.r;gcol[i*3+1]=col.g;gcol[i*3+2]=col.b;
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute("position",new THREE.BufferAttribute(gpos,3));
  geo.setAttribute("color",new THREE.BufferAttribute(gcol,3));
  const mat=new THREE.PointsMaterial({size:9,map:starTexture(),vertexColors:true,transparent:true,
    depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true,alphaTest:.02});
  points=new THREE.Points(geo,mat);scene.add(points);
  // faint spine
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pos),
    new THREE.LineBasicMaterial({color:0x8899bb,transparent:true,opacity:.18}));
  scene.add(line);
  scene.add(new THREE.AmbientLight(0xffffff,.8));

  ray=new THREE.Raycaster();ray.params.Points.threshold=6;mouse=new THREE.Vector2();
  renderer.domElement.addEventListener("pointermove",onMove);
  renderer.domElement.addEventListener("click",onClick);
  window.addEventListener("resize",onResize);
  running=true;
}
function onResize(){if(!renderer)return;const host=root.querySelector("#s3Canvas");const W=host.clientWidth,H=host.clientHeight;camera.aspect=W/H;camera.updateProjectionMatrix();renderer.setSize(W,H);}

function pick(e){
  const rect=renderer.domElement.getBoundingClientRect();
  mouse.x=((e.clientX-rect.left)/rect.width)*2-1;
  mouse.y=-((e.clientY-rect.top)/rect.height)*2+1;
  ray.setFromCamera(mouse,camera);
  const hit=ray.intersectObject(points);
  return hit.length?hit[0].index:-1;
}
function onMove(e){
  const i=pick(e),tip=root.querySelector("#s3Tip");
  if(i>=0){renderer.domElement.style.cursor="pointer";
    tip.hidden=false;tip.textContent=evs[i].d+" — "+evs[i].t;
    tip.style.left=(e.clientX+14)+"px";tip.style.top=(e.clientY+14)+"px";}
  else{renderer.domElement.style.cursor="grab";tip.hidden=true;}
}
function onClick(e){const i=pick(e);if(i>=0)flyTo(i);}

function flyTo(i){
  focus=i;const p=pos[i];const n=p.clone().normalize();
  const camPos=p.clone().add(n.multiplyScalar(46)).add(new THREE.Vector3(0,10,0));
  camTarget.v=camPos;ctrlTarget.v=p.clone();flying=true;controls.autoRotate=false;
  showCard(i);
}
function showCard(i){
  const v=evs[i],er=HV.eraById(v.e),card=root.querySelector("#s3Card");
  card.hidden=false;
  card.innerHTML='<span class="panel-era" style="background:'+(er?er.color:"var(--muted)")+'">'+esc(er?HV.eraShort(er.name):"")+'</span>'+
    '<div class="s3-date">'+esc(v.d)+'</div><h3>'+esc(v.t)+'</h3>'+
    (v.p?'<div class="s3-place">'+esc(v.p)+'</div>':'')+
    '<p>'+esc((v.x||"").slice(0,220))+((v.x||"").length>220?"…":"")+'</p>'+
    '<div class="s3-cardbtns"><button class="btn primary" id="s3Open">Open full page ↗</button>'+
    '<button class="btn" id="s3Prev">‹</button><button class="btn" id="s3Next">›</button></div>';
  card.querySelector("#s3Open").onclick=()=>{const id=v.id;close();HV.openFull?HV.openFull(id):HV.selectEvent(id);};
  card.querySelector("#s3Prev").onclick=()=>flyTo((focus-1+evs.length)%evs.length);
  card.querySelector("#s3Next").onclick=()=>flyTo((focus+1)%evs.length);
}
function toggleTour(){tour=!tour;const b=root.querySelector("#s3Tour");if(b)b.textContent=tour?"⏸ Pause tour":"▶ Auto-tour";
  if(tour){tourT=0;if(focus<0)flyTo(0);}}

function animate(){
  if(!running)return;raf=requestAnimationFrame(animate);
  if(flying&&camTarget.v){
    camera.position.lerp(camTarget.v,.06);controls.target.lerp(ctrlTarget.v,.08);
    if(camera.position.distanceTo(camTarget.v)<1.2){flying=false;}
  }
  if(tour){tourT++;if(tourT>150){tourT=0;flyTo((focus+1)%evs.length);}}
  if(points)points.rotation.y+=0.0004;
  controls.update();renderer.render(scene,camera);
}

const btn=document.getElementById("btn3D");
if(btn)btn.onclick=()=>{try{open();}catch(e){HV.toast&&HV.toast("Could not open the 3D view.");}};
})();
