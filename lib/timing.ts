import type {Draw} from './tarot';
// Untold editorial correspondence v1. Symbolic bands, never calibrated probabilities.
export const timingQuestions=[
 {id:'contact-timing',situation:'breakup',ko:'연락은 언제 올까?',en:'When might they contact me?',eventKo:'연락',eventEn:'Contact',variableKo:'가벼운 안부에 서로 답할 수 있으면 대화가 빨라질 수 있어요. 답을 재촉하거나 차단·연락 거절을 무시하면 오히려 멀어질 수 있어요.',variableEn:'A welcome, mutual exchange can help. Pressure or ignored boundaries can increase distance.',actionKo:'이미 연락을 거절당했다면 다시 보내지 마세요. 연락이 오더라도 안부인지 재회 의사인지 구분하세요.'},
 {id:'reunion-timing',situation:'breakup',ko:'재회 흐름은 언제 움직일까?',en:'When might reconnection begin?',eventKo:'재회를 위한 대화',eventEn:'Reconnection',variableKo:'헤어진 이유를 두 사람이 함께 이야기할 준비가 되면 변화가 빨라질 수 있어요. 그리움만 확인하고 같은 문제를 덮으면 재회 논의가 늦어질 수 있어요.',variableEn:'Willingness to address the breakup can help. Avoiding the same unresolved problem can delay reconnection.',actionKo:'다시 만나기 전에 달라져야 할 점을 정리하세요. 상대도 그 변화에 동의하는지 확인하는 것이 먼저예요.'},
 {id:'new-love-timing',situation:'single',ko:'새 연애는 언제 시작될까?',en:'When might new love begin?',eventKo:'새로운 만남',eventEn:'A new connection',variableKo:'새 사람을 만날 기회와 계속 알아갈 시간이 있으면 변화가 빨라질 수 있어요. 지난 관계를 정리할 시간이 더 필요하거나 만남 자체가 없다면 늦어질 수 있어요.',variableEn:'Opportunities and time to get to know someone help. Unfinished feelings or no opportunities can slow things down.',actionKo:'관심 있는 활동이나 부담 없는 모임을 골라보세요. 첫 만남부터 연애로 이어져야 한다는 부담은 두지 마세요.'},
 {id:'progress-timing',situation:'undefined',ko:'우리 관계는 언제 진전될까?',en:'When might this relationship progress?',eventKo:'관계를 정하는 대화',eventEn:'Relationship progress',variableKo:'서로 원하는 관계를 분명히 말하고 시간을 내면 진전이 빨라질 수 있어요. 한쪽만 관계를 정하고 싶어 하거나 대화를 피하면 늦어질 수 있어요.',variableEn:'Clear intentions and mutual time help. Different expectations or avoided conversations can delay progress.',actionKo:'내가 원하는 관계를 먼저 정리하세요. 상대에게도 같은 만남을 원하는지 부담을 주지 않고 물어보세요.'}
] as const;
export function isTiming(id:string){return timingQuestions.some(q=>q.id===id)}
const bands=[['며칠~1주','A few days–1 week'],['1~3주','1–3 weeks'],['2~6주','2–6 weeks'],['1~3개월','1–3 months'],['3개월 이후','Beyond 3 months']] as const;
// Major cards use explicit thematic pace; null means conditions matter more than a date.
const majorBand:(number|null)[]=[1,1,null,3,3,3,2,1,2,null,null,3,null,null,3,null,null,3,null,1,2,null];
const majorReasons=[
 '첫발을 내딛는 인물은 새 시도를 뜻해요. 시작은 빨라도 관계가 안정되는 데는 시간이 더 필요해요.',
 '도구를 앞에 둔 마법사는 생각을 행동으로 옮기는 모습을 뜻해요. 누군가 먼저 표현하는 속도를 빠르게 읽어요.',
 '여사제의 가려진 두루마리는 아직 드러나지 않은 정보를 뜻해요. 상대의 의사가 확인되기 전에는 기간을 정하지 않아요.',
 '여제의 풍요로운 풍경은 돌봄과 성장을 뜻해요. 여러 번 편안하게 만나는 시간을 거치는 쪽으로 읽어요.',
 '황제의 단단한 왕좌는 기준과 책임을 뜻해요. 현실적인 약속을 조율하는 시간이 필요해요.',
 '교황의 의식과 두 인물은 합의된 약속을 뜻해요. 관계를 어떻게 정할지 서로 확인하는 시간이 필요해요.',
 '연인의 두 인물은 서로를 선택하는 일을 뜻해요. 한 사람의 마음보다 두 사람의 결정을 기다리는 기간으로 읽어요.',
 '전차는 방향을 정하고 출발하는 모습을 뜻해요. 뜻이 맞으면 대화나 만남을 추진하는 속도가 빠른 편이에요.',
 '사자를 다루는 인물은 억지로 밀기보다 차분하게 조율하는 모습을 뜻해요. 신뢰를 확인할 시간을 두는 쪽이에요.',
 '은둔자의 등불은 혼자 생각하고 정리하는 시간을 뜻해요. 그 정리가 끝날 때를 카드만으로 정할 수는 없어요.',
 '운명의 수레바퀴는 상황 전환을 뜻하지만 그 속도가 일정하지 않아요. 기회가 생기는 조건을 먼저 봐야 해요.',
 '정의의 저울은 균형과 책임을 뜻해요. 서로 납득할 결론을 내기까지 확인과 조율이 필요해요.',
 '매달린 사람의 멈춘 자세는 보류를 뜻해요. 지금은 날짜보다 무엇이 결정을 막는지 확인해야 해요.',
 '죽음 카드의 전환은 이전 방식의 끝을 뜻해요. 이전 관계가 그대로 돌아올 날짜로 읽지 않아요.',
 '절제의 두 컵은 서로 다른 속도를 맞추는 과정을 뜻해요. 급한 결론보다 시간을 둔 조율로 읽어요.',
 '악마 카드의 사슬은 벗어나기 어려운 집착이나 반복을 뜻해요. 재회 날짜보다 관계의 부담을 먼저 확인해요.',
 '탑의 무너지는 모습은 기존 관계의 불안정을 뜻해요. 상황이 정리되기 전에는 날짜를 붙이지 않아요.',
 '별의 물을 붓는 모습은 회복을 뜻해요. 마음이 안정되고 다시 다가갈 여유를 만드는 시간이 필요해요.',
 '달의 어두운 길은 정보 부족과 혼란을 뜻해요. 추측이 많아 기간을 정하기 어려워요.',
 '태양 아래 열린 모습은 솔직한 표현을 뜻해요. 서로의 뜻이 확인된다면 대화가 비교적 빨리 진행되는 쪽이에요.',
 '심판의 깨어나는 인물들은 지난 일을 다시 검토하는 모습을 뜻해요. 재논의의 여지는 있지만 답은 서로 확인해야 해요.',
 '세계의 원형 테두리는 한 단계의 마무리를 뜻해요. 끝난 관계의 재개와 새 출발을 같은 날짜로 읽지 않아요.'
];
export function timingReading(d:Draw,id:string,ko:boolean){
 const question=timingQuestions.find(q=>q.id===id)!;
 const n=d.card.id;const rank=n<22?0:(n-22)%14+1;const suit=n<22?-1:Math.floor((n-22)/14);
 let band:number|null=n<22?majorBand[n]:([1,2,1,3][suit]);
 let reason=n<22?majorReasons[n]:['완드는 시작과 행동을 나타내므로 비교적 빠른 속도를 기본으로 읽어요.','컵은 감정과 교류를 나타내므로 마음을 확인하는 시간을 포함해 읽어요.','소드는 판단과 대화를 나타내므로 결정은 빠를 수 있지만 갈등이 있으면 멈출 수 있어요.','펜타클은 생활과 현실 조건을 나타내므로 약속을 실행할 시간을 길게 잡아요.'][suit];
 if(n>=22){
  if(rank<=3)reason+=' 초반 숫자 카드는 시작 단계이므로 첫 움직임과 관계의 완성을 구분해요.';
  else if(rank<=7){if(band!==null)band=Math.min(4,band+1);reason+=' 중간 숫자 카드는 조율과 선택의 단계를 뜻해 기본 기간보다 한 단계 늦게 읽어요.';}
  else if(rank<=10){if(band!==null)band=Math.min(4,band+1);reason+=' 후반 숫자 카드는 쌓인 상황의 정리가 필요하다고 보고 기본 기간보다 한 단계 늦게 읽어요.';}
  else {band=rank===12?(suit===3?3:1):null;reason+=rank===12?' 기사는 실제 행동에 나서는 인물이므로 움직임의 속도를 함께 봐요.':' 시종·퀸·킹은 사람의 태도와 준비에 무게를 두므로 고정 기간을 붙이지 않아요.';}
 }
 // Eight of Wands: special fast-motion symbol, not eight calendar days.
 if(n===29&&!d.reversed){band=0;reason='공중을 가로지르는 여덟 완드는 빠른 소식과 진행을 뜻해요. 숫자 8을 8일로 바꾸지 않고, 이 카드의 움직임을 가장 빠른 기간대에 대응시켜요.';}
 const blocked=n>=22&&d.card.tone<0 || [13,15,16].includes(n);
 if(blocked){band=null;reason+=' 사건이 성립할 근거보다 중단·갈등이 두드러져 기간을 제시하지 않아요.';}
 if(d.reversed){if(band!==null)band=Math.min(4,band+1);reason+=' 역방향은 여기서 표현이나 실행의 지연으로 반영해요. 나쁜 결과로 단정하는 뜻은 아니에요.';}
 // Reunion/new love/progress take longer than an initial message; never promise a relationship in days.
 if(band!==null&&id!=='contact-timing')band=Math.max(2,band);
 const speed=band===null?(blocked?'진행보다 문제 해결이 먼저':'시기 판단 보류'):band<2?'빠름':band===2?'보통':'지연';
 const speedEn=band===null?'Timing unresolved':band<2?'Fast':band===2?'Moderate':'Delayed';
 const window=band===null?(ko?'기간을 정하기 어려워요':'No meaningful time window'):bands[band][ko?0:1];
 const answer=ko?(band===null?`${question.eventKo} 시기는 지금 카드로 정하기 어려워요.`:`이 리딩에서는 ${question.eventKo}의 첫 움직임을 ${window} 범위로 읽어요.`):(band===null?`This card does not support a timing window for ${question.eventEn.toLowerCase()}.`:`This reading associates the first step toward ${question.eventEn.toLowerCase()} with ${window.toLowerCase()}.`);
 if(!ko)reason=`${d.card.name}: ${d.reversed?d.card.reversed:d.card.upright} ${band===null?'Conditions or unresolved difficulties take precedence over a date.':'The card’s suit, stage and orientation map to an editorial pace band.'} ${d.reversed?'Reversal delays an otherwise available band; it does not guarantee a bad outcome.':''}`;
 return {band,window,speed:ko?speed:speedEn,answer,reason,variable:ko?question.variableKo:question.variableEn,action:ko?question.actionKo:'Check mutual willingness and respect boundaries before taking the next step.'};
}
