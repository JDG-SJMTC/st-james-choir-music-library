/* KK40 fail-closed source, lyric-boundary and musical-system QA.
 * Candidate coordinates or syllable counts are never evidence of approval.
 * Does not modify original score. */
(function(root){'use strict';
function validate(data){
 const errors=[],warnings=[];
 if(!data||data.song!=='KK-0040')errors.push('Wrong or missing KK40 source');
 if(!Array.isArray(data?.stanzas)||data.stanzas.length!==6)errors.push('Exactly six stanzas required');
 const reports=[];
 for(let i=0;i<6;i++){
  const stanza=data?.stanzas?.[i],id=i+1,problems=[];
  if(!stanza){errors.push('Stanza '+id+' missing');continue;}
  if(stanza.number!==id)problems.push('stanza number mismatch');
  if(!Array.isArray(stanza.lyricLines)||!stanza.lyricLines.length||stanza.lyricLines.some(x=>typeof x!=='string'||!x.trim()))
   problems.push('exact Manglish lyric lines missing');
  if(!Array.isArray(stanza.syllables)||!stanza.syllables.length)
   problems.push('source syllable segmentation missing');
  if(!Array.isArray(stanza.musicalSystems)||stanza.musicalSystems.length!==6)
   problems.push('six musical-system assignments required');
  if(stanza.lyricLines?.length&&stanza.syllables?.length){
   const normalized=s=>s.normalize('NFC').replace(/[\s\-–—.,!?;:'"()]/g,'').toLocaleLowerCase();
   const reconstructed=stanza.syllables.map(x=>x.text||'').join('');
   if(normalized(reconstructed)!==normalized(stanza.lyricLines.join('')))
    problems.push('syllables do not round-trip to exact lyric source');
   const counts=stanza.lyricLines.map(x=>normalized(x).length),starts=[];let pos=0;
   for(const len of counts){starts.push(pos);pos+=len;}
   if(stanza.lyricBoundariesVerified!==true)problems.push('lyrical-line boundaries not independently verified');
  }
  if(stanza.musicalSystems?.length===6&&stanza.syllables?.length){
   const flat=stanza.musicalSystems.flatMap(x=>x.syllableIndices||[]);
   if(flat.length!==stanza.syllables.length||flat.some((v,j)=>v!==j))
    problems.push('musical systems must cover each syllable once in exact source order');
   stanza.musicalSystems.forEach((system,j)=>{
    if(!system.boundaryVerified)problems.push('system '+(j+1)+' boundary unverified');
    if(!system.printedMalayalamVerified)problems.push('system '+(j+1)+' Malayalam correspondence unverified');
    if(!system.noteAnchorsVerified)problems.push('system '+(j+1)+' note anchors unverified');
   });
  }
  if(stanza.visualCollisionCheckPassed!==true)problems.push('rendered visual collision QA pending');
  if(stanza.approved!==true)problems.push('stanza not approved');
  errors.push(...problems.map(x=>'Stanza '+id+': '+x));
  reports.push({stanza:id,pass:problems.length===0,issues:problems});
 }
 if(data?.originalScorePixelPreserved!==true)errors.push('original-score pixel-preservation QA missing');
 return {pass:errors.length===0,errors,warnings,reports};
}
root.SJMTCKK40BoundaryGate={validate};
if(typeof module==='object'&&module.exports)module.exports={validate};
})(typeof globalThis!=='undefined'?globalThis:this);
