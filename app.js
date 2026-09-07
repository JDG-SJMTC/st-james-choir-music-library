const searchInput = document.querySelector('#search');
const clearBtn = document.querySelector('#clearBtn');
const resultsEl = document.querySelector('#results');
const resultCountEl = document.querySelector('#resultCount');
const resultsTitleEl = document.querySelector('#results-title');
const emptyEl = document.querySelector('#empty');
const collectionTabs = document.querySelectorAll('[data-collection]');
const recentSection = document.querySelector('#recent-section');
const recentResults = document.querySelector('#recent-results');
const recentClear = document.querySelector('#recent-clear');

const songs = EMBEDDED_SONGS;
const doxologies = EMBEDDED_DOXOLOGIES;
const catalogue = [...songs, ...doxologies];
let currentResults = [];
let activeCollection = 'songs';
const RECENT_KEY = 'stJamesChoirRecentV2';

function normalize(value = '') {
  return String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}
function displayNumber(item) { return item.collection === 'Doxologies' ? item.number : String(item.number); }
function itemLabel(item) { return item.collection === 'Doxologies' ? `Doxology ${item.number}` : `Song ${item.number}`; }
function scoreItem(item, query) {
  if (!query) return 1;
  const q = normalize(query), num = normalize(displayNumber(item));
  const arabic = item.arabicNumber ? String(item.arabicNumber) : '';
  const id = normalize(item.id);
  const collectionTerm = item.collection === 'Doxologies' ? `doxology ${arabic} ${num}` : `song ${num}`;
  if (q === num || q === arabic || q === id || q === normalize(collectionTerm)) return 1000;
  const en=normalize(item.english), ml=normalize(item.malayalam||''), aliases=normalize((item.aliases||[]).join(' '));
  const haystack=`${en} ${ml} ${aliases} ${num} ${arabic} ${normalize(collectionTerm)}`;
  let score=0;
  if(en===q||ml===q) score+=700;
  if(en.startsWith(q)||ml.startsWith(q)) score+=500;
  if(en.includes(q)||ml.includes(q)) score+=350;
  if(aliases.includes(q)||normalize(collectionTerm).includes(q)) score+=250;
  const tokens=q.split(' ').filter(Boolean);
  if(tokens.length>1){const matched=tokens.filter(t=>haystack.includes(t)).length;score+=matched*60;if(matched!==tokens.length)score-=200;}
  return score;
}
function escapeHtml(s){return String(s||'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));}

function getRecentIds(){try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]');}catch{return [];}}
function saveRecent(item){
  if(!item || !item.notationFile) return;
  const next=[item.id,...getRecentIds().filter(id=>id!==item.id)].slice(0,10);
  localStorage.setItem(RECENT_KEY,JSON.stringify(next)); renderRecent();
}
function renderRecent(){
  const items=getRecentIds().map(id=>catalogue.find(x=>x.id===id)).filter(Boolean);
  recentSection.hidden=items.length===0;
  recentResults.innerHTML=items.map(i=>compactCard(i)).join('');
}
function compactCard(item){
  const ml=item.malayalam?`<span class="recent-ml" lang="ml">${escapeHtml(item.malayalam)}</span>`:'';
  return `<button class="recent-card" type="button" data-open-recent="${escapeHtml(item.id)}">
    <span class="recent-no">${escapeHtml(displayNumber(item))}</span><span>${ml}<span class="recent-en">${escapeHtml(item.english)}</span></span>
  </button>`;
}

function actionButtons(item){
  if(!item.notationFile) return `<span class="open-btn disabled">Not mapped</span>`;
  const choir = item.choirView
    ? `<a class="action-btn choir-btn" href="${item.choirView}" data-choir-id="${escapeHtml(item.id)}">Choir View</a>`
    : `<button class="action-btn choir-btn disabled-action" type="button" data-choir-unavailable="${escapeHtml(item.id)}" title="Choir View lyric mapping has not yet been verified for this item">Choir View</button>`;
  return `<div class="actions"><a class="action-btn notation-btn" href="${item.notationFile}" target="_blank" rel="noopener" data-notation-id="${escapeHtml(item.id)}">Open Notation</a>${choir}</div>`;
}
function itemCard(item){
  const isDox=item.collection==='Doxologies';
  const label=isDox?`Doxology ${item.number}`:item.number;
  const ml=item.malayalam?`<p class="malayalam" lang="ml">${escapeHtml(item.malayalam)}</p>`:'';
  const badge=isDox?'<span class="collection-badge">Doxology</span>':'';
  return `<article class="song-card ${!item.notationFile?'unavailable':''}" aria-label="${escapeHtml(itemLabel(item))}: ${escapeHtml(item.english)}">
    <div class="song-no">${escapeHtml(displayNumber(item))}</div>
    <div class="song-title">${ml}<p class="english">${escapeHtml(item.english)} ${badge}</p></div>
    ${actionButtons(item)}
  </article>`;
}
function visibleBase(query){if(query.trim())return catalogue;return activeCollection==='doxologies'?doxologies:songs;}
function render(query=''){
  const q=query.trim(), base=visibleBase(q);
  currentResults=base.map(item=>({item,score:scoreItem(item,q)})).filter(x=>x.score>0)
   .sort((a,b)=>q?(b.score-a.score||((a.item.arabicNumber||a.item.number)-(b.item.arabicNumber||b.item.number))):((a.item.arabicNumber||a.item.number)-(b.item.arabicNumber||b.item.number))).map(x=>x.item);
  resultsEl.innerHTML=currentResults.map(itemCard).join(''); emptyEl.hidden=currentResults.length!==0; clearBtn.hidden=!q;
  if(q){resultsTitleEl.textContent='Search results';resultCountEl.textContent=`${currentResults.length} ${currentResults.length===1?'match':'matches'}`;}
  else if(activeCollection==='doxologies'){resultsTitleEl.textContent='Doxologies';resultCountEl.textContent=`${doxologies.length} doxologies`;}
  else{resultsTitleEl.textContent='Kristheeya Keerthanangal';resultCountEl.textContent=`${songs.length} songs`;}
}
function byId(id){return catalogue.find(x=>x.id===id);}

document.addEventListener('click',e=>{
  const notation=e.target.closest('[data-notation-id]'); if(notation){saveRecent(byId(notation.dataset.notationId)); return;}
  const choir=e.target.closest('[data-choir-id]'); if(choir){saveRecent(byId(choir.dataset.choirId)); return;}
  const recent=e.target.closest('[data-open-recent]'); if(recent){const item=byId(recent.dataset.openRecent); if(item){saveRecent(item); if(item.choirView){window.location.href=item.choirView;} else if(item.notationFile){window.open(item.notationFile,'_blank','noopener');}} return;}
  const unavailable=e.target.closest('[data-choir-unavailable]'); if(unavailable){
    alert('Choir View is not available for this item.');
  }
});
searchInput.addEventListener('input',e=>render(e.target.value));
searchInput.addEventListener('keydown',e=>{if(e.key!=='Enter'||currentResults.length===0||!currentResults[0].notationFile)return;e.preventDefault();const item=currentResults[0];saveRecent(item);window.open(item.notationFile,'_blank','noopener');});
clearBtn.addEventListener('click',()=>{searchInput.value='';searchInput.focus();render('');});
collectionTabs.forEach(btn=>btn.addEventListener('click',()=>{activeCollection=btn.dataset.collection;collectionTabs.forEach(b=>b.classList.toggle('active',b===btn));searchInput.value='';render('');}));
recentClear.addEventListener('click',()=>{localStorage.removeItem(RECENT_KEY);renderRecent();});
document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement!==searchInput){e.preventDefault();searchInput.focus();}});
render(''); renderRecent();
