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

/* ---------- Theme (switching handled by js/theme.js; here we only react) ---------- */
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
      const yr=ERA_YEAR[er.id];                  // move the political-map slider to this era
      if(yr!==undefined){const sl=$("#timeSlider");if(sl){sl.value=yr;sl.dispatchEvent(new Event("input"));}}
      toast("Filtered to "+eraShort(er.name)+" — click it again to show all");
    }else{
      map.setView(HOME_CENTER,HOME_ZOOM);
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

/* ---- Time-driven political map of the region (real historical borders) ----
   Borders come from the open historical-basemaps project (CC-BY-SA): one
   GeoJSON snapshot per key year. The slider picks the nearest snapshot; we
   render just the polities intersecting the Middle East / plateau region. */
const HB_YEARS=[-3000,-2000,-1500,-1000,-700,-500,-400,-323,-300,-200,-100,-1,100,200,300,400,500,600,700,800,900,1000,1100,1200,1279,1300,1400,1492,1500,1530,1600,1650,1700,1715,1783,1800,1815,1878,1880,1900,1914,1920,1930,1938,1945,1960,1994,2000,2010];
const ERA_YEAR={chal:-3000,bronze:-1250,iron:-650,ach:-500,hel:-300,par:-100,sas:400,later:1600};
const HB_CACHE={}, REGION=[22,8,80,48];   // [W,S,E,N]
const POLIT_PALETTE=["#23408E","#8A6212","#146F70","#8C3A2B","#5A4E86","#4E6A35","#7E4F25","#2F5670","#9C4326","#45447A","#135F63","#6B4E9E","#3C5A9A","#2A6E62"];
function hbSnap(y){let b=HB_YEARS[0];for(const s of HB_YEARS)if(Math.abs(s-y)<Math.abs(b-y))b=s;return b;}
function hbUrl(s){return "https://cdn.jsdelivr.net/gh/aourednik/historical-basemaps@master/geojson/world_"+(s<0?("bc"+(-s)):(""+s))+".geojson";}
function yearLabel(y){y=Math.round(+y);return y<0?((-y)+" BCE"):(y+" CE");}
function politColor(n){let h=0;for(let i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))>>>0;return POLIT_PALETTE[h%POLIT_PALETTE.length];}
function fbbox(g){const m=[Infinity,Infinity,-Infinity,-Infinity];(function scan(c){if(typeof c[0]==="number"){if(c[0]<m[0])m[0]=c[0];if(c[1]<m[1])m[1]=c[1];if(c[0]>m[2])m[2]=c[0];if(c[1]>m[3])m[3]=c[1];}else c.forEach(scan);})(g.coordinates||[]);return m;}
function inRegion(b){return b[0]<REGION[2]&&b[2]>REGION[0]&&b[1]<REGION[3]&&b[3]>REGION[1];}
let politLayer=null, politLabels=[], politReq=0, politYear=null;
function clearPolit(){ if(politLayer){map.removeLayer(politLayer);politLayer=null;} politLabels.forEach(l=>map.removeLayer(l)); politLabels=[]; }
async function fetchHB(s){ if(HB_CACHE[s])return HB_CACHE[s]; const r=await fetch(hbUrl(s)); const d=await r.json(); HB_CACHE[s]=d; return d; }
async function loadPolitical(year){
  const on=$("#timeOn"); if(on&&!on.checked){clearPolit();return;}
  const snap=hbSnap(year), my=++politReq; politYear=year;
  let d; try{d=await fetchHB(snap);}catch(e){return;}
  if(my!==politReq)return;                       // a newer request has started
  clearPolit();
  const feats=d.features.filter(f=>f&&f.geometry&&f.properties&&f.properties.NAME&&inRegion(fbbox(f.geometry)));
  politLayer=L.geoJSON({type:"FeatureCollection",features:feats},{
    style:f=>{const c=politColor(f.properties.NAME);return{color:c,weight:1,opacity:.85,fillColor:c,fillOpacity:.42};},
    onEachFeature:(f,l)=>{l.bindTooltip(f.properties.NAME,{sticky:true,direction:"top",className:"hv-tip"});
      l.on("mouseover",()=>l.setStyle({fillOpacity:.62,weight:2}));
      l.on("mouseout",()=>{try{politLayer.resetStyle(l);}catch(e){}});
      l.on("click",()=>showPolity(f.properties));}
  }).addTo(map);
  if(politLayer.bringToBack)politLayer.bringToBack();
  feats.map(f=>{const b=fbbox(f.geometry);const w=Math.min(b[2],REGION[2])-Math.max(b[0],REGION[0]),h=Math.min(b[3],REGION[3])-Math.max(b[1],REGION[1]);
      return{f,area:w*h,cx:(Math.max(b[0],REGION[0])+Math.min(b[2],REGION[2]))/2,cy:(Math.max(b[1],REGION[1])+Math.min(b[3],REGION[3]))/2};})
    .filter(o=>o.area>5).sort((a,b)=>b.area-a.area).slice(0,16)
    .forEach(o=>{const m=L.marker([o.cy,o.cx],{interactive:false,keyboard:false,
      icon:L.divIcon({className:"polit-label",html:'<span>'+esc(o.f.properties.NAME)+'</span>'})}).addTo(map);politLabels.push(m);});
}
/* ---- descriptions & pages for the kingdoms shown on the political map ---- */
const POLITY_INFO=[
 {kw:["achaemenid"],name:"Achaemenid Empire",url:"https://en.wikipedia.org/wiki/Achaemenid_Empire",body:["The first Persian Empire (c. 550–330 BCE), founded by Cyrus the Great — the largest the world had yet seen, uniting the plateau with Mesopotamia, Egypt, Anatolia and Central Asia.","It was run through satrapies, the Royal Road, gold coinage and a multilingual bureaucracy, and fell to Alexander the Great in 330 BCE."]},
 {kw:["median","medes","media"],name:"Median Kingdom",url:"https://en.wikipedia.org/wiki/Medes",body:["The kingdom of the Medes (c. 700–550 BCE), Iranian-speakers of the north-western Zagros who, with Babylon, destroyed Assyria before being absorbed by their Persian kin under Cyrus."]},
 {kw:["elam"],name:"Elam",url:"https://en.wikipedia.org/wiki/Elam",body:["One of the oldest civilisations of the Near East (c. 3200–540 BCE), joining lowland Susa to highland Anshan in Fars, and for millennia the great eastern rival of Mesopotamia."]},
 {kw:["parthia"],name:"Parthian Empire",url:"https://en.wikipedia.org/wiki/Parthian_Empire",body:["The Parthian (Arsacid) Empire (c. 247 BCE–224 CE), an Iranian dynasty from the north-east that mastered mounted archery, controlled the Silk Road, and held Rome at bay for centuries."]},
 {kw:["sasan"],name:"Sasanian Empire",url:"https://en.wikipedia.org/wiki/Sasanian_Empire",body:["The last pre-Islamic Persian empire (224–651 CE), a superpower rivalling Rome and Byzantium that gave Zoroastrianism an official, codified form before the Arab conquest."]},
 {kw:["seleucid"],name:"Seleucid Empire",url:"https://en.wikipedia.org/wiki/Seleucid_Empire",body:["The Hellenistic empire (312–63 BCE) of Alexander’s general Seleucus, which planted Greek cities, coinage and art across Iran and Mesopotamia."]},
 {kw:["neo-assyria","assyria"],name:"Assyrian Empire",url:"https://en.wikipedia.org/wiki/Neo-Assyrian_Empire",body:["The Neo-Assyrian Empire (c. 911–609 BCE), the dominant military power of the Near East, which repeatedly campaigned into the Zagros before falling to the Medes and Babylonians."]},
 {kw:["babylon"],name:"Babylonia",url:"https://en.wikipedia.org/wiki/Babylonia",body:["Babylonia of the lower Euphrates; its Neo-Babylonian empire (626–539 BCE) briefly ruled the Near East before Cyrus the Great took the city in 539 BCE."]},
 {kw:["safavid"],name:"Safavid Empire",url:"https://en.wikipedia.org/wiki/Safavid_Iran",body:["The Safavid Empire (1501–1736) that reunified Iran, made Twelver Shi’ism the state religion, and raised the incomparable capital of Isfahan."]},
 {kw:["qajar"],name:"Qajar Iran",url:"https://en.wikipedia.org/wiki/Qajar_dynasty",body:["The Qajar dynasty (1789–1925), which made Tehran the capital and ruled Iran through an age of European pressure, lost territory, and the 1906 Constitutional Revolution."]},
 {kw:["afsharid","afshar"],name:"Afsharid Empire",url:"https://en.wikipedia.org/wiki/Afsharid_dynasty",body:["The empire of Nader Shah (1736–1796), the military genius who expelled invaders, seized the throne, and sacked Delhi in 1739."]},
 {kw:["zand"],name:"Zand Dynasty",url:"https://en.wikipedia.org/wiki/Zand_dynasty",body:["The Zand dynasty (1751–1794) of Karim Khan, who styled himself only ‘regent’ and gave Iran a rare interval of peace from Shiraz."]},
 {kw:["rashidun"],name:"Rashidun Caliphate",url:"https://en.wikipedia.org/wiki/Rashidun_Caliphate",body:["The first (‘Rightly-Guided’) caliphate (632–661 CE), under which Arab-Muslim armies conquered the Sasanian Empire."]},
 {kw:["umayyad"],name:"Umayyad Caliphate",url:"https://en.wikipedia.org/wiki/Umayyad_Caliphate",body:["The first great Islamic caliphate (661–750 CE), which absorbed the former Sasanian lands into a vast empire stretching from Spain to Central Asia."]},
 {kw:["abbasid"],name:"Abbasid Caliphate",url:"https://en.wikipedia.org/wiki/Abbasid_Caliphate",body:["The caliphate (750–1258 CE) whose Baghdad court — deeply shaped by Persian administration and scholars — presided over the Islamic Golden Age."]},
 {kw:["samanid"],name:"Samanid Empire",url:"https://en.wikipedia.org/wiki/Samanid_Empire",body:["A Persian dynasty (819–999) centred on Bukhara that led the renaissance of the New Persian language, nurturing Rudaki, Ferdowsi and Avicenna."]},
 {kw:["ghaznavid","ghazna"],name:"Ghaznavid Empire",url:"https://en.wikipedia.org/wiki/Ghaznavids",body:["A Turko-Persian empire (977–1186) based at Ghazni that carried Persianate court culture deep into India."]},
 {kw:["seljuk","seljuq"],name:"Seljuk Empire",url:"https://en.wikipedia.org/wiki/Seljuk_Empire",body:["The Great Seljuk Empire (1037–1194), a Turkic dynasty that ruled Iran and the Near East, patronising Persian administration and Sunni learning."]},
 {kw:["khwarazm","khwarezm","khwarizm"],name:"Khwarazmian Empire",url:"https://en.wikipedia.org/wiki/Khwarazmian_Empire",body:["A vast but short-lived empire (c. 1077–1231) of the east, destroyed by the Mongol invasion it provoked."]},
 {kw:["ilkhan"],name:"Ilkhanate",url:"https://en.wikipedia.org/wiki/Ilkhanate",body:["The Mongol state ruling Iran (1256–1335), founded by Hulagu Khan; its later khans converted to Islam and rebuilt Persian cultural life."]},
 {kw:["mongol"],name:"Mongol Empire",url:"https://en.wikipedia.org/wiki/Mongol_Empire",body:["The largest contiguous land empire in history, whose 13th-century conquests devastated and then reshaped Iran under the Ilkhans."]},
 {kw:["timurid","timur"],name:"Timurid Empire",url:"https://en.wikipedia.org/wiki/Timurid_Empire",body:["The empire of Timur (Tamerlane) and his heirs (1370–1507), an age of dazzling art and science centred on Samarkand and Herat."]},
 {kw:["ottoman"],name:"Ottoman Empire",url:"https://en.wikipedia.org/wiki/Ottoman_Empire",body:["The great Turkish empire of Anatolia and the Near East, for centuries the western rival of Safavid and Qajar Iran."]},
 {kw:["byzantine","eastern roman"],name:"Byzantine Empire",url:"https://en.wikipedia.org/wiki/Byzantine_Empire",body:["The Christian Eastern Roman Empire of Constantinople, locked in centuries of frontier war with Sasanian Iran."]},
 {kw:["roman"],name:"Roman Empire",url:"https://en.wikipedia.org/wiki/Roman_Empire",body:["Rome, the Mediterranean superpower whose eastern frontier met the Parthian and then Sasanian empires of Iran."]},
 {kw:["urartu","van"],name:"Urartu",url:"https://en.wikipedia.org/wiki/Urartu",body:["The Iron Age kingdom (9th–6th c. BCE) centred on Lake Van, which built fortresses across today’s north-western Iran."]},
 {kw:["mannae","mannaea"],name:"Mannaea",url:"https://en.wikipedia.org/wiki/Mannaeans",body:["An Iron Age kingdom south of Lake Urmia, caught between Assyria, Urartu and the rising Medes."]},
 {kw:["scythia","saka","sacae"],name:"Scythians (Saka)",url:"https://en.wikipedia.org/wiki/Scythians",body:["Iranian-speaking horse nomads of the steppe whose confederations raided and traded with the settled empires of Iran."]},
 {kw:["bactria"],name:"Bactria",url:"https://en.wikipedia.org/wiki/Bactria",body:["The rich land of the middle Oxus — an Achaemenid satrapy and later a Greek kingdom, a crossroads between Iran, India and the steppe."]},
 {kw:["kushan"],name:"Kushan Empire",url:"https://en.wikipedia.org/wiki/Kushan_Empire",body:["A Central Asian empire (c. 30–375 CE) astride the routes between Iran, India and China, and a great patron of Buddhism."]},
 {kw:["hephthalite","white hun"],name:"Hephthalites",url:"https://en.wikipedia.org/wiki/Hephthalites",body:["The ‘White Huns’, steppe conquerors who humbled the Sasanians in the 5th century and dominated the north-east."]},
 {kw:["gandhara","gandhāra"],name:"Gandhāra",url:"https://en.wikipedia.org/wiki/Gandhara",body:["The region of the north-west Indian subcontinent, long tied to Iran — an Achaemenid satrapy and a famed crossroads of Greek, Indian and Iranian art."]},
 {kw:["persia","iran"],name:"Persia (Iran)",url:"https://en.wikipedia.org/wiki/History_of_Iran",body:["Persia — the heartland of the Iranian plateau, home across the ages to Elam, the Medes and Persians, and the long succession of empires that followed."]}
];
function polityInfo(name){const n=(name||"").toLowerCase();for(const e of POLITY_INFO){if(e.kw.some(k=>n.includes(k)))return e;}return null;}
function showPolity(props){
  const name=(props&&props.NAME)||"Unknown", info=polityInfo(name), yl=yearLabel(politYear);
  panel.classList.add("polity-mode");
  $("#panelEra").textContent="Political map"; $("#panelEra").style.background="var(--lapis)";
  let html='<div class="panel-date">Kingdoms &amp; powers · '+esc(yl)+'</div><h2>'+esc(info?info.name:name)+'</h2>';
  const sub=[]; if(props.SUBJECTO&&props.SUBJECTO!==name)sub.push("subject to "+props.SUBJECTO);
  if(props.PARTOF&&props.PARTOF!==name&&props.PARTOF!==props.SUBJECTO)sub.push("part of "+props.PARTOF);
  if(sub.length)html+='<div class="place">'+esc(sub.join(" · "))+'</div>';
  html+='<div class="tags"><span class="tag">'+esc(yl)+'</span>'+(info?'':'<span class="tag debated">brief entry</span>')+'</div>';
  if(info){ html+='<p class="summary">'+esc(info.body[0])+'</p>'; if(info.body[1])html+='<div class="body"><p>'+esc(info.body[1])+'</p></div>'; }
  else { html+='<p class="summary">A polity shown on the historical map of the region around '+esc(yl)+'. The atlas doesn’t carry a written entry for this one yet — follow the link for more.</p>'; }
  const url=info?info.url:("https://en.wikipedia.org/w/index.php?search="+encodeURIComponent(name));
  html+='<div class="panel-actions"><a class="btn primary" href="'+esc(url)+'" target="_blank" rel="noopener">Read more ↗</a></div>';
  const pb=$("#panelBody"); pb.innerHTML=html; pb.scrollTop=0;
  openPanel();
}

