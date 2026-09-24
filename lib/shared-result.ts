import {cards,questions,clarifiers,messages} from './tarot';
import {scenarioList,getScenario} from './reading-scenarios';
export type SharedReading={v:1;q:string;cards:[number,boolean][];oracle:number;message:number};
export function parseSharedReading(hash:string):SharedReading|null {
 try{
  if(!hash.startsWith('#result=')||hash.length>1200)return null;
  const data=JSON.parse(decodeURIComponent(hash.slice(8)));
  if(data.v!==1||typeof data.q!=='string'||![...questions,...scenarioList(false)].some(q=>q.id===data.q))return null;
  if(!Array.isArray(data.cards)||data.cards.length!==getScenario(data.q,false).count)return null;
  if(!data.cards.every((c:unknown)=>Array.isArray(c)&&c.length===2&&Number.isInteger(c[0])&&c[0]>=0&&c[0]<cards.length&&typeof c[1]==='boolean'))return null;
  if(new Set(data.cards.map((c:[number,boolean])=>c[0])).size!==data.cards.length)return null;
  if(!Number.isInteger(data.oracle)||data.oracle<0||data.oracle>=clarifiers.length||!Number.isInteger(data.message)||data.message<0||data.message>=messages.length)return null;
  return data;
 }catch{return null}
}
export function readingUrl(origin:string,ko:boolean,data:SharedReading){return `${origin}/reading/${data.q}?lang=${ko?'ko':'en'}#result=${encodeURIComponent(JSON.stringify(data))}`}
