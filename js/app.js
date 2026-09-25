/* ============================================================
   histoviz — app logic
   Depends on: window.CATS, window.ERAS, window.EV (js/data.js), Leaflet + markercluster
   ============================================================ */
(function(){
"use strict";
const CATS=window.CATS, ERAS=window.ERAS, EV=window.EV;
const byId={}; EV.forEach(v=>byId[v.id]=v);
// Merge additive enrichment (photos, body, refs, related) from js/enrich.js, keyed by id.
const ENRICH=window.ENRICH||{};
Object.keys(ENRICH).forEach(id=>{if(byId[id])Object.assign(byId[id],ENRICH[id]);});
const HV=(window.HV=window.HV||{});   // shared API for the other view modules

const active=new Set(Object.keys(CATS));
const flags={unesco:false,debated:false};
let query="";
let activeEra=null;       // when set, the era rail filters to just this era
let visibleOrder=[];      // ids in current display order
let activeId=null;

const $=s=>document.querySelector(s);
const tlScrollEl=$("#tlScroll");
function esc(s){return (s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

/* ---------- Auth: users & roles (client-side convenience layer, NOT real security) ---------- */
const AUKEY="hv-users", ASKEY="hv-session";
let users=[]; try{users=JSON.parse(localStorage.getItem(AUKEY)||"[]")||[];}catch(e){users=[];}
let session=null; try{session=localStorage.getItem(ASKEY)||null;}catch(e){}
function saveUsers(){try{localStorage.setItem(AUKEY,JSON.stringify(users));}catch(e){}}
function setSession(u){session=u;try{u?localStorage.setItem(ASKEY,u):localStorage.removeItem(ASKEY);}catch(e){}}
function currentUser(){return users.find(u=>u.username===session)||null;}
function isAdmin(){const u=currentUser();return !!u&&u.role==="admin";}
function isEditor(){return !!currentUser();}          // any signed-in user may add content
function canEdit(ev){if(!currentUser())return false;return isAdmin()||(!!ev&&ev.owner===session);} // admins edit all; users edit only their own
function adminCount(){return users.filter(u=>u.role==="admin").length;}
async function hashPass(pw,salt){
  salt=salt||(Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2));
  const data=new TextEncoder().encode(salt+"::"+pw); let hex;
  if(typeof crypto!=="undefined"&&crypto.subtle){
    const buf=await crypto.subtle.digest("SHA-256",data);
    hex=[...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
  }else{let h=5381;for(let i=0;i<data.length;i++)h=((h*33)^data[i])>>>0;hex="x"+h.toString(16);}
  return {salt,hash:hex};
}
async function verifyPass(user,pw){const r=await hashPass(pw,user.salt);return r.hash===user.hash;}
function refreshAuth(){
  const u=currentUser();
  const set=(id,hide)=>{const el=$(id);if(el)el.hidden=hide;};
  set("#btnAdd",!isEditor());
  set("#btnUsers",!isAdmin());
  set("#btnSignIn",!!u);
  set("#btnSignOut",!u);
  const chip=$("#userChip");
  if(chip){chip.hidden=!u;if(u)$("#userLabel").textContent="👤 "+u.username+" · "+(u.role==="admin"?"Admin":"User");}
}

/* ---------- Admin: user-added events (saved in localStorage) ---------- */
const UKEY="hv-user-events";
let userEvents=[]; try{userEvents=JSON.parse(localStorage.getItem(UKEY)||"[]")||[];}catch(e){userEvents=[];}
const userIds=new Set();
function applyUserEvents(){
  userIds.forEach(id=>{const i=EV.findIndex(v=>v.id===id);if(i>=0)EV.splice(i,1);delete byId[id];});
  userIds.clear();
  userEvents.forEach(v=>{EV.push(v);byId[v.id]=v;userIds.add(v.id);});
}
function persistUser(){try{localStorage.setItem(UKEY,JSON.stringify(userEvents));}catch(e){}}
function eraForYear(y){for(const er of ERAS){if(y>=er.start&&y<er.end)return er.id;}
  return y<ERAS[0].start?ERAS[0].id:ERAS[ERAS.length-1].id;}
applyUserEvents();

/* ---------- Overrides for curated (base/enrich) events ---------- */
let overrides={}; try{overrides=JSON.parse(localStorage.getItem("hv-overrides")||"{}")||{};}catch(e){overrides={};}
function saveOverrides(){try{localStorage.setItem("hv-overrides",JSON.stringify(overrides));}catch(e){}}
function applyOverrides(){Object.keys(overrides).forEach(id=>{if(byId[id])Object.assign(byId[id],overrides[id]);});}
applyOverrides();
// Persist rich content (article HTML, gallery, refs, …) for any event; routes to userEvents or overrides.
function saveEventContent(id,patch){
  const ev=byId[id]; if(!ev)return false;
  if(userIds.has(id)){const i=userEvents.findIndex(u=>u.id===id);if(i>=0){Object.assign(userEvents[i],patch);persistUser();}}
  else{overrides[id]=Object.assign(overrides[id]||{},patch);saveOverrides();}
  Object.assign(ev,patch); render(); return true;
}

/* ---------- Theme ---------- */
const THEMES=["auto","light","dark","parchment"];
function applyTheme(t){
  document.documentElement.setAttribute("data-theme",t);
  try{localStorage.setItem("hv-theme",t);}catch(e){}
  document.querySelectorAll("#themeSeg button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.theme===t));
  applyMapTheme();
}
function effDark(){
  const t=document.documentElement.getAttribute("data-theme");
  if(t==="dark")return true;
  if(t==="light"||t==="parchment")return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function effParchment(){return document.documentElement.getAttribute("data-theme")==="parchment";}

/* ---------- Ribbon ---------- */
const ERA_ICON={pal:"🦴",epi:"🏹",neo:"🌾",chal:"🏺",bronze:"⚒️",iron:"🗡️",ach:"👑",hel:"⚔️",par:"🐎",sas:"🔥",later:"🕌"};
function eraShort(nm){return nm.split(":")[0].replace(" (Arsacid) Empire","").replace(" Empire","").replace("Achaemenid Persia","Achaemenid").replace("Alexander & the Seleucids","Seleucid");}
const ribbon=$("#ribbon");
const TOTAL=ERAS[ERAS.length-1].end-ERAS[0].start;
ERAS.forEach(er=>{
  const count=EV.filter(v=>v.e===er.id).length;
  const b=document.createElement("button");
  b.type="button"; b.style.setProperty("--erc",er.color); b.dataset.era=er.id;
  b.dataset.frac=((er.end-er.start)/TOTAL).toString();
  b.title=er.name+" ("+er.span+") · "+count+" events";
  b.setAttribute("aria-label","Jump to "+er.name+", "+count+" events");
  b.innerHTML='<span class="era-yrs">'+esc(er.short||er.span.replace(/c\. /g,""))+'</span>'+
    '<span class="era-name">'+esc(eraShort(er.name))+'</span>';
  b.addEventListener("click",()=>{
    // Toggle: click an era to filter to it; click it again to show every era.
    activeEra=(activeEra===er.id)?null:er.id;
    // Reflect the selection in the rail
    [...ribbon.children].forEach(x=>x.setAttribute("aria-current",(activeEra&&x===b)?"true":"false"));
    render();                                   // re-filter the timeline + map markers
    if(activeEra){
      const g=document.getElementById("tlera-"+er.id);
      if(g)$("#tlScroll").scrollTo({left:g.offsetLeft-8,behavior:"smooth"});
      const pts=EV.filter(v=>v.e===er.id&&isFinite(v.lat)&&isFinite(v.lng)).map(v=>[v.lat,v.lng]);
      if(pts.length){try{map.fitBounds(pts,{padding:[45,45],maxZoom:7,animate:true});}catch(e){}}
      toast("Filtered to "+eraShort(er.name)+" — click it again to show all");
    }else{
      map.setView(HOME_CENTER,HOME_ZOOM);        // cleared → back to the whole region
      toast("Showing all eras");
    }
  });
  ribbon.appendChild(b);
});
function setScale(trueScale){
  ribbon.classList.toggle("true",trueScale);
  [...ribbon.children].forEach(b=>{
    const f=parseFloat(b.dataset.frac);
    b.style.flex=trueScale?"0 0 calc("+(f*100)+"% - 2px)":"1 1 0";
    b.classList.toggle("narrow",trueScale&&f<0.06);
  });
  $("#btnTrue").setAttribute("aria-pressed",trueScale);
  $("#btnEven").setAttribute("aria-pressed",!trueScale);
  $("#ribbonNote").textContent=trueScale
    ?"True scale: the Palaeolithic alone fills over 80% of the bar. Everything from the first writing (c. 3100 BCE) to 651 CE takes under 4%."
    :"Each era gets equal space here. Switch to true scale to see how thin recorded history is.";
}
$("#btnTrue").onclick=()=>setScale(true);
$("#btnEven").onclick=()=>setScale(false);

/* ---------- Chips + flags ---------- */
const chips=$("#chips");
Object.entries(CATS).forEach(([k,v])=>{
  const b=document.createElement("button");
  b.type="button"; b.className="chip"; b.setAttribute("aria-pressed","true");
  b.innerHTML='<i style="background:'+v.color+'"></i>'+esc(v.name);
  b.onclick=()=>{active.has(k)?active.delete(k):active.add(k);b.setAttribute("aria-pressed",active.has(k));render();};
  chips.appendChild(b);
});
$("#fUnesco").onclick=e=>{flags.unesco=!flags.unesco;e.currentTarget.setAttribute("aria-pressed",flags.unesco);render();};
$("#fDebated").onclick=e=>{flags.debated=!flags.debated;e.currentTarget.setAttribute("aria-pressed",flags.debated);render();};
$("#search").addEventListener("input",e=>{query=e.target.value.trim().toLowerCase();render();});

function matches(v,er){
  if(activeEra&&v.e!==activeEra)return false;
  if(!active.has(v.c))return false;
  if(flags.unesco&&!v.un)return false;
  if(flags.debated&&!v.db)return false;
  if(query){
    const hay=[v.t,v.p,v.x,v.body&&[].concat(v.body).join(" "),v.d,CATS[v.c].name,er.name].join(" ").toLowerCase();
    if(!hay.includes(query))return false;
  }
  return true;
}

/* ---------- Map ---------- */
const HOME_CENTER=[33.5,50.5], HOME_ZOOM=5;
const map=L.map("map",{zoomControl:false,scrollWheelZoom:true,worldCopyJump:true}).setView(HOME_CENTER,HOME_ZOOM);

/* Base maps — no API key required, reliable and CORS-friendly (Esri World tiles).
   Terrain is the default; the single map-control panel switches to satellite. */
const terrainLayer=L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  {maxZoom:19,attribution:'Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Esri, USGS, NOAA'});
const satelliteLayer=L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {maxZoom:19,attribution:'Imagery &copy; <a href="https://www.esri.com/">Esri</a> — Maxar, Earthstar Geographics'});
// place-name / border reference, shown only over the satellite view
const placeLabels=L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  {maxZoom:19,pane:"overlayPane"});
terrainLayer.addTo(map);

/* One clean control panel (HTML overlay in .mapwrap): basemap · zoom · routes. */
function setBasemap(kind){
  const sat=kind==="satellite";
  if(sat){
    if(map.hasLayer(terrainLayer))map.removeLayer(terrainLayer);
    satelliteLayer.addTo(map); if(satelliteLayer.bringToBack)satelliteLayer.bringToBack();
    placeLabels.addTo(map);
  }else{
    if(map.hasLayer(satelliteLayer))map.removeLayer(satelliteLayer);
    if(map.hasLayer(placeLabels))map.removeLayer(placeLabels);
    terrainLayer.addTo(map); if(terrainLayer.bringToBack)terrainLayer.bringToBack();
  }
  const t=$("#mpTerrain"), s=$("#mpSatellite");
  if(t){t.classList.toggle("is-active",!sat);t.setAttribute("aria-pressed",String(!sat));}
  if(s){s.classList.toggle("is-active",sat);s.setAttribute("aria-pressed",String(sat));}
}
(function wireMapPanel(){
  const zi=$("#mpZoomIn"),zo=$("#mpZoomOut"),rs=$("#mpReset"),bt=$("#mpTerrain"),bs=$("#mpSatellite");
  if(zi)zi.onclick=()=>map.zoomIn();
  if(zo)zo.onclick=()=>map.zoomOut();
  if(rs)rs.onclick=()=>map.setView(HOME_CENTER,HOME_ZOOM);
  if(bt)bt.onclick=()=>setBasemap("terrain");
  if(bs)bs.onclick=()=>setBasemap("satellite");
})();
setTimeout(()=>map.invalidateSize(),150);

function applyMapTheme(){                       // imagery basemaps carry no theme filter
  const el=document.getElementById("map"); if(el)el.classList.remove("map-dark","map-parchment");
}
applyMapTheme();

const cluster=L.markerClusterGroup({
  maxClusterRadius:38, showCoverageOnHover:false, spiderfyOnMaxZoom:true,
  iconCreateFunction:c=>L.divIcon({html:"<div>"+c.getChildCount()+"</div>",className:"hv-cluster",iconSize:[34,34]})
}).addTo(map);
let markersByIdx={};

function markerStroke(){return effDark()?"#0F1522":"#FFFFFF";}
function baseStyle(cat){return {radius:6,weight:1.6,color:markerStroke(),fillColor:CATS[cat].color,fillOpacity:.92};}

/* trade-route overlays (illustrative, approximate) */
const ROUTES={
  royal:{name:"Persian Royal Road",color:"#8A6212",pts:[[32.19,48.25],[34.5,45.5],[36.19,44.01],[36.36,43.15],[36.86,39.03],[39.0,35.5],[39.65,31.99],[38.49,28.04]]},
  silk:{name:"Silk Road (Iran leg)",color:"#146F70",pts:[[33.09,44.58],[34.8,48.52],[35.59,51.44],[36.16,54.35],[36.3,59.6],[37.66,62.19]]},
  lapis:{name:"Lapis-lazuli route",color:"#5A4E86",pts:[[37.0,70.6],[35.9,64.9],[30.6,61.33],[28.36,56.15],[30.0,52.4],[32.19,48.25],[30.96,46.1]]}
};
const routeLayers={};
Object.entries(ROUTES).forEach(([k,r])=>{
  routeLayers[k]=L.polyline(r.pts,{color:r.color,weight:3,opacity:.85,dashArray:"1 8",lineCap:"round"});
});

/* ---------- Detail panel ---------- */
const scrim=$("#scrim"), panel=$("#panel");
function closePanel(){panel.classList.remove("show");scrim.classList.remove("show");
  setTimeout(()=>{if(!panel.classList.contains("show"))scrim.hidden=true;},260);
  if(activeId&&byId[activeId]) history.replaceState(null,"",location.pathname+location.search);
}
$("#panelClose").onclick=closePanel;
scrim.onclick=closePanel;
$("#panelPrev").onclick=()=>step(-1);
$("#panelNext").onclick=()=>step(1);
function step(d){
  if(!visibleOrder.length)return;
  let i=visibleOrder.indexOf(activeId);
  i=(i+d+visibleOrder.length)%visibleOrder.length;
  selectEvent(visibleOrder[i]);
}

function commonsImg(file,w){return "https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file)+"?width="+(w||800);}
function commonsPage(file){return "https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(file);}

function fillPanel(v){
  const er=ERAS.find(e=>e.id===v.e);
  $("#panelEra").textContent=er?er.name.split(":")[0]:"";
  $("#panelEra").style.background=er?er.color:"var(--muted)";
  let html="";
  if(v.img&&v.img[0]){
    const im=v.img[0];
    const src=im.src||commonsImg(im.file,900);
    const page=im.link||(im.file?commonsPage(im.file):src);
    html+='<figure class="panel-figure"><a href="'+esc(page)+'" target="_blank" rel="noopener">'+
      '<img loading="lazy" src="'+esc(src)+'" alt="'+esc(im.alt||v.t)+'"></a>'+
      (im.credit?'<figcaption>'+esc(im.credit)+'</figcaption>':'')+'</figure>';
  }
  html+='<div class="panel-date">'+esc(v.d)+'</div>';
  html+='<h2>'+esc(v.t)+'</h2>';
  if(v.p)html+='<div class="place">'+esc(v.p)+'</div>';
  let tags='<span class="tag">'+esc(CATS[v.c].name)+'</span>';
  if(v.un)tags+='<span class="tag unesco">'+esc(v.un)+'</span>';
  if(v.db)tags+='<span class="tag debated">Date or interpretation debated</span>';
  html+='<div class="tags">'+tags+'</div>';
  html+='<p class="summary">'+esc(v.x)+'</p>';
  if(v.body){
    const paras=[].concat(v.body);
    html+='<div class="body">'+paras.map(p=>'<p>'+esc(p)+'</p>').join("")+'</div>';
  }else{
    html+='<div class="body pending"><p>A fuller article and vetted sources for this entry are being added in the research pass.</p></div>';
  }
  html+='<div class="panel-actions">'+
        '<button class="btn primary" id="openFullBtn">Open full page ↗</button>'+
        '<button class="btn" id="focusMap">Focus on map</button>'+
        (canEdit(v)?'<button class="btn" id="editBtn">✎ Edit</button>':'')+
        '<button class="btn ghost" id="copyLink">Copy link</button></div>';
  if(v.refs&&v.refs.length){
    html+='<h3>References</h3><ul class="refs">'+v.refs.map(r=>'<li><a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+esc(r.label)+'</a></li>').join("")+'</ul>';
  }
  const rel=(v.related||[]).map(id=>byId[id]).filter(Boolean);
  if(rel.length){
    html+='<h3>Related events</h3><div class="related">'+rel.map(r=>
      '<button class="rel-chip" data-id="'+esc(r.id)+'"><i style="background:'+CATS[r.c].color+'"></i><span>'+esc(r.t)+'</span></button>').join("")+'</div>';
  }
  const pb=$("#panelBody"); pb.innerHTML=html; pb.scrollTop=0;
  pb.querySelectorAll(".rel-chip").forEach(c=>c.onclick=()=>selectEvent(c.dataset.id));
  const ofb=$("#openFullBtn"); if(ofb)ofb.onclick=()=>{try{HV.openFull&&HV.openFull(v.id);}catch(e){}};
  const eb=$("#editBtn"); if(eb)eb.onclick=()=>{try{HV.editEvent&&HV.editEvent(v.id);}catch(e){}};
  $("#focusMap").onclick=()=>focusMap(v);
  $("#copyLink").onclick=()=>{const u=location.origin+location.pathname+"#"+v.id;
    navigator.clipboard&&navigator.clipboard.writeText(u);$("#copyLink").textContent="Copied ✓";
    setTimeout(()=>{const b=$("#copyLink");if(b)b.textContent="Copy link";},1500);};
}
function openPanel(){scrim.hidden=false;requestAnimationFrame(()=>{scrim.classList.add("show");panel.classList.add("show");});}

/* ---------- Select / focus ---------- */
function focusMap(v){
  const mk=markersByIdx[v.id];
  map.flyTo([v.lat,v.lng],Math.max(map.getZoom(),7),{duration:.6});
  if(mk)cluster.zoomToShowLayer(mk,()=>{mk.openPopup();});
}
function selectEvent(id){
  const v=byId[id]; if(!v)return;
  if(activeId&&markersByIdx[activeId]){const pm=markersByIdx[activeId];pm.setStyle(baseStyle(byId[activeId].c));pm.setRadius(6);}
  const pc=document.querySelector('.tl-item.active'); if(pc)pc.classList.remove("active");
  activeId=id;
  const card=document.querySelector('.tl-item[data-id="'+id+'"]');
  if(card){card.classList.add("active");card.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"});}
  const mk=markersByIdx[id];
  if(mk){
    mk.setStyle({color:getComputedStyle(document.documentElement).getPropertyValue("--gold").trim()||"#8A6212",weight:3,fillColor:CATS[v.c].color,fillOpacity:1});
    mk.setRadius(10);
    map.flyTo([v.lat,v.lng],Math.max(map.getZoom(),6),{duration:.6});
    cluster.zoomToShowLayer(mk,()=>{mk.bringToFront&&mk.bringToFront();mk.openPopup();});
  }
  fillPanel(v); openPanel();
  history.replaceState(null,"","#"+id);
}

/* ---------- Render timeline + markers ---------- */
function render(){
  const track=$("#tlTrack"); track.innerHTML="";
  cluster.clearLayers(); markersByIdx={}; visibleOrder=[];
  let shown=0, side=0;
  ERAS.forEach(er=>{
    const items=EV.filter(v=>v.e===er.id&&matches(v,er)).sort((a,b)=>a.y-b.y);
    if(!items.length)return;
    shown+=items.length;
    const group=document.createElement("div");
    group.className="tl-era"; group.id="tlera-"+er.id;
    const tab=document.createElement("div");
    tab.className="tl-era-tab"; tab.style.background=er.color;
    tab.textContent=er.name.split(":")[0]; tab.title=er.name+" · "+er.span;
    group.appendChild(tab);
    items.forEach(v=>{
      visibleOrder.push(v.id);
      const item=document.createElement("div");
      item.className="tl-item"; item.dataset.side=(side%2)?"down":"up"; item.dataset.id=v.id;
      item.style.setProperty("--enterRX",(side%2)?"-9deg":"9deg"); side++;
      const dot=document.createElement("button");
      dot.type="button"; dot.className="tl-dot"+((v.img||v.body||v.refs)?" has-media":"");
      dot.style.background=CATS[v.c].color; dot.setAttribute("aria-label",v.t+" — details");
      const date=document.createElement("div"); date.className="tl-date"; date.textContent=v.d;
      const card=document.createElement("article");
      card.className="tl-card"; card.style.setProperty("--accent",CATS[v.c].color);
      let tags='<span class="tag">'+esc(CATS[v.c].name)+'</span>';
      if(v.un)tags+='<span class="tag unesco">'+esc(v.un)+'</span>';
      if(v.db)tags+='<span class="tag debated">debated</span>';
      if(v.img||v.body)tags+='<span class="tag media">read more</span>';
      card.innerHTML='<h3>'+esc(v.t)+'</h3>'+(v.p?'<div class="place">'+esc(v.p)+'</div>':'')+'<p>'+esc(v.x)+'</p><div class="tl-tags">'+tags+'</div>';
      item.appendChild(card); item.appendChild(date); item.appendChild(dot);
      item.addEventListener("click",()=>selectEvent(v.id));
      group.appendChild(item);
      const m=L.circleMarker([v.lat,v.lng],baseStyle(v.c));
      m.bindTooltip('<b>'+esc(v.d)+'</b> — '+esc(v.t),{direction:"top",offset:[0,-6],opacity:.97,className:"hv-tip"});
      m.bindPopup('<b>'+esc(v.t)+'</b><br>'+esc(v.d)+(v.p?'<br><i>'+esc(v.p)+'</i>':'')+'<br><a href="#'+v.id+'">details ›</a>');
      m.on("click",()=>selectEvent(v.id));
      cluster.addLayer(m); markersByIdx[v.id]=m;
    });
    track.appendChild(group);
  });
  // 3D entrance reveal as items scroll into view
  if(window.__io)window.__io.disconnect();
  if("IntersectionObserver" in window){
    window.__io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting)en.target.classList.add("in");});},
      {root:tlScrollEl,rootMargin:"0px 160px",threshold:.04});
    track.querySelectorAll(".tl-item").forEach(it=>window.__io.observe(it));
  }else{track.querySelectorAll(".tl-item").forEach(it=>it.classList.add("in"));}
  if(!shown)track.innerHTML='<p class="empty">No entries match. Clear the search box or turn categories back on.</p>';
  $("#count").textContent=shown+" of "+EV.length+" entries";
  if(activeId&&markersByIdx[activeId]){
    const card=document.querySelector('.tl-item[data-id="'+activeId+'"]'); if(card)card.classList.add("active");
    const mk=markersByIdx[activeId];
    mk.setStyle({color:getComputedStyle(document.documentElement).getPropertyValue("--gold").trim()||"#8A6212",weight:3,fillOpacity:1});mk.setRadius(10);
  }
}

/* ---------- Theme + layer wiring ---------- */
document.querySelectorAll("#themeSeg button").forEach(b=>b.onclick=()=>applyTheme(b.dataset.theme));
(function initTheme(){
  let t=null; try{t=localStorage.getItem("hv-theme");}catch(e){}
  // One-time migration: adopt the new "Paper" default even if an older session
  // saved the previous "auto" default. Explicit choices after this are kept.
  try{ if(!localStorage.getItem("hv-theme-default-v2")){ t="parchment"; localStorage.setItem("hv-theme-default-v2","1"); } }catch(e){}
  if(!t||!THEMES.includes(t))t="parchment";
  applyTheme(t);
})();
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{applyMapTheme();render();});

document.querySelectorAll(".route-toggle").forEach(cb=>cb.addEventListener("change",()=>{
  const k=cb.dataset.route, lyr=routeLayers[k];
  if(cb.checked)lyr.addTo(map); else map.removeLayer(lyr);
}));

/* keyboard nav when panel open */
document.addEventListener("keydown",e=>{
  if(scrim.hidden)return;
  if(e.key==="Escape")closePanel();
  else if(e.key==="ArrowRight")step(1);
  else if(e.key==="ArrowLeft")step(-1);
});

/* ---------- Timeline: wheel → horizontal scroll + drag-to-pan ---------- */
(function(){
  const s=tlScrollEl; if(!s)return;
  s.addEventListener("wheel",e=>{
    if(Math.abs(e.deltaY)<=Math.abs(e.deltaX))return;
    const atStart=s.scrollLeft<=0&&e.deltaY<0;
    const atEnd=s.scrollLeft+s.clientWidth>=s.scrollWidth-1&&e.deltaY>0;
    if(!atStart&&!atEnd){s.scrollLeft+=e.deltaY;e.preventDefault();}
  },{passive:false});
  let dragging=false,startX=0,startLeft=0,moved=false;
  s.addEventListener("pointerdown",e=>{if(e.button!==0)return;dragging=true;moved=false;startX=e.clientX;startLeft=s.scrollLeft;});
  window.addEventListener("pointermove",e=>{if(!dragging)return;const dx=e.clientX-startX;
    if(Math.abs(dx)>5){moved=true;s.classList.add("grabbing");}s.scrollLeft=startLeft-dx;});
  window.addEventListener("pointerup",()=>{if(!dragging)return;dragging=false;s.classList.remove("grabbing");});
  s.addEventListener("click",e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false;}},true);
})();

