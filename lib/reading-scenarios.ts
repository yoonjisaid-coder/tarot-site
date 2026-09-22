import {questionLens} from './question-lenses';
import {questions,type Draw} from './tarot';
import {koQuestions} from './tarot-ko';
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
export function scenarioList(ko:boolean):Scenario[]{return rows.map(r=>({id:r[1],situation:r[0],label:ko?r[2]:r[3],title:ko?r[2]:r[3],positions:ko?r[4].split('|'):(englishPositions[r[1]]??['The underlying connection','What needs understanding','Your next step']),focus:ko?r[5]:`For “${r[3]}”, distinguish emotional possibility from what both people are actually choosing.`,prompt:ko?r[6]:'Choose one small step that respects your needs and leaves room for an honest response.',count:3}))}
export const aliases:Record<string,string>={'their-feelings':'crush-feelings','my-ex':'ex-misses-me','reconciliation':'repair','will-they-contact-me':'ex-contact','our-future':'our-direction'};
export function getScenario(id:string,ko:boolean):Scenario{const found=scenarioList(ko).find(q=>q.id===(aliases[id]??id));if(found)return found;const legacy=(ko?koQuestions:questions).find(q=>q.id===id)??(ko?koQuestions:questions)[0];return {...legacy,positions:[...legacy.positions],situation:'general'}}
export function detailedReading(d:Draw,q:Scenario,i:number,ko:boolean){
 const base=d.reversed?d.card.reversed:d.card.upright;
 if(!ko)return [{title:q.positions[i],text:`${d.card.name} — ${d.card.keyword}. ${base}`},{title:'In your situation',text:q.focus},{title:'A step to consider',text:q.prompt}];
 const context=q.id==='three-card'?[ '지난 관계를 돌아보면', '지금 관계에서 중요한 점', '지금과 같은 만남이 이어진다면' ][i]:q.positions[i];
 return [
  {title:context,text:base},
  {title:'선택한 질문에 대입하면',text:questionLens(d,q.id)},
  {title:i===2?'지금 해볼 일':'확인해볼 점',text:i===2?q.prompt:q.focus},
 ];
}
export function matchingMessage(id:number,q:Scenario,ko:boolean,original:string){if(q.situation==='breakup')return original;if(id===9)return ko?'설렘을 느끼면서도 내 속도를 지킬 수 있어요.':'You can feel the spark and still honor your own pace.';if(id===19)return ko?'상대의 선택을 존중하면서 나의 바람도 소중히 여겨 주세요.':'Respect their choice without dismissing your own hopes.';return original}
export function spreadConnection(ds:Draw[],q:Scenario,ko:boolean){
 if(ds.length<3)return '';
 const [a,b,c]=ds;
 if(ko)return `‘${q.positions[0]}’의 ${a.card.name}: ${a.reversed?a.card.reversed:a.card.upright} ‘${q.positions[1]}’의 ${b.card.name}: ${b.reversed?b.card.reversed:b.card.upright} ‘${q.positions[2]}’의 ${c.card.name}: ${c.reversed?c.card.reversed:c.card.upright}`;
 return `${a.card.name} in “${q.positions[0]}”, ${b.card.name} in “${q.positions[1]}”, and ${c.card.name} in “${q.positions[2]}”. ${q.prompt}`;
}
