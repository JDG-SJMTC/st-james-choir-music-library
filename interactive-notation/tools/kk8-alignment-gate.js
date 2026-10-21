/* KK 8 release gate. Pure validation; never confuses layout with musical approval. */
(function(root){'use strict';
const expectedSystems=[13,12,15];
function validate(d,allVerses){const errors=[],warnings=[];
 if(!d||d.song!=='KK-0008'||d.stanza!==1)errors.push('Incorrect song/stanza');
 if(!d||!Array.isArray(d.systems)||d.systems.length!==3)errors.push('Expected exactly 3 musical systems');
 if(!d||!d.coordinateSystem||d.coordinateSystem.width!==878||d.coordinateSystem.height!==1241)errors.push('Image coordinate basis must match original.png (878x1241)');
 let reconstructed='';
 (d?.systems||[]).forEach((s,i)=>{if(!Array.isArray(s.fragments)||s.fragments.length!==expectedSystems[i])errors.push('Unexpected fragment count in system '+(i+1));let last=-Infinity;s.fragments?.forEach((f,j)=>{if(typeof f.raw!=='string'||!f.raw.length)errors.push('Empty fragment '+i+':'+j);if(!Number.isFinite(f.x)||f.x<=last)errors.push('Unordered anchor '+i+':'+j);last=f.x;if(f.x<0||f.x>878)errors.push('Out-of-bounds x '+i+':'+j);if(f.noteVerified!==true||f.syllableVerified!==true)warnings.push('Unverified note/syllable '+i+':'+j)});const text=s.fragments?.map(f=>f.raw).join('')||'';if(text!==s.exactText)errors.push('System text mismatch '+(i+1));reconstructed+=text});
 if(reconstructed!==d?.sourceText)errors.push('Stanza 1 source round-trip mismatch');if(allVerses&&d?.sourceText!==allVerses[0])errors.push('Stanza 1 differs from locked source');
 if(!d?.verification?.printedMalayalam||!d?.verification?.noteToSyllable||!d?.verification?.melismas||!d?.verification?.musicalApproval)warnings.push('Musical verification not complete');
 if(d?.releaseApproved!==true)warnings.push('Release not approved');
 return {structurePass:errors.length===0,releasePass:errors.length===0&&warnings.length===0,errors,warnings,fragments:(d?.systems||[]).reduce((n,s)=>n+(s.fragments?.length||0),0)};
}
root.SJMTCAlignmentGate={validate};if(typeof module==='object'&&module.exports)module.exports={validate};
})(typeof globalThis!=='undefined'?globalThis:this);
