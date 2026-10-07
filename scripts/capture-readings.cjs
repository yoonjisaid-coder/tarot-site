// Replays the reading engine the way the result screen composes it, for each quality fixture.
// Usage: node scripts/capture-readings.cjs <compiled lib dir> <out.json>
const path=require('node:path');const fs=require('node:fs');
const [root,out]=process.argv.slice(2);
if(!root||!out)throw Error('Usage: capture-readings.cjs <compiled lib dir> <out.json>');
const {koCards}=require(path.join(root,'tarot-ko.js'));
const S=require(path.join(root,'reading-scenarios.js'));
const T=require(path.join(root,'timing.js'));
const {fixtures}=require('./quality-fixtures.cjs');
const rows=fixtures.map(fx=>{
 if(!fx.q)return {...fx,status:'NOT_SUPPORTED_BY_PRODUCT'};
 const q=S.getScenario(fx.q,true);
 const drawn=fx.cards.slice(0,q.count).map(([id,reversed])=>({card:koCards[id],reversed}));
 const timing=T.isTiming(q.id);
 const cards=drawn.map((d,i)=>({card:`${d.card.name}${d.reversed?' (역방향)':''}`,position:q.positions[i],sections:S.detailedReading(d,q,i,true,drawn)}));
 let answer,summary;
 if(S.readingSummary){summary=S.readingSummary(drawn,q,true);answer=summary.answer}
 else{
  answer=timing?T.timingReading(drawn[0],q.id,true).answer:S.readingConclusion(drawn,q,true);
  summary={lead:timing?T.timingReading(drawn[0],q.id,true).variable:S.readingConclusion(drawn,q,true),body:S.spreadConnection(drawn,q,true),action:q.prompt};
 }
 return {...fx,title:q.title,answer,cards,synthesis:{lead:summary.lead,body:summary.body,action:summary.action}};
});
fs.writeFileSync(out,JSON.stringify(rows,null,1));
console.log(`captured ${rows.filter(r=>!r.status).length} readings, ${rows.filter(r=>r.status).length} not supported -> ${out}`);
