import type {Draw} from './tarot';

// Editorial symbolic correspondences, NOT measured likelihoods or claims about minds.
// U/R are intentionally independent: reversal is not a polarity multiplier.
type Signal = 'initiative'|'affection'|'memory'|'commitment'|'pause'|'distance'|'conflict'|'unclear';
const signalRows: [Signal[], Signal[]][] = [
 [['initiative'],['unclear']], [['initiative'],['unclear']], [['pause'],['unclear']],
 [['affection'],['pause']], [['commitment'],['conflict']], [['commitment'],['unclear']],
 [['affection','commitment'],['conflict']], [['initiative'],['conflict']], [['commitment'],['pause']],
 [['distance','pause'],['distance']], [['unclear'],['pause']], [['commitment'],['conflict']],
 [['pause'],['pause']], [['distance'],['pause']], [['commitment'],['conflict']],
 [['conflict','affection'],['distance']], [['conflict'],['pause']], [['affection'],['pause']],
 [['unclear'],['unclear']], [['affection','initiative'],['pause']], [['initiative','memory'],['pause']],
 [['distance'],['pause']],
 // Wands: Ace through King.
 [['initiative'],['pause']], [['pause'],['unclear']], [['initiative'],['pause']],
 [['commitment'],['unclear']], [['conflict'],['pause']], [['initiative'],['unclear']],
 [['conflict'],['pause']], [['initiative'],['pause']], [['pause'],['distance']],
 [['pause'],['distance']], [['initiative'],['unclear']], [['initiative','unclear'],['conflict']],
 [['initiative','affection'],['unclear']], [['initiative'],['conflict']],
 // Cups: affection alone is never an initiative signal.
 [['affection'],['pause']], [['affection','commitment'],['conflict']], [['affection'],['unclear']],
 [['pause'],['initiative']], [['memory','pause'],['memory']], [['memory','affection'],['distance']],
 [['unclear'],['pause']], [['distance'],['pause']], [['affection'],['unclear']],
 [['affection','commitment'],['conflict']], [['affection','initiative'],['pause']],
 [['affection','initiative'],['unclear']], [['affection'],['pause']], [['affection','commitment'],['pause']],
 // Swords: clarity is not automatically contact or romance.
 [['initiative'],['unclear']], [['pause'],['conflict']], [['conflict'],['pause']],
 [['pause'],['initiative']], [['conflict'],['pause']], [['distance'],['pause']],
 [['unclear','distance'],['unclear']], [['pause'],['initiative']], [['pause'],['pause']],
 [['distance','conflict'],['pause']], [['initiative','unclear'],['unclear']],
 [['initiative','conflict'],['conflict']], [['distance','commitment'],['conflict']],
 [['commitment'],['conflict']],
 // Pentacles: practical investment and maintenance, not speed.
 [['commitment'],['pause']], [['unclear'],['pause']], [['commitment'],['conflict']],
 [['pause'],['distance']], [['distance'],['pause']], [['commitment'],['unclear']],
 [['pause','commitment'],['pause']], [['commitment'],['pause']], [['distance','commitment'],['unclear']],
 [['commitment'],['conflict']], [['commitment'],['pause']], [['commitment','pause'],['pause']],
 [['commitment','affection'],['pause']], [['commitment'],['conflict']],
];

type Intent = 'contact'|'reunion'|'feelings'|'memory'|'commitment';
const intents:Record<string,Intent> = {
 'ex-contact':'contact', 'contact-flow':'contact', 'ex-return':'reunion',
 'crush-feelings':'feelings', 'ex-misses-me':'memory', 'define-us':'commitment',
};
export const contractQuestionIds = Object.keys(intents);
export type ReadingContract = {
 version:'relationship-contract-v1'; questionId:string; question:string; intent:Intent;
 judgment:'supported'|'blocked'|'conditional'; answer:string;
 evidence:{cardId:number;reversed:boolean;position:string;meaning:string;role:string}[];
 combination:string; condition:string; action:string;
};
type Question = {id:string;title:string;positions:string[]};
export function cardSignals(d:Draw):readonly Signal[]{
 const row=signalRows[d.card.id];
 if(!row)throw new Error('Unknown card ID');
 return row[d.reversed?1:0];
}
const has=(s:readonly Signal[],...values:Signal[])=>values.some(v=>s.includes(v));
const firstSentence=(s:string)=>s.match(/[^.!?。！？]+[.!?。！？]*/)?.[0]?.trim()??s;