/* ---------- Toast ---------- */
function toast(m){const t=$("#toast");if(!t)return;t.textContent=m;t.hidden=false;
  clearTimeout(toast._t);toast._t=setTimeout(()=>{t.hidden=true;},2800);}

/* ---------- Admin controller ---------- */
(function initAdmin(){
  const btnAdd=$("#btnAdd"), modal=$("#admModal"), scrimA=$("#admScrim");
  const F={id:$("#fId"),year:$("#fYear"),era:$("#fEraAd"),date:$("#fDate"),title:$("#fTitle"),cat:$("#fCat"),
    place:$("#fPlace"),lat:$("#fLat"),lng:$("#fLng"),summary:$("#fSummary"),body:$("#fBody"),
    img:$("#fImg"),credit:$("#fCredit"),un:$("#fUn"),db:$("#fDb")};
  F.cat.innerHTML=Object.entries(CATS).map(([k,v])=>'<option value="'+k+'">'+esc(v.name)+'</option>').join("");
  function show(){scrimA.hidden=false;modal.hidden=false;requestAnimationFrame(()=>{scrimA.classList.add("show");modal.classList.add("show");});}
  function hide(){modal.classList.remove("show");scrimA.classList.remove("show");setTimeout(()=>{modal.hidden=true;scrimA.hidden=true;},220);}
  function list(){
    const el=$("#admList");
    const mine=userEvents.filter(canEdit);
    if(!mine.length){el.innerHTML='<p class="adm-hint">'+(userEvents.length
      ?'You can only edit events you added — you have none yet.'
      :'No events added yet. Anything you add is saved in this browser; use “Export added” to save it permanently.')+'</p>';return;}
    el.innerHTML='<p class="adm-hint">'+mine.length+' event(s) you can edit'+(isAdmin()?' (admin: all events)':'')+':</p>'+
      mine.slice().sort((a,b)=>a.y-b.y).map(v=>'<div class="adm-row"><span class="yr">'+esc(v.d)+'</span><span class="ti">'+esc(v.t)+
      (isAdmin()&&v.owner&&v.owner!==session?' <em>· by '+esc(v.owner)+'</em>':'')+
      '</span><button data-edit="'+esc(v.id)+'">Edit</button><button data-del="'+esc(v.id)+'">Delete</button></div>').join("");
    el.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openForm(byId[b.dataset.edit]));
    el.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>del(b.dataset.del));
  }
  function openForm(ev){
    if(ev&&!canEdit(ev)){toast("You can only edit events you added.");return;}
    $("#admTitle").textContent=ev?"Edit event":"Add event";
    $("#admDelete").hidden=!ev;
    if(ev){
      F.id.value=ev.id;F.year.value=Math.abs(ev.y);F.era.value=ev.y<0?"BCE":"CE";F.date.value=ev.d||"";
      F.title.value=ev.t||"";F.cat.value=ev.c;F.place.value=ev.p||"";F.lat.value=ev.lat;F.lng.value=ev.lng;
      F.summary.value=ev.x||"";F.body.value=ev.body?[].concat(ev.body).join("\n\n"):"";
      const im=ev.img&&ev.img[0];F.img.value=im?(im.src||("File:"+im.file)):"";F.credit.value=im&&im.credit?im.credit:"";
      F.un.value=ev.un||"";F.db.checked=!!ev.db;
    }else{$("#admForm").reset();F.id.value="";}
    list();show();
  }
  function build(){
    const yr=Math.abs(parseInt(F.year.value,10)||0),bce=F.era.value==="BCE",y=bce?-yr:yr;
    const ev={id:F.id.value||("u"+Date.now().toString(36)),y,e:eraForYear(y),
      d:F.date.value.trim()||(yr+" "+(bce?"BCE":"CE")),t:F.title.value.trim(),c:F.cat.value,
      lat:parseFloat(F.lat.value),lng:parseFloat(F.lng.value),x:F.summary.value.trim()||F.title.value.trim()};
    if(F.place.value.trim())ev.p=F.place.value.trim();
    const body=F.body.value.trim();if(body)ev.body=body.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
    const img=F.img.value.trim();
    if(img){const im=/^https?:/i.test(img)?{src:img}:{file:img.replace(/^File:/i,"")};im.alt=ev.t;
      if(F.credit.value.trim())im.credit=F.credit.value.trim();ev.img=[im];}
    if(F.un.value.trim())ev.un=F.un.value.trim();
    if(F.db.checked)ev.db=1;
    return ev;
  }
  function save(e){
    e.preventDefault();
    if(!F.title.value.trim()){toast("Please enter a title.");return;}
    if(!isFinite(parseFloat(F.lat.value))||!isFinite(parseFloat(F.lng.value))){
      toast("Please set a location — type coordinates or use “Pick location on the map”.");return;}
    const ev=build();
    const editingId=F.id.value;
    if(editingId&&userIds.has(editingId)){          // editing a user-added event
      const i=userEvents.findIndex(u=>u.id===editingId);
      if(i<0||!canEdit(userEvents[i])){toast("You can only edit events you added.");return;}
      ev.owner=userEvents[i].owner||session;
      userEvents[i]=ev; persistUser();
    }else if(editingId){                             // editing a curated (base/enrich) event
      if(!isAdmin()){toast("Only admins can edit the curated timeline.");return;}
      const o=Object.assign({},ev); delete o.id;
      overrides[editingId]=Object.assign(overrides[editingId]||{},o); saveOverrides();
      Object.assign(byId[editingId],o);
    }else{                                           // brand-new event
      ev.owner=session; userEvents.push(ev); persistUser();
    }
    applyUserEvents(); applyOverrides(); render(); hide();
    toast(editingId?"Event updated ✓":"Event added ✓");
    selectEvent(editingId||ev.id);
  }
  function del(id){
    const rec=userEvents.find(u=>u.id===id); if(!rec)return false;
    if(!canEdit(rec)){toast("You can only delete events you added.");return false;}
    userEvents=userEvents.filter(u=>u.id!==id);persistUser();applyUserEvents();render();list();
    if(activeId===id)closePanel();
    toast('Deleted “'+rec.t+'”. Re-add it to undo.');return true;
  }
  if(btnAdd)btnAdd.onclick=()=>openForm(null);
  HV.editEvent=(id)=>{const ev=byId[id];if(ev)openForm(ev);};   // used by panel/full-page Edit buttons
  $("#admClose").onclick=hide; scrimA.onclick=hide;
  $("#admForm").onsubmit=save;
  $("#admDelete").onclick=()=>{if(F.id.value&&del(F.id.value))hide();};
  $("#fPick").onclick=()=>{
    hide();toast("Click anywhere on the map to drop the location…");
    document.querySelector(".mapwrap").scrollIntoView({behavior:"smooth",block:"center"});
    map.once("click",e=>{F.lat.value=e.latlng.lat.toFixed(4);F.lng.value=e.latlng.lng.toFixed(4);show();toast("Location set ✓");});
  };
  $("#admExport").onclick=()=>{
    const mine=userEvents.filter(canEdit);
    const json=JSON.stringify(mine,null,1);
    try{navigator.clipboard&&navigator.clipboard.writeText(json);}catch(e){}
    try{const b=new Blob([json],{type:"application/json"});const a=document.createElement("a");
      a.href=URL.createObjectURL(b);a.download="iranian-heritage-events.json";a.click();}catch(e){}
    toast("Copied to clipboard & downloaded "+mine.length+" event(s).");
  };
})();

