/* KK40 mandatory source and musical-boundary preflight. Run: node interactive-notation/song-40/qa-source.test.js */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=__dirname,src=JSON.parse(fs.readFileSync(path.join(base,'production-manglish-source.json'),'utf8'));
const ledger=JSON.parse(fs.readFileSync(path.join(base,'musical-system-ledger.json'),'utf8'));
const norm=s=>s.normalize('NFC');
assert.equal(src.song,'KK-0040');assert.equal(src.refrain.length,2);assert.equal(src.stanzas.length,6);
for(const [i,st] of src.stanzas.entries()){assert.equal(st.length,2,'Stanza '+(i+1)+' requires two exact lyrical lines');assert.ok(st.every(s=>s&&s===norm(s)));}
assert.equal(src.refrainAfterEach,'-haa...');
assert.equal(src.attribution,'(Moshavatsalam)');
assert.equal(ledger.systems.length,6);
const verified=ledger.systems.every(s=>s.verifiedSyllableBoundary===true)&&
 ledger.scoreStructure?.refrain?.verified===true&&ledger.scoreStructure?.stanza?.verified===true;
if(!verified){console.error('BLOCKED: KK40 musical-system boundaries and alternative/repeated passages are not independently verified.');process.exitCode=1;}
else console.log('KK40 source and musical-system boundaries verified');
