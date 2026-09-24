// Compile the relevant TS modules to a temporary directory before running this gate.
const assert=require('node:assert/strict');
const path=require('node:path');
const root=process.argv[2];
if(!root)throw Error('Provide the temporary compiled module directory');
const {cards}=require(path.join(root,'tarot.js'));
const {koCards}=require(path.join(root,'tarot-ko.js'));
const {timingQuestions,timingReading}=require(path.join(root,'timing.js'));
const {scenarioList,detailedReading}=require(path.join(root,'reading-scenarios.js'));
const {parseSharedReading,readingUrl}=require(path.join(root,'shared-result.js'));
let checks=0;
for(const card of cards)for(const reversed of [false,true])for(const q of timingQuestions){
 const d={card,reversed};const r=timingReading(d,q.id,true);
 assert.deepEqual(r,timingReading(d,q.id,true));
 assert.ok(r.reason&&r.variable&&r.action&&r.answer);
 if(r.band===null)assert.equal(r.window,'기간을 정하기 어려워요');
 else {assert.ok(r.band>=0&&r.band<=4);if(q.id!=='contact-timing')assert.ok(r.band>=2)}
 if(card.id>=22&&card.tone<0)assert.equal(r.band,null);
 const url=readingUrl('https://example.test',true,{v:1,q:q.id,cards:[[card.id,reversed]],oracle:0,message:0});
 const parsed=parseSharedReading(new URL(url).hash);assert.equal(parsed.cards[0][0],card.id);assert.equal(parsed.cards[0][1],reversed);
 const scenario=scenarioList(true).find(s=>s.id===q.id);assert.equal(detailedReading({card:koCards[card.id],reversed},scenario,0,true).length,5);
 checks++;
}
assert.equal(timingReading({card:cards[29],reversed:false},'contact-timing',true).band,0);
assert.equal(timingReading({card:cards[12],reversed:false},'contact-timing',true).band,null);
assert.equal(timingReading({card:cards[18],reversed:true},'contact-timing',true).band,null);
assert.equal(parseSharedReading('#result=%7B'),null);
assert.equal(parseSharedReading('#result='+encodeURIComponent(JSON.stringify({v:1,q:'contact-timing',cards:[[999,false]],oracle:0,message:0}))),null);
console.log(`PASS: ${checks} timing/orientation/share combinations; special cases; malformed links. Symbolic consistency only, not predictive accuracy.`);
