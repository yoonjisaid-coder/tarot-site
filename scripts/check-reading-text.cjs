// Compile the lib TS modules to a temporary directory before running this gate (same as check-timing.cjs).
// Sweeps Korean 3-card readings for particle errors, filler sentences, double spaces and verdict/connection contradictions.
const path=require('node:path');
const root=process.argv[2];
if(!root)throw Error('Provide the temporary compiled module directory');
const {koCards}=require(path.join(root,'tarot-ko.js'));
const S=require(path.join(root,'reading-scenarios.js'));
const batchim=w=>{const c=w.slice(-1).charCodeAt(0)-0xac00;return c>=0&&c<=11171?c%28!==0:null};
const issues={};const add=k=>issues[k]=(issues[k]||0)+1;
let seed=1;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
let readings=0;
for(const q of S.scenarioList(true).filter(q=>q.count===3))for(let t=0;t<400;t++){
 const ids=new Set();while(ids.size<3)ids.add(Math.floor(rnd()*78));
 const d=[...ids].map(id=>({card:koCards[id],reversed:rnd()<.5}));readings++;
 const conclusion=S.readingConclusion(d,q,true),connection=S.spreadConnection(d,q,true);
 for(const text of [conclusion,connection,...d.flatMap((x,i)=>S.detailedReading(x,q,i,true).map(p=>p.text))]){
  if(/  /.test(text))add('double space');
  if(text.includes('시작해서 살펴볼'))add('filler sentence');
  for(const m of text.matchAll(/‘([^’]+)’(이|가) /g)){const b=batchim(m[1]);if(b!==null&&(b?'이':'가')!==m[2])add('particle')}
 }
 if(/낮은 편|거리가 있는/.test(conclusion)&&connection.includes('여지가 커집니다'))add('verdict/connection contradiction');
}
if(Object.keys(issues).length)throw Error(`FAIL: ${JSON.stringify(issues)} across ${readings} readings`);
console.log(`PASS: ${readings} Korean 3-card readings without particle, filler, spacing or verdict contradiction defects. Not an editorial quality score.`);