(function wireTimeSlider(){
  const sl=$("#timeSlider"),out=$("#timeYear"),on=$("#timeOn"),ticks=$("#timeTicks"); if(!sl)return;
  const mn=+sl.min,mx=+sl.max;
  if(ticks){let h="";HB_YEARS.forEach(y=>{if(y>=mn&&y<=mx)h+='<i style="left:'+((y-mn)/(mx-mn)*100)+'%"></i>';});
    [-3000,-2000,-1000,-500,1,500,1000,1500,2000].forEach(y=>{if(y>=mn&&y<=mx)h+='<b style="left:'+((y-mn)/(mx-mn)*100)+'%">'+yearLabel(y)+'</b>';});ticks.innerHTML=h;}
  function bubble(){if(!out)return;out.textContent=yearLabel(sl.value);out.style.left=((+sl.value-mn)/(mx-mn)*100)+"%";}
  let t=null;
  sl.addEventListener("input",()=>{bubble();clearTimeout(t);t=setTimeout(()=>loadPolitical(+sl.value),240);});
  sl.addEventListener("change",()=>{bubble();loadPolitical(+sl.value);});
  if(on)on.addEventListener("change",()=>loadPolitical(+sl.value));
  bubble(); loadPolitical(+sl.value);
})();

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
function closePanel(){panel.classList.remove("show");panel.classList.remove("polity-mode");scrim.classList.remove("show");
  setTimeout(()=>{if(!panel.classList.contains("show"))scrim.hidden=true;},260);
  if(activeId&&byId[activeId]) history.replaceState(null,"",location.pathname+location.search);
}
$("#panelClose").onclick=closePanel;
scrim.onclick=closePanel;
$("#panelPrev").onclick=()=>step(-1);
$("#panelNext").onclick=()=>step(1);
function step(d){
  if(panel.classList.contains("polity-mode"))return;
  if(!visibleOrder.length)return;
  let i=visibleOrder.indexOf(activeId);
  i=(i+d+visibleOrder.length)%visibleOrder.length;
  selectEvent(visibleOrder[i]);
}

function commonsImg(file,w){return "https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(file)+"?width="+(w||800);}
function commonsPage(file){return "https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(file);}

function fillPanel(v){
  panel.classList.remove("polity-mode");
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

/* ---------- React to theme changes (js/theme.js drives the switching) ---------- */
document.addEventListener("hv-theme",()=>{applyMapTheme();render();});

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