/** null explicitly means legacy/not migrated, never quality-approved fallback. */
export function interpretSpread(ds:Draw[],q:Question,ko:boolean):ReadingContract|null {
 const intent=intents[q.id];
 if(!intent)return null;
 if(ds.length!==3||q.positions.length!==3||new Set(ds.map(d=>d.card.id)).size!==3)
  throw new Error('A relationship contract requires three distinct positioned cards');
 if(ds.some(d=>!Number.isInteger(d.card.id)||d.card.id<0||d.card.id>77||typeof d.reversed!=='boolean'))
  throw new Error('Invalid card or orientation');
 const [a,b,c]=ds.map(cardSignals);
 const friction=has(b,'conflict','distance','pause','unclear');
 const affection=has(a,'affection','memory');
 const moving=has(a,'initiative')&&has(b,'initiative','affection','commitment')&&!friction;
 const stable=has(a,'commitment','affection',...(intent==='reunion'?['memory' as const]:[]))&&has(b,'commitment')&&!friction;
 const volatileContact=(has(a,'initiative')&&has(b,'conflict'))||(has(a,'conflict')&&has(b,'initiative'));
 const romanticSupport=has(a,'affection')&&has(b,'affection','commitment')&&!friction;
 const leaving=has(a,'distance')&&!has(a,'affection','memory');
 const state:ReadingContract['judgment']=intent==='contact'
  ?moving?'supported':volatileContact?'conditional':friction||leaving?'blocked':'conditional'
  :intent==='memory'
   ?has(a,'memory')?'supported':leaving||has(a,'conflict','pause')?'blocked':'conditional'
  :intent==='feelings'
   ?romanticSupport?'supported':leaving||has(a,'conflict','pause')?'blocked':'conditional'
   :stable?'supported':friction||leaving||has(a,'conflict')?'blocked':'conditional';
 const answers:Record<Intent,Record<ReadingContract['judgment'],[string,string]>>={
  contact:{
   supported:['카드상으로는 상대가 먼저 연락할 쪽에 무게가 실립니다.','The spread leans toward them initiating contact.'],
   blocked:['현재 카드 흐름에서는 상대가 먼저 연락할 가능성을 낮게 읽습니다.','This spread leans against them initiating contact for now.'],
   conditional:['연락할 여지는 있지만, 상대가 먼저 움직일 것이라고 기대할 근거는 약합니다.','Contact is possible, but there is little support here for expecting them to initiate.']},
  reunion:{
   supported:['재회를 시도해 볼 여지는 큰 편으로 읽습니다. 다만 다시 사귀기로 합의하는 과정은 남아 있습니다.','The spread supports exploring reunion, not assuming you are back together.'],
   blocked:['지금은 다시 만나기보다 재회를 막는 문제를 먼저 해결해야 하는 흐름입니다.','Reunion is not the stronger direction now; the barrier needs addressing first.'],
   conditional:['다시 대화할 여지는 있지만, 이 조합만으로 재회까지 기대하기는 어렵습니다.','There is room to reopen a conversation, but not enough support to expect reunion.']},
  feelings:{
   supported:['단순한 친절보다는 호감 쪽으로 읽습니다. 다만 연애할 의사가 확인됐다는 뜻은 아닙니다.','This leans more toward attraction than simple politeness, not a confirmed wish to date.'],
   blocked:['현재 조합에서는 연애 감정이 있다는 쪽으로 읽기 어렵습니다.','This combination gives little support for reading their behavior as romantic interest.'],
   conditional:['지금의 다정함을 연애 호감으로 판단하기에는 근거가 부족합니다.','There is not enough support here to interpret their kindness as romantic interest.']},
  memory:{
   supported:['함께했던 시간을 그리워하는 쪽으로 읽습니다. 그리움과 돌아오려는 의사는 별개입니다.','This leans toward missing your shared past; that is separate from wanting to return.'],
   blocked:['지금은 그리움을 키우기보다 관계에서 거리를 두는 쪽에 무게를 둡니다.','The stronger theme is distance from the relationship rather than growing longing.'],
   conditional:['그리움이 남았다고 분명하게 읽을 근거는 약합니다.','There is little clear support for reading this as lingering longing.']},
  commitment:{
   supported:['연인 관계로 나아갈 기반은 있는 편으로 읽습니다. 관계를 정하는 대화가 다음 단계입니다.','There is a basis for a relationship; agreeing on what you both want is the next step.'],
   blocked:['현재 흐름만 이어진다면 연인 관계로 정해지기는 어려운 편입니다.','If this pattern continues, becoming an agreed relationship looks difficult.'],
   conditional:['가까워질 수는 있어도, 연인이 되기로 정할 준비까지는 보이지 않습니다.','Closeness is possible, but readiness to agree on a relationship is not established.']},
 };
 const n=(i:number)=>`${ds[i].card.name}${ds[i].reversed?(ko?' 역방향':' reversed'):''}`;
 const mechanism=volatileContact&&intent==='contact'
  ?(ko?'연락을 시작하는 움직임과 갈등이 함께 나옵니다. 갑자기 말이 오갈 수는 있어도, 차분히 관계를 회복하는 대화로 이어진다고 보기는 어렵습니다.':'Initiative and conflict occur together. An abrupt exchange is possible, but that is not evidence of a calm repair conversation.')
  :friction
  ?has(b,'conflict')
   ?(ko?'두 번째 자리는 서로 부딪히는 문제를 우선 보여줍니다. 첫 카드의 접근 의지나 감정이 있더라도, 그 갈등을 해결했다고 읽을 수는 없습니다.':'The second position emphasizes conflict. Any interest or initiative in the first card does not resolve that conflict.')
   :has(b,'distance')
    ?(ko?'두 번째 자리의 거리 두기가 첫 카드의 의미에 제동을 겁니다. 감정이 남는 것과 다시 가까워지는 행동을 분리해서 봐야 합니다.':'Distance in the second position limits the first card. Remaining feelings and renewed closeness are separate signals.')
    :has(b,'pause')
     ?(ko?'두 번째 자리의 멈춤 때문에 첫 카드의 흐름이 바로 행동으로 이어지기는 어렵습니다. 이 멈춤을 숨은 애정의 증거로 바꾸어 읽지는 않습니다.':'The pause in the second position limits movement from the first. This pause is not evidence of hidden affection.')
     :(ko?'두 번째 자리는 선택이나 태도가 정리되지 않았음을 나타냅니다. 첫 카드 하나로 상대가 관계를 선택했다고 판단하지 않습니다.':'The second position leaves intentions or choices unresolved; the first card alone cannot establish a relationship decision.')
  :intent==='contact'&&!moving
   ?(ko?'이 두 자리는 먼저 연락을 시작하는 움직임까지 함께 뒷받침하지는 않습니다. 감정을 유지하거나 상황을 지켜보는 것과 먼저 말을 거는 것은 다릅니다.':'These positions do not jointly support initiative to send a message. Maintaining feelings or observing the situation is different from starting a conversation.')
   :(ko?'첫 카드의 흐름을 두 번째 자리에서도 이어갈 수 있는 조합입니다. 다만 장애물 자리에 나온 좋은 카드는 이미 해결된 사실이 아니라 갖춰야 할 조건으로 읽습니다.':'The second position can support the direction of the first. A constructive card in the barrier position is a condition to meet, not proof it has been met.');
 const conditions:Record<Intent,[string,string]>={
  contact:['이 판단이 달라지는 단서는 실제로 대화를 시작하고 이어가는 행동입니다. 연락이 와도 안부 한 번과 관계 회복을 같은 뜻으로 보지는 마세요.','Actual initiation and follow-through would change this assessment. A single message is not reconciliation.'],
  reunion:['재회 쪽으로 판단을 바꾸려면 헤어진 이유에 대해 두 사람이 무엇을 다르게 할지 합의해야 합니다. 그립다는 말만으로는 그 조건이 충족되지 않습니다.','Reunion requires agreement about what both people would do differently about the breakup. Missing each other does not meet that condition.'],
  feelings:['호감이라는 해석은 상대가 별도로 시간을 내고 먼저 교류를 이어갈 때 더 설득력이 생깁니다. 카드는 실제 속마음을 확인해 주지는 않습니다.','The attraction reading gains practical support if they make time and initiate exchange. Cards cannot verify private feelings.'],
  memory:['그리움 여부는 카드로 확인할 수 없는 속마음입니다. 다시 만나자는 제안이나 행동이 없다면 그리움을 재회 신호로 확대하지 마세요.','Cards cannot verify private longing. Without a proposal or action, do not turn the memory theme into a reunion signal.'],
  commitment:['연인이 될 조건은 서로 원하는 관계를 말하고 그에 맞게 행동하는 것입니다. 한쪽만 관계를 정하고 싶어 한다면 이 해석의 긍정적인 부분도 약해집니다.','A relationship requires both people to name what they want and act accordingly. One-sided willingness weakens the constructive reading.'],
 };
 const actionSubject:Record<Intent,[string,string]>={contact:['연락을 기다릴 때','While waiting for contact'],reunion:['재회를 논의할 기회가 생기면','If reunion becomes a real conversation'],feelings:['상대의 호감을 확인하고 싶다면','When checking for interest'],memory:['그 사람의 그리움을 생각할 때','When thinking about whether they miss you'],commitment:['관계를 정하고 싶다면','When defining the relationship']};
 const step=has(c,'conflict','distance')
  ?(ko?'다가가는 것보다 거절이나 거리 두기의 뜻을 존중하는 쪽을 택하세요. 답을 얻기 위해 계속 연락하지는 마세요.':'Prioritize respecting distance or refusal over pursuing an answer through repeated messages.')
  :has(c,'pause','unclear')
   ?(ko?'바로 결론을 요구하기보다 실제로 달라진 말이나 행동이 있는지 먼저 확인하세요. 새로운 정보 없이 기다림만 늘리지는 마세요.':'Check for a real change in words or behavior before asking for a decision. Do not extend the wait without new information.')
   :has(c,'commitment')
    ?(ko?'한 번의 다정한 말보다 서로 약속을 지키고 대화를 이어갈 수 있는지 확인하세요. 이어가지 않는 관계를 혼자 유지할 필요는 없습니다.':'Look for kept agreements and reciprocal conversation rather than one warm remark. You do not need to maintain it alone.')
    :has(c,'affection')
     ?(ko?'상대의 반응에 맞춰 내 바람을 지우지는 마세요. 가까워지고 싶은 마음을 표현하더라도, 상대도 교류를 원한다는 응답이 있는지 보고 다음 단계를 정하세요.':'Do not erase your own wishes to fit their response. If you express interest, wait for reciprocal interest before taking another step.')
     :(ko?'연락을 거절당한 적이 없다면, 짧은 대화로 의사를 확인하는 정도가 맞습니다. 응답이나 호응이 없다면 재촉하지 마세요.':'If contact has not been declined, a brief conversation can clarify willingness. Do not press for a response or interest.');
 const evidence=ds.map((d,i)=>({cardId:d.card.id,reversed:d.reversed,position:q.positions[i],meaning:firstSentence(d.reversed?d.card.reversed:d.card.upright),role:ko?(i===0?'질문의 출발점으로 읽으며, 이것만으로 결론을 정하지 않습니다.':i===1?'앞 카드가 현실의 행동으로 이어질 조건 또는 걸림돌입니다.':'조언 자리입니다. 이 카드를 상대가 앞으로 반드시 할 행동으로 바꾸어 읽지 않습니다.'):(i===0?'The starting point, not a standalone verdict.':i===1?'A condition or obstacle affecting the first position.':'Advice, not a forecast of what the other person must do.')}));
 let answer=answers[intent][state][ko?0:1];
 if(intent==='contact'&&volatileContact)answer=ko?'갑작스러운 연락은 가능하지만, 갈등을 풀기 위한 안정적인 대화까지 기대하기는 어렵습니다.':'An abrupt message is possible, but a constructive repair conversation is less supported.';
 if(q.id==='contact-flow')answer=ko?(state==='supported'?'다음 연락을 조금 더 기다려볼 수는 있습니다. 다만 기다림의 근거는 실제로 이어지는 대화여야 합니다.':'상대의 다음 연락만 기다리기보다는 기다림을 줄이는 쪽을 권합니다. 먼저 움직일 근거가 충분하지 않습니다.'):(state==='supported'?'A little more time for their next message is reasonable, provided conversation actually continues.':'Do not organize your time around waiting for their next message; initiative is not sufficiently supported.');
 return {version:'relationship-contract-v1',questionId:q.id,question:q.title,intent,judgment:state,
  answer,evidence,
  combination:ko?`‘${q.positions[0]}’의 ${n(0)} 카드와 ‘${q.positions[1]}’의 ${n(1)} 카드를 함께 읽습니다. ${mechanism}`:`Read ${n(0)} in “${q.positions[0]}” together with ${n(1)} in “${q.positions[1]}”. ${mechanism}`,
  condition:conditions[intent][ko?0:1],
  action:ko?`‘${q.positions[2]}’의 ${n(2)} 카드에서 가져갈 조언입니다. ${actionSubject[intent][0]} ${step}`:`Applying ${n(2)} in “${q.positions[2]}”: ${actionSubject[intent][1]}, ${step.charAt(0).toLowerCase()+step.slice(1)}`};
}
