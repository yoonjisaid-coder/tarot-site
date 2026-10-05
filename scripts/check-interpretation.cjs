const assert=require('node:assert/strict'),path=require('node:path');
const root=process.argv[2];
if(!root)throw Error('Pass the compiled module directory');
const {cards}=require(path.join(root,'tarot.js'));
const {koCards}=require(path.join(root,'tarot-ko.js'));
const {interpretSpread,contractQuestionIds,cardSignals}=require(path.join(root,'interpretation-contract.js'));
const e=require(path.join(root,'reading-scenarios.js'));
const {readingUrl,parseSharedReading}=require(path.join(root,'shared-result.js'));
const draw=(ids,ko=true)=>ids.map(x=>({card:(ko?koCards:cards)[Array.isArray(x)?x[0]:x],reversed:Array.isArray(x)?x[1]:false}));
const read=(ids,id='ex-contact',ko=true)=>interpretSpread(draw(ids,ko),e.getScenario(id,ko),ko);
let contracts=0;
for(const ko of [true,false])for(const id of contractQuestionIds)for(let position=0;position<3;position++)for(let card=0;card<78;card++)for(const reversed of [true,false]){
 const ids=[(card+1)%78,(card+2)%78];ids.splice(position,0,[card,reversed]);
 const r=read(ids,id,ko);contracts++;
 assert.equal(r.evidence.length,3);assert.equal(r.questionId,id);
 assert.equal(r.evidence[position].cardId,card);assert.equal(r.evidence[position].reversed,reversed);
 for(const key of ['answer','combination','condition','action'])assert.ok(r[key].trim());
 assert.ok(!JSON.stringify(r).includes('undefined'));
 assert.deepEqual(r,read(ids,id,ko),'deterministic replay');
 assert.equal(r.judgment,read(ids,id,!ko).judgment,'language cannot change judgment');
}
assert.equal(read([41,9,64]).judgment,'blocked','nostalgia plus distance is not contact');
assert.equal(read([49,12,50]).judgment,'blocked','mature feeling plus pause is not initiative');
assert.equal(read([29,16,11]).judgment,'conditional','fast movement plus rupture is not a simple no');
assert.match(read([29,16,11]).combination,/갑자기/);
assert.equal(read([1,19,48]).judgment,'supported');
assert.equal(read([20,37,66],'ex-return').judgment,'supported','renewal plus reciprocity differs from longing alone');
assert.equal(read([38,2,48],'crush-feelings').judgment,'conditional','friendship and silence do not establish romantic attraction');
assert.equal(read([37,19,14],'crush-feelings').judgment,'supported');
assert.notEqual(read([41,9,64]).answer,read([41,9,64],'ex-misses-me').answer,'question substitution');
assert.notEqual(read([41,9,64],'ex-misses-me').judgment,read([[41,true],9,64],'ex-misses-me').judgment,'reversal affects interpretation');
assert.notEqual(read([41,9,64],'ex-misses-me').judgment,read([9,41,64],'ex-misses-me').judgment,'position affects interpretation');
assert.equal(read([41,9,64]).answer,read([41,9,29]).answer,'advice position cannot manufacture a forecast');
assert.notEqual(read([41,9,64]).action,read([41,9,29]).action,'advice responds to third card');
assert.throws(()=>read([41,41,64]));assert.throws(()=>read([41,9]));
assert.equal(interpretSpread(draw([1,2,3]),{id:'not-a-question',title:'',positions:['a','b','c']},true),null);
assert.equal(cardSignals({card:koCards[15],reversed:true}).includes('distance'),true,'Devil reversed is release, not blanket negativity');
let legacy=0,shared=0;
for(const ko of [true,false])for(const q of [...e.scenarioList(ko),...['daily','three-card','yes-no'].map(id=>e.getScenario(id,ko))]){
 const ds=draw([1,2,3].slice(0,q.count),ko);
 assert.ok(e.readingConclusion(ds,q,ko));ds.forEach((d,i)=>assert.ok(e.detailedReading(d,q,i,ko,ds).length));legacy++;
 const payload={v:1,q:q.id,cards:ds.map(d=>[d.card.id,d.reversed]),oracle:0,message:0};
 assert.deepEqual(parseSharedReading(new URL(readingUrl('https://example.invalid',ko,payload)).hash),payload);shared++;
}
assert.equal(parseSharedReading('#result='+encodeURIComponent(JSON.stringify({v:1,q:'career',cards:[[1,false]],oracle:0,message:0}))),null);
console.log(JSON.stringify({status:'PASS',contractSweeps:contracts,routeLanguageChecks:legacy,sharedRoundTrips:shared,scope:'Structural and explicit semantic regression only; not paid quality or browser E2E.'}));
