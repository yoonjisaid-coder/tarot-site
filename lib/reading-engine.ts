// Korean question-first reading engine.
// Chain: question → question type → card classes → direct judgment → card evidence → situation → timing → condition → action.
// Cards are evidence for the answer; the answer is about the user's question, never a card glossary.
import type {Draw} from './tarot';
import {CONTACT,RECONCILE,FEELINGS,PROGRESS} from './reading-voice-partner';
import {DECISION,LETGO,SELF} from './reading-voice-self';

export type Cls='ACT'|'WARM'|'PAST'|'WAIT'|'FOG'|'CONFLICT'|'END'|'BUILD'|'HEAL'|'BIND'|'TURN'|'TRUTH';
type Triple=[string,string,string];
export type Voice=Record<Cls,{w:string;s:Triple;o:Triple;a:Triple}>;
type TypeKey='CONTACT'|'RECONCILE'|'FEELINGS'|'PROGRESS'|'DECISION'|'LETGO'|'SELF';
type Role='s'|'o'|'a'|'past'|'now'|'next';
type Level=0|1|2|3|4; // HIGH, DELAY, MIXED, LOW, FOG
type Unit='CONTACT'|'RECONCILE'|'PROGRESS'|'NEWLOVE';

const VOICES:Record<TypeKey,Voice>={CONTACT,RECONCILE,FEELINGS,PROGRESS,DECISION,LETGO,SELF};

