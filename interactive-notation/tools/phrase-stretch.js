/* Reusable lyric-phrase stretching for KK30/KK150-style layouts.
   Layout suggestions are NEVER musical verification. */
(function(root){
'use strict';
function stretch(tokens,anchors,options={}){
 if(!Array.isArray(tokens)||!tokens.length||tokens.some(t=>typeof t!=='string'||!t))
  throw Error('tokens must be nonempty text fragments');
 if(!Array.isArray(anchors)||anchors.length<2||anchors.some(x=>!Number.isFinite(x)))
  throw Error('need at least two numeric reference anchors');
 for(let i=1;i<anchors.length;i++)if(anchors[i]<=anchors[i-1])
  throw Error('anchors must increase strictly');
 const start=anchors[0],end=anchors[anchors.length-1];
 const weights=tokens.map(t=>Math.max(1,[...t].length));
 const total=weights.reduce((a,b)=>a+b,0);
 const minGap=options.minGap??0;
 if(!Number.isFinite(minGap)||minGap<0)throw Error('invalid minimum gap');
 const remaining=(end-start)-minGap*(tokens.length-1);
 if(remaining<0)throw Error('not enough horizontal space');
 let acc=0;
 const points=tokens.map((text,i)=>{
  const x=start+minGap*i+remaining*(acc+weights[i]/2)/total;
  acc+=weights[i];
  return {text,x,verified:false,method:'phrase-stretch-proposal'};
 });
 return {points,range:[start,end],sourceAnchorCount:anchors.length,
   targetTokenCount:tokens.length,requiresMusicalReview:true};
}
function validateTranscript(original,parts){
 if(typeof original!=='string'||!Array.isArray(parts)||parts.some(x=>typeof x!=='string'))
  return {ok:false,reason:'Invalid transcript'};
 return {ok:parts.join('')===original,reason:parts.join('')===original?'exact':'source text changed'};
}
root.SJMTCPhraseStretch=Object.freeze({stretch,validateTranscript});
})(typeof window!=='undefined'?window:globalThis);
