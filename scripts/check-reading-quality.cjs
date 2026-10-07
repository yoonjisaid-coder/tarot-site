// Semantic regression detectors for Korean readings. Compile lib to a temp dir first (see check-timing.cjs).
// These checks catch known failure patterns; passing them is NOT evidence of paid/free product quality.
// Human scoring of docs/quality/R2_REVIEW.md remains the quality gate.
const path=require('node:path');
const root=process.argv[2];
if(!root)throw Error('Provide the temporary compiled module directory');
const {koCards}=require(path.join(root,'tarot-ko.js'));
const S=require(path.join(root,'reading-scenarios.js'));
const {combos}=require('./quality-fixtures.cjs');
const fail={};const add=(k,detail)=>{(fail[k]??=[]).length<3&&fail[k].push(detail)};
let checks=0;
const ids=S.scenarioList(true).filter(q=>q.count===3).map(q=>q.id).concat(['three-card']);
const typeOf={'ex-contact':'contact','contact-flow':'contact','ex-silence':'wait','let-go':'wait','reach-out':'decide','confess':'decide','approach':'decide','ex-misses-me':'feel','crush-feelings':'feel','thinking-of-me':'feel','hidden-feelings':'feel','mixed-signals':'feel','ex-return':'reunion','repair':'reunion','after-reunion':'reunion','define-us':'progress','our-direction':'progress','three-card':'progress','new-love':'self','love-pattern':'self','new-connection':'self','healthy-love':'self'};
function read(id,cards){
 const q=S.getScenario(id,true);const ds=cards.slice(0,q.count).map(([c,r])=>({card:koCards[c],reversed:r}));
 const sections=ds.map((d,i)=>S.detailedReading(d,q,i,true,ds));const sum=S.readingSummary?S.readingSummary(ds,q,true):{answer:S.readingConclusion(ds,q,true),lead:S.readingConclusion(ds,q,true),body:S.spreadConnection(ds,q,true)};
 return {q,ds,sections,sum,all:[sum.answer,...sections.flat().map(s=>s.text),sum.lead,sum.body]};
}
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const spreads=[...Object.values(combos)];
for(let t=0;t<150;t++){const s=new Set();while(s.size<3)s.add(Math.floor(rnd()*78));spreads.push([...s].map(c=>[c,rnd()<.4]))}
for(const cards of spreads){
 const byType={};
 for(const id of ids){
  const r=read(id,cards);checks++;
  // 1. Every question must be served by the new engine and lead with a judgment, not a card description.
  const first=r.sum.answer.split(/(?<=[.!?])\s/)[0];
  if(/^(현재|카드|이 카드|완드|컵|소드|펜타클)/.test(first)||first.length>80)add('answer does not lead with a judgment',`${id}: ${first}`);
  // 2. No sentence may repeat inside one reading.
  const sentences=r.all.join(' ').match(/[^.!?]+[.!?]/g)?.map(s=>s.trim())??[];
  const seen=new Set();for(const s of sentences){if(s.length>12&&seen.has(s))add('repeated sentence within a reading',`${id}: ${s}`);seen.add(s)}
  // 3. Register and filler patterns found in the pre-rework output.
  const text=r.all.join(' ');
  if(/습니다|입니다|보입니다/.test(text))add('mixed formal register',`${id}`);
  if((text.match(/흐름/g)||[]).length>2)add('"흐름" overused',`${id}`);
  if(/현재 상태:|쪽으로 읽어요\. 현재|가능성 자체를/.test(text))add('pre-rework filler phrase',`${id}`);
  // 4. Fabrication / certainty.
  if(/SNS|인스타|다른 사람을 만나|새 애인|반드시|100%|확실히 (연락|돌아|만나)|\d+월 \d+일|\d+일 (뒤|후)에?/.test(text))add('fabricated fact or false certainty',`${id}: ${text.slice(0,80)}`);
  // 5. Timing questions give a usable range plus a confidence note, or explicitly decline.
  if(['ex-contact','contact-flow','ex-return','define-us','our-direction'].includes(id)){
   const ok=/(\d+~\d+(주|개월)|며칠~1주|반년)/.test(r.sum.body)&&/(무게를|참고하세요|약해요)/.test(r.sum.body);
   const declined=/시기를 말하기 어려워요|흐릿해요|근거가 부족해요/.test(r.sum.body);
   if(!ok&&!declined)add('timing question without range or explicit decline',`${id}: ${r.sum.body.slice(0,80)}`);
  }
  (byType[typeOf[id]]??=[]).push(r);
 }
 // 6. Genericity: the same card at the same position must not produce identical card sections across question types.
 const types=Object.keys(byType);
 for(let a=0;a<types.length;a++)for(let b=a+1;b<types.length;b++){
  const A=byType[types[a]][0],B=byType[types[b]][0];
  for(let i=0;i<3;i++)for(let k=0;k<4;k++){
   if(A.sections[i][k].text===B.sections[i][k].text)add('card section identical across question types',`${types[a]} vs ${types[b]} card ${i+1} "${A.sections[i][k].title}"`);
  }
  if(A.sum.answer===B.sum.answer)add('answer identical across question types',`${types[a]} vs ${types[b]}`);
 }
}
// 7. Progression: open→blocked→recovering and open→open→breaking must not share a conclusion.
for(const id of ['our-direction','three-card']){
 const a=read(id,combos.A),b=read(id,combos.B);checks++;
 if(a.sum.answer===b.sum.answer||a.sum.lead===b.sum.lead)add('progression ignored',id);
}
// 8. Single-card questions use the engine too.
for(const [id,card] of [['daily',[[17,false]]],['daily',[[16,false]]],['yes-no',[[19,false]]],['yes-no',[[15,false]]]]){
 const r=read(id,card);checks++;
 if(/한쪽으로 결론내리기 어려운 흐름/.test(r.sum.answer))add('single-card question on legacy generic answer',id);
}
if(Object.keys(fail).length){console.error(JSON.stringify(fail,null,1));throw Error(`FAIL: ${Object.keys(fail).length} quality regression categories across ${checks} readings`)}
console.log(`PASS: ${checks} readings, ${spreads.length} spreads × ${ids.length} questions — no genericity, repetition, register, fabrication, timing-range or progression regressions. Detector only; not a quality score.`);