// Pick the Korean particle by whether the word ends in a final consonant (digits read as Sino-Korean).
export function josa(word:string,withBatchim:string,without:string){const last=word.replace(/[’'”"\s)]+$/,'').slice(-1);if(/[0-9]/.test(last))return '013678'.includes(last)?withBatchim:without;const code=last.charCodeAt(0)-0xac00;if(code<0||code>11171)return without;return code%28?withBatchim:without}
const j=(w:string,a:string,b:string)=>w+josa(w,a,b);
// Template slots: {name} or {name|이/가} → value plus the matching particle.
function fill(t:string,v:Record<string,string>){return t.replace(/\{(\w+)(?:\|([^/}]+)\/([^}]+))?\}/g,(_,k,a,b)=>a?j(v[k]??'',a,b):(v[k]??''))}

// [upright class, reversed class, what the card shows]. Ids follow lib/tarot.ts.
const CARDS:[Cls,Cls,string][]=[
['ACT','FOG','절벽 끝에서 가볍게 발을 내딛는 여행자'],['ACT','FOG','네 가지 도구 앞에서 한 손을 들어 올린 인물'],['WAIT','FOG','두루마리를 반쯤 가린 채 두 기둥 사이에 앉은 여인'],['WARM','BIND','밀밭 한가운데 편안히 앉은 여인'],['BUILD','CONFLICT','숫양 장식의 돌 왕좌에 곧게 앉은 통치자'],['BUILD','CONFLICT','두 사람 앞에서 의식을 이끄는 사제'],['WARM','CONFLICT','천사 아래 마주 선 두 사람'],['ACT','FOG','두 스핑크스를 앞세우고 나아가는 전사'],['HEAL','WAIT','사자의 입을 부드럽게 다루는 여인'],['WAIT','WAIT','홀로 등불을 들고 선 노인'],['TURN','WAIT','하늘에 떠서 돌아가는 커다란 바퀴'],
['TRUTH','CONFLICT','칼과 저울을 든 재판관'],['WAIT','WAIT','나무에 거꾸로 매달린 채 고요한 사람'],['END','BIND','흰 말을 탄 해골 기사'],['HEAL','CONFLICT','두 컵 사이로 물을 옮겨 붓는 날개 달린 인물'],['BIND','TURN','사슬에 묶인 두 사람과 그 위에 앉은 존재'],['CONFLICT','FOG','번개를 맞아 무너지는 높은 건물'],['HEAL','WAIT','큰 별 아래 물가에서 물을 붓는 여인'],['FOG','TRUTH','달빛 아래 갈림길과 짖는 개 두 마리'],['WARM','WAIT','해바라기 앞에서 흰 말을 탄 아이'],['PAST','WAIT','나팔 소리에 깨어나는 사람들'],['BUILD','WAIT','화환 안에서 춤추는 인물'],
['ACT','WAIT','구름 속 손이 내민 싹 튼 완드'],['WAIT','FOG','지구본을 들고 먼 곳을 내다보는 사람'],['ACT','WAIT','언덕 위에서 떠나는 배들을 바라보는 사람'],['BUILD','WAIT','꽃장식 아래 축하하는 사람들'],['CONFLICT','CONFLICT','막대를 휘두르며 부딪치는 다섯 사람'],['ACT','WAIT','월계관을 쓰고 행진하는 기수'],['CONFLICT','WAIT','높은 곳에서 홀로 막대를 막아 내는 사람'],['ACT','WAIT','하늘을 가로질러 날아가는 여덟 개의 완드'],['WAIT','CONFLICT','상처를 감고도 경계를 늦추지 않는 사람'],['BIND','END','열 개의 막대를 힘겹게 짊어진 사람'],['ACT','FOG','완드를 들고 설레는 눈으로 바라보는 시종'],['ACT','FOG','앞발을 든 말을 타고 달려 나가는 기사'],['WARM','CONFLICT','해바라기와 검은 고양이를 곁에 둔 여왕'],['ACT','CONFLICT','몸을 앞으로 기울인 채 왕좌에 앉은 왕'],
['WARM','WAIT','구름 속 손에서 물이 넘쳐흐르는 컵'],['WARM','CONFLICT','컵을 주고받으며 마주 선 두 사람'],['WARM','FOG','잔을 높이 들고 함께 축하하는 세 사람'],['WAIT','TURN','내밀어진 컵을 외면하고 앉은 사람'],['PAST','HEAL','쏟아진 컵 앞에서 고개 숙인 사람'],['PAST','BIND','꽃이 담긴 컵을 건네는 아이들'],['FOG','TRUTH','구름 위 여러 컵 속 환상을 바라보는 사람'],['END','BIND','쌓아 둔 컵을 두고 떠나는 사람'],['WARM','FOG','컵들을 뒤에 두고 만족스럽게 앉은 사람'],['BUILD','CONFLICT','무지개 아래 함께 선 가족'],['WARM','FOG','컵 속 물고기를 보며 웃는 시종'],['WARM','FOG','컵을 들고 천천히 다가오는 기사'],['WARM','BIND','뚜껑 덮인 컵을 바라보는 여왕'],['BUILD','WAIT','출렁이는 바다 위에서 침착한 왕'],
['TRUTH','FOG','왕관을 꿰뚫은 검 한 자루'],['WAIT','TURN','눈을 가린 채 두 검을 교차한 사람'],['CONFLICT','HEAL','세 자루 검에 꿰뚫린 심장'],['WAIT','TURN','무덤 위에 누워 쉬는 기사'],['CONFLICT','TURN','검을 챙기며 돌아서는 사람들을 보는 승자'],['TURN','BIND','배를 타고 잔잔한 물가로 건너가는 사람들'],['FOG','TRUTH','검을 몰래 들고 빠져나가는 사람'],['BIND','HEAL','눈을 가리고 검에 둘러싸인 사람'],['FOG','HEAL','한밤중 잠에서 깨어 얼굴을 감싼 사람'],['END','HEAL','열 자루 검에 쓰러진 사람'],['WAIT','FOG','검을 들고 주변을 살피는 시종'],['ACT','CONFLICT','바람을 가르며 돌진하는 기사'],['TRUTH','CONFLICT','검을 곧게 세우고 손을 내민 여왕'],['TRUTH','CONFLICT','검을 들고 정면을 응시하는 왕'],
['BUILD','WAIT','정원 위 손에 놓인 금화 하나'],['WAIT','FOG','금화 두 개를 저글링하는 사람'],['BUILD','CONFLICT','함께 설계를 의논하는 사람들'],['BIND','TURN','금화를 꼭 끌어안은 사람'],['CONFLICT','HEAL','눈 속을 지나가는 두 사람과 불 켜진 창'],['WARM','CONFLICT','저울을 들고 금화를 나누는 사람'],['WAIT','FOG','자라는 금화 덩굴을 지켜보는 농부'],['BUILD','WAIT','금화를 하나씩 새기는 장인'],['BUILD','FOG','포도밭에서 여유롭게 선 여인'],['BUILD','CONFLICT','여러 세대가 모인 집'],['BUILD','WAIT','금화를 조심스럽게 들여다보는 시종'],['BUILD','WAIT','멈춰 선 말 위에서 밭을 바라보는 기사'],['WARM','BIND','금화를 무릎에 안고 정원에 앉은 여왕'],['BUILD','BIND','금화를 들고 포도 문양 옷을 입은 왕'],
];

const NOUN:Record<Cls,string>={ACT:'적극적인 움직임',WARM:'따뜻한 마음',PAST:'지난 기억',WAIT:'멈춤과 망설임',FOG:'불확실함',CONFLICT:'갈등과 상처',END:'끝과 정리',BUILD:'현실적인 기반',HEAL:'회복',BIND:'집착과 반복',TURN:'상황의 전환',TRUTH:'분명한 판단'};
const OBS:Record<Cls,string>={ACT:'서두르는 마음',WARM:'좋은 감정에만 기대는 마음',PAST:'지난 일에 대한 미련',WAIT:'결정을 미루는 태도',FOG:'확인되지 않은 추측',CONFLICT:'풀리지 않은 갈등',END:'이미 정리된 마음',BUILD:'현실적인 조건',HEAL:'아물지 않은 상처',BIND:'반복되는 패턴',TURN:'엇갈리는 타이밍',TRUTH:'솔직하지 못한 대화'};
const WANT:Record<Cls,string>={ACT:'함께 도전하는 즐거움',WARM:'다정한 애정 표현',PAST:'오래 쌓인 추억',WAIT:'서로의 속도를 기다려 주는 여유',FOG:'설렘과 신비로움',CONFLICT:'솔직하게 부딪히고 푸는 대화',END:'서로의 독립을 지키는 거리',BUILD:'안정과 신뢰',HEAL:'편안한 위로',BIND:'깊은 몰입',TURN:'함께 변해 가는 경험',TRUTH:'솔직한 대화'};
const DO:Record<Cls,string>={ACT:'먼저 움직이는 것',WARM:'마음을 따뜻하게 표현하는 것',PAST:'지난 시간을 정리하는 것',WAIT:'한 박자 쉬어 가는 것',FOG:'섣불리 결론 내리지 않는 것',CONFLICT:'갈등을 피하지 않고 다루는 것',END:'정리할 것을 정리하는 것',BUILD:'차근차근 쌓아 가는 것',HEAL:'나부터 회복하는 것',BIND:'익숙한 패턴을 끊는 것',TURN:'달라진 상황을 받아들이는 것',TRUTH:'솔직하게 말하는 것'};

const BASE:Record<Cls,number>={ACT:2,WARM:2,PAST:1,WAIT:0,FOG:-1,CONFLICT:-2,END:-2,BUILD:1,HEAL:1,BIND:-1,TURN:1,TRUTH:1};
const POL:Record<TypeKey,Record<Cls,number>>={
 CONTACT:BASE,FEELINGS:BASE,PROGRESS:BASE,
 RECONCILE:{...BASE,PAST:2,END:-3},
 DECISION:{...BASE,TRUTH:2,WAIT:-1,CONFLICT:-1,PAST:0},
 // For wait-or-let-go, positive means letting go is the better choice.
 LETGO:{ACT:1,WARM:-2,PAST:-1,WAIT:0,FOG:0,CONFLICT:1,END:2,BUILD:1,HEAL:1,BIND:1,TURN:1,TRUTH:1},
 SELF:{ACT:2,WARM:2,PAST:-1,WAIT:0,FOG:-1,CONFLICT:-1,END:1,BUILD:1,HEAL:1,BIND:-2,TURN:1,TRUTH:1},
};
const SLOW:Cls[]=['WAIT','HEAL','BUILD','PAST','BIND'];

type Pos={role:Role;voice?:TypeKey};
type Meta={type:TypeKey;pos:Pos[];verdicts:[string,string,string,string,string];unit?:Unit};
const P=(...roles:(Role|[Role,TypeKey])[]):Pos[]=>roles.map(r=>Array.isArray(r)?{role:r[0],voice:r[1]}:{role:r});
const SOA=P('s','o','a');

// Direct answers per question, indexed by level: HIGH, DELAY, MIXED, LOW, FOG.
const META:Record<string,Meta>={
 'ex-contact':{type:'CONTACT',pos:SOA,unit:'CONTACT',verdicts:[
  '연락이 올 가능성이 높은 편이에요. 상대 쪽에서 먼저 움직일 힘이 카드에 분명하게 나와 있어요.',
  '연락 가능성은 있어요. 다만 바로 오기보다는 한동안 망설이다가 연락하는 쪽에 가까워요.',
  '연락할 마음은 남아 있지만 그걸 막는 이유도 분명해요. 그 걸림돌이 풀리느냐에 따라 연락 여부가 갈려요.',
  '지금 흐름으로는 상대가 먼저 연락할 가능성이 낮아요. 기다리기보다 내 생활을 먼저 챙기는 편이 나아요.',
  '연락이 올지 안 올지 카드가 한쪽으로 기울지 않아요. 상대도 아직 마음을 정하지 못한 상태에 가까워요.']},
 'contact-flow':{type:'CONTACT',pos:SOA,unit:'CONTACT',verdicts:[
  '기다려도 괜찮아요. 상대 쪽에서 연락을 이어 갈 힘이 충분해요.',
  '기다려도 되지만 답이 오기까지 평소보다 시간이 걸릴 수 있어요. 늦어진다고 마음이 식었다고 볼 필요는 없어요.',
  '연락이 끊길 관계는 아니지만, 지금 연락 방식에 서로 맞지 않는 부분이 있어요. 기다리기만 하기보다 한 번은 짚고 넘어가는 게 좋아요.',
  '그냥 기다리기만 하는 건 권하지 않아요. 지금 흐름이면 상대가 먼저 연락을 이어 갈 가능성이 낮아요.',
  '상대의 다음 연락을 예측하기 어려운 상태예요. 기다릴지 말지는 상대보다 내 기준으로 정하는 편이 나아요.']},
 'ex-silence':{type:'LETGO',pos:SOA,verdicts:[
  '지금 침묵은 상대가 관계를 정리하는 쪽에 가까워서일 가능성이 커요. 다시 연락이 오길 기대하며 기다리기엔 신호가 약해요.',
  '상대는 {obs|을/를} 이유로 연락을 미루고 있는 쪽에 가까워요. 끝났다기보다 시간이 필요한 침묵이에요.',
  '침묵의 이유는 {obs}에 있어요. 마음이 아예 없는 건 아니지만, 그 문제가 풀리기 전에는 먼저 연락하기 어려운 상태예요.',
  '연락이 없는 건 마음이 끝나서라기보다 아직 움직일 때를 재고 있기 때문에 가까워요. 침묵이 길어도 완전히 닫힌 관계는 아니에요.',
  '왜 연락이 없는지 카드로도 분명하게 드러나지 않아요. 확인되지 않은 이유를 내 탓으로 채우지 않는 게 중요해요.']},
 'reach-out':{type:'DECISION',pos:SOA,verdicts:[
  '연락해 봐도 괜찮아요. 지금은 먼저 움직이는 쪽이 기다리는 것보다 유리해요.',
  '연락 자체는 괜찮지만 지금 바로보다는 조금 시간을 두는 게 좋아요. 마음이 정리된 뒤 보내는 연락이 덜 흔들려요.',
  '보내도 되지만 조건이 있어요. 답을 기대하기보다 내 마음을 정리하는 짧은 안부 정도가 맞아요.',
  '지금은 먼저 연락하지 않는 편이 나아요. 보내도 원하는 반응을 얻기 어려운 때예요.',
  '연락할지 말지 카드가 분명하게 밀어 주지 않아요. 왜 연락하고 싶은지부터 정하고 결정해도 늦지 않아요.']},
 'confess':{type:'DECISION',pos:P('s',['s','FEELINGS'],'a'),verdicts:[
  '고백해도 괜찮은 때예요. 지금 마음을 전하면 상대도 진지하게 받아들일 가능성이 커요.',
  '마음은 전해도 되지만 고백은 조금 뒤가 좋아요. 지금은 둘만의 시간을 한두 번 더 쌓는 게 먼저예요.',
  '고백할 이유도, 망설일 이유도 둘 다 있어요. 답을 확인받는 고백보다 부담 없이 마음을 비치는 정도가 맞아요.',
  '지금 고백하는 건 권하지 않아요. 상대가 받아들일 준비가 아직 안 된 쪽에 가까워요.',
  '상대 마음이 잘 보이지 않는 상태라 고백의 결과를 점치기 어려워요. 먼저 상대 반응을 조금 더 확인해 보세요.']},
 'approach':{type:'DECISION',pos:P(['s','PROGRESS'],'o','a'),verdicts:[
  '지금은 먼저 다가가도 자연스럽게 받아들여질 때예요. 가벼운 제안부터 바로 시작해 보세요.',
  '서두르기보다 조금씩 접점을 늘리는 방식이 맞아요. 몇 번 편하게 대화가 이어진 뒤에 한 걸음 더 나가세요.',
  '다가갈 여지는 있지만 조심할 부분도 있어요. 부담을 주지 않는 거리에서 시작하는 게 핵심이에요.',
  '지금은 적극적으로 다가가기보다 거리를 지키는 편이 나아요. 상대 쪽에서 받아들일 여유가 크지 않아요.',
  '상대 반응이 아직 잘 안 보이는 상태예요. 다가가기 전에 평소 대화에서 반응을 조금 더 살펴보세요.']},
 'let-go':{type:'LETGO',pos:SOA,verdicts:[
  '이제는 놓아주는 쪽이 맞아요. 기다림이 나를 지치게 하는 데 비해 돌아올 신호는 약해요.',
  '당장 끊기보다 기한을 정해 두고 정리해 가는 게 좋아요. 마음이 따라오는 데 시간이 조금 더 필요해요.',
  '기다릴 이유와 놓아줄 이유가 함께 있어요. 언제까지, 무엇을 보고 결정할지 기준을 정하는 게 먼저예요.',
  '아직 완전히 놓을 때는 아니에요. 관계에 남은 연결이 있어서, 조금 더 지켜볼 이유가 있어요.',
  '기다림과 정리 중 어느 쪽도 카드가 강하게 밀지 않아요. 상대의 최근 행동을 기준으로 정하세요.']},
 'ex-misses-me':{type:'FEELINGS',pos:SOA,verdicts:[
  '그리워하는 마음이 있을 가능성이 높아요. 좋았던 기억을 아직 꺼내 보는 쪽에 가까워요.',
  '그리움은 있어요. 다만 아직 겉으로 드러낼 만큼 정리되지는 않은 마음이에요.',
  '그리운 마음과 다시 엮이고 싶지 않은 마음이 함께 있어요. 그리움이 곧 재회 의사로 이어지진 않아요.',
  '지금은 그리움보다 정리하는 쪽에 마음이 기울어 있어요. 상대가 나를 붙잡고 있다고 보긴 어려워요.',
  '그리워하는지 카드로도 선명하게 드러나지 않아요. 상대 스스로도 마음을 정리하지 못한 상태에 가까워요.']},
 'crush-feelings':{type:'FEELINGS',pos:SOA,verdicts:[
  '호감 쪽에 가까워요. 단순한 친절이라기엔 나에게 쏟는 관심이 분명해요.',
  '호감의 싹은 있어요. 다만 아직은 친절과 호감 사이에서 천천히 커 가는 단계예요.',
  '관심은 있지만 연애 감정으로 굳어지진 않았어요. 다정함 속에 거리를 두는 신호도 함께 섞여 있어요.',
  '지금은 호감보다 친절에 가까워요. 다정함을 연애 감정으로 받아들이기엔 근거가 약해요.',
  '호감인지 친절인지 아직 판단하기 어려워요. 상대 마음이 겉으로 잘 드러나지 않는 상태예요.']},
 'thinking-of-me':{type:'FEELINGS',pos:P('s','s','a'),verdicts:[
  '네, 상대도 나를 떠올리고 있을 가능성이 높아요. 함께한 순간이 상대에게도 기억에 남아 있어요.',
  '생각은 하고 있어요. 다만 그 마음을 표현으로 옮기기까지는 시간이 걸리는 쪽이에요.',
  '나를 떠올리긴 하지만 그 생각이 늘 편하진 않아요. 마음 한쪽에 걸리는 부분이 있어요.',
  '지금 상대의 관심은 나보다 다른 데 가 있는 편이에요. 내 생각을 자주 한다고 보긴 어려워요.',
  '상대가 나를 얼마나 떠올리는지 카드로도 흐릿하게 나와요. 추측보다 실제 대화를 기준으로 보세요.']},
 'hidden-feelings':{type:'FEELINGS',pos:SOA,verdicts:[
  '말하지 않을 뿐 마음은 꽤 커요. 표현할 타이밍을 고르고 있는 쪽에 가까워요.',
  '마음은 있지만 아직 스스로도 확신하지 못해서 말을 아끼고 있어요.',
  '호감은 있지만 관계를 바꿨을 때 잃을 것을 걱정하고 있어요. 그래서 가까운 거리에서 멈춰 있어요.',
  '말하지 않는 이유는 연애 감정이 크지 않기 때문에 가까워요. 지금의 편한 거리를 유지하고 싶어 하는 쪽이에요.',
  '상대 자신도 이 마음이 무엇인지 정리하지 못한 상태예요. 그래서 말로 꺼내지 못하고 있어요.']},
 'mixed-signals':{type:'FEELINGS',pos:SOA,verdicts:[
  '마음이 식어서가 아니라 표현하는 속도가 들쭉날쭉한 거예요. 관심 자체는 꾸준한 편이에요.',
  '가까워지는 게 부담스러워 한 번씩 속도를 늦추는 쪽이에요. 마음은 있지만 천천히 가고 싶어 해요.',
  '다가오고 싶은 마음과 거리를 두고 싶은 마음이 번갈아 나타나요. 상대 안에서도 아직 정리가 안 된 상태예요.',
  '멀어지는 쪽이 상대의 진짜 신호에 가까워요. 다정함은 순간적인 것이고, 관계를 깊게 할 생각은 크지 않아요.',
  '왜 그러는지 카드로도 뚜렷하지 않아요. 상대의 말보다 반복되는 행동 패턴을 기준으로 보세요.']},
 'ex-return':{type:'RECONCILE',pos:SOA,unit:'RECONCILE',verdicts:[
  '다시 만날 여지는 충분해요. 두 사람 사이에 아직 이어진 끈이 분명해요.',
  '재회 가능성은 있어요. 다만 금방은 아니고, 시간을 두고 천천히 다시 가까워지는 쪽이에요.',
  '다시 만날 여지는 있지만 조건이 붙어요. 헤어진 이유가 정리되지 않으면 다시 이어져도 오래가기 어려워요.',
  '지금 흐름으로는 재회 가능성이 낮아요. 남은 감정보다 관계를 끝낸 이유가 더 크게 작용하고 있어요.',
  '재회 여부가 아직 한쪽으로 정해지지 않았어요. 두 사람 모두 마음이 정리되지 않은 상태에 가까워요.']},
 'repair':{type:'RECONCILE',pos:SOA,verdicts:[
  '바뀌어야 할 건 생각보다 크지 않아요. {obs|을/를} 다잡으면 다시 만날 기반은 남아 있어요.',
  '가장 먼저 달라져야 할 건 {obs}{obs2}. 이걸 바꾸는 데 시간이 걸리는 만큼 재회도 서두르지 않는 게 좋아요.',
  '{obs|을/를} 바꾸지 않으면 다시 만나도 같은 이유로 부딪혀요. 마음보다 이 문제를 먼저 다뤄야 해요.',
  '지금은 무엇을 바꾸기 전에 {obs} 문제가 너무 커요. 재회보다 각자 정리할 시간이 먼저예요.',
  '무엇이 문제였는지 아직 두 사람 모두 정확히 모르는 상태예요. 헤어진 이유부터 같이 짚어 보는 게 먼저예요.']},
 'after-reunion':{type:'RECONCILE',pos:SOA,verdicts:[
  '같은 이유로 아플 가능성은 낮아요. 다시 만난다면 예전과 다른 관계를 만들 힘이 있어요.',
  '처음엔 조심스럽겠지만, 시간을 두고 맞춰 가면 같은 상처를 반복하지 않을 수 있어요.',
  '같은 문제가 다시 나올 여지가 있어요. {obs|이/가} 그대로라면 다시 만나도 비슷한 지점에서 부딪혀요.',
  '지금 상태로 다시 만나면 같은 이유로 아플 가능성이 커요. {obs|이/가} 아직 해결되지 않았어요.',
  '같은 문제가 반복될지는 아직 알 수 없어요. 예전 갈등을 어떻게 다룰지 이야기해 본 적이 없다면 그것부터 필요해요.']},
 'define-us':{type:'PROGRESS',pos:SOA,unit:'PROGRESS',verdicts:[
  '연인으로 발전할 가능성이 높아요. 이제는 분위기보다 관계를 정하는 대화가 필요한 단계예요.',
  '발전 가능성은 있어요. 다만 바로 사귀기보다는 몇 번 더 만나며 확신을 쌓는 과정이 필요해요.',
  '서로 끌리는 건 맞지만 관계를 정하는 데 걸리는 문제가 있어요. 원하는 관계의 모습이 같은지 먼저 확인해야 해요.',
  '지금 흐름으로는 연인으로 이어질 가능성이 낮아요. 한쪽만 관계를 정하고 싶어 하는 상태에 가까워요.',
  '사귈 수 있을지 아직 판단하기 이른 상태예요. 서로 마음을 확인할 대화가 아직 없었던 쪽이에요.']},
 'our-direction':{type:'PROGRESS',pos:P('s','o','next'),unit:'PROGRESS',verdicts:[
  '이 관계는 더 가까워지는 방향으로 가고 있어요. 지금처럼만 이어 가도 자연스럽게 깊어질 수 있어요.',
  '천천히 좋아지는 쪽으로 가고 있어요. 다만 지금은 어려운 구간이라 답답하게 느껴질 수 있어요.',
  '지금은 좋아 보여도 앞으로 흔들릴 수 있는 관계예요. 반복되는 패턴 하나를 바꾸느냐에 따라 방향이 갈려요.',
  '지금 상태가 이어지면 관계가 멀어지는 쪽으로 가요. 방향을 바꾸려면 지금 반복되는 모습부터 달라져야 해요.',
  '어디로 갈지 아직 정해지지 않은 관계예요. 두 사람이 이 관계를 어떻게 보고 있는지부터 맞춰 봐야 해요.']},
 'three-card':{type:'PROGRESS',pos:P('past','now','next'),verdicts:[
  '과거보다 앞으로가 나아지는 관계예요. 지금의 좋은 점이 이어지면 더 단단해질 수 있어요.',
  '지금은 어렵지만 앞으로 나아지는 관계예요. 이 시기를 다지는 시간으로 보면 돼요.',
  '지금은 좋아 보여도 앞으로 흔들릴 수 있어요. 지금 어떤 선택을 하느냐에 따라 앞으로가 달라져요.',
  '이대로라면 앞으로 더 어려워질 수 있어요. 지금 드러난 문제를 미루지 않는 게 중요해요.',
  '앞으로의 방향이 아직 뚜렷하지 않아요. 지금 상황을 조금 더 지켜보며 판단하는 게 좋아요.']},
 'new-love':{type:'SELF',pos:SOA,verdicts:[
  '네, 새 연애를 시작할 준비가 됐어요. 마음의 여유도, 새 사람을 받아들일 힘도 충분해요.',
  '거의 준비됐어요. 다만 지난 감정을 마저 정리할 시간이 조금 더 있으면 좋아요.',
  '새 연애를 원하는 마음은 있지만 아직 돌봐야 할 감정이 남아 있어요. 그 부분을 알고 시작하면 괜찮아요.',
  '지금은 새 연애보다 나를 먼저 챙길 때예요. 아직 지난 일의 영향이 커서 새 관계에 온전히 마음을 쓰기 어려워요.',
  '준비가 됐는지 스스로도 확신이 없는 상태예요. 연애를 원하는 이유부터 차분히 정리해 보세요.']},
 'love-pattern':{type:'SELF',pos:SOA,verdicts:[
  '반복의 원인은 크지 않아요. {obs|이/가} 가끔 같은 선택으로 이끌 뿐, 바꿀 힘은 이미 충분해요.',
  '반복의 뿌리는 {obs}에 있어요. 알아차리기 시작했으니 천천히 다른 선택을 늘려 가면 돼요.',
  '같은 일이 반복되는 건 {obs} 때문이에요. 끌리는 사람의 유형보다 내가 관계에서 반복하는 행동을 봐야 해요.',
  '같은 일이 되풀이되는 핵심 원인은 {obs}{obs2}. 이 패턴을 알아차리지 못하면 상대가 바뀌어도 같은 지점에서 힘들어질 수 있어요.',
  '반복의 원인이 아직 스스로에게도 잘 보이지 않아요. 지난 관계들의 공통점을 하나씩 적어 보는 게 출발점이에요.']},
 'new-connection':{type:'SELF',pos:SOA,verdicts:[
  '지금은 만남의 기회를 적극적으로 늘리면 좋은 때예요. 움직이는 만큼 결과가 따라와요.',
  '서두르기보다 생활 반경을 조금씩 넓히는 게 맞아요. 만남은 익숙한 곳에서 천천히 생겨요.',
  '만남의 기회는 있지만 {obs|이/가} 발목을 잡아요. 그 습관 하나만 바꿔도 만남이 훨씬 쉬워져요.',
  '지금은 새 사람을 찾기보다 {obs}부터 풀어야 해요. 그 상태로는 만남이 생겨도 이어지기 어려워요.',
  '어떤 만남을 원하는지부터 정리가 필요해요. 방향이 정해지면 어디서 만날지도 분명해져요.']},
 'healthy-love':{type:'SELF',pos:P('s','s','a'),verdicts:[
  '{want|이/가} 살아 있는 관계가 잘 맞아요. 여기에 {want2|이/가} 받쳐 주면 오래 편안할 수 있어요.',
  '{want|이/가} 중심이 되는 관계가 맞아요. 서두르기보다 {want2|을/를} 천천히 쌓아 가는 연애가 편해요.',
  '{want|을/를} 원하면서도 {want2|을/를} 함께 바라는 마음이 있어요. 두 가지를 다 채워 주는 관계가 맞아요.',
  '지금 끌리는 관계와 실제로 맞는 관계가 다를 수 있어요. 나에게 필요한 건 {want}, 그리고 {want2}{want2c}.',
  '어떤 사랑이 맞는지 아직 찾는 중이에요. 다만 {want|이/가} 중요한 기준이 될 거예요.']},
 'daily':{type:'SELF',pos:P('s'),verdicts:[
  '오늘은 마음먹은 일을 밀고 나가기 좋은 날이에요. 미뤄 둔 연락이나 계획이 있다면 오늘 움직여 보세요.',
  '오늘은 서두르지 말고 한 박자 쉬어 가는 게 좋아요. 결과보다 준비에 시간을 쓰세요.',
  '좋은 일과 신경 쓰이는 일이 같이 오는 날이에요. 중요한 결정은 하나만 하세요.',
  '오늘은 부딪히는 일을 피하고 나를 지키는 데 집중하세요. 기분이 상하는 말에 바로 답하지 않는 게 좋아요.',
  '오늘은 확실하지 않은 일에 결론을 내리지 않는 게 좋아요. 판단은 내일로 미뤄도 괜찮아요.']},
 'yes-no':{type:'DECISION',pos:P('s'),verdicts:[
  '예에 가까워요. 지금 움직이는 쪽에 힘이 실려 있어요.',
  '예에 가깝지만 지금 당장은 아니에요. 조금 기다렸다 움직이세요.',
  '조건부 예예요. 걸리는 부분을 먼저 확인한 뒤라면 괜찮아요.',
  '아니오에 가까워요. 지금은 하지 않는 편이 나아요.',
  '아직 판단하기 어려워요. 정보를 조금 더 모은 뒤 다시 보세요.']},
};

const CONS:Record<TypeKey,[string,string,string,string]>={
 CONTACT:['마음도 있고 막는 것도 크지 않아서, 연락은 생각보다 자연스럽게 이어질 수 있어요.','마음은 있어도 이 걸림돌 때문에 연락이 바로 이어지진 않아요. 걸림돌이 풀리는 때가 곧 연락의 때예요.','지금 상태만 보면 어렵지만, 걸림돌이 생각보다 가벼워서 상황이 바뀌면 연락의 여지가 생겨요.','마음도 멀어졌고 막는 것도 커서, 연락을 기대하며 기다리기엔 부담이 큰 상황이에요.'],
 RECONCILE:['남은 마음이 있고 막는 것도 크지 않아서, 다시 이어질 바탕이 있어요.','다시 이어질 마음은 있지만 이 걸림돌을 넘지 못하면 재회해도 오래가기 어려워요.','지금은 거리가 있지만 막고 있는 것이 생각보다 가벼워서, 시간이 지나며 달라질 여지가 있어요.','남은 마음보다 관계를 끝낸 이유가 더 커서, 재회보다 정리가 자연스러운 상황이에요.'],
 FEELINGS:['상대 마음은 나를 향해 열려 있고, 그걸 막는 것도 크지 않아요.','상대 마음에 호감은 있지만, 이 걸림돌 때문에 행동으로 드러나지 않고 있어요.','지금 겉으로 보이는 마음은 차갑지만, 그 이유가 생각보다 가벼워서 달라질 수 있어요.','상대 마음이 멀어져 있고 그 이유도 분명해서, 지금은 마음을 기대하기 어려워요.'],
 PROGRESS:['관계를 끌고 갈 힘도 있고 막는 것도 크지 않아서, 자연스럽게 다음 단계로 넘어갈 수 있어요.','관계를 원하는 마음은 있지만 이 걸림돌이 진전을 붙잡고 있어요. 이걸 다뤄야 관계가 정리돼요.','지금은 제자리 같지만 막는 것이 크지 않아서, 계기만 생기면 관계가 움직일 수 있어요.','관계를 끌고 갈 힘도 약하고 막는 것도 커서, 지금 형태로는 진전이 어려워요.'],
 DECISION:['내 마음도 준비됐고 막는 것도 크지 않아서, 움직여 볼 만한 때예요.','내 마음은 준비됐지만 이 걸림돌 때문에 지금 움직이면 원하는 반응을 얻기 어려워요.','내 마음은 아직 흔들리지만 상황 자체는 나쁘지 않아요. 마음이 정리되면 움직여도 돼요.','내 마음도 정리되지 않았고 상황도 받쳐 주지 않아서, 지금은 움직이지 않는 편이 나아요.'],
 LETGO:['내 마음도 정리할 준비가 됐고, 붙잡을 이유도 크지 않아요. 놓아주기 좋은 때예요.','정리하고 싶은 마음은 있지만 이 걸림돌이 발목을 잡아요. 그것만 정리하면 한결 가벼워져요.','아직 마음이 남아 있지만 상황은 정리 쪽으로 가고 있어요. 천천히 받아들일 시간이 필요해요.','마음도 남아 있고 정리를 막는 것도 커서, 지금 당장 놓기는 어려워요. 기한을 정해 지켜보세요.'],
 SELF:['나에게는 새로 시작할 힘이 있고, 막는 것도 크지 않아요.','시작할 마음은 있지만 이 걸림돌이 나를 같은 자리로 끌어당겨요. 이것부터 알아차리는 게 핵심이에요.','지금은 지쳐 있지만 막는 것이 크지 않아서, 회복되면 금방 움직일 수 있어요.','지금은 새로 시작하기보다 나를 돌보고 정리하는 데 힘을 써야 할 때예요.'],
};
const MID:Record<TypeKey,string>={CONTACT:'마음이 분명하지도, 완전히 닫히지도 않은 상태예요. 걸림돌을 어떻게 다루느냐에 따라 연락 여부가 갈려요.',RECONCILE:'남은 마음도, 막는 이유도 아직 뚜렷하지 않아요. 어느 쪽으로 기울지는 앞으로의 대화에 달려 있어요.',FEELINGS:'상대 마음이 분명하게 드러나지 않았고, 그 사이에 추측도 섞여 있어요. 확인되는 행동이 나와야 판단할 수 있어요.',PROGRESS:'관계를 끌고 갈 힘도, 막는 문제도 아직 애매해요. 한 번의 솔직한 대화가 방향을 정해 줄 거예요.',DECISION:'움직일 이유도, 멈출 이유도 아직 뚜렷하지 않아요. 서두를 필요 없는 결정이에요.',LETGO:'기다릴 이유도, 놓을 이유도 아직 뚜렷하지 않아요. 기준을 먼저 정하면 답이 보여요.',SELF:'시작할 힘도, 막는 문제도 아직 뚜렷하지 않아요. 내가 원하는 걸 먼저 정리하는 게 순서예요.'};
const PAIR=['두 카드가 같은 방향을 가리켜서 판단에 힘이 실려요.','앞의 카드는 가능성을, 뒤의 카드는 조심할 점을 보여 줘서 서두르지 않는 게 좋아요.','처음엔 어려워 보여도 두 번째 카드가 여지를 남겨 줘요.','두 카드 모두 조심스러운 쪽이라 지금은 속도를 늦추는 게 맞아요.'];
const ARC={up:'지금 좋은 점이 앞으로도 이어지는 관계예요.',recover:'어려운 구간을 지나면 회복 쪽으로 갈 수 있는 관계예요. 지금의 갈등을 끝이라고 단정하지 마세요.',fall:'좋은 분위기가 끝까지 이어진다고 보긴 어려워요. 좋은 분위기만 믿고 문제를 미루면 뒤에서 크게 흔들릴 수 있어요.',down:'지금의 어려움이 앞으로도 이어질 수 있어요. 방향을 바꾸려면 지금 바로 무언가 달라져야 해요.',open:'앞으로의 방향은 지금 어떤 선택을 하느냐에 달려 있어요.'};
const TOPIC:Record<TypeKey,string>={CONTACT:'연락',RECONCILE:'재회',FEELINGS:'상대의 마음 표현',PROGRESS:'관계의 진전',DECISION:'내 결정',LETGO:'정리',SELF:'새로운 시작'};
const TOPIC_AT:Record<TypeKey,string>={CONTACT:'연락을 두고는',RECONCILE:'재회를 두고는',FEELINGS:'상대 마음을 두고는',PROGRESS:'이 관계를 두고는',DECISION:'이번 결정에서는',LETGO:'기다림을 두고는',SELF:'새 출발을 앞두고는'};
const COND_IF:Record<TypeKey,string>={CONTACT:'이 부분이 풀리면 연락 가능성도 달라져요.',RECONCILE:'이 부분이 해결되면 재회 판단도 달라질 수 있어요.',FEELINGS:'이 부분이 풀리면 상대 마음도 더 분명하게 드러날 거예요.',PROGRESS:'이 부분을 넘으면 관계가 한 단계 나아갈 수 있어요.',DECISION:'이 부분이 정리되면 움직이기 훨씬 쉬워져요.',LETGO:'이 부분이 정리되면 결정도 한결 가벼워져요.',SELF:'이 부분을 바꾸면 연애의 방향도 달라질 수 있어요.'};

// Timing: editorial pace classes, never calibrated probabilities or dates.
export const UNITS:Record<Unit,[string,string,string,string,string]>={
 CONTACT:['며칠~1주','1~2주','2~4주','1~2개월','2~3개월 이상'],
 RECONCILE:['2~4주','1~2개월','2~3개월','3~6개월','반년 이상'],
 PROGRESS:['1~2주','2~4주','1~2개월','2~3개월','3개월 이상'],
 NEWLOVE:['1~2개월','2~3개월','3~4개월','4~6개월','반년 이후'],
};
const EVENT:Record<Unit,string>={CONTACT:'연락',RECONCILE:'다시 대화가 열리는',PROGRESS:'관계가 한 단계 나아가는',NEWLOVE:'새 인연이 시작되는'};
const PACE:Record<Cls,number|null>={ACT:0,TRUTH:1,WARM:1,TURN:1,PAST:2,BUILD:2,HEAL:2,WAIT:3,BIND:3,CONFLICT:3,FOG:null,END:null};
export function rangeText(unit:Unit,center:number,confidence:'high'|'mid'|'low'|'one'){
 const u=UNITS[unit];const c=Math.max(0,Math.min(4,center));
 const early=c>0&&u[c-1]!==u[c]?u[c-1]:null;const late=c<4&&u[c+1]!==u[c]?u[c+1]:null;
 const head=`${EVENT[unit]} 시기는 ${j(u[c],'이','가')} 중심이에요.`;
 const span=early&&late?` 빠르면 ${u[c-1]}, 늦어지면 ${u[c+1]}까지 열어 두세요.`:late?` 늦어지면 ${u[c+1]}까지 걸릴 수 있어요.`:early?` 빠르면 ${u[c-1]} 안에도 움직일 수 있지만, 그보다 더 길어질 수도 있어요.`:'';
 const conf=confidence==='one'?' 카드 한 장으로 본 시기라 중심 구간 정도로만 참고하세요.':confidence==='high'?' 카드들이 비슷한 속도를 가리켜서 시기 판단에 비교적 무게를 둘 수 있어요.':confidence==='mid'?' 카드마다 속도가 조금씩 달라서 중심 구간 정도로만 참고하세요.':' 다만 시기 신호는 약해요. 숫자보다 상대의 실제 움직임을 기준으로 보세요.';
 return head+span+conf;
}

const WARM_OBS:Record<TypeKey,string>={CONTACT:'마음이 있어서 생긴 조심스러움',FEELINGS:'마음이 있어서 생긴 조심스러움',RECONCILE:'감정에 기대 문제를 덮는 마음',PROGRESS:'지금의 편안함을 잃을까 하는 걱정',DECISION:'상대도 같은 마음이길 바라는 기대',LETGO:'아직 남은 애정',SELF:'쉽게 마음을 주는 성향'};
function obsTheme(t:TypeKey,c:Cls){if(c==='WARM')return WARM_OBS[t];const m=VOICES[t][c].o[0].match(/(?:걸림돌은|막는 건) (.+?)(?:이에요|예요)\./);return m&&m[1].length<=14&&!m[1].includes('다는 점')?m[1]:OBS[c]}
const clsOf=(d:Draw):Cls=>{const c=CARDS[d.card.id];return d.reversed?c[1]:c[0]};
export function koEngineSupports(id:string){return id in META}

function analyse(ds:Draw[],id:string){
 const m=META[id];const pol=POL[m.type];
 const items=ds.map((d,i)=>{const pos=m.pos[i]??{role:'s' as Role};const cls=clsOf(d);return {d,i,cls,role:pos.role,voice:pos.voice??m.type,p:pol[cls]}});
 const primary=items.filter(x=>['s','now','next','past'].includes(x.role));
 const obstacle=items.find(x=>x.role==='o');const advice=items.find(x=>x.role==='a');
 const outcome=items.find(x=>x.role==='next');
 let level:Level;
 const delay=primary.some(x=>SLOW.includes(x.cls)||(x.d.reversed&&x.p>0));
 if(outcome){
  const now=items.find(x=>x.role==='now')??obstacle??primary[0];
  const past=items.find(x=>x.role==='past');
  const o=outcome.p,c=now?now.p:0;
  if(outcome.cls==='FOG'&&c<=0)level=4;
  else if(o>0&&c>0)level=delay&&o<2?1:0;
  else if(o>0)level=1;
  else if(c>0)level=2;
  else if(o<0)level=3;
  else level=(past&&past.p<0)?3:4;
 }else{
  const adv=(a0=>a0&&(m.type==='DECISION'||m.type==='LETGO')?a0:null)(items.find(x=>x.role==='a'));
  const pScore=(primary.reduce((s,x)=>s+x.p,0)+(adv?adv.p*0.5:0))/Math.max(1,primary.length+(adv?0.5:0));
  const oPen=obstacle?(obstacle.p<=-2?-1:obstacle.p<0?-0.5:obstacle.p>=1?0.5:0):0;
  const total=pScore+oPen;
  const fog=primary.some(x=>x.cls==='FOG')&&total<=0.5;
  if(fog)level=4;
  else if(pScore>=1&&obstacle&&obstacle.p<=-2)level=2;
  else if(total>=1.75)level=delay?1:0;
  else if(total>=0.75)level=1;
  else if(total>-0.75)level=2;
  else level=3;
 }
 return {m,items,primary,obstacle,advice,outcome,level};
}

function timingFor(a:ReturnType<typeof analyse>){
 const unit=a.m.unit;if(!unit)return null;
 if(a.level===3)return {unit,text:`지금 흐름 그대로라면 ${EVENT[unit]} 시기를 말하기 어려워요.${a.obstacle?' 걸림돌이 먼저 풀려야 시기를 다시 볼 수 있어요.':''}`,center:null};
 if(a.level===4||a.primary.some(x=>x.cls==='END'))return {unit,text:`${EVENT[unit]} 시기도 지금 카드로는 흐릿해요. 날짜를 정해 두고 기다리기보다 실제 움직임이 생기는지를 기준으로 보세요.`,center:null};
 const paces=a.items.filter(x=>x.role!=='o'&&x.role!=='past').map(x=>{const base=PACE[x.cls];if(base===null)return null;const id=x.d.card.id;const suit=id>=22&&id<36?-1:id>=64?1:0;return Math.max(0,Math.min(4,base+suit+(x.d.reversed?1:0)))}).filter((v):v is number=>v!==null);
 if(!paces.length)return {unit,text:`${EVENT[unit]} 시기를 좁힐 근거가 부족해요. 날짜보다 실제 움직임을 기준으로 보세요.`,center:null};
 let center=Math.round(paces.reduce((s,v)=>s+v,0)/paces.length);
 if(a.obstacle&&a.obstacle.p<=-2)center+=1;
 center=Math.max(0,Math.min(4,center));
 const spread=Math.max(...paces)-Math.min(...paces);
 const confidence=paces.length>=2&&spread<=1?'high':paces.length>=2&&spread<=2?'mid':'low';
 return {unit,text:rangeText(unit,center,confidence),center};
}

function slots(a:ReturnType<typeof analyse>){
 const ob=a.obstacle?obsTheme(a.obstacle.voice,a.obstacle.cls):OBS[a.items[0].cls];
 const w1=WANT[a.items[0].cls];const w2=a.items[1]?WANT[a.items[1].cls]:WANT[a.items[0].cls];
 return {obs:ob,obs2:josa(ob,'이에요','예요'),want:w1,want2:w2===w1?'오래가는 신뢰':w2,want2c:josa(w2===w1?'오래가는 신뢰':w2,'이에요','예요')};
}

export function koAnswer(ds:Draw[],id:string){
 const a=analyse(ds,id);const verdict=fill(a.m.verdicts[a.level],slots(a));
 const t=timingFor(a);
 return t&&t.center!==null?`${verdict} 시기는 ${UNITS[t.unit][t.center]} 안팎을 중심으로 봐요.`:verdict;
}

export function koCardSections(ds:Draw[],id:string,index:number){
 const a=analyse(ds,id);const used=new Set<string>();
 // Earlier cards claim their sentences first so later duplicates can fall back.
 let out:{title:string;text:string}[]=[];
 for(const x of a.items){
  const v=VOICES[x.voice][x.cls];const key=x.role==='o'?'o':x.role==='a'?'a':'s';
  const nm=x.d.card.name;const extra=[`${j(nm,'도','도')} 앞의 카드와 같은 ${j(NOUN[x.cls],'을','를')} 보여 줘요.`,`같은 신호가 겹쳐 나온 만큼, 이 부분이 이번 리딩에서 특히 중요해요.`,`앞에서 정한 행동을 한 번 더 확인하는 카드로 받아들이세요.`];
  const pick=(slot:number,...c:string[])=>{const f=c.find(s=>!used.has(s))??extra[slot];used.add(f);return f};
  const claim=x.role==='past'?`처음 이 관계를 이끈 건 ${NOUN[x.cls]}${josa(NOUN[x.cls],'이에요','예요')}.`:x.role==='next'?`앞으로 이 관계는 ${NOUN[x.cls]} 쪽으로 가요.`:pick(0,v[key][0],v.a[0]);
  const apply=x.role==='past'?(x.p>0?'그때 쌓인 좋은 감정이 지금도 관계를 받쳐 주고 있어요.':x.p<0?'그때 생긴 어려움이 지금 관계에도 흔적을 남기고 있어요.':'그때의 분위기가 지금 관계의 출발점이 되었어요.'):x.role==='next'?pick(1,v.a[1],v.s[1]):pick(1,v[key][1],v.a[1]);
  const act=x.role==='next'?pick(2,v.a[2],v.s[2]):pick(2,v[key][2],v.a[2]);
  const [up,,image]=CARDS[x.d.card.id];
  const why=v.w.split('카드라서, ');const pic=`${x.d.card.name}에는 ${j(image,'이','가')} 그려져 있어요.`;const flip=x.d.reversed&&up!==x.cls?` 역방향으로 나와서 ‘${x.d.card.keyword}’의 힘이 막히거나 뒤집힌 상태로 봐요.`:'';
  const repeatWhy=x.role!=='o'&&x.role!=='a'&&used.has(v.w);used.add(v.w);
  const tail=`앞의 카드와 같은 ${NOUN[x.cls]} 쪽 카드라서, 같은 판단에 무게를 한 번 더 실어 줘요.`;const third=repeatWhy&&used.has(tail);if(repeatWhy)used.add(tail);const again=`${pic}${flip} ${tail}`;
  const evidence=repeatWhy?(third?`${pic}${flip} 세 장이 모두 ${NOUN[x.cls]} 쪽이라, 이번 리딩이 가리키는 방향은 분명해요.`:again):x.role==='o'
   ?`${pic}${flip} 걸림돌 자리에 나온 ${j(NOUN[x.cls],'은','는')} 여기서 ${j(TOPIC[x.voice],'을','를')} 가로막는 ${j(obsTheme(x.voice,x.cls),'으로','로')} 작용해요.`
   :x.role==='a'
   ?`${pic}${flip} 조언 자리에 나왔기 때문에, ${TOPIC_AT[x.voice]} ${j(DO[x.cls],'이','가')} 필요하다는 근거로 읽어요.`
   :x.d.reversed&&up!==x.cls
   ?`${x.d.card.name}에는 ${j(image,'이','가')} 그려져 있어요. 역방향으로 나와서 ‘${x.d.card.keyword}’의 힘이 막히거나 뒤집힌 상태로 봐요. 그래서 ${why[1]??v.w}`
   :`${x.d.card.name}에는 ${j(image,'이','가')} 그려져 있어요. ${x.d.reversed&&up===x.cls?'역방향이라 이 힘이 겉으로 덜 드러나지만 방향은 같아요. ':''}${v.w}`;
  if(x.i===index)out=[
   {title:'질문에 대한 한 줄 답',text:claim},
   {title:'카드에 근거한 설명',text:evidence},
   {title:'관계에 적용',text:apply},
   {title:'종합 조언',text:act},
  ];
 }
 return out;
}

export function koSummary(ds:Draw[],id:string,prompt:string){
 const a=analyse(ds,id);const n=(k:number)=>a.items[k].d.card.name;const sign=(k:number)=>a.items[k].p>0;
 let lead:string;
 if(a.items.length===1){lead=`카드가 한 장이라 ${n(0)}의 ${j(NOUN[a.items[0].cls],'이','가')} 이번 답의 유일한 근거예요. 세부 사정보다 지금의 큰 방향을 참고하세요.`}
 else if(a.outcome){
  const c=a.items[1],o=a.items[2];const arc=o.p>0&&c.p>0?ARC.up:o.p>0?ARC.recover:c.p>0&&o.p<0?ARC.fall:o.p<0?ARC.down:ARC.open;
  const start=a.items[0].role==='past'?(a.items[0].p>0?`${n(0)}${josa(n(0),'을','를')} 보면 처음엔 좋았던 관계예요. `:`${n(0)}${josa(n(0),'을','를')} 보면 처음부터 쉽지는 않았던 관계예요. `):`${j(n(0),'을','를')} 보면 두 사람의 바탕에는 ${j(NOUN[a.items[0].cls],'이','가')} 있어요. `;
  lead=`${start}지금은 ${n(1)}의 ${NOUN[c.cls]}, 앞으로는 ${n(2)}의 ${NOUN[o.cls]} 쪽이에요. ${arc}`;
 }else{
  const op=a.obstacle?a.obstacle.p>0:false;
  const cons=!a.obstacle?PAIR[(sign(0)?0:2)+(sign(1)?0:1)]:a.level===3?CONS[a.m.type][3]:a.level<=1?CONS[a.m.type][op?0:1]:sign(0)?CONS[a.m.type][1]:op?CONS[a.m.type][2]:MID[a.m.type];
  lead=`${j(n(0),'은','는')} ${j(NOUN[a.items[0].cls],'을','를')}, ${a.obstacle?'걸림돌 자리의 ':''}${j(n(1),'은','는')} ${j(a.obstacle?obsTheme(a.obstacle.voice,a.obstacle.cls):NOUN[a.items[1].cls],'을','를')} 보여 줘요. ${cons}${a.items[2]?(a.level>=2&&a.level<=3&&a.items[2].p>0&&['ACT','TRUTH','WARM','TURN'].includes(a.items[2].cls)?` 다만 마지막 ${j(n(2),'은','는')} ${j(DO[a.items[2].cls],'을','를')} 권해요. 크게 움직이기보다 작게 시도해 보라는 뜻으로 받아들이세요.`:a.level<=1&&a.items[2].p<0?` 다만 마지막 ${j(n(2),'은','는')} ${j(DO[a.items[2].cls],'을','를')} 권해요. 서두르지 말라는 신호로 함께 기억하세요.`:` 마지막 ${j(n(2),'은','는')} 그 사이에서 ${j(DO[a.items[2].cls],'을','를')} 권해요.`):''}`;
 }
 const t=timingFor(a);
 const ot=a.obstacle?obsTheme(a.obstacle.voice,a.obstacle.cls):'';const cond=a.obstacle?`결과를 바꿀 수 있는 가장 큰 변수는 ${a.obstacle.d.card.name}에 담긴 ${ot}${josa(ot,'이에요','예요')}. ${COND_IF[a.m.type]}`:'';
 return {answer:koAnswer(ds,id),lead,body:[t?.text,cond].filter(Boolean).join(' '),action:prompt,level:a.level};
}
