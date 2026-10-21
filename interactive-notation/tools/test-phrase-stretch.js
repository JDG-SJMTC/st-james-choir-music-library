/* Run: node interactive-notation/tools/test-phrase-stretch.js */
const assert=require('node:assert/strict');
require('./phrase-stretch.js');
const {stretch,validateTranscript}=globalThis.SJMTCPhraseStretch;
const r=stretch(['koo','dey','paar','kka'],[120,210,290,420],{minGap:12});
assert.equal(r.points.length,4);
assert.ok(r.points.every((p,i)=>p.verified===false&&p.x>=120&&p.x<=420));
assert.ok(r.points.every((p,i)=>i===0||p.x>r.points[i-1].x));
assert.equal(r.requiresMusicalReview,true);
assert.equal(validateTranscript('Koodey paarkka',['Koo','dey',' ','paar','kka']).ok,true);
assert.equal(validateTranscript('Koodey paarkka',['Koo','dey','paar','kka']).ok,false);
assert.throws(()=>stretch(['a','b'],[400,100]));
assert.throws(()=>stretch(['a','b','c'],[0,10],{minGap:20}));
console.log('PASS: 8 phrase-stretch invariants; musical alignment NOT verified');
