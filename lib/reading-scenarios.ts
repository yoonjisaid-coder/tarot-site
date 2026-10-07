import {timingQuestions,isTiming,timingReading} from './timing';
import {cardScene} from './card-scenes';
import {questionLens} from './question-lenses';
import {questions,type Draw} from './tarot';
import {koQuestions} from './tarot-ko';
import {koEngineSupports,koCardSections,koAnswer,koSummary} from './reading-engine';
export const situations=[{id:'breakup',ko:'재회 · 이별',en:'Breakup & reunion',context:'헤어진 뒤에는 좋았던 기억과 마지막에 받은 상처가 번갈아 크게 느껴질 수 있어요. 지금 떠오르는 감정이 그 사람 자체를 향한 것인지, 함께했던 익숙한 일상을 잃은 허전함인지 구분하면 이 카드가 가리키는 지점이 더 분명해져요.'},{id:'crush',ko:'짝사랑 · 고백 전',en:'A crush & confession',context:'아직 마음을 확인하지 않은 사이에서는 짧은 눈맞춤이나 다정한 말도 오래 생각하게 되죠. 내 안의 설렘과 둘 사이에서 실제로 오간 교류를 나누어 보면, 혼자 키운 기대와 함께 자랄 가능성을 구분하기 쉬워져요.'},{id:'undefined',ko:'썸 · 애매한 관계',en:'An undefined connection',context:'가까운 날도 있지만 관계를 설명하려면 망설여지는 사이일 수 있어요. 즐거웠던 한순간만큼 연락이 끊긴 뒤 어떻게 다시 이어졌는지, 서운함을 말했을 때 어떤 반응이 돌아왔는지도 이 관계의 일부예요.'},{id:'single',ko:'솔로',en:'Single & open to love',context:'특정한 상대가 없는 지금의 리딩은 누군가의 속마음을 가정하지 않아요. 어떤 만남을 원하는지, 새 사람이 들어올 자리가 내 일상에 있는지, 반복하고 싶지 않은 관계의 습관은 무엇인지를 중심으로 읽어요.'}] as const;
// Each question has its own three interpretive positions and practical observation.
const rows=[
['breakup','ex-misses-me','그 사람도 나를 그리워할까?','Do they miss me?','추억에 남은 감정|그리움과 현실의 차이|지금 나를 위한 조언','좋았던 기억을 꺼내는 말과 다시 관계를 돌보려는 행동은 구분해야 해요.','그 사람이 돌아온다면 다시 경험하고 싶은 것과 반복하고 싶지 않은 것을 하나씩 적어 보세요.'],
['breakup','ex-contact','헤어진 상대에게 연락이 올까?','Will my ex contact me?','마지막 대화의 여운|연락을 어렵게 하는 점|연락 앞에서 나의 선택','침묵에는 정리할 시간, 갈등 회피, 관계를 끝내려는 의사 등 서로 다른 이유가 있을 수 있어요. 카드의 분위기만으로 연락 날짜를 정할 수는 없어요.','연락이 왔을 때 듣고 싶은 말보다 먼저 확인해야 할 변화가 무엇인지 정해 보세요.'],
['breakup','reach-out','내가 먼저 연락해도 될까?','Should I reach out?','연락하고 싶은 진짜 이유|상대와 나의 경계|부담을 줄이는 다음 행동','안부가 궁금한 것인지, 답을 받아 불안을 가라앉히고 싶은 것인지에 따라 같은 연락도 의미가 달라져요.','연락을 원치 않는다는 뜻을 들었다면 존중하세요. 그런 경계가 없다면 답을 재촉하지 않는 짧은 안부를 감당할 수 있을지 생각해 보세요.'],
['breakup','repair','다시 만나려면 무엇이 달라져야 할까?','What would make reunion different?','남아 있는 연결의 기반|반드시 바뀌어야 할 패턴|다시 쌓아야 할 신뢰','그립다는 마음이 다시 만날 이유가 될 수는 있어도, 헤어진 이유를 해결해 주지는 않아요. 사과와 변화의 차이를 살펴볼 질문이에요.','이전 갈등 하나를 골라 두 사람이 각각 바꿀 수 있는 행동을 구체적으로 써 보세요.'],
['breakup','ex-silence','왜 아직 아무 연락이 없을까?','What surrounds the silence?','침묵을 바라보는 내 마음|아직 확인되지 않은 부분|기다림의 기준','상대가 침묵하는 이유를 알고 싶은 마음과 내가 기다림을 지속할 이유는 서로 다른 문제예요.','기다리는 동안 멈춰 둔 일 하나를 다시 시작하고, 언제 내 마음을 재점검할지 정해 보세요.'],
['breakup','let-go','더 기다릴까, 이제 놓아줄까?','Should I wait or let go?','아직 붙잡고 있는 것|기다림이 내게 주는 영향|나를 지키는 방향','놓아주는 선택은 사랑했던 시간을 부정하는 일이 아니에요. 관계에 가능성이 있는지와 내 일상이 감당할 수 있는지를 함께 보세요.','상대의 말이 아니라 최근 실제 변화 세 가지를 떠올려 보세요. 변화가 없다면 기다림의 조건을 다시 정할 수 있어요.'],
['breakup','after-reunion','다시 만나면 같은 이유로 아플까?','Would the same problems return?','다시 이어질 때의 기대|반복될 수 있는 갈등|달라질 수 있는 선택','다시 연락이 이어졌다는 사실만으로 관계의 규칙까지 달라지는 것은 아니에요. 같은 갈등을 다르게 다룰 준비가 있는지를 읽어요.','마지막에 서로 이해하지 못했던 문제를 떠올리고, 이번에는 어떤 대화나 행동이 달라져야 하는지 적어 보세요.'],
['breakup','ex-return','우리에게 다시 만날 여지가 있을까?','Is there room to reconnect?','아직 남아 있는 연결|재회를 어렵게 하는 현실|다시 만나기 위한 조건','남아 있는 감정과 다시 관계를 선택할 의사는 따로 확인해야 해요. 그리움뿐 아니라 서로에게 다가올 자리가 있는지 살펴봐요.','다시 만날 기회가 생기면 어떤 관계를 원하는지부터 차분히 확인해 보세요.'],
['crush','crush-feelings','이 다정함은 호감일까, 친절일까?','Interest or just kindness?','지금 오가는 관심|친절과 호감의 경계|한 걸음 가까워질 방법','모두에게 다정한 사람인지, 나에게 별도로 시간을 내고 대화를 이어가는지에 따라 같은 표현도 다르게 읽혀요.','가벼운 제안 하나에 상대도 질문이나 대안을 더하는지 보세요. 일방적으로 대화를 살려야 한다면 속도를 낮춰도 좋아요.'],
['crush','thinking-of-me','상대도 내 생각을 할까?','Am I on their mind?','기억에 남는 교류|관심을 표현하는 방식|자연스럽게 연결될 계기','기억에 남는 것과 연애를 원하는 것은 같은 뜻이 아니에요. 작은 취향이나 나눈 이야기를 기억하고 다시 꺼내는 행동을 단서로 볼 수 있어요.','둘이 나누었던 주제 하나로 대화를 열고, 상대도 내 이야기를 궁금해하는지 느껴 보세요.'],
['crush','confess','지금 마음을 고백해도 괜찮을까?','Am I ready to tell them?','내 마음의 준비|지금 고백해도 괜찮을지|전할 말과 속도','고백은 관계를 보장받는 시험보다 내 마음을 정직하게 알리는 선택에 가까워요. 어떤 답이 와도 상대와 나의 선택권이 남아 있어야 해요.','마음은 분명하게 전하되 바로 답하지 않아도 된다는 여유를 줄 수 있는지 생각해 보세요.'],
['crush','approach','어떻게 자연스럽게 가까워질까?','How can we get closer?','이미 있는 연결고리|다가갈 때 주의할 점|작은 첫걸음','큰 이벤트보다 서로 편하게 응답할 수 있는 계기가 관계를 더 잘 보여줄 때가 있어요.','공통 관심사로 짧은 대화를 제안해 보세요. 다음 만남은 상대의 자발적인 호응이 있는지 확인한 뒤 생각해도 늦지 않아요.'],
['undefined','hidden-feelings','가까운데도 말하지 않는 마음은 뭘까?','What remains unspoken?','표현되는 마음|말로 정리되지 않은 부분|서로 확인해야 할 질문','가까워지고 싶은 마음과 관계에 책임질 준비는 다른 속도로 자랄 수 있어요. 말하지 않은 부분을 전부 숨은 사랑으로 채우지는 말아요.','상대의 마음을 추궁하기보다 나는 어떤 관계를 원하는지 먼저 설명해 보세요.'],
['undefined','mixed-signals','왜 다정했다가 멀어질까?','Why the mixed signals?','가까워지는 순간의 흐름|거리가 생기는 패턴|내가 지킬 기준','바쁠 때에도 짧게 상황을 알려주는지, 멀어진 뒤 아무 설명 없이 돌아오는지가 서로 다른 패턴을 보여줘요.','연락 횟수를 세기보다 약속을 지키는 방식과 서운함을 이야기할 수 있는지를 보세요.'],
['undefined','define-us','우리는 연인이 될 수 있을까?','Can this become a relationship?','지금 우린 어디쯤일까|관계를 정하기 어려운 이유|관계를 정하기 위한 대화','함께 즐거운 시간을 보내는 것과 서로를 연인으로 선택하는 것은 별도의 합의가 필요해요.','내가 원하는 만남의 형태를 말하고 상대가 원하는 형태도 물어보세요. 모호한 답이 반복되면 그것도 현재의 정보예요.'],
['undefined','our-direction','이 관계는 어디로 향하고 있을까?','Where is this going?','함께 쌓아 온 기반|현재 반복되는 모습|이 흐름이 이어질 때','미래의 방향은 특별했던 하루보다 평소 반복되는 선택에 더 많이 담겨 있어요.','서로 더 편해지고 있는지, 아니면 불안을 달래는 데 쓰는 시간이 늘고 있는지 돌아보세요.'],
['undefined','contact-flow','다음 연락을 기다려도 될까?','Should I wait for their next message?','최근 연락의 균형|기다림을 만드는 요인|나에게 맞는 소통 방식','연락의 빈도보다 서로에게 가능한 소통을 설명하고 맞춰 가는 태도가 중요해요.','내가 먼저 연락하지 않을 때도 연결이 유지되는지, 연락이 부담이 아닌 대화가 되는지 살펴보세요.'],
['single','new-love','새로운 사랑을 맞을 준비가 됐을까?','Am I ready for new love?','지금 내 마음의 자리|아직 돌봐야 할 감정|새 만남을 위한 준비','연애를 하고 싶다는 바람과 낯선 사람을 알아갈 여력이 같은 상태인지는 따로 살펴볼 수 있어요.','이번 주 누군가를 만날 시간뿐 아니라 혼자 회복할 시간도 남겨 두세요.'],
['single','love-pattern','연애에서 같은 일이 반복되는 이유는?','What pattern am I repeating?','익숙하게 끌리는 모습|반복되는 선택의 배경|다르게 선택할 기회','익숙한 감정이 반드시 나에게 잘 맞는 관계라는 뜻은 아니에요. 빠르게 끌린 순간 이후 어떤 역할을 맡게 되는지 돌아볼 질문이에요.','이전 관계에서 자주 참았던 요구 하나를 떠올리고 다음 만남에서는 언제 표현할지 정해 보세요.'],
['single','new-connection','새로운 사람을 만나려면 어떻게 해야 할까?','Where can I make room for connection?','새 만남에 도움이 되는 점|만남을 어렵게 하는 습관|시도해볼 활동','정해진 누군가가 도착할 날을 기다리기보다, 내가 자연스럽게 나다울 수 있는 만남의 환경을 살펴봐요.','관심 있는 활동 하나를 골라 보세요. 연애 성과보다 내가 즐길 수 있는 자리를 고르는 것이 시작이에요.'],
['single','healthy-love','나에게 잘 맞는 사랑은 어떤 모습일까?','What kind of love suits me?','내가 원하는 사랑|편안함을 만드는 현실 조건|놓치지 말아야 할 기준','이 질문은 미래 상대의 신상이나 외모를 맞히는 대신, 나에게 맞는 관계의 성질을 살펴봐요.','설렘 외에도 대화 방식, 혼자만의 시간, 갈등을 푸는 태도 중 꼭 필요한 기준을 골라 보세요.']
];

