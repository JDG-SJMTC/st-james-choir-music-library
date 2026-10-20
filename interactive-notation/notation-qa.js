/* Shared notation release gate. Fail closed: no inferred anchors are approved. */
(function(root){
'use strict';
function validate(song){
 const errors=[],warnings=[];
 if(!song||typeof song!=='object')return {ok:false,errors:['Missing song manifest'],warnings};
 if(!song.id)errors.push('Missing song ID');
 if(!Array.isArray(song.verses)||!song.verses.length)errors.push('Missing source verses');
 if(!Array.isArray(song.systems)||!song.systems.length)errors.push('Missing approved musical staff systems');
 if(!Array.isArray(song.alignments)||song.alignments.length!==(song.verses||[]).length)errors.push('Every stanza needs a separate alignment');
 (song.verses||[]).forEach((verse,v)=>{
  if(typeof verse!=='string'||!verse.trim())errors.push('Empty source stanza '+(v+1));
  const a=(song.alignments||[])[v];
  if(!a||!Array.isArray(a.systems)){errors.push('No musical-system transcript for stanza '+(v+1));return;}
  if(a.systems.length!==(song.systems||[]).length)errors.push('System count mismatch in stanza '+(v+1));
  const fragments=[];
  a.systems.forEach((sys,i)=>{
   if(!sys||sys.boundaryVerified!==true)errors.push('Unverified system boundary '+(i+1)+' stanza '+(v+1));
   if(!sys||!Array.isArray(sys.tokens)||!sys.tokens.length){errors.push('Missing aligned tokens for stanza '+(v+1)+' system '+(i+1));return;}
   sys.tokens.forEach((t,j)=>{
    if(!t||typeof t.text!=='string'||!t.text.length)errors.push('Missing token text at '+v+'/'+i+'/'+j);
    if(!t||!Number.isFinite(t.x)||!Number.isFinite(t.y)||!Number.isInteger(t.noteIndex)||t.noteIndex<0)errors.push('Invalid note anchor at '+v+'/'+i+'/'+j);
    if(!t||t.anchorVerified!==true)errors.push('Unverified glyph/note anchor at '+v+'/'+i+'/'+j);
    if(t&&typeof t.text==='string')fragments.push(t.text);
   });
  });
  // Require an explicit lossless transcription, not an inferred whitespace join.
  if(a.sourceText!==verse)errors.push('Source text changed in stanza '+(v+1));
  if(a.roundTripVerified!==true)errors.push('Round-trip transcription not independently verified for stanza '+(v+1));
  if(a.collisionCheckPassed!==true)errors.push('Collision check not passed for stanza '+(v+1));
 });
 if(song.visualQA!==true)errors.push('Desktop and mobile visual QA not approved');
 if(song.musicalQA!==true)errors.push('Musical sign-off not approved');
 return {ok:errors.length===0,errors,warnings};
}
root.SJMTCNotationQA=Object.freeze({validate});
})(typeof window!=='undefined'?window:globalThis);
