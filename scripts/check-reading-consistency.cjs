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
// R3.1 checks: the regressions found in the R3 human-review set.
const selfward=['LETGO','SELF'];const applyBy=new Map();const actions={};
seed=23;
for(let t=0;t<200;t++){
 const set=new Set();while(set.size<3)set.add(Math.floor(rnd()*78));
 const cards=[...set].map(c=>({card:koCards[c],reversed:rnd()<.5}));
 for(const id of ids){
  const q=S.getScenario(id,true);const sec=cards.map((d,i)=>S.detailedReading(d,q,i,true,cards));const sum=S.readingSummary(cards,q,true);
  const a=E.koAnalysis(cards,id);checks++;
  // 8. A reversed card is never named in the synthesis as if it were upright.
  for(const x of a.items)if(x.reversed){
   // One-letter names (힘, 별, 달, 탑) are also ordinary words, so for them only count "name의" mentions at a word start.
   const text=' '+sum.lead+' '+sum.body;const count=t=>text.split(t).length-1;
   const bad=x.name.length>1?count(' '+x.name)!==count(' '+x.label):count(' '+x.name+'의 ')>0;
   if(bad)add('reversed card read as upright in synthesis',`${id}: ${x.label} / ${sum.lead.slice(0,90)}`);
  }
  a.items.forEach((x,i)=>{
   // 9. Under a positive verdict the obstacle is described as slowing things down, not blocking them.
   if(x.role==='o'&&a.level<=1&&!/정도는 아니고/.test(sec[i][1].text))add('positive verdict with a blocking obstacle',`${id}: ${sec[i][1].text.slice(0,80)}`);
   // 10. Questions about the reader's own life get advice aimed at the reader, not at a partner.
   if(x.role==='a'&&selfward.includes(a.type)&&/상대|함께 그리는|주고받으며/.test(sec[i][0].text))add('partner-directed advice on a self question',`${id}: ${sec[i][0].text}`);
   // 11. Same question type and position: the application line comes from the card, not from its class.
   const k=`${id}|${i}|${x.cls}`;const m=applyBy.get(k)??new Map();applyBy.set(k,m);m.set(x.label,sec[i][2].text);
   // 11b. Same position, same class, different card: the one-line answer comes from the card, not from its class.
   if(['s','now'].includes(x.role)){const ck=k+'|claim';const cm=applyBy.get(ck)??new Map();applyBy.set(ck,cm);cm.set(x.label,sec[i][0].text)}
  });
  // 12a. Constructions flagged in R3.1 review must not come back.
  const all=[...sec.flat().map(z=>z.text),sum.answer,sum.lead,sum.action].join(' ');
  const awk=all.match(/라는 뜻이에요|함께 챙기세요|물꼬를 트려면|크게 키우지 않으면/);if(awk)add('awkward construction',`${id}: ${awk[0]}`);
  // 12b. The next step is not a fixed per-question line: none when the advice card already gives a step, otherwise from the cards.
  if(a.items.some(x=>x.role==='a')&&sum.action)add('next step repeats the advice card',id);
  (actions[id]??=new Set()).add(sum.action);
  // 12. Wait-or-let-go "set a deadline" verdict: the advice card must not be offered as what comes first instead of the deadline.
  if(id==='let-go'&&a.level===2&&/먼저예요/.test(sum.lead))add('let-go deadline verdict with a competing priority',sum.lead.slice(0,90));
 }
}
for(const [qid,set] of Object.entries(actions))if(set.size===1&&[...set][0])add('next step fixed per question',qid);
for(const [k,m] of applyBy){const texts=[...m.values()];if(new Set(texts).size<texts.length)add('same class shares one application line',k)}
// 13. Daily and yes/no readings stay out of love-specific wording for every card and orientation.
for(const id of ['daily','yes-no'])for(let c=0;c<78;c++)for(const r of [false,true]){
 const q=S.getScenario(id,true);const ds=[{card:koCards[c],reversed:r}];checks++;
 const text=[...S.detailedReading(ds[0],q,0,true,ds).map(s=>s.text),S.readingSummary(ds,q,true).lead].join(' ');
 const hit=text.split(koCards[c].name).join('').match(/사랑|연애|연인|재회|상대|고백|애정/);if(hit)add(`${id}: love-specific wording`,`${koCards[c].name}${r?' 역':''}: ${hit[0]}`);
}
// 14. "What love suits me" positions answer that question from the card, not with readiness wording.
for(let c=0;c<78;c++){
 const q=S.getScenario('healthy-love',true);const ds=[0,1,2].map(i=>({card:koCards[(c+i*7)%78],reversed:i===1}));checks++;
 for(let i=0;i<2;i++){const t=S.detailedReading(ds[i],q,i,true,ds)[0].text;if(/여유가 있어요|준비가 된|준비됐/.test(t)||!/사랑|편안/.test(t))add('healthy-love position answered with readiness wording',t)}
}
if(Object.keys(fail).length){console.error(JSON.stringify(fail,null,1));throw Error(`FAIL: ${Object.keys(fail).length} consistency categories across ${checks} readings`)}
console.log(`PASS: ${checks} readings — card cores stated, obstacle named consistently, verdict/evidence/advice/timing aligned. Detector only; not a quality score.`);
