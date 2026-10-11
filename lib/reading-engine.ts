// Korean question-first reading engine.
// Chain: card semantic core → position role → question type → situation. The question may apply a card,
// never overwrite it: every card's own core (lib/card-cores.ts) appears in its evidence, obstacle and advice.
// Verdict, card evidence, synthesis and action are derived from the same analysis so they point the same way.
import type {Draw} from './tarot';
import {CONTACT,RECONCILE,FEELINGS,PROGRESS} from './reading-voice-partner';
import {DECISION,LETGO,SELF} from './reading-voice-self';
import {CORES} from './card-cores';
import {PRACTICE} from './card-practice';

export type Cls='ACT'|'WARM'|'PAST'|'WAIT'|'FOG'|'CONFLICT'|'END'|'BUILD'|'HEAL'|'BIND'|'TURN'|'TRUTH'|'EXPECT';
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
// 으로/로: 로 after a vowel or ㄹ.
const ro=(w:string)=>{const c=w.slice(-1).charCodeAt(0)-0xac00;return w+(c>=0&&c<=11171&&c%28&&c%28!==8?'으로':'로')};
// Template slots: {name} or {name|이/가} → value plus the matching particle.
function fill(t:string,v:Record<string,string>){return t.replace(/\{(\w+)(?:\|([^/}]+)\/([^}]+))?\}/g,(_,k,a,b)=>a?j(v[k]??'',a,b):(v[k]??''))}

const WANT:Record<Cls,string>={ACT:'함께 도전하는 즐거움',WARM:'다정한 애정 표현',PAST:'오래 쌓인 추억',WAIT:'서로의 속도를 기다려 주는 여유',FOG:'설렘과 신비로움',CONFLICT:'솔직하게 부딪히고 푸는 대화',END:'서로의 독립을 지키는 거리',BUILD:'안정과 신뢰',HEAL:'편안한 위로',BIND:'깊은 몰입',TURN:'함께 변해 가는 경험',TRUTH:'솔직한 대화',EXPECT:'현실적인 기대'};

const BASE:Record<Cls,number>={ACT:2,WARM:2,PAST:1,WAIT:0,FOG:-1,CONFLICT:-2,END:-2,BUILD:1,HEAL:1,BIND:-1,TURN:1,TRUTH:1,EXPECT:-1};
const POL:Record<TypeKey,Record<Cls,number>>={
 CONTACT:BASE,FEELINGS:BASE,PROGRESS:BASE,
 RECONCILE:{...BASE,PAST:2,END:-3},
 DECISION:{...BASE,TRUTH:2,WAIT:-1,CONFLICT:-1,PAST:0},
 // Wait-or-let-go: positive means letting go is the better choice. Memories (PAST) and expectations (EXPECT)
 // are holding the user rather than the partner, so they point toward letting go; remaining warmth points toward waiting.
 LETGO:{ACT:1,WARM:-2,PAST:1,WAIT:0,FOG:0,CONFLICT:1,END:2,BUILD:1,HEAL:1,BIND:1,TURN:1,TRUTH:1,EXPECT:1},
 SELF:{ACT:2,WARM:2,PAST:-1,WAIT:0,FOG:-1,CONFLICT:-1,END:1,BUILD:1,HEAL:1,BIND:-2,TURN:1,TRUTH:1,EXPECT:-1},
};
const SLOW:Cls[]=['WAIT','HEAL','BUILD','PAST','BIND'];