const englishPositions:Record<string,string[]>={
'ex-misses-me':['The memory that remains','Longing versus present reality','What you need now'],
'ex-contact':['The last conversation','What keeps a distance','Your choice about contact'],
'reach-out':['Why you want to reach out','Each person’s boundaries','A considerate next step'],
'repair':['A basis for reconnection','The pattern that must change','Trust to rebuild'],
'ex-silence':['How silence affects you','What remains unknown','A boundary for waiting'],
'let-go':['What you are holding on to','The cost of waiting','A direction that protects you'],
'after-reunion':['Expectations of reunion','A conflict that could repeat','A different choice'],
'ex-return':['What still connects you','Practical barriers','Conditions for reconnection'],
'crush-feelings':['The attention you exchange','Kindness versus attraction','A step toward closeness'],
 'thinking-of-me':['A memorable connection','How interest is expressed','A natural opening'],
'confess':['Your emotional readiness','Room for an honest response','Words and pace'],
'approach':['An existing connection','What to be mindful of','A small first step'],
'hidden-feelings':['What is expressed','What remains unspoken','A question to clarify'],
'mixed-signals':['When closeness grows','When distance returns','A boundary for yourself'],
'define-us':['Where you stand now','What makes commitment difficult','A shared next step'],
'our-direction':['The foundation you built','The pattern today','If this pattern continues'],
'contact-flow':['Balance in recent contact','What leaves you waiting','Communication that suits you'],
'new-love':['Your emotional space','What still needs care','Readiness for a new meeting'],
'love-pattern':['A familiar attraction','The choice behind the pattern','A different opportunity'],
'new-connection':['Your strengths','Habits that narrow your world','An experience to explore'],
'healthy-love':['The connection you need','Practical conditions for ease','A standard to keep']};

