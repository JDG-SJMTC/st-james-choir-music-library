/* KK40: evidence-based syllable-to-score mapping gate.
 * Raw connected ink groups do not count as Malayalam syllables.
 * A draft mapping cannot render until each fragment has an independently
 * verified Malayalam group, note event, and measured centre.
 */
(function(root){
'use strict';
const clean=s=>s.normalize('NFC').replace(/[\s\-–—.,!?;:'"()]/g,'').toLocaleLowerCase();
function validate(manifest,source){
 const errors=[];
 if(!manifest||manifest.song!=='KK-0040')errors.push('Missing KK40 mapping manifest');
 if(!source||source.song!=='KK-0040'||source.refrain?.length!==2)errors.push('Missing exact production refrain');
 const systems=manifest?.systems;
 if(!Array.isArray(systems)||systems.length!==3)errors.push('Expected exactly three refrain systems');
 for(let i=0;i<3;i++){
  const s=systems?.[i];if(!s){errors.push('System '+(i+1)+' missing');continue;}
  const expected=source?.refrain?.[i===0?0:1];
  if(typeof expected!=='string'||clean(s.sourceLine||'')!==clean(expected))
   errors.push('System '+(i+1)+': source-line mismatch');
  if(!Array.isArray(s.fragments)||!s.fragments.length){errors.push('System '+(i+1)+': missing fragments');continue;}
  if(clean(s.fragments.map(f=>f.manglish||'').join(''))!==clean(expected||''))
   errors.push('System '+(i+1)+': fragments do not reconstruct production text');
  s.fragments.forEach((f,j)=>{
   if(typeof f.malayalam!=='string'||!f.malayalam.trim())errors.push('System '+(i+1)+' fragment '+(j+1)+': Malayalam correspondence missing');
   if(!Number.isFinite(f.noteX)||!Number.isFinite(f.glyphCentreX))errors.push('System '+(i+1)+' fragment '+(j+1)+': measured anchor missing');
   if(f.verified!==true)errors.push('System '+(i+1)+' fragment '+(j+1)+': independently unverified');
  });
  if(s.systemBoundaryVerified!==true)errors.push('System '+(i+1)+': musical boundary unverified');
  if(s.visualCollisionCheckPassed!==true)errors.push('System '+(i+1)+': visual collision QA pending');
 }
 if(manifest?.endingDifferenceVerified!==true)errors.push('Refrain alternative endings not verified');
 return {pass:errors.length===0,errors};
}
root.KK40RefrainAnchorGate={validate};
if(typeof module==='object'&&module.exports)module.exports={validate};
})(typeof globalThis!=='undefined'?globalThis:this);
