// Representative questions for the interpretation quality harness.
// `q` maps the natural question to the product's preset question id; null = the product does not offer this question.
// Card ids: 0-21 majors, 22-35 wands, 36-49 cups, 50-63 swords, 64-77 pentacles (ace..10, page, knight, queen, king).
const combos={
 A:[[19,false],[52,false],[17,false]], // Sun, Three of Swords, Star — open, blocked, recovering
 B:[[19,false],[36,false],[16,false]], // Sun, Ace of Cups, Tower — open, open, breaking
 C:[[29,false],[47,false],[64,false]], // Eight of Wands, Knight of Cups, Ace of Pentacles — fast and warm
 D:[[13,false],[56,false],[9,false]],  // Death, Seven of Swords, Hermit — ended, hidden, withdrawn
 E:[[2,false],[18,false],[51,false]],  // High Priestess, Moon, Two of Swords — unspoken, unclear, undecided
 F:[[41,false],[20,false],[38,false]], // Six of Cups, Judgement, Three of Cups — memory, review, warmth
 G:[[12,false],[44,true],[24,false]],  // Hanged Man, Nine of Cups reversed, Three of Wands — paused, unsatisfied, opening
 H:[[6,true],[15,false],[62,false]],   // Lovers reversed, Devil, Queen of Swords — mismatch, attachment, clear boundary
 I:[[45,false],[33,false],[77,false]], // Ten of Cups, Knight of Wands, King of Pentacles
};
const f=(id,group,text,q,cards)=>({id,group,text,q,cards:typeof cards==='string'?combos[cards]:cards,combo:typeof cards==='string'?cards:null});
module.exports={combos,fixtures:[
 f(1,'contact','헤어진 남자친구가 다시 연락할까요?','ex-contact','C'),
 f(2,'contact','헤어진 여자친구한테 연락이 올까요?','ex-contact','D'),
 f(3,'contact','전 애인에게서 연락이 올 가능성이 있을까요?','ex-contact','G'),
 f(4,'contact','썸 타는 사람의 다음 연락, 기다려도 될까요?','contact-flow','A'),
 f(5,'contact','요즘 연락이 뜸한 그 사람, 기다려도 될까요?','contact-flow','E'),
 f(6,'contact','연락은 언제쯤 올까요?','contact-timing',[[29,false]]),
 f(7,'contact','그 사람 연락 시기가 궁금해요','contact-timing',[[2,false]]),
 f(8,'contact','그 사람이 언제 연락할까요?','contact-timing',[[40,true]]),
 f(9,'reunion','우리 다시 만날 수 있을까요?','ex-return','F'),
 f(10,'reunion','재회 가능성 있을까요?','ex-return','D'),
 f(11,'reunion','다시 만나면 또 같은 이유로 헤어질까요?','after-reunion','H'),
 f(12,'reunion','재회하려면 뭐가 바뀌어야 할까요?','repair','B'),
 f(13,'reunion','재회는 언제쯤 가능할까요?','reunion-timing',[[20,false]]),
 f(14,'reunion','재회 시기가 궁금해요','reunion-timing',[[37,false]]),
 f(15,'reunion','헤어진 지 석 달, 다시 이어질 여지가 있나요?','ex-return','A'),
 f(16,'reunion','다시 만나도 괜찮을까요?','after-reunion','C'),
 f(17,'feelings','그 사람도 나를 그리워할까요?','ex-misses-me','F'),
 f(18,'feelings','전 애인이 저를 그리워할까요?','ex-misses-me','D'),
 f(19,'feelings','상대방이 나를 좋아할까요?','crush-feelings','C'),
 f(20,'feelings','이 다정함이 호감일까요, 그냥 친절일까요?','crush-feelings','E'),
 f(21,'feelings','그 사람도 내 생각을 할까요?','thinking-of-me','A'),
 f(22,'feelings','가까운데 왜 마음을 말하지 않을까요?','hidden-feelings','E'),
 f(23,'feelings','왜 다정했다가 갑자기 멀어질까요?','mixed-signals','H'),
 f(24,'feelings','그 사람 속마음이 궁금해요','their-feelings','G'),
 f(25,'progress','우리 사귈 수 있을까요?','define-us','C'),
 f(26,'progress','썸에서 연인으로 발전할까요?','define-us','B'),
 f(27,'progress','이 관계는 어디로 가고 있을까요? (A)','our-direction','A'),
 f(28,'progress','이 관계는 어디로 가고 있을까요? (B)','our-direction','B'),
 f(29,'progress','관계가 언제 진전될까요?','progress-timing',[[34,false]]),
 f(30,'progress','언제쯤 사귀게 될까요?','progress-timing',[[7,false]]),
 f(31,'progress','우리 관계의 과거·현재·미래 (A)','three-card','A'),
 f(32,'progress','우리 관계의 과거·현재·미래 (B)','three-card','B'),
 f(33,'newlove','새로운 사랑은 언제 올까요?','new-love-timing',[[22,false]]),
 f(34,'newlove','올해 안에 연애할 수 있을까요?','new-love-timing',[[73,false]]),
 f(35,'newlove','새 연애를 시작할 준비가 됐을까요?','new-love','E'),
 f(36,'newlove','이제 새 연애 해도 될까요?','new-love','C'),
 f(37,'newlove','왜 연애에서 같은 일이 반복될까요?','love-pattern','H'),
 f(38,'newlove','새로운 사람을 어떻게 만날 수 있을까요?','new-connection','C'),
 f(39,'newlove','저한테 맞는 연애는 어떤 모습일까요?','healthy-love','I'),
 f(40,'decision','제가 먼저 연락해도 될까요?','reach-out','C'),
 f(41,'decision','먼저 연락해 볼까요?','reach-out','D'),
 f(42,'decision','지금 고백해도 될까요?','confess','A'),
 f(43,'decision','고백해도 괜찮을까요?','confess','E'),
 f(44,'decision','계속 기다릴까요, 놓아줄까요?','let-go','F'),
 f(45,'decision','이제 그만 기다려야 할까요?','let-go','D'),
 f(46,'decision','어떻게 하면 자연스럽게 가까워질까요?','approach','G'),
 f(47,'decision','왜 아직 연락이 없을까요?','ex-silence','D'),
 f(48,'general','오늘의 타로 (별)','daily',[[17,false]]),
 f(49,'general','오늘의 타로 (탑)','daily',[[16,false]]),
 f(50,'general','예/아니오: 마음을 표현해도 될까?','yes-no',[[19,false]]),
 f(51,'general','예/아니오: 지금 연락해도 될까?','yes-no',[[15,false]]),
 f(52,'career','이직에 성공할까요?',null,'C'),
 f(53,'career','이번 면접 붙을까요?',null,'A'),
 f(54,'career','취업은 언제 될까요?',null,[[29,false]]),
 f(55,'money','이번 달 돈 문제 풀릴까요?',null,'G'),
 f(56,'money','지금 투자해도 될까요?',null,'D'),
 f(57,'decision','회사를 그만둘까요, 남을까요?',null,'E'),
]};
