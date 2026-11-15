/* KK 8 beta: run with node tools/kk8-lyric-integrity.test.js from interactive-notation/ */
const fs=require('node:fs');const assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'../song-8/index.html'),'utf8');
function extract(name,end){const marker='const '+name+'=';const start=html.indexOf(marker);assert(start>=0,'Missing '+name);const from=start+marker.length;const to=html.indexOf(end,from);assert(to>from,'Missing terminator for '+name);return JSON.parse(html.slice(from,to));}
const verses=extract('verses',';const drafts=');const drafts=extract('drafts',';\nconst $=');
assert.equal(verses.length,7);assert.equal(drafts.length,7);
const letters=s=>s.replace(/\s/g,'');
for(let i=0;i<7;i++){
 const parts=drafts[i];assert(parts.length>0,'Empty stanza '+(i+1));
 assert.equal(letters(parts.map(p=>p.text).join('')),letters(verses[i]),'Lyric letters mismatch in stanza '+(i+1));
 for(const p of parts){assert([1,2,3].includes(p.system),'Bad musical system');assert(Number.isFinite(p.x)&&p.x>=0&&p.x<=878,'Bad horizontal anchor');}
 console.log('PASS stanza '+(i+1)+': '+parts.length+' fragments; exact non-whitespace character fidelity and anchor bounds');
}
assert(html.includes('const cuts=[386,557,742],band=38,sourceBottom=840;'),'Unexpected score geometry');
console.log('PASS score geometry constants; manual visual QA still required');