export type Scenario={id:string;situation:string;label:string;title:string;positions:string[];focus:string;prompt:string;count:number};
export function scenarioList(ko:boolean):Scenario[]{return rows.map(r=>({id:r[1],situation:r[0],label:ko?r[2]:r[3],title:ko?r[2]:r[3],positions:ko?r[4].split('|'):(englishPositions[r[1]]??['The underlying connection','What needs understanding','Your next step']),focus:ko?r[5]:`For “${r[3]}”, distinguish emotional possibility from what both people are actually choosing.`,prompt:ko?r[6]:'Choose one small step that respects your needs and leaves room for an honest response.',count:3})).concat(timingQuestions.map(q=>({id:q.id,situation:q.situation,label:ko?q.ko:q.en,title:ko?q.ko:q.en,positions:[ko?'시기를 읽는 카드':'Your timing card'],focus:ko?'시기 카드 1장으로 속도와 기간대, 변수를 살펴봐요.':'One card for pace, a symbolic time window and the conditions that matter.',prompt:ko?q.actionKo:'Check mutual willingness and respect boundaries.',count:1})))}
export const aliases:Record<string,string>={'their-feelings':'crush-feelings','my-ex':'ex-misses-me','reconciliation':'repair','will-they-contact-me':'ex-contact','our-future':'our-direction'};
export function getScenario(id:string,ko:boolean):Scenario{const found=scenarioList(ko).find(q=>q.id===(aliases[id]??id));if(found)return found;const legacy=(ko?koQuestions:questions).find(q=>q.id===id)??(ko?koQuestions:questions)[0];return {...legacy,positions:[...legacy.positions],situation:'general'}}
export function detailedReading(d:Draw,q:Scenario,i:number,ko:boolean,all?:Draw[]){
 if(isTiming(q.id)){const r=timingReading(d,q.id,ko);return [
  {title:ko?'질문에 대한 한 줄 답':'Answer',text:r.answer},
  {title:ko?'시기 · 현재 상태':'Timing and status',text:`${r.speed} · ${r.window}`},
  {title:ko?'카드에 근거한 설명':'Why this card',text:r.reason},
  {title:ko?'시기를 바꾸는 변수':'What can change the timing',text:r.variable},
  {title:ko?'종합 조언':'Your next step',text:r.action}
 ]}
 if(ko&&all&&koEngineSupports(q.id))return koCardSections(all,q.id,i);
 const base=d.reversed?d.card.reversed:d.card.upright;
 const lens=ko?questionLens(d,q.id):q.focus;
 const sentences=lens.match(/[^.!?。！？]+[.!?。！？]*/g)?.map(s=>s.trim())??[lens];
 const position=q.positions[i];
 const state=ko?(d.reversed?'현재 상태: 표현이나 행동이 막히는 부분을 먼저 봐요.':d.card.tone>0?'현재 상태: 대화나 행동으로 이어갈 여지가 있어요.':d.card.tone<0?'현재 상태: 진전보다 해결할 문제가 먼저 보여요.':'현재 상태: 서로의 의사와 조건을 더 확인해야 해요.'):(d.reversed?'Status: expression or action needs attention.':d.card.tone>0?'Status: there is room for constructive action.':d.card.tone<0?'Status: address the difficulty first.':'Status: clarify intentions and conditions.');
 const first=base.match(/[^.!?。！？]+[.!?。！？]*/)?.[0]?.trim()??base;
 const application=ko?(q.id==='daily'?`오늘의 일이나 대화에 적용하면, ${first} ${sentences.slice(1).join(' ')}`:`‘${position}’에 놓인 카드예요. ${q.id==='three-card'?(i===0?'앞의 설명은 과거에 남은 영향으로 읽어요.':i===1?'앞의 설명은 현재 반복되는 상황으로 읽어요.':'앞의 설명은 지금의 태도가 이어질 때의 방향으로 읽어요.'):i===0?'이 자리에서부터 질문을 풀어 가요.':i===1?'좋은 점이 있더라도 이 부분이 풀리지 않으면 진전이 늦어질 수 있어요.':'앞선 두 자리와 함께 판단할 다음 선택이에요.'} ${sentences.slice(1).join(' ')}`):`In “${position}”, ${base} ${q.focus}`;
 return [
  {title:ko?'질문에 대한 한 줄 답':'Your answer at a glance',text:`${i===0?sentences[0]:first} ${state}`},
  {title:ko?'카드에 근거한 설명':'What the card means',text:base},
  {title:ko?(q.id==='daily'?'오늘에 적용':'관계에 적용'):'Applying it to your situation',text:application},
  {title:ko?'종합 조언':'Advice to take with you',text:ko&&q.situation!=='single'&&q.id!=='daily'?`${cardScene(d.card.id)} ${i===2||q.count===1?q.prompt:''}`:q.prompt},
 ];
}
function effectiveTone(d:Draw){return d.reversed?-d.card.tone:d.card.tone}
// Pick the Korean particle by whether the word ends in a final consonant (digits read as Sino-Korean).
function josa(word:string,withBatchim:string,without:string){const last=word.replace(/[’'”"\s)]+$/,'').slice(-1);if(/[0-9]/.test(last))return '013678'.includes(last)?withBatchim:without;const code=last.charCodeAt(0)-0xac00;if(code<0||code>11171)return without;return code%28?withBatchim:without}
function spreadSignal(ds:Draw[]){const score=ds.reduce((sum,d)=>sum+effectiveTone(d),0);const positive=ds.filter(d=>effectiveTone(d)>0).length;const negative=ds.filter(d=>effectiveTone(d)<0).length;return {score,positive,negative,mixed:positive>0&&negative>0}}
function directJudgment(ds:Draw[],q:Scenario,ko:boolean){
 const s=spreadSignal(ds);const strong=s.score>=2, weak=s.score<=-2, mixed=s.mixed;
 if(!ko)return strong?'The spread leans positive, but it still needs real-world follow-through.':weak?'The current spread leans against the outcome you are hoping for.':mixed?'The spread is mixed: there is some opening, but a real obstacle is still active.':'The spread is not decisive yet; the next concrete action matters more than a symbolic yes/no.';
 const map:Record<string,[string,string,string,string]>={
  'ex-contact':['연락이 다시 올 가능성은 높은 편이에요. 다만 연락 자체와 재회 의사는 구분해서 봐야 해요.','현재 흐름에서는 먼저 연락해 올 가능성이 낮은 편이에요. 기다림보다 내 생활을 이어가는 쪽이 낫습니다.','연락 여지는 있지만 바로 움직이는 흐름은 아니에요. 다시 말을 걸고 싶은 마음과 망설이는 이유가 같이 잡힙니다.','지금 카드만으로는 연락 여부가 한쪽으로 기울지 않아요. 실제 연락 행동이 생기는지를 기준으로 보는 편이 낫습니다.'],
  'ex-return':['다시 연결될 여지는 있는 편이에요. 다만 예전 관계로 그대로 돌아가는 재회보다는 달라진 조건이 필요합니다.','현재 흐름에서는 재회 가능성이 낮은 편이에요. 남은 감정보다 해결되지 않은 문제가 더 크게 작용합니다.','감정이나 연결은 남아 있지만 재회를 막는 조건도 분명해요. 한쪽만 움직여서는 다시 시작되기 어렵습니다.','재회를 확신하기엔 아직 정보가 부족해요. 서로 다시 만나려는 행동이 실제로 생기는지가 갈림길입니다.'],
  'repair':['다시 만난다면 이전과 다른 관계를 만들 여지는 있어요. 핵심은 헤어진 원인을 행동으로 바꾸는 것입니다.','지금 상태로 다시 만나면 같은 문제가 반복될 가능성이 더 커 보여요. 재회보다 원인 해결이 먼저입니다.','다시 시작할 마음과 반복될 문제 둘 다 보여요. 바뀐 행동이 확인되기 전에는 재회를 서두르지 않는 편이 낫습니다.','재회 자체보다 무엇이 실제로 달라졌는지를 먼저 확인해야 하는 흐름이에요.'],
  'crush-feelings':['호감 쪽으로 기울어 있어요. 다만 다정함만 보지 말고 상대도 먼저 시간과 대화를 만드는지 확인하세요.','현재는 연애 호감이라고 보기엔 약한 편이에요. 친절이나 편안함을 호감으로 확대하지 않는 게 좋습니다.','호감 신호와 거리 두는 신호가 같이 보여요. 관심은 있을 수 있지만 관계를 진전시킬 준비까지 됐다고 보긴 어렵습니다.','친절인지 호감인지 아직 한쪽으로 기울지 않아요. 상대의 자발적인 연락과 만남 제안이 다음 판단 기준입니다.'],
  'define-us':['연인으로 발전할 가능성이 높은 편이에요. 이제는 분위기보다 관계를 어떻게 정의할지 대화가 필요한 단계입니다.','현재 흐름에서는 연인 관계로 굳어질 가능성이 낮은 편이에요. 한쪽만 관계를 정하려 한다면 더 기다려도 해결되기 어렵습니다.','끌림은 있지만 관계를 정하는 데 걸리는 문제가 있어요. 감정보다 서로 원하는 관계의 형태가 같은지 확인해야 합니다.','아직 연인이 될지 판단하기엔 흐름이 중립적이에요. 관계를 정의하는 대화가 있어야 다음 단계가 보입니다.'],
  'confess':['고백해 보는 쪽에 조금 더 무게가 실려요. 다만 답을 재촉하지 않는 방식이 좋습니다.','지금은 고백을 서두르지 않는 편이 낫습니다. 관계의 기본적인 상호 관심을 조금 더 확인하세요.','마음을 전할 여지는 있지만 상대의 반응을 낙관하기엔 걸림이 있어요. 짧고 부담 없는 표현부터 시작하는 편이 낫습니다.','지금은 고백 여부보다 서로 편하게 대화가 이어지는지 한 번 더 확인하는 게 좋습니다.'],
  'let-go':['기다림을 완전히 끝내기보다 짧게 기준을 정해 지켜볼 여지는 있어요. 다만 상대의 실제 행동이 전제입니다.','지금은 더 기다리기보다 놓아주는 쪽이 강합니다. 상대의 움직임 없이 내 일상만 멈추는 기다림은 끝내는 편이 낫습니다.','기다릴 이유와 놓아줄 이유가 동시에 보여요. 기한 없이 기다리지 말고 확인할 행동 기준을 정하세요.','카드가 기다림과 정리 중 한쪽을 강하게 밀지는 않아요. 상대의 최근 행동을 기준으로 결정하세요.']
 };
 const row=map[q.id];if(row)return strong?row[0]:weak?row[1]:mixed?row[2]:row[3];
 return strong?'현재 흐름은 질문에서 바라는 방향에 조금 더 가깝습니다. 다만 실제 행동이 이어지는지 확인해야 해요.':weak?'현재 흐름은 질문에서 바라는 결과와는 거리가 있는 편입니다. 억지로 밀기보다 걸리는 조건을 먼저 보는 게 낫습니다.':mixed?'좋은 신호와 걸림돌이 같이 보여요. 가능성은 있지만 지금 상태 그대로 자연스럽게 풀린다고 보긴 어렵습니다.':'아직 한쪽으로 결론내리기 어려운 흐름이에요. 다음 실제 행동이나 대화가 판단을 바꿀 수 있습니다.';
}
export function readingConclusion(ds:Draw[],q:Scenario,ko:boolean){
 if(ds.length===0)return '';
 if(isTiming(q.id))return timingReading(ds[0],q.id,ko).answer;
 if(ko&&koEngineSupports(q.id))return koAnswer(ds,q.id);
 const verdict=directJudgment(ds,q,ko);
 if(ds.length===1)return verdict;
 const s=spreadSignal(ds);const obstacle=ds.find(d=>effectiveTone(d)<0);const support=ds.find(d=>effectiveTone(d)>0);const last=ds[ds.length-1];
 if(!ko)return `${verdict} ${support?`${support.card.name} provides the clearest opening.`:''} ${obstacle?`${obstacle.card.name} is the main restraint.`:''} The final card, ${last.card.name}, points to ${last.card.keyword.toLowerCase()} as the next condition to watch.`;
 return [verdict,support&&`긍정 신호는 ${support.card.name}의 ‘${support.card.keyword}’에서 가장 선명해요.`,obstacle&&`${support?'반면 ':''}${obstacle.card.name}의 ‘${obstacle.card.keyword}’${josa(obstacle.card.keyword,'이','가')} 지금 가장 큰 걸림돌입니다.`,`마지막 ${last.card.name}${josa(last.card.name,'은','는')} 다음 흐름을 판단할 때 ‘${last.card.keyword}’${josa(last.card.keyword,'이','가')} 실제 행동으로 나타나는지를 보라고 합니다.`].filter(Boolean).join(' ');
}
export function matchingMessage(id:number,q:Scenario,ko:boolean,original:string){if(q.situation==='breakup')return original;if(id===9)return ko?'설렘을 느끼면서도 내 속도를 지킬 수 있어요.':'You can feel the spark and still honor your own pace.';if(id===19)return ko?'상대의 선택을 존중하면서 나의 바람도 소중히 여겨 주세요.':'Respect their choice without dismissing your own hopes.';return original}
export function spreadConnection(ds:Draw[],q:Scenario,ko:boolean){
 if(ds.length<3)return '';
 const [a,b,c]=ds;const tones=ds.map(effectiveTone);const s=spreadSignal(ds);const progression=tones[2]>tones[0]?(ko?(s.score<=-2?'마지막 카드는 처음보다 가볍지만 전체 흐름은 아직 무거워요. 중간의 걸림돌이 실제로 풀리는지부터 확인해야 합니다.':'처음보다 마지막 카드의 흐름이 나아져서, 중간의 문제를 넘기면 관계가 움직일 여지가 커집니다.'):(s.score<=-2?'The final card is lighter than the opening, but the spread as a whole is still heavy; check whether the middle obstacle actually eases.':'The final card improves on the opening card, so the obstacle in the middle is not necessarily the endpoint.')):tones[2]<tones[0]?(ko?(s.score>=2?'전체 흐름은 좋은 편이지만 마지막 카드가 처음보다 무거워요. 초반의 좋은 신호만 믿기보다 뒤에서 드러난 조건을 먼저 챙기세요.':'처음보다 마지막 카드가 더 무거워져요. 초반의 좋은 신호만 믿고 밀기보다 뒤에서 드러난 조건을 먼저 해결해야 합니다.'):'The final card is heavier than the opening, so the later condition matters more than the initial promise.'):(ko?'처음과 마지막의 힘이 비슷해서 한 번의 계기보다 반복되는 행동이 결론을 좌우합니다.':'The opening and ending are balanced; repeated behavior matters more than one moment.');
 if(ko)return `${q.positions[0]}에서는 ${a.card.name}의 ‘${a.card.keyword}’, ${q.positions[1]}에서는 ${b.card.name}의 ‘${b.card.keyword}’, ${q.positions[2]}에서는 ${c.card.name}의 ‘${c.card.keyword}’${josa(c.card.keyword,'이','가')} 이어집니다. ${progression}`;
 return `${a.card.name} opens the spread, ${b.card.name} changes the pressure in the middle, and ${c.card.name} sets the direction. ${progression}`;
}
// What the result screen shows under "the cards together": lead paragraph, timing/condition body and the next step.
export function readingSummary(ds:Draw[],q:Scenario,ko:boolean){
 if(isTiming(q.id)){const r=timingReading(ds[0],q.id,ko);return {answer:r.answer,lead:r.variable,body:'',action:q.prompt}}
 if(ko&&koEngineSupports(q.id)){const r=koSummary(ds,q.id,q.prompt);return {answer:r.answer,lead:r.lead,body:r.body,action:r.action}}
 return {answer:readingConclusion(ds,q,ko),lead:readingConclusion(ds,q,ko),body:spreadConnection(ds,q,ko),action:q.prompt};
}
