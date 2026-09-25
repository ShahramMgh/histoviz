/* ============================================================
   The Iranian Heritage — shared theme controller
   Included on every page (landing + atlas). Applies the saved
   theme, wires any #themeSeg button group (via delegation, so it
   works even inside a dynamically-shown profile), persists the
   choice, and fires a "hv-theme" event other scripts can listen to.
   ============================================================ */
(function(){
  "use strict";
  var THEMES=["auto","light","dark","parchment"];
  function apply(t){
    document.documentElement.setAttribute("data-theme",t);
    try{localStorage.setItem("hv-theme",t);}catch(e){}
    document.querySelectorAll("#themeSeg button").forEach(function(b){
      b.setAttribute("aria-pressed", b.dataset.theme===t ? "true":"false");
    });
    document.dispatchEvent(new CustomEvent("hv-theme",{detail:t}));
  }
  window.hvApplyTheme=apply;
  // initialise — one-time migration adopts the "Paper" default
  var t=null; try{t=localStorage.getItem("hv-theme");}catch(e){}
  try{ if(!localStorage.getItem("hv-theme-default-v2")){ t="parchment"; localStorage.setItem("hv-theme-default-v2","1"); } }catch(e){}
  if(!t||THEMES.indexOf(t)<0)t="parchment";
  apply(t);
  // one delegated handler covers the theme buttons wherever they live
  document.addEventListener("click",function(e){
    var b=e.target&&e.target.closest?e.target.closest("#themeSeg button"):null;
    if(b&&b.dataset.theme)apply(b.dataset.theme);
  });
  try{ window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(){
    document.dispatchEvent(new CustomEvent("hv-theme",{detail:document.documentElement.getAttribute("data-theme")}));
  }); }catch(e){}
})();