/* ---------- Auth controller (sign in / create first admin / sign out) ---------- */
(function initAuth(){
  const modal=$("#authModal"), scrim=$("#authScrim");
  function open(){
    const first=users.length===0;
    $("#authTitle").textContent=first?"Create administrator":"Sign in";
    $("#authHint").textContent=first
      ?"No accounts exist yet. Create the first administrator to manage this archive."
      :"Sign in to add or edit events.";
    $("#authSubmit").textContent=first?"Create admin":"Sign in";
    $("#authForm").reset();
    scrim.hidden=false;modal.hidden=false;
    requestAnimationFrame(()=>{scrim.classList.add("show");modal.classList.add("show");});
    setTimeout(()=>$("#auUser").focus(),60);
  }
  function close(){modal.classList.remove("show");scrim.classList.remove("show");setTimeout(()=>{modal.hidden=true;scrim.hidden=true;},220);}
  async function submit(e){
    e.preventDefault();
    const un=$("#auUser").value.trim(), pw=$("#auPass").value;
    if(!un||!pw){toast("Enter a username and password.");return;}
    if(users.length===0){
      const {salt,hash}=await hashPass(pw);
      users.push({username:un,role:"admin",salt,hash});saveUsers();setSession(un);
      refreshAuth();close();toast("Administrator “"+un+"” created — you’re signed in ✓");return;
    }
    const u=users.find(x=>x.username.toLowerCase()===un.toLowerCase());
    if(!u||!(await verifyPass(u,pw))){toast("Incorrect username or password.");return;}
    setSession(u.username);refreshAuth();close();toast("Signed in as "+u.username+" ✓");
  }
  $("#btnSignIn").onclick=open;
  $("#authClose").onclick=close; scrim.onclick=close;
  $("#authForm").onsubmit=submit;
  $("#btnSignOut").onclick=()=>{setSession(null);refreshAuth();toast("Signed out");};
})();