type Pos={role:Role;voice?:TypeKey};
type Meta={type:TypeKey;pos:Pos[];verdicts:[string,string,string,string,string];labels?:[string,string,string,string,string]|null;unit?:Unit};
const P=(...roles:(Role|[Role,TypeKey])[]):Pos[]=>roles.map(r=>Array.isArray(r)?{role:r[0],voice:r[1]}:{role:r});
const SOA=P('s','o','a');
// What the verdict level means for each question type, shown next to the answer heading.
const LABELS:Record<TypeKey,[string,string,string,string,string]>={
 CONTACT:['가능성 높음','가능성 있음 · 시간이 걸림','조건부','가능성 낮음','판단 보류'],
 RECONCILE:['가능성 높음','가능성 있음 · 시간이 걸림','조건부','가능성 낮음','판단 보류'],
 FEELINGS:['마음이 있는 쪽','마음은 있지만 조심스러움','엇갈리는 마음','마음이 약한 쪽','아직 알 수 없음'],
 PROGRESS:['발전 가능성 높음','천천히 발전','조건부','발전 어려움','판단 보류'],
 DECISION:['움직여도 좋아요','조금 기다렸다가','조건부','지금은 멈춤','판단 보류'],
 LETGO:['놓아주는 쪽','천천히 정리','기한을 두고 판단','조금 더 지켜볼 쪽','판단 보류'],
 SELF:['좋은 때','천천히','조건부','지금은 쉬어 갈 때','판단 보류'],
};

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
 'ex-silence':{type:'LETGO',pos:SOA,labels:['다시 열릴 가능성 낮음','시간이 필요한 침묵','조건부','아직 닫히지 않음','판단 보류'],verdicts:[
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
  '지금 당장 더 기다리라고 보기는 어려워요. 다만 완전히 정리하기 전에, 상대의 실제 행동을 확인할 짧은 기한을 두는 편이 나아요.',
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
 'repair':{labels:null,type:'RECONCILE',pos:SOA,verdicts:[
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
 'our-direction':{type:'PROGRESS',pos:P('s','now','next'),unit:'PROGRESS',verdicts:[
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
 'new-love':{type:'SELF',pos:SOA,labels:['준비됨','거의 준비됨','조건부','아직 쉬어 갈 때','판단 보류'],verdicts:[
  '네, 새 연애를 시작할 준비가 됐어요. 마음의 여유도, 새 사람을 받아들일 힘도 충분해요.',
  '거의 준비됐어요. 다만 지난 감정을 마저 정리할 시간이 조금 더 있으면 좋아요.',
  '새 연애를 원하는 마음은 있지만 아직 돌봐야 할 감정이 남아 있어요. 그 부분을 알고 시작하면 괜찮아요.',
  '지금은 새 연애보다 나를 먼저 챙길 때예요. 아직 지난 일의 영향이 커서 새 관계에 온전히 마음을 쓰기 어려워요.',
  '준비가 됐는지 스스로도 확신이 없는 상태예요. 연애를 원하는 이유부터 차분히 정리해 보세요.']},
 'love-pattern':{labels:null,type:'SELF',pos:SOA,verdicts:[
  '반복의 원인은 크지 않아요. {obs|이/가} 가끔 같은 선택으로 이끌 뿐, 바꿀 힘은 이미 충분해요.',
  '반복의 뿌리는 {obs}에 있어요. 알아차리기 시작했으니 천천히 다른 선택을 늘려 가면 돼요.',
  '같은 일이 반복되는 건 {obs} 때문이에요. 끌리는 사람의 유형보다 내가 관계에서 반복하는 행동을 봐야 해요.',
  '같은 일이 되풀이되는 핵심 원인은 {obs}{obs2}. 이 패턴을 알아차리지 못하면 상대가 바뀌어도 같은 지점에서 힘들어질 수 있어요.',
  '반복의 원인이 아직 스스로에게도 잘 보이지 않아요. 지난 관계들의 공통점을 하나씩 적어 보는 게 출발점이에요.']},
 'new-connection':{labels:null,type:'SELF',pos:SOA,verdicts:[
  '지금은 만남의 기회를 적극적으로 늘리면 좋은 때예요. 움직이는 만큼 결과가 따라와요.',
  '서두르기보다 생활 반경을 조금씩 넓히는 게 맞아요. 만남은 익숙한 곳에서 천천히 생겨요.',
  '만남의 기회는 있지만 {obs|이/가} 발목을 잡아요. 그 습관 하나만 바꿔도 만남이 훨씬 쉬워져요.',
  '지금은 새 사람을 찾기보다 {obs}부터 풀어야 해요. 그 상태로는 만남이 생겨도 이어지기 어려워요.',
  '어떤 만남을 원하는지부터 정리가 필요해요. 방향이 정해지면 어디서 만날지도 분명해져요.']},
 'healthy-love':{labels:null,type:'SELF',pos:P('s','s','a'),verdicts:[
  '{want|이/가} 살아 있는 관계가 잘 맞아요. 여기에 {want2|이/가} 받쳐 주면 오래 편안할 수 있어요.',
  '{want|이/가} 중심이 되는 관계가 맞아요. 서두르기보다 {want2|을/를} 천천히 쌓아 가는 연애가 편해요.',
  '{want|을/를} 원하면서도 {want2|을/를} 함께 바라는 마음이 있어요. 두 가지를 다 채워 주는 관계가 맞아요.',
  '지금 끌리는 관계와 실제로 맞는 관계가 다를 수 있어요. 나에게 필요한 건 {want}, 그리고 {want2}{want2c}.',
  '어떤 사랑이 맞는지 아직 찾는 중이에요. 다만 {want|이/가} 중요한 기준이 될 거예요.']},
 'daily':{type:'SELF',pos:P('s'),labels:['밀고 나갈 날','쉬어 갈 날','조심할 일이 섞인 날','나를 지킬 날','판단을 미룰 날'],verdicts:[
  '오늘은 마음먹은 일을 밀고 나가기 좋은 날이에요. 미뤄 둔 연락이나 계획이 있다면 오늘 움직여 보세요.',
  '오늘은 서두르지 말고 한 박자 쉬어 가는 게 좋아요. 결과보다 준비에 시간을 쓰세요.',
  '좋은 일과 신경 쓰이는 일이 같이 오는 날이에요. 중요한 결정은 하나만 하세요.',
  '오늘은 부딪히는 일을 피하고 나를 지키는 데 집중하세요. 기분이 상하는 말에 바로 답하지 않는 게 좋아요.',
  '오늘은 확실하지 않은 일에 결론을 내리지 않는 게 좋아요. 판단은 내일로 미뤄도 괜찮아요.']},
 'yes-no':{type:'DECISION',pos:P('s'),labels:['예','예 · 조금 뒤에','조건부 예','아니오','판단 보류'],verdicts:[
  '예에 가까워요. 지금 움직이는 쪽에 힘이 실려 있어요.',
  '예에 가깝지만 지금 당장은 아니에요. 조금 기다렸다 움직이세요.',
  '조건부 예예요. 걸리는 부분을 먼저 확인한 뒤라면 괜찮아요.',
  '아니오에 가까워요. 지금은 하지 않는 편이 나아요.',
  '아직 판단하기 어려워요. 정보를 조금 더 모은 뒤 다시 보세요.']},
};


// One-line answer for the obstacle card: the card's own obstacle, framed by what it blocks for this question type.
const OBS_FRAME:Record<TypeKey,string>={CONTACT:'연락을 늦추는 건',RECONCILE:'다시 가까워지는 걸 막는 건',FEELINGS:'상대 마음을 가리는 건',PROGRESS:'관계가 한 단계 나아가지 못하는 이유는',DECISION:'움직이기 전에 조심할 건',LETGO:'정리를 어렵게 하는 건',SELF:'지금 발목을 잡는 건'};
const ADV_AT:Record<TypeKey,string>={CONTACT:'연락을 두고는',RECONCILE:'재회를 두고는',FEELINGS:'상대 마음을 두고는',PROGRESS:'이 관계를 두고는',DECISION:'이번 결정에서는',LETGO:'기다림을 두고는',SELF:'새 출발을 앞두고는'};
// Synthesis pieces by question type. Structure is chosen by verdict level and how the cards relate, not at random.
const POS:Record<TypeKey,string>={CONTACT:'연락이 오는 쪽에 힘을 실어 줘요.',RECONCILE:'다시 이어질 바탕이 돼요.',FEELINGS:'상대 마음이 나를 향해 있다는 쪽으로 읽혀요.',PROGRESS:'관계를 앞으로 끌고 가요.',DECISION:'움직여도 된다는 쪽에 무게를 실어요.',LETGO:'이제 정리해도 된다는 쪽으로 기울어요.',SELF:'새로 시작할 힘이 돼요.'};
const DRAG:Record<TypeKey,string>={CONTACT:'시간을 끌게 할 수 있어요.',RECONCILE:'재회를 늦출 수 있어요.',FEELINGS:'마음이 겉으로 드러나는 걸 늦추고 있어요.',PROGRESS:'속도를 늦추고 있어요.',DECISION:'지금 바로 움직이기엔 부담이 될 수 있어요.',LETGO:'정리를 조금 더디게 해요.',SELF:'시작을 조금 늦출 수 있어요.'};
const MIXPOS:Record<TypeKey,string>={CONTACT:'연락할 마음은 남아 있어요',RECONCILE:'다시 만날 마음은 남아 있어요',FEELINGS:'마음은 분명히 있어요',PROGRESS:'관계를 원하는 마음은 있어요',DECISION:'움직이고 싶은 이유는 충분해요',LETGO:'정리할 이유는 충분해요',SELF:'시작할 힘은 있어요'};
const MIDTAIL:Record<TypeKey,string>={CONTACT:'걸림돌을 어떻게 다루느냐에 따라 연락 여부가 갈려요.',RECONCILE:'어느 쪽으로 기울지는 앞으로의 대화에 달려 있어요.',FEELINGS:'확인되는 행동이 나와야 마음을 판단할 수 있어요.',PROGRESS:'한 번의 솔직한 대화가 방향을 정해 줄 거예요.',DECISION:'서두를 필요 없는 결정이에요.',LETGO:'기준을 먼저 정하면 답이 보여요.',SELF:'내가 원하는 걸 먼저 정리하는 게 순서예요.'};
const LOW:Record<TypeKey,string>={CONTACT:'지금은 연락을 기대하며 기다리기 어려운 상황이에요.',RECONCILE:'재회보다 정리가 자연스러운 상황이에요.',FEELINGS:'지금은 상대 마음을 기대하기 어려워요.',PROGRESS:'지금 형태로는 관계가 나아가기 어려워요.',DECISION:'지금 움직이면 상처만 남기 쉬워요.',LETGO:'지금 당장 놓기는 어려워요.',SELF:'지금은 시작보다 회복이 먼저예요.'};
const FOGT:Record<TypeKey,string>={CONTACT:'상대가 실제로 움직이는지를 기준으로 보세요.',RECONCILE:'두 사람 모두 마음이 정리될 시간이 더 필요해요.',FEELINGS:'추측보다 실제로 오간 말과 행동을 기준으로 보세요.',PROGRESS:'관계를 정하기 전에 서로의 생각부터 확인해야 해요.',DECISION:'마음이 분명해질 때까지 결정을 미뤄도 괜찮아요.',LETGO:'기다릴지 놓을지는 상대의 다음 행동을 보고 정해도 늦지 않아요.',SELF:'원하는 사랑이 무엇인지부터 정리해 보세요.'};
const ARC={up:'지금의 좋은 점이 앞으로도 이어지는 관계예요.',recover:'어려운 구간을 지나면 회복 쪽으로 갈 수 있는 관계예요. 지금의 갈등을 끝이라고 단정하지 마세요.',fall:'좋은 분위기가 끝까지 이어진다고 보긴 어려워요. 좋은 분위기만 믿고 문제를 미루면 뒤에서 크게 흔들릴 수 있어요.',down:'지금의 어려움이 앞으로도 이어질 수 있어요. 방향을 바꾸려면 지금 바로 무언가 달라져야 해요.',open:'앞으로의 방향은 지금 어떤 선택을 하느냐에 달려 있어요.'};

// Timing — UNTOLD's own editorial convention, not a traditional tarot rule (see docs/TIMING_READING_RULES.md).
// Each card gets a pace from its reading class, adjusted by suit (wands faster, pentacles slower) and orientation
// (reversed = one step slower); a heavy obstacle adds one step. Never dates, never calibrated probabilities.
export const UNITS:Record<Unit,[string,string,string,string,string]>={
 CONTACT:['며칠~1주','1~2주','2~4주','1~2개월','2~3개월 이상'],
 RECONCILE:['2~4주','1~2개월','2~3개월','3~6개월','반년 이상'],
 PROGRESS:['1~2주','2~4주','1~2개월','2~3개월','3개월 이상'],
 NEWLOVE:['1~2개월','2~3개월','3~4개월','4~6개월','반년 이후'],
};
const EVENT:Record<Unit,string>={CONTACT:'연락',RECONCILE:'다시 대화가 열리는',PROGRESS:'관계가 한 단계 나아가는',NEWLOVE:'새 인연이 시작되는'};
const PACE:Record<Cls,number|null>={ACT:0,TRUTH:1,WARM:1,TURN:1,PAST:2,BUILD:2,HEAL:2,WAIT:3,BIND:3,CONFLICT:3,EXPECT:3,FOG:null,END:null};
export type Confidence='높음'|'보통'|'낮음';
export function rangeText(unit:Unit,center:number,confidence:Confidence,basis:string){
 const u=UNITS[unit][Math.max(0,Math.min(4,center))];
 return `${EVENT[unit]} 시기는 ${j(u,'이','가')} 가장 유력해요(시기 확신도 ${confidence}). ${basis}`.trim();
}

const coreOf=(d:Draw)=>CORES[d.card.id][d.reversed?1:0];
const clsOf=(d:Draw):Cls=>coreOf(d)[0];
const first=(d:Draw)=>coreOf(d)[1].split(', ')[0];
const label=(d:Draw)=>d.card.name+(d.reversed?' 역방향':'');
// Single-card daily and yes/no readings are not love questions: state the core without its love-only keywords
// (e.g. The Sun: "기쁨, 밝은 확신" instead of "기쁨, 솔직한 애정, 밝은 확신").
const LOVE_ONLY=/사랑|연애|연인|재회|상대|고백|애정|로맨틱/;
const plainCore=(d:Draw)=>{const all=coreOf(d)[1].split(', ');const kept=all.filter(k=>!LOVE_ONLY.test(k));return kept.length?kept:all};
const practiceOf=(d:Draw)=>PRACTICE[d.card.id][d.reversed?1:0];
// Questions about the reader's own life (waiting/letting go, new love, daily) take the card's advice turned toward the reader;
// relationship questions take the card's advice as written in card-cores.ts.
const SELFWARD:TypeKey[]=['LETGO','SELF'];
const actFor=(d:Draw,type:TypeKey)=>SELFWARD.includes(type)?practiceOf(d)[1]:coreOf(d)[3];
// Whether the card's core is something to lean on (true) or something to handle (false). Upright waiting and memory
// cards count as supportive except Four of Cups (apathy), Five of Cups (loss) and Two of Swords (avoidance).
const UNWANTED=[39,40,51];
function supportive(d:Draw){const c=clsOf(d);if(['ACT','WARM','BUILD','HEAL','TRUTH','TURN'].includes(c))return true;if(d.reversed)return false;return (c==='WAIT'||c==='PAST')&&!UNWANTED.includes(d.card.id)}
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
  const adv=advice&&(m.type==='DECISION'||m.type==='LETGO')?advice:null;
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
type Analysis=ReturnType<typeof analyse>;
// Exposed for the consistency gate (scripts/check-reading-consistency.cjs).
export function koAnalysis(ds:Draw[],id:string){const a=analyse(ds,id);return {level:a.level,type:a.m.type,items:a.items.map(x=>({role:x.role,cls:x.cls,p:x.p,core:coreOf(x.d)[1],obs:coreOf(x.d)[2],act:actFor(x.d,a.m.type),label:label(x.d),name:x.d.card.name,reversed:x.d.reversed,supportive:supportive(x.d)}))}}

function timingFor(a:Analysis){
 const unit=a.m.unit;if(!unit)return null;
 if(a.level===3)return {unit,text:`지금 흐름 그대로라면 ${EVENT[unit]} 시기를 말하기 어려워요.${a.obstacle?' 걸림돌이 먼저 풀려야 시기를 다시 볼 수 있어요.':''}`,center:null,confidence:null};
 if(a.level===4||a.primary.some(x=>x.cls==='END'))return {unit,text:`${EVENT[unit]} 시기도 지금 카드로는 흐릿해요. 날짜를 정해 두고 기다리기보다 실제 움직임이 생기는지를 기준으로 보세요.`,center:null,confidence:null};
 const paced=a.items.filter(x=>x.role!=='o'&&x.role!=='past').map(x=>{const base=PACE[x.cls];if(base===null)return null;const id=x.d.card.id;const suit=id>=22&&id<36?-1:id>=64?1:0;return {x,v:Math.max(0,Math.min(4,base+suit+(x.d.reversed?1:0)))}}).filter((v):v is {x:typeof a.items[number];v:number}=>v!==null);
 if(!paced.length)return {unit,text:`${EVENT[unit]} 시기를 좁힐 근거가 부족해요. 날짜보다 실제 움직임을 기준으로 보세요.`,center:null,confidence:null};
 const heavy=!!a.obstacle&&a.obstacle.p<=-2;
 const center=Math.max(0,Math.min(4,Math.round(paced.reduce((s,p)=>s+p.v,0)/paced.length)+(heavy?1:0)));
 const vs=paced.map(p=>p.v);const spread=Math.max(...vs)-Math.min(...vs);
 const confidence:Confidence=paced.length>=2&&spread<=1?'높음':paced.length>=2&&spread<=2?'보통':'낮음';
 const speed=(v:number)=>v<=1?'빠른':v===2?'중간 속도의':'느린';
 const names=(ps:typeof paced)=>ps.map(p=>label(p.x.d)).join(', ');
 const words=[...new Set(paced.map(p=>speed(p.v)))];
 let basis=words.length===1?`${paced.length>1?j(names(paced),'은','는')+' 모두':j(names(paced),'은','는')} ${words[0]} 카드예요.`:`${j(names(paced.filter(p=>p.v<=1)),'은','는')||''} 빠르고 ${j(names(paced.filter(p=>p.v>=2)),'은','는')} 느린 편이라 속도가 엇갈려요.`;
 if(words.length>1&&!paced.some(p=>p.v<=1))basis=`${names(paced)}의 속도가 서로 달라요.`;
 if(heavy)basis+=` 걸림돌인 ${j(label(a.obstacle!.d),'이','가')} 무거워서 한 단계 늦춰 봤어요.`;
 return {unit,text:rangeText(unit,center,confidence,basis),center,confidence};
}

function slots(a:Analysis){
 const ob=a.obstacle?coreOf(a.obstacle.d)[2]:coreOf(a.items[0].d)[2];
 const w1=WANT[a.items[0].cls];const w2raw=a.items[1]?WANT[a.items[1].cls]:w1;const w2=w2raw===w1?'오래가는 신뢰':w2raw;
 return {obs:ob,obs2:josa(ob,'이에요','예요'),want:w1,want2:w2,want2c:josa(w2,'이에요','예요')};
}

export function koLabel(ds:Draw[],id:string){const a=analyse(ds,id);const l=a.m.labels===undefined?LABELS[a.m.type]:a.m.labels;return l?l[a.level]:''}

// Daily answer: the card's own picture of the day, then one closing tone from the verdict level.
const DAILY_TONE=['마음먹은 일은 미루지 말고 밀고 나가 보세요.','서두르지 말고 한 박자 쉬어 가세요.','좋은 일과 신경 쓰이는 일이 섞여 있으니 중요한 결정은 하나만 하세요.','부딪히는 일은 피하고 나를 지키는 데 마음을 쓰세요.','확실하지 않은 일은 결론을 미뤄 두세요.'];
export function koAnswer(ds:Draw[],id:string){
 const a=analyse(ds,id);
 if(id==='daily'){const scene=practiceOf(a.items[0].d)[0];return `${scene.endsWith('때예요.')?'오늘은 ':''}${scene} ${DAILY_TONE[a.level]}`}
 if(id==='healthy-love'){
  const [c0,c1]=a.items.map(x=>x.d);const has=(d:Draw)=>supportive(d)?`${j(first(d),'이','가')} 있는`:`${j(coreOf(d)[2],'이','가')} 없는`;
  return `나에게 맞는 사랑은 ${has(c0)} 관계예요. ${has(c1).replace(/ 있는$/,' 있을').replace(/ 없는$/,' 없을')} 때 그 관계가 오래 편안할 수 있어요.`;
 }
 const verdict=fill(a.m.verdicts[a.level],slots(a));
 const t=timingFor(a);
 return t&&t.center!==null?`${verdict} 가장 유력한 시기는 ${UNITS[t.unit][t.center]}${josa(UNITS[t.unit][t.center],'이에요','예요')}(확신도 ${t.confidence}).`:verdict;
}

// "…다는 근거가 돼요." → "…다고 봐요." so evidence reads as a reader's judgment, not a formula.
const judge=(w:string)=>{const tail=w.split('카드라서, ')[1];if(!tail)return w;return '그래서 '+tail.replace(/다는 (재회의 )?근거(가 돼요|로 읽혀요)\.$/,'다고 봐요.').replace(/라는 근거가 돼요\.$/,'라고 봐요.').replace(/거라는 근거로 읽혀요\.$/,'거라고 봐요.')};

// "~하는 것" advice phrase → polite imperative, including the irregular verbs used in card-cores.ts.
function imperative(act:string){
 if(act.endsWith('지 않는 것'))return act.slice(0,-6)+'지 마세요';
 if(act.endsWith('갖는 것'))return act.slice(0,-4)+'가지세요';
 if(act.endsWith('묻는 것'))return act.slice(0,-4)+'물어보세요';
 if(act.endsWith('듣는 것'))return act.slice(0,-4)+'들으세요';
 const m=act.match(/^(.*)(\S)는 것$/);if(!m)return act;
 return m[1]+m[2]+((m[2].charCodeAt(0)-0xac00)%28===0?'세요':'으세요');
}

// Card sections. Every line is built from the card's own core and practice entry; the reading class only picks the
// one-line answer and the judgment bridge for the main positions. Obstacle and advice lines follow the verdict level,
// so a positive verdict never sits next to an obstacle that "blocks" or advice that says to stop.
const APPLY_AT:Record<TypeKey,string>={CONTACT:'연락 문제로 보면,',RECONCILE:'두 사람 사이로 보면,',FEELINGS:'상대의 태도로 보면,',PROGRESS:'지금 관계로 보면,',DECISION:'지금 내 상태로 보면,',LETGO:'지금 내 마음으로 보면,',SELF:'지금의 나로 보면,'};
// Who a main position describes, so each card's own trait reads as the one-line answer.
const SUBJ:Record<TypeKey,string>={CONTACT:'그 사람은',FEELINGS:'상대는',RECONCILE:'두 사람은',PROGRESS:'지금 두 사람은',DECISION:'움직이려는 나는',LETGO:'기다리는 나는',SELF:'지금의 나는'};
const SUBJ_BY_ID:Record<string,string>={'contact-flow':'두 사람은'};
const OBS_HARD:Record<TypeKey,string>={CONTACT:'{obs|이/가} 풀리지 않는 동안에는 연락할 이유보다 미룰 이유가 더 크게 느껴져요.',RECONCILE:'{obs|이/가} 그대로라면 다시 만나도 같은 자리에서 멈추기 쉬워요.',FEELINGS:'{obs} 때문에 마음이 있어도 겉으로는 잘 드러나지 않아요.',PROGRESS:'{obs|이/가} 남아 있는 동안에는 관계를 정하자는 말이 자연스럽게 나오기 어려워요.',DECISION:'{obs|이/가} 정리되지 않은 채 움직이면 원하는 반응을 얻기 어려워요.',LETGO:'{obs|이/가} 이어지는 동안에는 기다릴지 놓을지 결정하는 일도 미뤄지기 쉬워요.',SELF:'{obs|이/가} 그대로라면 새로운 시작도 같은 지점에서 막히기 쉬워요.'};
const OBS_SOFT:Record<TypeKey,string>={CONTACT:'{obs|은/는} 연락을 막을 정도는 아니고, 시기를 조금 늦출 수 있는 정도예요.',RECONCILE:'{obs|은/는} 재회를 막을 정도는 아니고, 다시 가까워지는 속도를 늦추는 정도예요.',FEELINGS:'{obs|은/는} 마음을 가릴 정도는 아니고, 표현을 조금 늦추는 정도예요.',PROGRESS:'{obs|은/는} 관계를 막을 정도는 아니고, 속도를 조금 늦추는 정도예요.',DECISION:'{obs|은/는} 움직임을 막을 정도는 아니고, 서두르지 않게 붙잡아 주는 정도예요.',LETGO:'{obs|은/는} 정리를 막을 정도는 아니고, 조금 더디게 하는 정도예요.',SELF:'{obs|은/는} 시작을 막을 정도는 아니고, 속도를 조금 늦추는 정도예요.'};
// Lead-ins for the obstacle card's own advice: while the obstacle decides the answer, and while it only slows things down.
const OBS_FIX:Record<TypeKey,string>={CONTACT:'연락을 기다리는 동안에는',RECONCILE:'재회를 생각하는 동안에는',FEELINGS:'상대 마음이 잘 보이지 않을 때는',PROGRESS:'관계를 정하기 전까지는',DECISION:'움직이기 전에',LETGO:'어느 쪽으로 정하든',SELF:'새로 시작하기 전에'};
const OBS_EASE:Record<TypeKey,string>={CONTACT:'연락이 오가기 시작하면',RECONCILE:'다시 가까워지는 과정에서는',FEELINGS:'마음을 확인해 가는 동안에는',PROGRESS:'관계를 키워 가면서',DECISION:'움직이더라도',LETGO:'정리하는 동안에는',SELF:'새로 시작하면서도'};
const ADV_SCOPE:Record<TypeKey,string>={CONTACT:'연락 문제에서',RECONCILE:'재회 문제에서',FEELINGS:'상대 마음을 알아 가는 과정에서',PROGRESS:'관계를 정하는 과정에서',DECISION:'이번 결정에서',LETGO:'기다림에 답을 내리는 과정에서',SELF:'새 출발을 준비하는 과정에서'};
// The advice position is always about the reader's side, whoever the question is about.
const ADV_ME:Record<TypeKey,string>={CONTACT:'연락을 앞둔 내 쪽에서 보면,',RECONCILE:'다시 만나려는 내 쪽에서 보면,',FEELINGS:'상대 마음보다 내 쪽에서 보면,',PROGRESS:'관계를 정하려는 내 쪽에서 보면,',DECISION:'지금 내 상태로 보면,',LETGO:'지금 내 마음으로 보면,',SELF:'지금의 나로 보면,'};
// Lead-ins for the advice card's concrete step toward the other person (relationship questions).
const RSTEP_AT:Record<TypeKey,string>={CONTACT:'연락과 관련해서는',RECONCILE:'재회와 관련해서는',FEELINGS:'상대 마음과 관련해서는',PROGRESS:'관계를 정하는 일에서는',DECISION:'이번에는',LETGO:'',SELF:''};
const STEP_AT:Record<TypeKey,string>={CONTACT:'연락을 기다리는 동안',RECONCILE:'다시 만나기 전에',FEELINGS:'상대 마음을 짐작하기 전에',PROGRESS:'관계를 정하기 전에',DECISION:'결정하기 전에',LETGO:'마음을 정리하는 동안',SELF:'새 출발을 준비하며'};
const YESNO_ACT=['망설임이 길어지기 전에 정한 쪽으로 첫걸음을 떼 보세요.','방향은 맞지만 때를 조금 기다리는 편이 좋아요.','걸리는 조건 하나를 먼저 확인하고 나서 움직이세요.','지금은 멈추고, 상황이 달라진 뒤에 다시 물어보세요.','정보를 하나 더 모은 뒤에 다시 판단하세요.'];
const MOVING:Cls[]=['ACT','TRUTH','WARM','TURN'];

export function koCardSections(ds:Draw[],id:string,index:number){
 const a=analyse(ds,id);const used=new Set<string>();const type=a.m.type;
 let out:{title:string;text:string}[]=[];
 for(const x of a.items){
  const v=VOICES[x.voice][x.cls];
  const [,core,obs]=coreOf(x.d);const [scene,self,step,rstep,trait]=practiceOf(x.d);
  const act=actFor(x.d,type),imp=imperative(act),f=first(x.d),sup=supportive(x.d);
  const meaning=`${j(label(x.d),'은','는')} ${j(core,'을','를')} 뜻해요.`;
  const plainMeaning=`${j(label(x.d),'은','는')} ${j(plainCore(x.d).join(', '),'을','를')} 뜻해요.`;
  const extra=['같은 신호가 겹쳐 나온 만큼, 이 부분이 이번 리딩에서 특히 중요해요.','앞에서 정한 행동을 한 번 더 확인하는 카드로 받아들이세요.'];
  const pick=(slot:number,...c:string[])=>{const s=c.find(t=>!used.has(t))??extra[slot];used.add(s);return s};
  let sections:[string,string][];
  if(id==='daily'){
   // The answer above already names what to pay attention to today; the card section shows why and one step.
   sections=[['카드에 근거한 설명',`${plainMeaning} 그래서 오늘 신경 쓸 건 ${self}${josa(self,'이에요','예요')}.`],['오늘에 적용',`오늘 안에 ${step}`]];
  }else if(id==='yes-no'){
   sections=[['질문에 대한 한 줄 답',`카드가 가리키는 쪽은 ${self}${josa(self,'이에요','예요')}.`],['카드에 근거한 설명',`${plainMeaning} ${scene}`],['상황에 적용',`${STEP_AT.DECISION} ${step}`],['종합 조언',YESNO_ACT[a.level]]];
  }else if(x.role==='o'){
   const soft=a.level<=1,at=`${ADV_SCOPE[x.voice]}는`;
   sections=[
    ['질문에 대한 한 줄 답',`${OBS_FRAME[x.voice]} ${obs}${josa(obs,'이에요','예요')}.`],
    ['카드에 근거한 설명',`${meaning} ${fill(soft?OBS_SOFT[x.voice]:OBS_HARD[x.voice],{obs})}`],
    ['관계에 적용',!soft&&sup?`${at} 이 카드의 좋은 면이 지나쳐서 ${ro(obs)} 나타나고 있어요.`:soft&&sup?`${at} 오히려 ${scene}`:`${at} ${scene}`],
    ['종합 조언',`${soft?OBS_EASE[x.voice]:OBS_FIX[x.voice]} ${imp}.`],
   ];
  }else if(x.role==='a'){
   const p=x.p,moving=MOVING.includes(x.cls)&&p>0;
   // "What love suits me" asks for a standard to keep, not a fresh start.
   const hl=id==='healthy-love';
   const claim=hl?`놓치지 말아야 할 기준은 ${act}${josa(act,'이에요','예요')}.`
    :a.level===2&&moving?`${ADV_AT[x.voice]} 부담 없는 선에서 ${imp}.`
    :a.level===3&&moving?`${ADV_AT[x.voice]} 지금 당장보다는 때를 봐서 ${imp}.`
    :a.level<=1&&p<0?`${ADV_AT[x.voice]} 서두르기 전에 먼저 ${imp}.`
    :`${ADV_AT[x.voice]} ${imp}.`;
   const stepText=SELFWARD.includes(type)?`${hl?'나에게 맞는 사랑을 찾는 동안':STEP_AT[x.voice]} ${step}`
    :`${RSTEP_AT[x.voice]} ${a.level===3&&moving?'때가 오면 ':''}${rstep}`;
   sections=[['질문에 대한 한 줄 답',claim],['카드에 근거한 설명',`${meaning} ${ADV_ME[x.voice]} ${scene}`],['관계에 적용',stepText]];
  }else if(id==='healthy-love'||(id==='love-pattern'&&x.i===0)){
   // These positions ask what kind of love fits or what keeps attracting the reader, not whether they are ready.
   const claim=id==='love-pattern'?`내가 익숙하게 끌리는 건 ${f}${josa(f,'이에요','예요')}.`
    :x.i===0?(sup?`내가 원하는 사랑의 중심에는 ${j(f,'이','가')} 있어요.`:`내가 원하는 사랑은 ${j(obs,'이','가')} 없는 관계예요.`)
    :(sup?`편안함을 만드는 조건은 ${f}${josa(f,'이에요','예요')}.`:`편안하려면 ${j(obs,'을','를')} 피할 수 있어야 해요.`);
   const apply=id==='love-pattern'?(sup?`${f}에 끌리는 건 자연스러워요. 다만 그 끌림이 나를 편하게 하는지 한 번 더 살펴보세요.`:`${j(obs,'이','가')} 반복된다면, 그건 끌림이라기보다 익숙함일 수 있어요.`)
    :(sup?`누군가를 알아갈 때 ${j(f,'을','를')} 함께 느낄 수 있는지 살펴보세요.`:`누군가를 알아갈 때 ${j(obs,'이','가')} 반복된다면 한 걸음 물러서세요.`);
   sections=[['질문에 대한 한 줄 답',claim],['카드에 근거한 설명',`${meaning} ${scene}`],['관계에 적용',apply],['종합 조언',`${imp}.`]];
  }else{
   const claim=x.role==='past'?`처음 이 관계를 이끈 건 ${f}${josa(f,'이에요','예요')}.`
    :x.role==='next'?`앞으로 이 관계는 ${f} 쪽으로 가요.`
    :`${SUBJ_BY_ID[id]??SUBJ[x.voice]} ${trait}`;
   const judged=judge(v.w);const repeat=used.has(judged);used.add(judged);
   const evidence=repeat?(used.has('#same')?`${meaning} 세 장이 모두 같은 쪽을 가리켜서, 이번 리딩의 방향은 분명해요.`:(used.add('#same'),`${meaning} 앞의 카드와 같은 방향이라 판단에 무게가 더 실려요.`)):`${meaning} ${judged}`;
   const apply=`${x.role==='past'?'관계가 시작될 무렵을 보면,':x.role==='next'?'앞으로를 보면,':APPLY_AT[x.voice]} ${scene}`;
   sections=[['질문에 대한 한 줄 답',claim],['카드에 근거한 설명',evidence],['관계에 적용',apply],['종합 조언',x.role==='next'?pick(1,v.a[2],v.s[2]):pick(1,v.s[2],v.a[2])]];
  }
  if(x.i===index)out=sections.map(([title,text])=>({title,text}));
 }
 return out;
}

function adviceLine(a:Analysis){
 const ad=a.items[2];if(!ad||ad.role!=='a')return '';
 const n=label(ad.d),act=actFor(ad.d,a.m.type);
 const moving=MOVING.includes(ad.cls);
 // An action-leaning advice card under a cautious verdict: keep it, but scale it down in the card's own register.
 const SMALL:Record<string,string>={ACT:'한 번에 크게 움직이기보다 가볍게 시작해 보세요.',TRUTH:'결론부터 내기보다 솔직한 한마디부터 건네 보세요.',WARM:'큰 표현보다 부담 없는 다정함부터 보여 주세요.',TURN:'변화를 억지로 만들기보다 생기는 기회를 놓치지 마세요.'};
 if(a.level>=2&&a.level<=3&&ad.p>0&&moving)return `다만 ${j(n,'은','는')} ${j(act,'을','를')} 권해요. ${SMALL[ad.cls]}`;
 if(a.level<=1&&ad.p<0)return `그래도 ${j(n,'이','가')} ${j(act,'을','를')} 말하는 만큼, 서두르지는 마세요.`;
 if(a.level<=1)return `${n}${josa(n,'이','가')} 말하는 건 ${act}${josa(act,'이에요','예요')}.`;
 // Wait-or-let-go "set a deadline" verdict: the advice card says how to spend that window, not what comes first instead of it.
 if(a.level===2&&a.m===META['let-go'])return `기한을 두고 지켜보는 동안에는 ${n}의 조언대로 ${j(act,'이','가')} 도움이 돼요.`;
 if(a.level===2)return `${n}${josa(n,'이','가')} 권하는 대로, 지금은 ${j(act,'이','가')} 먼저예요.`;
 if(a.level===3)return `${j(n,'은','는')} ${j(act,'을','를')} 권해요.`;
 return `그동안 할 수 있는 건 ${act}${josa(act,'이에요','예요')}.`;
}

export function koSummary(ds:Draw[],id:string){
 const a=analyse(ds,id);const t=a.m.type;const it=a.items;const n=(k:number)=>label(it[k].d);
 let lead:string;
 if(it.length===1){lead=id==='daily'?'':`한 장으로 보는 리딩이라, ${n(0)}의 핵심인 ${j(plainCore(it[0].d)[0],'이','가')} 그대로 답이 돼요.`}
 else if(a.outcome){
  const c=it[1],o=it[2];const arc=o.p>0&&c.p>0?ARC.up:o.p>0?ARC.recover:c.p>0&&o.p<0?ARC.fall:o.p<0?ARC.down:ARC.open;
  const start=it[0].role==='past'?`처음엔 ${n(0)}의 ${j(first(it[0].d),'이','가')} 관계를 이끌었어요. `:`두 사람의 바탕에는 ${n(0)}의 ${j(first(it[0].d),'이','가')} 있어요. `;
  lead=`${start}지금은 ${n(1)}의 ${first(c.d)}, 앞으로는 ${n(2)}의 ${first(o.d)} 쪽이에요. ${arc}`;
 }else if(a.obstacle){
  const s0=it[0],ob=a.obstacle;const o=coreOf(ob.d)[2];const f0=first(s0.d);
  lead=a.level<=1?`${n(0)}의 ${j(f0,'이','가')} ${POS[t]}${ob.p>0?` ${n(1)}의 ${j(o,'도','도')} 크게 막아서지는 않아요.`:` 다만 ${n(1)}의 ${j(o,'이','가')} ${DRAG[t]}`}`
   :a.level===2?(s0.p>0?`${n(0)}만 보면 ${MIXPOS[t]}. 하지만 ${n(1)}의 ${j(o,'이','가')} 그 길을 막고 있어요.`:ob.p>0?`${n(0)}의 ${ro(f0)} 지금은 멈춰 있지만, ${n(1)}의 ${j(o,'은','는')} 생각보다 가벼워요.`:`${n(0)}의 ${j(f0,'과','와')} ${n(1)}의 ${j(o,'이','가')} 맞물려 있어서, 아직 어느 쪽으로도 기울지 않아요. ${MIDTAIL[t]}`)
   :a.level===3?`${n(0)}의 ${f0}에 ${n(1)}의 ${o}까지 겹쳐서 ${LOW[t]}`
   :`${n(0)}도 ${n(1)}도 아직 분명한 답을 주지 않아요. ${FOGT[t]}`;
  const adv=adviceLine(a);if(adv)lead+=` ${adv}`;
 }else{
  const f0=first(it[0].d),f1=first(it[1].d);const p0=it[0].p>0,p1=it[1].p>0;
  lead=p0&&p1?`${n(0)}의 ${j(f0,'과','와')} ${n(1)}의 ${j(f1,'이','가')} 같은 쪽을 가리켜요.`:p0?`${n(0)}의 ${j(f0,'은','는')} 좋은 신호지만, ${n(1)}의 ${j(f1,'이','가')} 조심할 부분을 보여 줘요.`:p1?`${n(0)}의 ${ro(f0)} 시작은 조심스럽지만, ${n(1)}의 ${j(f1,'이','가')} 여지를 남겨요.`:`${n(0)}의 ${j(f0,'과','와')} ${n(1)}의 ${f1} 모두 속도를 늦추라는 쪽이에요.`;
  const adv=adviceLine(a);if(adv)lead+=` ${adv}`;
 }
 const tm=timingFor(a);
 const action=it.length===1||a.advice?'':practiceOf(it[it.length-1].d)[3];
 return {answer:koAnswer(ds,id),lead,body:tm?.text??'',action,level:a.level};
}
