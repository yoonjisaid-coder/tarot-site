// Semantic consistency gate for Korean readings. Compile lib to a temp dir first (see check-timing.cjs).
// Checks that card meaning, verdict, evidence, synthesis, advice and timing point the same way.
// A detector for known failure patterns, not proof of editorial quality.
const path=require('node:path');
const root=process.argv[2];
if(!root)throw Error('Provide the temporary compiled module directory');
const {koCards}=require(path.join(root,'tarot-ko.js'));
const S=require(path.join(root,'reading-scenarios.js'));
const E=require(path.join(root,'reading-engine.js'));
const {CORES}=require(path.join(root,'card-cores.js'));
const fail={};const add=(k,d)=>{(fail[k]??=[]).length<3&&fail[k].push(d)};
// 0. Every card and orientation has a semantic core, an obstacle and an advice phrase.
if(CORES.length!==78)add('core table size',CORES.length);
CORES.forEach((pair,i)=>pair.forEach((c,r)=>{if(c.length!==4||c.slice(1).some(x=>!x||x.length<3))add('incomplete core',`${i}/${r}`)}));
const ids=S.scenarioList(true).filter(q=>q.count===3).map(q=>q.id).concat(['three-card']);
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
let checks=0;
for(let t=0;t<200;t++){
 const set=new Set();while(set.size<3)set.add(Math.floor(rnd()*78));
 const cards=[...set].map(c=>({card:koCards[c],reversed:rnd()<.4}));
 for(const id of ids){
  const q=S.getScenario(id,true);const sec=cards.map((d,i)=>S.detailedReading(d,q,i,true,cards));const sum=S.readingSummary(cards,q,true);
  const a=E.koAnalysis(cards,id);checks++;
  a.items.forEach((x,i)=>{
   // 1. Semantic integrity: the card's own core is stated in its evidence.
   if(!sec[i][1].text.includes(x.core))add('card core missing from evidence',`${id} card ${i+1}: ${x.core}`);
   // 2. The obstacle is named the same way in its own section and in the synthesis.
   if(x.role==='o'){
    if(!sec[i][0].text.includes(x.obs))add('obstacle claim not from card core',`${id}: ${sec[i][0].text}`);
    if(a.level!==4&&!sum.lead.includes(x.obs))add('synthesis names a different obstacle',`${id}: ${x.obs} / ${sum.lead.slice(0,80)}`);
   }
  });
  const primary=a.items.filter(x=>['s','now','next','past'].includes(x.role));
  const ps=primary.reduce((s,x)=>s+x.p,0);
  const ob=a.items.find(x=>x.role==='o');const adv=a.items.find(x=>x.role==='a');
  // 3. Verdict direction agrees with the main evidence.
  if(a.level<=1&&(ps<0||(ps===0&&!(adv&&adv.p>0)))&&!primary.some(x=>x.role==='next'&&x.p>0))add('positive verdict without positive evidence',`${id} L${a.level}: ${primary.map(x=>x.cls).join(',')}`);
  if(a.level===3&&ps>0&&!(ob&&ob.p<=-2)&&!primary.some(x=>x.role==='next'&&x.p<0))add('negative verdict with positive evidence',`${id}: ${primary.map(x=>x.cls).join(',')}`);
  // 4. An advice card that pulls against the verdict is acknowledged in the synthesis.
  if(adv&&a.level<=1&&adv.p<0&&!/그래도|다만/.test(sum.lead))add('unacknowledged advice tension',`${id} L${a.level} ${adv.cls}`);
  if(adv&&(a.level===2||a.level===3)&&adv.p>0&&['ACT','TRUTH','WARM','TURN'].includes(adv.cls)&&!/다만/.test(sum.lead))add('unacknowledged advice tension',`${id} L${a.level} ${adv.cls}`);
  // 5. The advice card's own advice appears where the reading recommends an action.
  if(adv&&a.level!==4&&!sum.lead.includes(adv.act))add('synthesis advice not from advice card',`${id}: ${adv.act}`);
  // 6. Timing in the answer and in the body agree, and the body states a confidence level.
  const m=sum.answer.match(/가장 유력한 시기는 (.+?)(이에요|예요)\(확신도 (낮음|보통|높음)\)/);
  if(m&&!(sum.body.includes(`${m[1]}`)&&sum.body.includes(`시기 확신도 ${m[3]}`)))add('answer and body timing disagree',`${id}: ${m[1]} / ${sum.body.slice(0,60)}`);
  if(m&&/빠르면|늦어지면/.test(sum.body))add('timing shows early/late spread by default',id);
 }
}
// 7. Wait-or-let-go: holding on to memories or expectations must not produce "keep waiting".
for(const [c,r] of [[41,false],[44,true],[42,false]]){
 const cards=[{card:koCards[c],reversed:r},{card:koCards[20],reversed:false},{card:koCards[38],reversed:false}];
 const a=E.koAnalysis(cards,'let-go');checks++;
 if(a.level===3)add('let-go: memory/expectation evidence read as "keep waiting"',`${koCards[c].name}${r?' 역':''}`);
}
if(Object.keys(fail).length){console.error(JSON.stringify(fail,null,1));throw Error(`FAIL: ${Object.keys(fail).length} consistency categories across ${checks} readings`)}
console.log(`PASS: ${checks} readings — card cores stated, obstacle named consistently, verdict/evidence/advice/timing aligned. Detector only; not a quality score.`);
