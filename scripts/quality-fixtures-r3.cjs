// R3 human-review set: 20 readings covering the required verdict types, plus same-cards/different-question
// and same-question/different-cards groups. `expect` is the intended verdict direction, checked when the set is built.
const s=(id,group,text,q,cards,expect)=>({id,group,text,q,cards,expect});
module.exports=[
 s(1,'연락 YES','헤어진 남자친구가 다시 연락할까요?','ex-contact',[[29,false],[37,false],[22,false]],'가능성 높음'),
 s(2,'연락 NO','헤어진 여자친구한테 연락이 올까요?','ex-contact',[[13,false],[54,false],[59,false]],'가능성 낮음'),
 s(3,'연락 delayed/mixed','전 애인에게서 연락이 올 가능성이 있을까요?','ex-contact',[[12,false],[18,false],[46,false]],null),
 s(4,'재회 YES','우리 다시 만날 수 있을까요?','ex-return',[[6,false],[36,false],[20,false]],'가능성 높음'),
 s(5,'재회 NO','재회 가능성 있을까요?','ex-return',[[13,false],[16,false],[43,false]],'가능성 낮음'),
 s(6,'상대 마음','상대방이 나를 좋아할까요?','crush-feelings',[[37,false],[44,true],[46,false]],null),
 s(7,'그리워하는지','그 사람도 나를 그리워할까요?','ex-misses-me',[[41,false],[40,false],[17,false]],null),
 s(8,'먼저 연락 YES','제가 먼저 연락해도 될까요?','reach-out',[[1,false],[17,false],[32,false]],'움직여도 좋아요'),
 s(9,'먼저 연락 NO','먼저 연락해 볼까요?','reach-out',[[15,false],[56,false],[53,false]],'지금은 멈춤'),
 s(10,'기다릴지 놓을지','계속 기다릴까요, 놓아줄까요?','let-go',[[43,false],[13,true],[22,false]],null),
 s(11,'관계 발전 positive','우리 사귈 수 있을까요?','define-us',[[6,false],[25,false],[37,false]],'발전 가능성 높음'),
 s(12,'관계 발전 negative','썸에서 연인으로 발전할까요?','define-us',[[26,false],[16,false],[51,false]],'발전 어려움'),
 s(13,'새 연애 시기','새로운 사랑은 언제 올까요?','new-love-timing',[[47,false]],null),
 s(14,'새 사람 만나는 방법','새로운 사람을 어떻게 만날 수 있을까요?','new-connection',[[38,false],[67,false],[22,false]],null),
 s(15,'오늘의 타로','오늘의 타로','daily',[[19,false]],null),
 s(16,'같은 카드 · 다른 질문 (A)','헤어진 사람이 다시 연락할까요?','ex-contact',[[37,false],[56,false],[17,false]],null),
 s(17,'같은 카드 · 다른 질문 (B)','그 사람이 나를 좋아할까요?','crush-feelings',[[37,false],[56,false],[17,false]],null),
 s(18,'같은 카드 · 다른 질문 (C)','우리 사귈 수 있을까요?','define-us',[[37,false],[56,false],[17,false]],null),
 s(19,'같은 질문 · 다른 카드','계속 기다릴까요, 놓아줄까요?','let-go',[[41,false],[20,false],[38,false]],null),
 s(20,'같은 질문 · 다른 카드','계속 기다릴까요, 놓아줄까요?','let-go',[[36,false],[9,false],[45,false]],null),
];