/* ---------- Users controller (admin only) ---------- */
(function initUsers(){
  const modal=$("#usersModal"), scrim=$("#usersScrim");
  function open(){if(!isAdmin()){toast("Admins only.");return;}listUsers();
    scrim.hidden=false;modal.hidden=false;requestAnimationFrame(()=>{scrim.classList.add("show");modal.classList.add("show");});}
  function close(){modal.classList.remove("show");scrim.classList.remove("show");setTimeout(()=>{modal.hidden=true;scrim.hidden=true;},220);}
  function listUsers(){
    const el=$("#usersList");
    el.innerHTML='<p class="adm-hint">'+users.length+' account(s):</p>'+users.map(u=>
      '<div class="adm-row"><span class="ti">'+esc(u.username)+(u.username===session?' <em>(you)</em>':'')+'</span>'+
      '<select data-role="'+esc(u.username)+'"><option value="user"'+(u.role==="user"?" selected":"")+'>User</option>'+
      '<option value="admin"'+(u.role==="admin"?" selected":"")+'>Admin</option></select>'+
      '<button data-deluser="'+esc(u.username)+'">Delete</button></div>').join("");
    el.querySelectorAll("[data-role]").forEach(s=>s.onchange=()=>{
      const u=users.find(x=>x.username===s.dataset.role);
      if(u.role==="admin"&&s.value!=="admin"&&adminCount()<=1){toast("You can’t remove the last admin.");s.value="admin";return;}
      u.role=s.value;saveUsers();refreshAuth();listUsers();toast("Role updated for “"+u.username+"”");
    });
    el.querySelectorAll("[data-deluser]").forEach(b=>b.onclick=()=>{
      const un=b.dataset.deluser, u=users.find(x=>x.username===un);
      if(u.role==="admin"&&adminCount()<=1){toast("You can’t delete the last admin.");return;}
      users=users.filter(x=>x.username!==un); if(session===un)setSession(null);
      saveUsers();refreshAuth();listUsers();toast("Deleted account “"+un+"”");
    });
  }
  async function addUser(e){
    e.preventDefault();
    const un=$("#nuUser").value.trim(), pw=$("#nuPass").value, role=$("#nuRole").value;
    if(!un||!pw){toast("Enter a username and password.");return;}
    if(users.some(x=>x.username.toLowerCase()===un.toLowerCase())){toast("That username already exists.");return;}
    const {salt,hash}=await hashPass(pw);
    users.push({username:un,role,salt,hash});saveUsers();$("#userAddForm").reset();listUsers();refreshAuth();
    toast("Added "+(role==="admin"?"admin":"user")+" “"+un+"” ✓");
  }
  $("#btnUsers").onclick=open; $("#usersClose").onclick=close; scrim.onclick=close;
  $("#userAddForm").onsubmit=addUser;
})();

/* ---------- Expose API for the other view modules (full-page, map-of-time, 3D) ---------- */
Object.assign(HV,{
  CATS,ERAS,
  events:()=>EV.slice(),
  eventById:id=>byId[id],
  eraById:id=>ERAS.find(e=>e.id===id),
  eraShort,ERA_ICON,
  selectEvent,render,toast,
  isAdmin,canEdit,currentUser,
  saveEventContent,eraForYear,commonsImg,commonsPage
});

/* ---------- Init ---------- */
setScale(false);
render();
refreshAuth();
window.addEventListener("load",()=>map.invalidateSize());
window.addEventListener("resize",()=>map.invalidateSize());
window.addEventListener("hashchange",()=>{const id=location.hash.replace("#","");if(byId[id])selectEvent(id);});
(function initHash(){const id=location.hash.replace("#","");if(byId[id])setTimeout(()=>selectEvent(id),300);})();
})();
