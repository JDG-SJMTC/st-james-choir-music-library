(function(){
  const id=new URLSearchParams(location.search).get('id');
  if(!id || !id.startsWith('MC26-')) return;
  const item=(window.EMBEDDED_MARAMON_2026||EMBEDDED_MARAMON_2026||[]).find(x=>x.id===id);
  if(!item) return;
  document.documentElement.classList.add('maramon-reader');
  const fs=document.getElementById('fullscreenBtn');
  function syncFullscreen(){
    const on=!!document.fullscreenElement||document.documentElement.classList.contains('focus-mode');
    document.documentElement.classList.toggle('p1-is-fullscreen',on);
    if(fs) fs.textContent=on?'× Exit Fullscreen':'⛶ Fullscreen';
  }
  if(fs) fs.onclick=async()=>{
    if(document.fullscreenElement){await document.exitFullscreen();return;}
    if(document.documentElement.classList.contains('focus-mode')){
      document.documentElement.classList.remove('focus-mode');syncFullscreen();return;
    }
    try{await document.documentElement.requestFullscreen();}
    catch(e){document.documentElement.classList.add('focus-mode');syncFullscreen();}
  };
  document.addEventListener('fullscreenchange',syncFullscreen);
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&document.documentElement.classList.contains('focus-mode')){
      document.documentElement.classList.remove('focus-mode');syncFullscreen();
    }
  });
  syncFullscreen();
  document.title=`Maramon 2026 · ${item.number}`;
  const title=document.getElementById('title'), subtitle=document.getElementById('subtitle');
  title.textContent=`Maramon 2026 · ${item.number}. ${item.english}`; subtitle.textContent=item.malayalam||'';
  const main=document.querySelector('.cv-main');
  main.innerHTML=`<section class="mc-reader-panel"><div class="p1switch mc-switch" role="tablist" aria-label="Lyrics language"><button type="button" data-mc-lang="malayalam">Malayalam</button><button type="button" data-mc-lang="manglish">Manglish</button></div><div class="p1zoom-host"><div class="p1zoom p1zoom-mc"><button type="button" data-d="-" aria-label="Zoom out">−</button><button type="button" class="p1val" title="Reset to 100%">100%</button><button type="button" data-d="+" aria-label="Zoom in">+</button></div></div><div id="mcViewport" class="mc-viewport"><img id="mcImage" alt="Maramon 2026 lyrics"></div><div class="mc-original"><a href="${item.notationFile}" target="_blank" rel="noopener">Original Sheet</a></div></section>`;
  const img=document.getElementById('mcImage'), viewport=document.getElementById('mcViewport'), val=document.querySelector('.p1zoom-mc .p1val');
  const langs={malayalam:item.malayalamImage,manglish:item.manglishImage};
  let lang=sessionStorage.getItem('sj-mc-lang')||'malayalam'; let zoom=Number(localStorage.getItem('sj-mc-zoom'))||100;
  const clamp=v=>Math.max(75,Math.min(200,v));
  function apply(){img.src=langs[lang];img.alt=`Maramon ${item.number} ${lang} lyrics`;img.style.width=zoom+'%';img.style.maxWidth='none';val.textContent=zoom+'%';document.querySelectorAll('[data-mc-lang]').forEach(b=>b.classList.toggle('active',b.dataset.mcLang===lang));}
  document.querySelector('.mc-switch').onclick=e=>{const b=e.target.closest('[data-mc-lang]');if(!b)return;lang=b.dataset.mcLang;sessionStorage.setItem('sj-mc-lang',lang);viewport.scrollTo(0,0);apply();};
  document.querySelector('.p1zoom-mc').onclick=e=>{const b=e.target.closest('button');if(!b)return;zoom=b.classList.contains('p1val')?100:clamp(zoom+(b.dataset.d==='+'?25:-25));localStorage.setItem('sj-mc-zoom',zoom);apply();};
  let startD=0,startZ=100; const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
  viewport.addEventListener('touchstart',e=>{if(e.touches.length===2){startD=dist(e.touches);startZ=zoom;}},{passive:true});
  viewport.addEventListener('touchmove',e=>{if(e.touches.length!==2||!startD)return;e.preventDefault();zoom=clamp(Math.round((startZ*dist(e.touches)/startD)/25)*25);localStorage.setItem('sj-mc-zoom',zoom);apply();},{passive:false});
  viewport.addEventListener('touchend',e=>{if(e.touches.length<2)startD=0},{passive:true});
  apply();
})();
