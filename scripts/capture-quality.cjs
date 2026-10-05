const fs=require('node:fs'),path=require('node:path');
const [root,output]=process.argv.slice(2);
if(!root||!output)throw Error('Usage: compiled-module-root output.json');
const {koCards}=require(path.join(root,'tarot-ko.js'));
const engine=require(path.join(root,'reading-scenarios.js'));
const cases=require('./quality-cases.cjs');
const rows=cases.map(c=>{
 if(!c.route)return {...c,status:'NOT_SUPPORTED_BY_PRODUCT',output:null,note:'No free-text input or interpretation request exists. Not silently mapped to a love question.'};
 const q=engine.getScenario(c.route,true),ds=c.cards.map(([id,reversed])=>({card:koCards[id],reversed}));
 const details=ds.map((d,i)=>engine.detailedReading(d,q,i,true,ds));
 return {...c,status:'SOURCE_REPLAY',selectedQuestion:q.title,cardNames:ds.map(d=>d.card.name+(d.reversed?' 역방향':' 정방향')),output:{answer:engine.readingConclusion(ds,q,true),details,combination:engine.spreadConnection(ds,q,true),condition:engine.readingCondition?.(ds,q,true)??null,action:engine.readingAction?.(ds,q,true)??q.prompt}};
});
fs.writeFileSync(output,JSON.stringify(rows,null,2)+'\n');
console.log(JSON.stringify({cases:rows.length,supported:rows.filter(r=>r.output).length,unsupported:rows.filter(r=>!r.output).length,output}));
