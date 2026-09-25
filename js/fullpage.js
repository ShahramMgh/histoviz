/* ============================================================
   histoviz — full-page event reader + admin article editor
   Exposes HV.openFull(id). Depends on window.HV (js/app.js).
   ============================================================ */
(function(){
"use strict";
const HV=window.HV; if(!HV)return;
const root=document.getElementById("fullpage"); if(!root)return;
const esc=s=>(s||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

let curId=null, editing=false, wGallery=[], wRefs=[];

function imgSrc(im,w){return im.src||HV.commonsImg(im.file,w||1600);}
function heroOf(v){return (v.gallery&&v.gallery[0])||(v.img&&v.img[0])||null;}
function articleHTML(v){
  if(v.article)return v.article;
  if(v.body)return [].concat(v.body).map(p=>"<p>"+esc(p)+"</p>").join("");
  return '<p class="fp-muted"><em>No detailed article yet.'+(HV.canEdit(v)?' Use “Edit article” to write one.':'')+'</em></p>';
}

function open(id){
  const v=HV.eventById(id); if(!v)return;
  curId=id; editing=false;
  render(); root.hidden=false; document.body.style.overflow="hidden"; root.scrollTop=0;
  try{history.replaceState(null,"","#full="+id);}catch(e){}
}
function close(){
  root.hidden=true; document.body.style.overflow=""; const id=curId; curId=null; editing=false;
  if((location.hash||"").indexOf("full=")>=0){try{history.replaceState(null,"","#"+(id||""));}catch(e){}}
}
HV.openFull=open;

function render(){
  const v=HV.eventById(curId); if(!v){close();return;}
  const er=HV.eraById(v.e), hero=heroOf(v), can=HV.canEdit(v);
  const tags='<span class="tag">'+esc(HV.CATS[v.c].name)+'</span>'+
    (v.un?'<span class="tag unesco">'+esc(v.un)+'</span>':'')+
    (v.db?'<span class="tag debated">Date or interpretation debated</span>':'');
  let h='';
  h+='<div class="fp-bar"><button class="fp-back" id="fpBack">‹ Back</button>'+
     '<span class="fp-crumb">'+esc(er?HV.eraShort(er.name):"")+'</span><div class="fp-actions">'+
     (can?'<button class="btn" id="fpEdit">'+(editing?"✓ Done editing":"✎ Edit article")+'</button>':'')+
     '<button class="fp-x" id="fpClose" aria-label="Close">×</button></div></div>';
  h+='<div class="fp-scroll"><article class="fp-doc">';
  h+='<header class="fp-hero'+(hero?"":" nohero")+'"><div class="fp-hero-in">'+
     (er?'<span class="panel-era" style="background:'+er.color+'">'+esc(HV.eraShort(er.name))+'</span>':'')+
     '<div class="fp-date">'+esc(v.d)+'</div><h1>'+esc(v.t)+'</h1>'+
     (v.p?'<div class="fp-place">'+esc(v.p)+'</div>':'')+'<div class="tags">'+tags+'</div></div></header>';
  if(hero&&hero.credit)h+='<p class="fp-credit">'+esc(hero.credit)+(hero.file?' — via Wikimedia Commons':'')+'</p>';
  h+='<p class="fp-lead">'+esc(v.x)+'</p>';
  if(editing){
    h+='<div class="fp-toolbar" id="fpTools">'+
       '<button data-cmd="formatBlock" data-val="h2" title="Heading">H</button>'+
       '<button data-cmd="bold" title="Bold"><b>B</b></button>'+
       '<button data-cmd="italic" title="Italic"><i>I</i></button>'+
       '<button data-cmd="insertUnorderedList" title="Bullet list">•</button>'+
       '<button data-cmd="insertOrderedList" title="Numbered list">1.</button>'+
       '<button data-cmd="formatBlock" data-val="blockquote" title="Quote">❝</button>'+
       '<span class="fp-tsep"></span>'+
       '<input id="fpUrl" placeholder="https://… (for link / image)">'+
       '<button data-link="1" title="Make link">🔗</button>'+
       '<button data-image="1" title="Insert image">🖼</button></div>';
    h+='<div class="fp-edit" id="fpArticle" contenteditable="true">'+articleHTML(v)+'</div>';
    h+='<h3 class="fp-h">Gallery</h3><div id="fpGalEdit" class="fp-gal-edit"></div>'+
       '<div class="fp-add"><input id="fpGalUrl" placeholder="Image URL or File:Name.jpg"><input id="fpGalCr" placeholder="credit (optional)"><button class="btn" id="fpGalAdd">Add image</button></div>';
    h+='<h3 class="fp-h">References</h3><div id="fpRefEdit" class="fp-ref-edit"></div>'+
       '<div class="fp-add"><input id="fpRefLabel" placeholder="Source label"><input id="fpRefUrl" placeholder="https://…"><button class="btn" id="fpRefAdd">Add reference</button></div>';
    h+='<div class="fp-savebar"><button class="btn primary" id="fpSave">Save article</button><button class="btn" id="fpCancel">Cancel</button></div>';
  }else{
    h+='<div class="fp-article">'+articleHTML(v)+'</div>';
    const gal=(v.gallery||[]).filter(g=>g!==hero);
    if(gal.length){h+='<h3 class="fp-h">Photo archive</h3><div class="fp-gallery">'+gal.map(g=>
      '<figure><img loading="lazy" src="'+esc(imgSrc(g,600))+'" data-full="'+esc(imgSrc(g,1600))+'" alt="'+esc(g.alt||v.t)+'">'+(g.credit?'<figcaption>'+esc(g.credit)+'</figcaption>':'')+'</figure>').join("")+'</div>';}
    if(v.refs&&v.refs.length){h+='<h3 class="fp-h">References</h3><ul class="refs">'+v.refs.map(r=>
      '<li><a href="'+esc(r.url)+'" target="_blank" rel="noopener">'+esc(r.label)+'</a></li>').join("")+'</ul>';}
    const rel=(v.related||[]).map(id=>HV.eventById(id)).filter(Boolean);
    if(rel.length){h+='<h3 class="fp-h">Related</h3><div class="related">'+rel.map(r=>
      '<button class="rel-chip" data-rel="'+esc(r.id)+'"><i style="background:'+HV.CATS[r.c].color+'"></i><span>'+esc(r.t)+'</span></button>').join("")+'</div>';}
    h+='<div class="fp-savebar"><button class="btn primary" id="fpMap">View on the map ↗</button></div>';
  }
  h+='</article></div>';
  root.innerHTML=h;

  const heroEl=root.querySelector(".fp-hero");
  if(hero&&heroEl){
    heroEl.style.backgroundImage="linear-gradient(to top,rgba(0,0,0,.78),rgba(0,0,0,.15)),url('"+imgSrc(hero,1600).replace(/'/g,"%27")+"')";
  }else if(heroEl){
    // No photograph yet: give the header an intentional era-coloured wash instead of flat grey.
    const c=(er&&er.color)||"#3a3a3a";
    heroEl.style.backgroundImage="linear-gradient(140deg,"+c+",color-mix(in srgb,"+c+" 45%,#000))";
  }

  root.querySelector("#fpBack").onclick=close;
  root.querySelector("#fpClose").onclick=close;
  const editBtn=root.querySelector("#fpEdit");
  if(editBtn)editBtn.onclick=()=>{ if(editing){doSave();} else {editing=true;wGallery=((v.gallery&&v.gallery.slice())||(v.img&&v.img.slice())||[]);wRefs=(v.refs?v.refs.slice():[]);render();} };

  if(editing) wireEditor(v); else wireReader();
}

function wireReader(){
  root.querySelectorAll(".rel-chip").forEach(c=>c.onclick=()=>{const id=c.dataset.rel;close();HV.selectEvent(id);});
  const m=root.querySelector("#fpMap"); if(m)m.onclick=()=>{const id=curId;close();HV.selectEvent(id);};
  root.querySelectorAll(".fp-gallery img").forEach(img=>img.addEventListener("click",()=>{
    const fig=img.closest("figure"), cap=fig&&fig.querySelector("figcaption");
    openLightbox(img.getAttribute("data-full")||img.src, img.alt, cap?cap.textContent:"");
  }));
}

/* ---- photo-archive lightbox ---- */
let lightbox=null;
function openLightbox(src,alt,cap){
  if(!lightbox){
    lightbox=document.createElement("div");
    lightbox.className="fp-lightbox";
    lightbox.innerHTML='<button class="fp-lb-x" aria-label="Close">×</button><img alt=""><div class="fp-lb-cap"></div>';
    document.body.appendChild(lightbox);
    lightbox.addEventListener("click",e=>{ if(e.target===lightbox||e.target.classList.contains("fp-lb-x"))closeLightbox(); });
  }
  lightbox.querySelector("img").src=src;
  lightbox.querySelector("img").alt=alt||"";
  lightbox.querySelector(".fp-lb-cap").textContent=cap||"";
  requestAnimationFrame(()=>lightbox.classList.add("show"));
}
function closeLightbox(){ if(lightbox)lightbox.classList.remove("show"); }
function lightboxOpen(){ return !!lightbox&&lightbox.classList.contains("show"); }

function wireEditor(v){
  const tools=root.querySelector("#fpTools"), ed=root.querySelector("#fpArticle");
  tools.querySelectorAll("button").forEach(b=>b.onmousedown=e=>{
    e.preventDefault();
    if(b.dataset.cmd){document.execCommand(b.dataset.cmd,false,b.dataset.val||null);ed.focus();}
    else if(b.dataset.link){const u=root.querySelector("#fpUrl").value.trim();if(u)document.execCommand("createLink",false,u);ed.focus();}
    else if(b.dataset.image){const u=root.querySelector("#fpUrl").value.trim();if(u)document.execCommand("insertImage",false,/^https?:/i.test(u)?u:HV.commonsImg(u.replace(/^File:/i,""),1000));ed.focus();}
  });
  renderGalEdit(); renderRefEdit();
  root.querySelector("#fpGalAdd").onclick=()=>{
    const url=root.querySelector("#fpGalUrl").value.trim(); if(!url)return;
    const im=/^https?:/i.test(url)?{src:url}:{file:url.replace(/^File:/i,"")};
    const cr=root.querySelector("#fpGalCr").value.trim(); if(cr)im.credit=cr; im.alt=v.t;
    wGallery.push(im); root.querySelector("#fpGalUrl").value="";root.querySelector("#fpGalCr").value=""; renderGalEdit();
  };
  root.querySelector("#fpRefAdd").onclick=()=>{
    const label=root.querySelector("#fpRefLabel").value.trim(), url=root.querySelector("#fpRefUrl").value.trim();
    if(!label||!url)return; wRefs.push({label,url});
    root.querySelector("#fpRefLabel").value="";root.querySelector("#fpRefUrl").value=""; renderRefEdit();
  };
  root.querySelector("#fpSave").onclick=doSave;
  root.querySelector("#fpCancel").onclick=()=>{editing=false;render();};
}
function renderGalEdit(){
  const el=root.querySelector("#fpGalEdit"); if(!el)return;
  el.innerHTML=wGallery.length?wGallery.map((g,i)=>'<div class="fp-gal-item"><img src="'+esc(imgSrc(g,240))+'" alt=""><span>'+esc(g.credit||g.src||("File:"+g.file))+'</span><button data-rm="'+i+'">✕</button></div>').join(""):'<p class="fp-muted">No images yet.</p>';
  el.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{wGallery.splice(+b.dataset.rm,1);renderGalEdit();});
}
function renderRefEdit(){
  const el=root.querySelector("#fpRefEdit"); if(!el)return;
  el.innerHTML=wRefs.length?wRefs.map((r,i)=>'<div class="fp-ref-row"><span>'+esc(r.label)+'</span><button data-rm="'+i+'">✕</button></div>').join(""):'<p class="fp-muted">No references yet.</p>';
  el.querySelectorAll("[data-rm]").forEach(b=>b.onclick=()=>{wRefs.splice(+b.dataset.rm,1);renderRefEdit();});
}
function doSave(){
  const ed=root.querySelector("#fpArticle");
  const patch={article:ed?ed.innerHTML.trim():undefined, gallery:wGallery.slice(), refs:wRefs.slice()};
  HV.saveEventContent(curId,patch);
  editing=false; render(); HV.toast&&HV.toast("Article saved ✓");
}

document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&lightboxOpen()){closeLightbox();return;}
  if(!root.hidden&&e.key==="Escape"&&!editing)close();
});
window.addEventListener("hashchange",()=>{const m=/(?:^|#)full=([^&]+)/.exec(location.hash);if(m&&HV.eventById(m[1]))open(m[1]);});
(function(){const m=/(?:^|#)full=([^&]+)/.exec(location.hash);if(m&&HV.eventById(m[1]))setTimeout(()=>open(m[1]),400);})();
})();
